// Components/Forms/NewVendorForm.js
import { useState, useEffect } from "react";
import styles from "./Forms.module.css";

const defaultFormState = {
  vendor_company: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  vendorCode: 0,
  rating: 0,
};

const NewVendorForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState(defaultFormState);

  // Populate form in Edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        vendor_company: initialData.vendor_company ?? "",
        contactPerson: initialData.contact_person ?? "",
        phone: initialData.phone ?? "",
        email: initialData.email ?? "",
        address: initialData.address ?? "",
        vendorCode: initialData.vendor_code ?? 0,
        rating: initialData.rating ?? 0,
      });
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData]);

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

    if (!formData.vendor_company || !formData.contactPerson || !formData.phone) {
      alert("Vendor Company, Contact Person, and Phone are required");
      return;
    }

    const payload = {
      vendor_company: formData.vendor_company,
      contact_person: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      vendor_code: formData.vendorCode,
      rating: formData.rating,
      is_active: false,
    };

    onSubmit(payload);

    if (!initialData) {
      setFormData(defaultFormState);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Vendor" : "Add Vendor"}</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Vendor Code</label>
          <input
            type="number"
            name="vendorCode"
            value={formData.vendorCode}
            onChange={handleChange}
            min={0}
          />
        </div>

        <div className={styles.field}>
          <label>Company Name *</label>
          <input
            type="text"
            name="vendor_company"
            value={formData.vendor_company}
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
            required
          />
        </div>

        <div className={styles.field}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
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
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating || 0}
            onChange={handleChange}
            min={0}
            max={5}
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
