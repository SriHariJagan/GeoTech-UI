import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDER } from "../../../store/context/DailyExecutionContext";
import { useProjects } from "../../../store/context/ProjectContext";
import { useVendors } from "../../../store/context/VendorContext";
import { useAuth } from "../../../store/context/AuthContext";
import { ROLES } from "../../../constants/roles";
import DERForm from "../../../Components/Forms/DERForm";
import styles from "./DER.module.css";
import Modal from "../../../Components/Modal/Modal";

const PAGE_SIZE = 10;

export default function DER() {
  const { dailyReports, loading, loadReports, updateReport, deleteReport, createReport } =
    useDER();
  const { projects, loadProjects } = useProjects();
  const { vendors, loadVendors } = useVendors();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [filters, setFilters] = useState({
    report_date: "",
    project_id: "",
    site_location: "",
    vendor_id: "",
  });

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadReports({ page, limit: PAGE_SIZE });
    loadProjects();
    loadVendors();
  }, [page, loadReports, loadProjects, loadVendors]);

  /* ---------------- ROLE PERMISSIONS ---------------- */
  const isAdmin = user?.role === ROLES.SUPERADMIN;
  const isSupervisor = user?.role === ROLES.SUPERVISOR;
  const canEdit = isAdmin || isSupervisor;
  const canDelete = isAdmin;

  /* ---------------- FILTER HANDLERS ---------------- */
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      report_date: "",
      project_id: "",
      site_location: "",
      vendor_id: "",
    });
    setPage(1);
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredReports = useMemo(() => {
    return dailyReports.filter((r) => {
      return (
        (!filters.report_date || r.report_date === filters.report_date) &&
        (!filters.project_id || r.project_id === +filters.project_id) &&
        (!filters.site_location || r.site_location === filters.site_location) &&
        (!filters.vendor_id || r.vendor_id === +filters.vendor_id)
      );
    });
  }, [dailyReports, filters]);

  /* ---------------- CRUD ---------------- */
  const handleSubmit = (data) => {
    if (selectedReport?.id) {
      updateReport(selectedReport.id, data);
    } else {
      createReport(data);
    }
    setSelectedReport(null);
    setIsEditOpen(false);
  };

  const confirmDelete = () => {
    deleteReport(selectedReport.id);
    setSelectedReport(null);
    setIsDeleteOpen(false);
  };

  /* ---------------- OPEN CREATE FORM ---------------- */
  const openCreateForm = () => {
    const defaultProject = isSupervisor
      ? projects.find((p) => p.supervisor_ids?.includes(user.id))
      : null;

    setSelectedReport({
      project_id: defaultProject?.id || "",
      vendor_id: defaultProject?.vendor_id || "",
      engineer_id: user?.id || "",
    });
    setIsEditOpen(true);
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Daily Execution Reports</h2>
        <button className={styles.addBtn} disabled={loading} onClick={openCreateForm}>
          + Create report
        </button>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input type="date" name="report_date" value={filters.report_date} onChange={handleFilterChange} />

        <select name="project_id" value={filters.project_id} onChange={handleFilterChange}>
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select name="site_location" value={filters.site_location} onChange={handleFilterChange}>
          <option value="">All Locations</option>
          {[...new Set(dailyReports.map((r) => r.site_location))].map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select name="vendor_id" value={filters.vendor_id} onChange={handleFilterChange}>
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.contact_person}</option>
          ))}
        </select>

        <button onClick={clearFilters} className={styles.clearBtn}>Clear</button>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Supervisor</th>
              <th>Vendor</th>
              <th>Site</th>
              <th>Borehole</th>
              <th>Rig</th>
              <th>Rig Type</th>
              <th>Total Depth</th>
              <th>Date</th>
              {(canEdit || canDelete) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className={styles.loadingRow}>Loading...</td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>No reports found</td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r.id}>
                  <td className={styles.projectLink} onClick={() => navigate(`${r.id}`)}>
                    {projects.find((p) => p.id === r.project_id)?.name || r.project_id}
                  </td>
                  <td>{r?.creator?.full_name || r.creator}</td>
                  <td>{vendors.find((v) => v.id === r.vendor_id)?.contact_person || r.vendor}</td>
                  <td>{r.site_location}</td>
                  <td>{r.borehole_no}</td>
                  <td>{r.rig_no}</td>
                  <td>{r.type_of_rig}</td>
                  <td>{r.total_depth}</td>
                  <td>{r.report_date}</td>
                  {(canEdit || canDelete) && (
                    <td>
                      {canEdit && <button className={styles.editBtn} onClick={() => { setSelectedReport(r); setIsEditOpen(true); }}>Edit</button>}
                      {canDelete && <button className={styles.deleteBtn} onClick={() => { setSelectedReport(r); setIsDeleteOpen(true); }}>Delete</button>}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={filteredReports.length < PAGE_SIZE} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DERForm initialData={selectedReport} onSubmit={handleSubmit} />
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h3>Delete Report?</h3>
        <p>Are you sure you want to delete this report for project <b>{projects.find(p => p.id === selectedReport?.project_id)?.name}</b>?</p>
        <div className={styles.confirmBtns}>
          <button className={styles.cancelBtn} onClick={() => setIsDeleteOpen(false)}>Cancel</button>
          <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
