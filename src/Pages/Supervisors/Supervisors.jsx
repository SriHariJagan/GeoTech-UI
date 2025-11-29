import { useContext, useState, useMemo, useEffect } from "react";
import { SupervisorContext } from "../../store/Context/SupervisorContext";
import { useLocation } from "react-router-dom";
import Modal from "../../Components/Modal/Modal";
import SupervisorForm from "../../Components/Forms/SupervisorForm";
import styles from "./Supervisors.module.css";

export default function Supervisors() {
  const { supervisors, loading, addSupervisor, updateSupervisor, deleteSupervisor } =
    useContext(SupervisorContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    reportUpdatedToday: "",
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  // ⭐ APPLY FILTER FROM URL
  useEffect(() => {
    const statusFromURL = queryParams.get("status");
    if (statusFromURL) {
      setFilters((prev) => ({ ...prev, status: statusFromURL }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "search") {
      setShowSuggestions(value.trim().length > 0);
    }
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", reportUpdatedToday: "" });
    setShowSuggestions(false);
  };

  // FILTERS APPLY
  const filteredData = useMemo(() => {
    return supervisors.filter((s) => {
      const matchesName =
        !filters.search ||
        s.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || s.status === filters.status;

      const matchesReport =
        !filters.reportUpdatedToday ||
        (filters.reportUpdatedToday === "yes" && s.reportUpdatedToday) ||
        (filters.reportUpdatedToday === "no" && !s.reportUpdatedToday);

      return matchesName && matchesStatus && matchesReport;
    });
  }, [filters, supervisors]);

  const suggestions = useMemo(() => {
    if (!filters.search) return [];
    return supervisors.filter((s) =>
      s.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [filters.search, supervisors]);

  const handleSubmit = (data) => {
    if (selectedSupervisor) {
      updateSupervisor(selectedSupervisor.id, data);
    } else {
      addSupervisor(data);
    }

    setSelectedSupervisor(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    deleteSupervisor(selectedSupervisor.id);
    setIsDeleteModal(false);
    setSelectedSupervisor(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Supervisors</h2>

        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedSupervisor(null);
            setIsModalOpen(true);
          }}
        >
          + Add Supervisor
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            value={filters.search}
            onChange={handleChange}
            autoComplete="off"
            onFocus={() => {
              if (filters.search.trim() !== "") setShowSuggestions(true);
            }}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestionsBox}>
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, search: s.name }));
                    setShowSuggestions(false);
                  }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Status</option>
          <option value="working">Working</option>
          <option value="idle">Idle</option>
        </select>

        <select
          name="reportUpdatedToday"
          value={filters.reportUpdatedToday}
          onChange={handleChange}
        >
          <option value="">Report Updated (All)</option>
          <option value="yes">Updated Today</option>
          <option value="no">Not Updated</option>
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
              <th>ID</th>
              <th>Supervisor Name</th>
              <th>Status</th>
              <th>Updated Today</th>
              <th>Last Updated</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading supervisors...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  No supervisors found
                </td>
              </tr>
            ) : (
              filteredData.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.status}</td>
                  <td>{s.reportUpdatedToday ? "Yes" : "No"}</td>
                  <td>{s.lastReportUpdated || "-"}</td>
                  <td>{s.contact}</td>
                  <td>{s.email}</td>

                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedSupervisor(s);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        setSelectedSupervisor(s);
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
        <SupervisorForm initialData={selectedSupervisor} onSubmit={handleSubmit} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Supervisor?</h3>
        <p>Are you sure you want to delete <b>{selectedSupervisor?.name}</b>?</p>

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
