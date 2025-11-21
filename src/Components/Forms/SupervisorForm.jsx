import { useState, useEffect } from "react";
import styles from "./Forms.module.css"; // shared CSS

export default function SupervisorForm({ initialData, onSubmit, projects = [] }) {
  const [form, setForm] = useState({
    name: "",
    project: "",
    contact: "",
    email: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Supervisor" : "Add Supervisor"}</h3>

      <input
        type="text"
        name="name"
        placeholder="Supervisor Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      {/* Project Dropdown */}
      <select
        name="project"
        value={form.project}
        onChange={handleChange}
        required
      >
        <option value="">Select Project</option>
        {projects.map((p) => (
          <option key={p.id || p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        value={form.contact}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Update Supervisor" : "Add Supervisor"}
        </button>
      </div>
    </form>
  );
}
