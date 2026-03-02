import { useEffect, useState, useMemo } from "react";
import Modal from "../../../Components/Modal/Modal";
import styles from "./Vendors.module.css";
import { useVendors } from "../../../store/context/VendorContext";
import NewVendorForm from "../../../Components/Forms/NewVendorForm";

export default function Vendors() {
  const {
    vendors,
    loading,
    loadVendors,
    addVendor,
    editVendor,
    removeVendor,
  } = useVendors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [filters, setFilters] = useState({
    vendor_company: "",
    contact_person: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  /* ---------------- FILTER HANDLERS ---------------- */
  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({ vendor_company: "", contact_person: "" });

  const unique = (key) => [
    ...new Set(vendors.map((v) => v[key]).filter(Boolean)),
  ];

  /* ---------------- FILTERED DATA ---------------- */
  const filteredVendors = useMemo(() => {
    return vendors.filter(
      (v) =>
        (!filters.vendor_company ||
          v.vendor_company === filters.vendor_company) &&
        (!filters.contact_person ||
          v.contact_person === filters.contact_person),
    );
  }, [filters, vendors]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (data) => {
    if (selectedVendor) {
      await editVendor(selectedVendor.id, data);
    } else {
      await addVendor(data);
    }
    setSelectedVendor(null);
    setIsModalOpen(false);
  };

  /* ---------------- DELETE ---------------- */
  const confirmDelete = async () => {
    if (!selectedVendor) return;
    await removeVendor(selectedVendor.id);
    setIsDeleteModal(false);
    setSelectedVendor(null);
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Vendor Overview</h2>
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

      {/* FILTERS */}
      <div className={styles.filters}>
        <select
          name="vendor_company"
          value={filters.vendor_company}
          onChange={handleChange}
        >
          <option value="">Vendor Company</option>
          {unique("vendor_company").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="contact_person"
          value={filters.contact_person}
          onChange={handleChange}
        >
          <option value="">Contact Person</option>
          {unique("contact_person").map((val) => (
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
              <th>Vendor Code</th>
              <th>Vendor Company</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className={styles.loadingRow}>
                  Loading vendors...
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
                  <td>{v.vendor_code}</td>
                  <td>{v.vendor_company}</td>
                  <td>{v.contact_person}</td>
                  <td>{v.phone}</td>
                  <td>{v.email}</td>
                  <td>{v.address}</td>
                  <td>{v.rating ?? 0}</td>

                  {/* ✅ PROJECTS DISPLAY */}
                  <td>
                    {v.project_names?.length > 0
                      ? v.project_names.join(", ")
                      : "—"}
                  </td>

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

      {/* ADD / EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewVendorForm initialData={selectedVendor} onSubmit={handleSubmit} />
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Vendor?</h3>
        <p>
          Are you sure you want to delete{" "}
          <b>{selectedVendor?.vendor_company}</b>?
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