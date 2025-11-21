// Components/Forms/NewVendorForm.js
import React, { useState } from "react";
import styles from "./Forms.module.css";

const NewVendorForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      company: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      depthHardRock: 0,
      depthSoftRock: 0,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "depthHardRock" || name === "depthSoftRock"
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
      <h2>{initialData ? "Edit Vendor" : "Add Vendor"}</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Vendor Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Depth in Hard Rocks</label>
          <input
            type="number"
            name="depthHardRock"
            value={formData.depthHardRock}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Depth in Soft Rock</label>
          <input
            type="number"
            name="depthSoftRock"
            value={formData.depthSoftRock}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? "Update Vendor" : "Add Vendor"}
        </button>
      </div>
    </form>
  );
};

export default NewVendorForm;
