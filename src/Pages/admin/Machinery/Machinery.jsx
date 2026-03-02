import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useMachines } from "../../../store/context/MachineContext";
import Modal from "../../../Components/Modal/Modal";
import styles from "./Machinery.module.css";
import MachineryForm from "../../../Components/Forms/MachineryForm";

export default function Machinery() {
  const {
    machines = [],
    loading,
    loadMachines,
    addMachine,
    editMachine,
    removeMachine,
  } = useMachines();

  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [filters, setFilters] = useState({
    machine_name: "",
    machine_type: "",
    status: "",
  });

  /* ================= LOAD MACHINES ================= */
  useEffect(() => {
    loadMachines();
  }, [loadMachines]);

  /* ================= APPLY STATUS FROM URL ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (status) {
      setFilters((prev) => ({
        ...prev,
        status: status.toLowerCase(),
      }));
    }
  }, [location.search]);

  /* ================= FILTER HANDLERS ================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const clearFilters = () =>
    setFilters({ machine_name: "", machine_type: "", status: "" });

  const uniqueValues = useCallback(
    (key) =>
      [...new Set(machines.map((m) => m[key]).filter(Boolean))],
    [machines]
  );

  /* ================= FILTER DATA ================= */
  const filteredData = useMemo(() => {
    return machines.filter((m) => {
      return (
        (!filters.machine_name ||
          m.machine_name === filters.machine_name) &&
        (!filters.machine_type ||
          m.machine_type === filters.machine_type) &&
        (!filters.status ||
          m.status?.toLowerCase() === filters.status.toLowerCase())
      );
    });
  }, [machines, filters]);

  /* ================= FORMAT DATE ================= */
  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  /* ================= STATUS BADGE CLASS ================= */
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return styles.statusActive;
      case "inactive":
        return styles.statusInactive;
      case "maintenance":
        return styles.statusMaintenance;
      default:
        return "";
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (data) => {
    try {
      if (selectedMachine) {
        await editMachine(selectedMachine.id, data);
      } else {
        await addMachine(data);
      }
      setSelectedMachine(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Machine save failed:", error);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!selectedMachine) return;

    try {
      await removeMachine(selectedMachine.id);
      setSelectedMachine(null);
      setIsDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      {/* Header */}
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
        <select
          name="machine_name"
          value={filters.machine_name}
          onChange={handleChange}
        >
          <option value="">Select Machine</option>
          {uniqueValues("machine_name").map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          name="machine_type"
          value={filters.machine_type}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          {uniqueValues("machine_type").map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="active">Working</option>
          <option value="inactive">Idle</option>
          <option value="maintenance">Maintenance</option>
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
              <th>Name</th>
              <th>Type</th>
              <th>Last Maintenance</th>
              <th>Status</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles.loadingRow}>
                  Loading...
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
                  <td>{m.machine_name}</td>
                  <td>{m.machine_type}</td>
                  <td>{formatDate(m.last_maintenance)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        m.status
                      )}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td>
                    {m.project_names?.length > 0
                      ? m.project_names.join(", ")
                      : "—"}
                  </td>
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

      {/* ADD / EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MachineryForm
          initialData={selectedMachine}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Machine?</h3>
        <p>
          Are you sure you want to delete{" "}
          <b>{selectedMachine?.machine_name}</b>?
        </p>

        <div className={styles.confirmBtns}>
          <button
            className={styles.cancelBtn}
            onClick={() => setIsDeleteModal(false)}
          >
            Cancel
          </button>

          <button
            className={styles.confirmDeleteBtn}
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}