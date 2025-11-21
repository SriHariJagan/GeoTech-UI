import { useState } from "react";
import styles from "./DERForm.module.css";

export default function DERForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3>Edit Daily Execution Report</h3>
      <div className={styles.formGrid}>
        <input
          type="text"
          name="project"
          value={formData.project || ""}
          onChange={handleChange}
          placeholder="Project"
        />
        <input
          type="text"
          name="siteLocation"
          value={formData.siteLocation || ""}
          onChange={handleChange}
          placeholder="Site Location"
        />
        <input
          type="text"
          name="vendor"
          value={formData.vendor || ""}
          onChange={handleChange}
          placeholder="Vendor"
        />
        <input
          type="number"
          name="bhoreholesNo"
          value={formData.bhoreholesNo || ""}
          onChange={handleChange}
          placeholder="Bhoreholes No"
        />
        <input
          type="text"
          name="rigNo"
          value={formData.rigNo || ""}
          onChange={handleChange}
          placeholder="Rig No"
        />
        <input
          type="text"
          name="chainage"
          value={formData.chainage || ""}
          onChange={handleChange}
          placeholder="Chainage"
        />
        <input
          type="number"
          name="depthStarted"
          value={formData.depthStarted || ""}
          onChange={handleChange}
          placeholder="Depth Started"
        />
        <input
          type="number"
          name="depthCompleted"
          value={formData.depthCompleted || ""}
          onChange={handleChange}
          placeholder="Depth Completed"
        />
        <input
          type="number"
          name="depthInSoil"
          value={formData.depthInSoil || ""}
          onChange={handleChange}
          placeholder="Depth in Soil"
        />
        <input
          type="number"
          name="depthInSoftRock"
          value={formData.depthInSoftRock || ""}
          onChange={handleChange}
          placeholder="Depth in Soft Rock"
        />
        <input
          type="number"
          name="depthInHardRock"
          value={formData.depthInHardRock || ""}
          onChange={handleChange}
          placeholder="Depth in Hard Rock"
        />
        <input
          type="number"
          name="totalDepthDrilled"
          value={formData.totalDepthDrilled || ""}
          onChange={handleChange}
          placeholder="Total Depth Drilled"
        />
        <input
          type="text"
          name="engineer"
          value={formData.engineer || ""}
          onChange={handleChange}
          placeholder="Engineer"
        />
        <input
          type="text"
          name="client"
          value={formData.client || ""}
          onChange={handleChange}
          placeholder="Client"
        />
        <input
          type="text"
          name="clientPersonName"
          value={formData.clientPersonName || ""}
          onChange={handleChange}
          placeholder="Client Person Name"
        />
        <input
          type="text"
          name="clientPersonDesignation"
          value={formData.clientPersonDesignation || ""}
          onChange={handleChange}
          placeholder="Client Person Designation"
        />
        <input
          type="text"
          name="remarks"
          value={formData.remarks || ""}
          onChange={handleChange}
          placeholder="Remarks"
        />
        <input
          type="date"
          name="date"
          value={formData.date || ""}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Save Changes
      </button>
    </form>
  );
}
