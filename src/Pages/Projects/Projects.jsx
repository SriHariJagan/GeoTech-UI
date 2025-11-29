import { useContext, useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ProjectContext } from "../../store/Context/ProjectContext";
import Modal from "../../Components/Modal/Modal";
import NewProjectForm from "../../Components/Forms/NewProjectForm";
import styles from "./Projects.module.css";

export default function Projects() {
  const {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
  } = useContext(ProjectContext);

  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  // Read query params (status)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status") || "";
    setFilters((prev) => ({ ...prev, status }));
  }, [location.search]);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () =>
    setFilters({ search: "", status: "" });

  // FILTER LOGIC
  const filteredData = useMemo(() => {
    return projects.filter((p) => {
      const matchesName =
        !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        !filters.status || p.status === filters.status;

      return matchesName && matchesStatus;
    });
  }, [filters, projects]);

  const handleSubmit = (data) => {
    if (selectedProject) updateProject(selectedProject.id, data);
    else addProject(data);

    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    deleteProject(selectedProject.id);
    setIsDeleteModal(false);
    setSelectedProject(null);
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Projects</h2>

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

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          type="text"
          name="search"
          placeholder="Search by project name..."
          value={filters.search}
          onChange={handleChange}
        />

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="hold">Hold</option>
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
              <th>Project Name</th>
              <th>Location</th>
              <th>Vendor</th>
              <th>Supervisors</th>
              <th>Machinery</th>
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
                <td colSpan="11" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading projects...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="11" className={styles.noData}>
                  No projects found
                </td>
              </tr>
            ) : (
              filteredData.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.location}</td>
                  <td>{p.vendor}</td>

                  {/* Supervisors */}
                  <td className={styles.tagCell}>
                    <div className={styles.tagList}>
                      {p.supervisors?.map((s) => (
                        <span key={s.id} className={styles.tag}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Machinery */}
                  <td className={styles.tagCell}>
                    <div className={styles.tagList}>
                      {p.machinery?.map((m) => (
                        <span key={m.id} className={styles.tag}>
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>{p.status}</td>
                  <td>{p.progress || 0}%</td>
                  <td>{p.totalBH || 0}</td>
                  <td>{p.completedBH || 0}</td>

                  <td>
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
        <NewProjectForm
          initialData={selectedProject}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Project?</h3>
        <p>
          Are you sure you want to delete{" "}
          <b>{selectedProject?.name}</b>?
        </p>

        <div className={styles.confirmBtns}>
          <button className={styles.cancelBtn} onClick={() => setIsDeleteModal(false)}>
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
