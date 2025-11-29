import { useState, useEffect } from "react";
import styles from "./Forms.module.css";

export default function SupervisorForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    status: "",
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

      {/* Status Dropdown */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="working">Working</option>
        <option value="idle">Idle</option>
      </select>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Update Supervisor" : "Add Supervisor"}
        </button>
      </div>
    </form>
  );
}
