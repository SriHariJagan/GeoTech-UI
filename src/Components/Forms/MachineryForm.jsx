import { useState, useEffect } from "react";
import styles from "./Forms.module.css";

export default function MachineryForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    lastMaintenance: "",
    status: "",
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

    if (!formData.name || !formData.type || !formData.status) {
      alert("Please fill all required fields!");
      return;
    }

    onSubmit(formData);

    setFormData({
      name: "",
      type: "",
      lastMaintenance: "",
      status: "",
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Machine" : "Add New Machine"}</h3>

      <label>Machine Name *</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter machine name"
      />

      <label>Machine Type *</label>
      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Excavator / Crane / Bulldozer"
      />

      <label>Last Maintenance</label>
      <input
        type="date"
        name="lastMaintenance"
        value={formData.lastMaintenance}
        onChange={handleChange}
      />

      <label>Status *</label>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="">Select Status</option>
        <option value="Working">Working</option>
        <option value="Idle">Idle</option>
        <option value="In Maintenance">In Maintenance</option>
      </select>

      <button type="submit" className={styles.submitBtn}>
        {initialData ? "Update Machine" : "Add Machine"}
      </button>
    </form>
  );
}
