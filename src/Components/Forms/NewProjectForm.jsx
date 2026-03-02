import { useState, useEffect } from "react";
import styles from "./NewProjectForms.module.css";
import { useMachines } from "../../store/context/MachineContext";
import { useUsers } from "../../store/context/UserContext";
import { useVendors } from "../../store/context/VendorContext";

export default function NewProjectForm({ initialData, onSubmit }) {
  const { machines, loadMachines } = useMachines();
  const { users, loadUsers } = useUsers();
  const { vendors, loadVendors } = useVendors();

  const supervisors = users.filter((u) => u.role === "SUPERVISOR");

  const EMPTY_FORM = {
    project_code: "",
    date: "",
    name: "",
    client_name: "",
    engineer_in_charge: "",
    location: "",
    status: "Not Started",
    progress: 0,
    totalBH: 0,
    completedBH: 0,
    supervisor_ids: [],
    machine_ids: [],
    vendor_ids: [],
  };

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    loadMachines();
    loadUsers();
    loadVendors();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...EMPTY_FORM,
        ...initialData,
        supervisor_ids: initialData.supervisors?.map((s) => s.id) || [],
        machine_ids: initialData.machinery?.map((m) => m.id) || [],
        vendor_ids: initialData.vendors?.map((v) => v.id) || [],
        totalBH: initialData.total_boreholes || 0,
        completedBH: initialData.completed_boreholes || 0,
        progress: initialData.progress || 0,
        status: initialData.status || "Not Started",
      });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addItem = (field, id) =>
    setFormData((p) => ({ ...p, [field]: [...p[field], id] }));

  const removeItem = (field, id) =>
    setFormData((p) => ({ ...p, [field]: p[field].filter((i) => i !== id) }));

  const submitForm = (e) => {
    e.preventDefault();
    onSubmit({
      project_code: formData.project_code,
      date: formData.date,
      name: formData.name,
      client_name: formData.client_name,
      engineer_in_charge: formData.engineer_in_charge,
      location: formData.location,
      status: formData.status,
      total_boreholes: Number(formData.totalBH),
      completed_boreholes: Number(formData.completedBH),
      supervisor_ids: formData.supervisor_ids,
      machine_ids: formData.machine_ids,
      vendor_ids: formData.vendor_ids,
    });
  };

  return (
    <form className={styles.form} onSubmit={submitForm}>
      <h2>{initialData ? "Edit Project" : "Create New Project"}</h2>

      {/* PROJECT DETAILS */}
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Project Code *</label>
          <input
            name="project_code"
            value={formData.project_code}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Project Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Client Name</label>
          <input
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Engineer In Charge</label>
          <input
            name="engineer_in_charge"
            value={formData.engineer_in_charge}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Not Started">Not Started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Total Boreholes</label>
          <input
            type="number"
            name="totalBH"
            value={formData.totalBH}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Completed Boreholes</label>
          <input
            type="number"
            name="completedBH"
            value={formData.completedBH}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Progress (%)</label>
          <input type="number" name="progress" value={formData.progress} disabled />
        </div>
      </div>

      {/* ASSIGNMENTS */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Assignments</h3>
        <div className={styles.assignmentGrid}>
          <div className={styles.field}>
            <ChipSelect
              label="Supervisors"
              items={supervisors}
              selected={formData.supervisor_ids}
              displayKey="full_name"
              onAdd={(id) => addItem("supervisor_ids", id)}
              onRemove={(id) => removeItem("supervisor_ids", id)}
            />
          </div>

          <div className={styles.field}>
            <ChipSelect
              label="Vendors"
              items={vendors}
              selected={formData.vendor_ids}
              displayKey="contact_person"
              onAdd={(id) => addItem("vendor_ids", id)}
              onRemove={(id) => removeItem("vendor_ids", id)}
            />
          </div>

          <div className={styles.field}>
            <ChipSelect
              label="Machinery"
              items={machines}
              selected={formData.machine_ids}
              displayKey="machine_name"
              onAdd={(id) => addItem("machine_ids", id)}
              onRemove={(id) => removeItem("machine_ids", id)}
            />
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        {initialData ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}

// ---------------- CHIP SELECT ----------------
function ChipSelect({ label, items, selected, onAdd, onRemove, displayKey }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(
    (i) =>
      i[displayKey]?.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(i.id)
  );

  return (
    <div className={styles.chipSelectBox}>
      <label>{label}</label>
      <div className={styles.chipContainer}>
        {selected.map((id) => {
          const item = items.find((i) => i.id === id);
          return (
            <span key={id} className={styles.chip}>
              {item?.[displayKey]}
              <button type="button" onClick={() => onRemove(id)}>
                ×
              </button>
            </span>
          );
        })}
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${label}`}
      />
      {search && filtered.length > 0 && (
        <div className={styles.dropdown}>
          {filtered.map((i) => (
            <div
              key={i.id}
              onClick={() => {
                onAdd(i.id);
                setSearch("");
              }}
            >
              {i[displayKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}