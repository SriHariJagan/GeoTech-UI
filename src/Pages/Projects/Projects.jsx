import { useContext, useState, useMemo } from "react";
import { ProjectContext } from "../../store/Context/ProjectContext";
import Modal from "../../Components/Modal/Modal";
import styles from "./Projects.module.css";
import NewProjectForm from "../../Components/Forms/NewProjectForm";
import { SupervisorContext } from "../../store/Context/SupervisorContext";

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, loading } =
    useContext(ProjectContext);

   const { supervisors} = useContext(SupervisorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const [filters, setFilters] = useState({
    project: "",
    location: "",
    vendor: "",
    supervisor: "",
    status: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      project: "",
      location: "",
      vendor: "",
      supervisor: "",
      status: "",
    });
  };

  const unique = (key) => [...new Set(projects.map((p) => p[key]))];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      return (
        (!filters.project || p.name === filters.project) &&
        (!filters.location || p.location === filters.location) &&
        (!filters.vendor || p.vendor === filters.vendor) &&
        (!filters.supervisor || p.supervisor === filters.supervisor) &&
        (!filters.status || p.status === filters.status)
      );
    });
  }, [filters, projects]);

  // -----------------------------
  // Handle Add/Edit Project
  // -----------------------------
  const handleSubmit = (data) => {
    if (selectedProject) {
      updateProject(selectedProject.id, data);
    } else {
      addProject(data);
    }

    setSelectedProject(null);
    setIsModalOpen(false);
  };

  // -----------------------------
  // Handle Delete Project
  // -----------------------------
  const confirmDelete = () => {
    deleteProject(selectedProject.id);
    setIsDeleteModal(false);
    setSelectedProject(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Project Overview</h2>

        <div className={styles.actionBtns}>
          <button
            className={styles.addBtn}
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className={styles.filters}>
        <select name="project" value={filters.project} onChange={handleChange}>
          <option value="">Select Project</option>
          {unique("name").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
        >
          <option value="">Select Location</option>
          {unique("location").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="vendor" value={filters.vendor} onChange={handleChange}>
          <option value="">Select Vendor</option>
          {unique("vendor").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="supervisor"
          value={filters.supervisor}
          onChange={handleChange}
        >
          <option value="">Select Supervisor</option>
          {unique("supervisor").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
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
              <th>Project Name</th>
              <th>Location</th>
              <th>Vendor</th>
              <th>Supervisor</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Total BH</th>
              <th>Completed BH</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading projects...</p>
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  No projects found
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td className={styles.projectNameTD}>
                    <span className={styles.projectName} data-full={p.name}>
                      {p.name}
                    </span>
                  </td>

                  <td>{p.location}</td>
                  <td>{p.vendor}</td>
                  <td>{p.supervisor}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[p.status.toLowerCase().replace(" ", "")]
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                    <span className={styles.progressText}>{p.progress}%</span>
                  </td>

                  <td>{p.totalBH}</td>
                  <td>{p.completedBH}</td>

                  <td className={styles.actionsCol}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedProject(p);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        setSelectedProject(p);
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
        <NewProjectForm initialData={selectedProject} onSubmit={handleSubmit} supervisors={supervisors} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Project?</h3>
        <p>
          Are you sure you want to delete <b>{selectedProject?.name}</b>?
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
