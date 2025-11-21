import { useContext, useState, useMemo } from "react";
import { DERContext } from "../../store/Context/DERContext";
import Modal from "../../Components/Modal/Modal";
import DERForm from "../../Components/Forms/DERForm";
import styles from "./DER.module.css";

export default function DER() {
  const { dailyReports, loading, updateReport, deleteReport } =
    useContext(DERContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    project: "",
    location: "",
    vendor: "",
  });

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({ date: "", project: "", location: "", vendor: "" });

  const unique = (key) => [...new Set(dailyReports.map((r) => r[key]))];

  const filteredReports = useMemo(() => {
    return dailyReports.filter((r) => {
      return (
        (!filters.date || r.date === filters.date) &&
        (!filters.project || r.project === filters.project) &&
        (!filters.location || r.siteLocation === filters.location) &&
        (!filters.vendor || r.vendor === filters.vendor)
      );
    });
  }, [filters, dailyReports]);

  const handleSubmit = (data) => {
    if (selectedReport) updateReport(selectedReport.id, data);
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    deleteReport(selectedReport.id);
    setSelectedReport(null);
    setIsDeleteModal(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Daily Execution Reports</h2>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
        />

        <select name="project" value={filters.project} onChange={handleChange}>
          <option value="">Select Project</option>
          {unique("project").map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select name="location" value={filters.location} onChange={handleChange}>
          <option value="">Select Location</option>
          {unique("siteLocation").map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select name="vendor" value={filters.vendor} onChange={handleChange}>
          <option value="">Select Vendor</option>
          {unique("vendor").map((v) => (
            <option key={v} value={v}>
              {v}
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
              <th>Project</th>
              <th>Site Location</th>
              <th>Vendor</th>
              <th>Bhoreholes No</th>
              <th>Rig No</th>
              <th>Chainage</th>
              <th>Depth Started (m)</th>
              <th>Depth Completed (m)</th>
              <th>Depth in Soil (m)</th>
              <th>Depth in Soft Rock (m)</th>
              <th>Depth in Hard Rock (m)</th>
              <th>Total Depth Drilled</th>
              <th>Engineer</th>
              <th>Client</th>
              <th>Client Person Name</th>
              <th>Client Person Designation</th>
              <th>Remarks</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="19" className={styles.loadingRow}>
                  <div className={styles.loader}></div>
                  <p>Loading reports...</p>
                </td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan="19" className={styles.noData}>
                  No reports found
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r.id}>
                  <td data-label="Project">{r.project}</td>
                  <td data-label="Site Location">{r.siteLocation}</td>
                  <td data-label="Vendor">{r.vendor}</td>
                  <td data-label="Bhoreholes No">{r.bhoreholesNo}</td>
                  <td data-label="Rig No">{r.rigNo}</td>
                  <td data-label="Chainage">{r.chainage}</td>
                  <td data-label="Depth Started">{r.depthStarted}</td>
                  <td data-label="Depth Completed">{r.depthCompleted}</td>
                  <td data-label="Depth in Soil">{r.depthInSoil}</td>
                  <td data-label="Depth in Soft Rock">{r.depthInSoftRock}</td>
                  <td data-label="Depth in Hard Rock">{r.depthInHardRock}</td>
                  <td data-label="Total Depth Drilled">
                    {r.totalDepthDrilled}
                  </td>
                  <td data-label="Engineer">{r.engineer}</td>
                  <td data-label="Client">{r.client}</td>
                  <td data-label="Client Person Name">{r.clientPersonName}</td>
                  <td data-label="Client Person Designation">
                    {r.clientPersonDesignation}
                  </td>
                  <td data-label="Remarks">{r.remarks}</td>
                  <td data-label="Date">{r.date}</td>

                  <td data-label="Actions">
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setSelectedReport(r);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        setSelectedReport(r);
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

      {/* EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DERForm initialData={selectedReport} onSubmit={handleSubmit} />
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h3>Delete Report?</h3>
        <p>
          Are you sure you want to delete <b>{selectedReport?.project}</b>?
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
