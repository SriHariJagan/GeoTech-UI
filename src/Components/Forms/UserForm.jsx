import { useEffect, useState } from "react";
import styles from "./Forms.module.css";

const EMPTY_FORM = {
  email: "",
  full_name: "",
  role: "",
  is_active: true,
  contact: ""
};

export default function UserForm({ initialData = null, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || "",
        full_name: initialData.full_name || "",
        contact: initialData.contact || "",
        role: initialData.role || "",
        is_active:
          typeof initialData.is_active === "boolean"
            ? initialData.is_active
            : true,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  /* ---------------- CHANGE HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "is_active" ? value === "active" : value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || (!initialData && !formData.email)) {
      alert("Please fill all required fields");
      return;
    }

    // 🔥 MAP FRONTEND → BACKEND
    const payload = {
      email: formData.email || undefined, // create only
      full_name: formData.full_name,
      contact: formData.contact,
      role: formData.role || undefined,
      is_active: formData.is_active,
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
      <h3>{initialData ? "Edit User" : "Add New User"}</h3>

      {/* Email (Create only) */}
      {!initialData && (
        <>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            required
          />
        </>
      )}

      {/* Full Name */}
      <label>Full Name *</label>
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Enter full name"
        required
      />


      {/* Contact Number */}
      <label>Contact Number *</label>
      <input
        type="text"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        placeholder="Contact number"
        required
      />

      {/* Role (Create only) */}
      {!initialData && (
        <>
          <label>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="LAB_ANALYST">Lab Analyst</option>
          </select>
        </>
      )}

      {/* Status (Edit only) */}
      {initialData && (
        <>
          <label>Status *</label>
          <select
            name="is_active"
            value={formData.is_active ? "active" : "disabled"}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={submitting}
      >
        {submitting
          ? "Saving..."
          : initialData
          ? "Update User"
          : "Create User"}
      </button>
    </form>
  );
}
