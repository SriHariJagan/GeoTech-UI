import { useContext, useState, useMemo } from "react";
import { MachineryContext } from "../../store/Context/MachineryContext";
import { ProjectContext } from "../../store/Context/ProjectContext";
import { SupervisorContext } from "../../store/Context/SupervisorContext";
import Modal from "../../Components/Modal/Modal";
import MachineryForm from "../../Components/Forms/MachineryForm";
import styles from "../Projects/Projects.module.css";

export default function Machinery() {
  const { machinery, loading, addMachine, updateMachine, deleteMachine } =
    useContext(MachineryContext);
  const { projects } = useContext(ProjectContext);
  const { supervisors } = useContext(SupervisorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const [filters, setFilters] = useState({
    machine: "",
    project: "",
    location: "",
  });

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({ machine: "", project: "", location: "" });

  const unique = (key) => [...new Set(machinery.map((m) => m[key]))];

  const filteredData = useMemo(() => {
    return machinery.filter((m) => {
      return (
        (!filters.machine || m.name === filters.machine) &&
        (!filters.project || m.project === filters.project) &&
        (!filters.location || m.location === filters.location)
      );
    });
  }, [filters, machinery]);

  const handleSubmit = (data) => {
    if (selectedMachine) {
      updateMachine(selectedMachine.id, data);
    } else {
      addMachine(data);
    }
    setSelectedMachine(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    deleteMachine(selectedMachine.id);
    setSelectedMachine(null);
    setIsDeleteModal(false);
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

      {/* FILTERS */}
      <div className={styles.filters}>
        <select name="machine" value={filters.machine} onChange={handleChange}>
          <option value="">Select Machine</option>
          {unique("name").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="project" value={filters.project} onChange={handleChange}>
          <option value="">Select Project</option>
          {unique("project").map((val) => (
            <option key={val}>{val}</option>
          ))}
        </select>

        <select name="location" value={filters.location} onChange={handleChange}>
          <option value="">Select Location</option>
          {unique("location").map((val) => (
            <option key={val}>{val}</option>
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
              <th>Machine Name</th>
              <th>Project Assigned</th>
              <th>Location</th>
              <th>Last Maintenance</th>
              <th>Supervisor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading machinery...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No machines found
                </td>
              </tr>
            ) : (
              filteredData.map((m) => (
                <tr key={m.id}>
                  <td className={styles.projectNameTD}>
                    <span className={styles.projectName} data-full={m.name}>
                      {m.name}
                    </span>
                  </td>

                  <td className={styles.projectNameTD}>
                    <span className={styles.projectName} data-full={m.project}>
                      {m.project}
                    </span>
                  </td>

                  <td className={styles.projectNameTD}>
                    <span className={styles.projectName} data-full={m.location}>
                      {m.location}
                    </span>
                  </td>

                  <td>{m.lastMaintenance}</td>
                  <td>{m.supervisor}</td>

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

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MachineryForm
          initialData={selectedMachine}
          onSubmit={handleSubmit}
          projects={projects}
          supervisors={supervisors}
        />
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
