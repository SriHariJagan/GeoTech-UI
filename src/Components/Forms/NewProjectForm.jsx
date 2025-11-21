import React, { useState } from "react";
import styles from "./Forms.module.css"; // shared CSS

const NewProjectForm = ({ initialData = null, onSubmit, supervisors = [] }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      location: "",
      vendor: "",
      supervisor: "",
      status: "Active",
      progress: 0,
      totalBH: 0,
      completedBH: 0,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "progress" || name === "totalBH" || name === "completedBH"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Project" : "Create New Project"}</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter project name"
          />
        </div>

        <div className={styles.field}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter project location"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Vendor</label>
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            placeholder="Enter vendor name"
          />
        </div>

        <div className={styles.field}>
          <label>Supervisor</label>
          <select
            name="supervisor"
            value={formData.supervisor}
            onChange={handleChange}
            required
          >
            <option value="">Select Supervisor</option>
            {supervisors.map((s) => (
              <option key={s.id || s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Progress (%)</label>
          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Total BH</label>
          <input
            type="number"
            name="totalBH"
            min="0"
            value={formData.totalBH}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Completed BH</label>
          <input
            type="number"
            name="completedBH"
            min="0"
            value={formData.completedBH}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
