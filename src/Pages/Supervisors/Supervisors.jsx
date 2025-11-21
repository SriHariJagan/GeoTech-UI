import { useContext, useState, useMemo } from "react";
import { SupervisorContext } from "../../store/Context/SupervisorContext";
import { ProjectContext } from "../../store/Context/ProjectContext";
import Modal from "../../Components/Modal/Modal";
import SupervisorForm from "../../Components/Forms/SupervisorForm";
import styles from "./Supervisors.module.css";

export default function Supervisors() {
  const {
    supervisors,
    loading,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
  } = useContext(SupervisorContext);

  const { projects } = useContext(ProjectContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const [filters, setFilters] = useState({
    supervisor: "",
    project: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => setFilters({ supervisor: "", project: "" });

  const uniqueSupervisors = [...new Set(supervisors.map((s) => s.name))];
  const uniqueProjects = [...new Set(projects.map((p) => p.name))];

  const filteredData = useMemo(() => {
    return supervisors.filter((s) => {
      return (
        (!filters.supervisor || s.name === filters.supervisor) &&
        (!filters.project || s.project === filters.project)
      );
    });
  }, [filters, supervisors]);

  const handleSubmit = (data) => {
    if (selectedSupervisor) updateSupervisor(selectedSupervisor.id, data);
    else addSupervisor(data);

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
        <h2 className={styles.title}>Supervisors Overview</h2>

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

      {/* FILTERS */}
      <div className={styles.filters}>
        <select
          name="supervisor"
          value={filters.supervisor}
          onChange={handleChange}
        >
          <option value="">Select Supervisor</option>
          {uniqueSupervisors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select name="project" value={filters.project} onChange={handleChange}>
          <option value="">Select Project</option>
          {uniqueProjects.map((p) => (
            <option key={p}>{p}</option>
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
              <th>ID</th>
              <th>Supervisor Name</th>
              <th>Project Assigned</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading supervisors...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No supervisors found
                </td>
              </tr>
            ) : (
              filteredData.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td className={styles.projectNameTD}>
                    <span className={styles.projectName} data-full={s.project}>
                      {s.project}
                    </span>
                  </td>
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
        <SupervisorForm
          initialData={selectedSupervisor}
          onSubmit={handleSubmit}
          projects={projects}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Supervisor?</h3>
        <p>
          Are you sure you want to delete <b>{selectedSupervisor?.name}</b>?
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
