import { useContext, useState, useMemo, useEffect } from "react";
import { MachineryContext } from "../../store/Context/MachineryContext";
import { useLocation } from "react-router-dom";
import Modal from "../../Components/Modal/Modal";
import MachineryForm from "../../Components/Forms/MachineryForm";
import styles from "./Machinery.module.css";

export default function Machinery() {
  const { machinery, loading, addMachine, updateMachine, deleteMachine } =
    useContext(MachineryContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
  });

  // ⭐ Apply status filter from Dashboard URL
  useEffect(() => {
    const statusFromURL = queryParams.get("status");

    if (statusFromURL) {
      const formatted =
        statusFromURL.charAt(0).toUpperCase() + statusFromURL.slice(1);

      setFilters((prev) => ({ ...prev, status: formatted }));
    }
  }, [location.search]);

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({ name: "", type: "", status: "" });

  const unique = (key) => [...new Set(machinery.map((m) => m[key]))];

  const filteredData = useMemo(() => {
    return machinery.filter((m) => {
      return (
        (!filters.name || m.name === filters.name) &&
        (!filters.type || m.type === filters.type) &&
        (!filters.status || m.status === filters.status)
      );
    });
  }, [filters, machinery]);

  const handleSubmit = (data) => {
    if (selectedMachine) updateMachine(selectedMachine.id, data);
    else addMachine(data);

    setSelectedMachine(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    deleteMachine(selectedMachine.id);
    setIsDeleteModal(false);
    setSelectedMachine(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Machinery Overview</h2>
        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedMachine(null);
            setIsModalOpen(true);
          }}
        >
          + Add Machine
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select name="name" value={filters.name} onChange={handleChange}>
          <option value="">Select Machine</option>
          {unique("name").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Select Type</option>
          {unique("type").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="Working">Working</option>
          <option value="Idle">Idle</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <button className={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Machine Name</th>
              <th>Type</th>
              <th>Last Maintenance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles.loadingRow}>
                  <p>Loading...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  No machines found
                </td>
              </tr>
            ) : (
              filteredData.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.type}</td>
                  <td>{m.lastMaintenance}</td>
                  <td>{m.status}</td>

                  <td className={styles.actionsCol}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedMachine(m);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        setSelectedMachine(m);
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

      {/* Edit/Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MachineryForm initialData={selectedMachine} onSubmit={handleSubmit} />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Machine?</h3>
        <p>
          Are you sure you want to delete <b>{selectedMachine?.name}</b>?
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
