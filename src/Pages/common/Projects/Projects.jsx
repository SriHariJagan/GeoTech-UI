import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../store/context/AuthContext";
import { useProjects } from "../../../store/context/ProjectContext";
import { ROLES } from "../../../constants/roles";
import styles from "./Projects.module.css";
import Modal from "../../../Components/Modal/Modal";
import NewProjectForm from "../../../Components/Forms/NewProjectForm";

export default function Projects() {
  const {
    projects = [],
    loading,
    addProject,
    updateProject,
    deleteProject,
    loadProjects,
  } = useProjects();

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdmin = user?.role === ROLES.SUPERADMIN;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "" });

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters((prev) => ({ ...prev, status: params.get("status") || "" }));
  }, [location.search]);

  const filteredData = useMemo(() =>
    projects.filter((p) => {
      const matchesName =
        !filters.search || p.name?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        !filters.status || p.status?.toLowerCase() === filters.status.toLowerCase();
      return matchesName && matchesStatus;
    }), [filters, projects]
  );

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing": return styles.statusOngoing;
      case "completed": return styles.statusCompleted;
      case "onhold": return styles.statusOnHold;
      default: return "";
    }
  };

  const handleSubmit = (data) => {
    if (!isSuperAdmin) return;
    if (selectedProject) updateProject(selectedProject.id, data);
    else addProject(data);
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!isSuperAdmin || !selectedProject) return;
    deleteProject(selectedProject.id);
    setSelectedProject(null);
    setIsDeleteModal(false);
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Projects</h2>
        {isSuperAdmin && (
          <button
            className={styles.addBtn}
            disabled={loading}
            onClick={() => { setSelectedProject(null); setIsModalOpen(true); }}
          >
            + Add Project
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by project name..."
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="onhold">On Hold</option>
        </select>
        <button onClick={() => setFilters({ search: "", status: "" })} className={styles.clearBtn}>Clear Filters</button>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Project Code</th>
              <th>Date</th>
              <th>Project Name</th>
              <th>Client Name</th>
              <th>Engineer Incharge</th>
              <th>Location</th>
              <th>Vendors</th>
              <th>Supervisors</th>
              <th>Machinery</th>
              <th>Status</th>
              <th>Progress</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="13">Loading projects...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="13">No projects found</td></tr>
            ) : (
              filteredData.map((p) => (
                <tr key={p.id}>
                  {/* <td>{p.id}</td> */}
                  <td>{p.project_code}</td>
                  <td>{p.date}</td>
                  <td><span className={styles.projectLink} onClick={() => navigate(`${p.id}`)}>{p.name}</span></td>
                  <td>{p.client_name || "-"}</td>
                  <td>{p.engineer_in_charge || "-"}</td>
                  <td>{p.location || "-"}</td>
                  <td>{p.vendors?.map(v => v.vendor_name).join(", ") || "-"}</td>
                  <td>{p.supervisors?.map(s => s.full_name).join(", ") || "-"}</td>
                  <td>{p.machinery?.map(m => m.machine_name).join(", ") || "-"}</td>
                  <td><span className={`${styles.statusBadge} ${getStatusClass(p.status)}`}>{p.status}</span></td>
                  <td>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar} style={{ width: `${p.progress || 0}%` }} />
                      <span className={styles.progressText}>{p.progress || 0}%</span>
                    </div>
                  </td>
                  {isSuperAdmin && (
                    <td>
                      <button onClick={() => { setSelectedProject(p); setIsModalOpen(true); }} className={styles.editBtn}>Edit</button>
                      <button onClick={() => { setSelectedProject(p); setIsDeleteModal(true); }} className={styles.deleteBtn}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {isSuperAdmin && isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NewProjectForm initialData={selectedProject} onSubmit={handleSubmit} />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {isSuperAdmin && isDeleteModal && (
        <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
          <h3>Delete Project?</h3>
          <p>Are you sure you want to delete <b>{selectedProject?.name}</b>?</p>
          <div className={styles.confirmBtns}>
            <button onClick={() => setIsDeleteModal(false)}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}