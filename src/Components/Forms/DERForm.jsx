import { useEffect, useState, useMemo } from "react";
import styles from "./DERForm.module.css";
import { useProjects } from "../../store/context/ProjectContext";
import { useVendors } from "../../store/context/VendorContext";

const today = new Date().toISOString().split("T")[0];

const INITIAL_STATE = {
  project_id: "",
  client: "",
  client_person_name: "",
  client_person_designation: "",
  site_location: "",
  vendor_id: "",

  borehole_no: "",
  rig_no: "",
  type_of_rig: "",
  chainage: "",
  depth_started: "",
  soil_depth: "",
  soft_rock_depth: "",
  hard_rock_depth: "",
  total_depth: "",
  remarks: "",
  borehole_started: "",
  borehole_ended: "",
  report_date: today,
};

export default function DERForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_STATE);

  const { projects, loadProjects } = useProjects();
  const { vendors, loadVendors } = useVendors();

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadProjects();
    loadVendors();
  }, []);

  /* ---------------- PREFILL FOR EDIT ---------------- */
  useEffect(() => {
    if (initialData) {
      setFormData({ ...INITIAL_STATE, ...initialData });
    }
  }, [initialData]);

  /* ================= PROJECT SELECTION ================= */
  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === Number(formData.project_id));
  }, [formData.project_id, projects]);

  /* ================= AUTO FILL PROJECT DETAILS ================= */
  useEffect(() => {
    if (selectedProject) {
      setFormData((prev) => ({
        ...prev,
        client: selectedProject.client_name || "",
        client_person_name:
          selectedProject.engineer_in_charge || "",
        client_person_designation: "",
        site_location: selectedProject.location || "",
      }));
    }
  }, [selectedProject]);

  /* ================= FILTER VENDORS BASED ON PROJECT ================= */
  const filteredVendors = useMemo(() => {
    if (!selectedProject) return [];

    const projectVendorIds =
      selectedProject.vendor_ids || [];

    return vendors.filter((v) =>
      projectVendorIds.includes(v.id)
    );
  }, [selectedProject, vendors]);

  /* ================= AUTO TOTAL DEPTH ================= */
  const totalDepth = useMemo(() => {
    const soil = Number(formData.soil_depth || 0);
    const soft = Number(formData.soft_rock_depth || 0);
    const hard = Number(formData.hard_rock_depth || 0);
    return soil + soft + hard;
  }, [
    formData.soil_depth,
    formData.soft_rock_depth,
    formData.hard_rock_depth,
  ]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total_depth: totalDepth,
    }));
  }, [totalDepth]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericFields = [
      "project_id",
      "vendor_id",
      "depth_started",
      "soil_depth",
      "soft_rock_depth",
      "hard_rock_depth",
      "total_depth",
    ];

    const payload = Object.keys(formData).reduce((acc, key) => {
      acc[key] = numericFields.includes(key)
        ? formData[key] === ""
          ? 0
          : Number(formData[key])
        : formData[key];
      return acc;
    }, {});

    onSubmit(payload);
  };

  /* ================= RENDER ================= */
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3>Daily Execution Report</h3>

      {/* ================= PROJECT SECTION ================= */}
      <div className={styles.section}>
        <h4>Project Information</h4>

        <div className={styles.formGrid}>
          <label>
            Project *
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_code} - {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Client
            <input
              type="text"
              value={formData.client}
              readOnly
            />
          </label>

          <label>
            Engineer In Charge
            <input
              type="text"
              value={formData.client_person_name}
              readOnly
            />
          </label>

          <label>
            Site Location
            <input
              type="text"
              value={formData.site_location}
              readOnly
            />
          </label>

          <label>
            Vendor *
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Vendor</option>
              {filteredVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vendor_company || v.contact_person}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ================= DRILLING SECTION ================= */}
      <div className={styles.section}>
        <h4>Borehole / Drilling Details</h4>

        <div className={styles.formGrid}>
          <label>
            Borehole No *
            <input
              type="text"
              name="borehole_no"
              value={formData.borehole_no}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rig No *
            <input
              type="text"
              name="rig_no"
              value={formData.rig_no}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rig Type *
            <input
              type="text"
              name="type_of_rig"
              value={formData.type_of_rig}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Chainage
            <input
              type="text"
              name="chainage"
              value={formData.chainage}
              onChange={handleChange}
            />
          </label>

          <label>
            Depth Started
            <input
              type="number"
              name="depth_started"
              value={formData.depth_started}
              onChange={handleChange}
            />
          </label>

          <label>
            Soil Depth
            <input
              type="number"
              name="soil_depth"
              value={formData.soil_depth}
              onChange={handleChange}
            />
          </label>

          <label>
            Soft Rock Depth
            <input
              type="number"
              name="soft_rock_depth"
              value={formData.soft_rock_depth}
              onChange={handleChange}
            />
          </label>

          <label>
            Hard Rock Depth
            <input
              type="number"
              name="hard_rock_depth"
              value={formData.hard_rock_depth}
              onChange={handleChange}
            />
          </label>

          <label>
            Total Depth (Auto)
            <input type="number" value={formData.total_depth} readOnly />
          </label>

          <label>
            Borehole Started *
            <input
              type="date"
              name="borehole_started"
              value={formData.borehole_started}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Borehole Ended *
            <input
              type="date"
              name="borehole_ended"
              value={formData.borehole_ended}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Report Date *
            <input
              type="date"
              name="report_date"
              value={formData.report_date}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.fullWidth}>
            Remarks
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        {initialData ? "Update Report" : "Create Report"}
      </button>
    </form>
  );
}