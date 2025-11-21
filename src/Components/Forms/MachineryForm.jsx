import { useState, useEffect } from "react";
import styles from "./Forms.module.css"; // you can reuse your existing form styles

export default function MachineryForm({ initialData = null, onSubmit, projects, supervisors }) {
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    location: "",
    lastMaintenance: "",
    supervisor: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.project || !formData.location || !formData.supervisor) {
      alert("Please fill all required fields.");
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      project: "",
      location: "",
      lastMaintenance: "",
      supervisor: "",
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Machine" : "Add New Machine"}</h3>

      {/* Machine Name */}
      <label>Machine Name *</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter machine name"
      />

      {/* Project */}
      <label>Project Assigned *</label>
      <select name="project" value={formData.project} onChange={handleChange}>
        <option value="">Select Project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Location */}
      <label>Location *</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Enter location"
      />

      {/* Last Maintenance */}
      <label>Last Maintenance Date</label>
      <input
        type="date"
        name="lastMaintenance"
        value={formData.lastMaintenance}
        onChange={handleChange}
      />

      {/* Supervisor */}
      <label>Supervisor *</label>
      <select name="supervisor" value={formData.supervisor} onChange={handleChange}>
        <option value="">Select Supervisor</option>
        {supervisors.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <button type="submit" className={styles.submitBtn}>
        {initialData ? "Update Machine" : "Add Machine"}
      </button>
    </form>
  );
}
