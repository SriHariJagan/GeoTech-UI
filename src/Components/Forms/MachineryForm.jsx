import { useState, useEffect } from "react";
import styles from "./Forms.module.css";

const today = new Date().toISOString().split("T")[0];


const EMPTY_FORM = {
  name: "",
  type: "",
  lastMaintenance: today,
  status: "inactive",
};

export default function MachineryForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */
  useEffect(() => {
    if (initialData) {
      console.log("Prefilling form with:", initialData);
      setFormData({
        name: initialData.machine_name || "",
        type: initialData.machine_type || "",
        lastMaintenance: initialData.last_maintenance || "",
        status: initialData.status || "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  /* ---------------- CHANGE HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type) {
      alert("Please fill all required fields!");
      return;
    }

    // 🔥 MAP FRONTEND → BACKEND
    const payload = {
      machine_name: formData.name,
      machine_type: formData.type,
      last_maintenance: formData.lastMaintenance || null,
      status: formData.status || "inactive", // default
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Machine" : "Add New Machine"}</h3>

      {/* Name */}
      <label>Machine Name *</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter machine name"
        required
      />

      {/* Type */}
      <label>Machine Type *</label>
      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Excavator / Crane / Bulldozer"
        required
      />

      {/* Maintenance */}
      <label>Last Maintenance</label>
      <input
        type="date"
        name="lastMaintenance"
        value={formData.lastMaintenance}
        onChange={handleChange}
      />

      {/* Status */}
      <label>Status *</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="active">Working</option>
        <option value="inactive" >Idle</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting
          ? "Saving..."
          : initialData
            ? "Update Machine"
            : "Add Machine"}
      </button>
    </form>
  );
}
