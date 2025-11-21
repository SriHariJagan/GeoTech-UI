import { useContext, useState, useMemo } from "react";
import { VendorContext } from "../../store/Context/VendorContext";
import Modal from "../../Components/Modal/Modal";
import styles from "./Vendors.module.css";
import NewVendorForm from "../../Components/Forms/NewVendorForm";

export default function Vendors() {
  const { vendors, loading, addVendor, updateVendor, deleteVendor } =
    useContext(VendorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [filters, setFilters] = useState({ name: "", company: "" });

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () => setFilters({ name: "", company: "" });

  const unique = (key) => [...new Set(vendors.map((v) => v[key]))];

  const filteredVendors = useMemo(() => {
    return vendors.filter(
      (v) =>
        (!filters.name || v.name === filters.name) &&
        (!filters.company || v.company === filters.company)
    );
  }, [filters, vendors]);

  const handleSubmit = (data) => {
    if (selectedVendor) updateVendor(selectedVendor.id, data);
    else addVendor(data);

    setSelectedVendor(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    deleteVendor(selectedVendor.id);
    setIsDeleteModal(false);
    setSelectedVendor(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Vendor Overview</h2>
        <div className={styles.actionBtns}>
          <button
            className={styles.addBtn}
            onClick={() => {
              setSelectedVendor(null);
              setIsModalOpen(true);
            }}
          >
            + Add Vendor
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <select name="name" value={filters.name} onChange={handleChange}>
          <option value="">Select Vendor</option>
          {unique("name").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="company" value={filters.company} onChange={handleChange}>
          <option value="">Select Company</option>
          {unique("company").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Depth Hard Rock</th>
              <th>Depth Soft Rock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading vendors...</p>
                </td>
              </tr>
            ) : filteredVendors.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  No vendors found
                </td>
              </tr>
            ) : (
              filteredVendors.map((v) => (
                <tr key={v.id}>
                  <td className={styles.truncateCell}>
                    {v.name}
                    <div className={styles.tooltip}>{v.name}</div>
                  </td>

                  <td className={styles.truncateCell}>
                    {v.address}
                    <div className={styles.tooltip}>{v.address}</div>
                  </td>

                  <td className={styles.truncateCell}>
                    {v.company}
                    <div className={styles.tooltip}>{v.company}</div>
                  </td>

                  <td className={styles.truncateCell}>
                    {v.contactPerson}
                    <div className={styles.tooltip}>{v.contactPerson}</div>
                  </td>

                  <td>{v.phone}</td>
                  <td>{v.email}</td>
                  <td>{v.depthHardRock}</td>
                  <td>{v.depthSoftRock}</td>
                  <td className={styles.actionsCol}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedVendor(v);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        setSelectedVendor(v);
                        setIsDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewVendorForm initialData={selectedVendor} onSubmit={handleSubmit} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Vendor?</h3>
        <p>
          Are you sure you want to delete <b>{selectedVendor?.name}</b>?
        </p>
        <div className={styles.confirmBtns}>
          <button
            className={styles.cancelBtn}
            onClick={() => setIsDeleteModal(false)}
          >
            Cancel
          </button>
          <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
