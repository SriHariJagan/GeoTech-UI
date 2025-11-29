import { useState, useContext, useEffect } from "react";
import styles from "./Forms.module.css";
import { SupervisorContext } from "../../store/Context/SupervisorContext";
import { MachineryContext } from "../../store/Context/MachineryContext";

export default function NewProjectForm({ initialData, onSubmit }) {
  const { supervisors } = useContext(SupervisorContext);
  const { machinery: contextMachinery } = useContext(MachineryContext);

  const emptyForm = {
    name: "",
    location: "",
    vendor: "",
    status: "ongoing",
    progress: 0,
    totalBH: 0,
    completedBH: 0,
    supervisors: [],
    machinery: [],
  };

  const [formData, setFormData] = useState(emptyForm);
  const [machinery, setMachinery] = useState(contextMachinery);

  // Sync context machinery and merge missing machinery from initialData
  useEffect(() => {
    let mergedMachinery = [...contextMachinery];

    if (initialData?.machinery?.length) {
      const missing = initialData.machinery.filter(
        (m) => !contextMachinery.find((cm) => cm.id === m.id)
      );
      if (missing.length) mergedMachinery = [...mergedMachinery, ...missing];
    }

    setMachinery(mergedMachinery);

    // Initialize form data
    if (initialData) {
      setFormData({
        ...emptyForm,
        name: initialData.name || "",
        location: initialData.location || "",
        vendor: initialData.vendor || "",
        status: initialData.status || "ongoing",
        progress: initialData.progress || 0,
        totalBH: initialData.totalBH || 0,
        completedBH: initialData.completedBH || 0,
        supervisors: initialData.supervisors?.map((s) => s.id) || [],
        machinery: initialData.machinery?.map((m) => m.id) || [],
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, contextMachinery]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const addItem = (field, id) => {
    setFormData((p) => ({ ...p, [field]: [...p[field], id] }));
  };

  const removeItem = (field, id) => {
    setFormData((p) => ({ ...p, [field]: p[field].filter((i) => i !== id) }));
  };

  const submitForm = (e) => {
    e.preventDefault();

    const finalProject = {
      ...formData,
      supervisors: supervisors.filter((s) => formData.supervisors.includes(s.id)),
      machinery: machinery.filter((m) => formData.machinery.includes(m.id)),
    };

    onSubmit(finalProject);
  };

  return (
    <form className={styles.form} onSubmit={submitForm}>
      <h2>{initialData ? "Edit Project" : "Add Project"}</h2>

      <input
        name="name"
        placeholder="Project Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />
      <input
        name="vendor"
        placeholder="Vendor"
        value={formData.vendor}
        onChange={handleChange}
      />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>

      <input
        type="number"
        name="progress"
        placeholder="Progress (%)"
        value={formData.progress}
        onChange={handleChange}
      />
      <input
        type="number"
        name="totalBH"
        placeholder="Total BH"
        value={formData.totalBH}
        onChange={handleChange}
      />
      <input
        type="number"
        name="completedBH"
        placeholder="Completed BH"
        value={formData.completedBH}
        onChange={handleChange}
      />

      {/* Supervisor Chip Select */}
      <ChipSelect
        label="Supervisors"
        items={supervisors}
        selected={formData.supervisors}
        onAdd={(id) => addItem("supervisors", id)}
        onRemove={(id) => removeItem("supervisors", id)}
      />

      {/* Machinery Chip Select */}
      <ChipSelect
        label="Machinery"
        items={machinery}
        selected={formData.machinery}
        onAdd={(id) => addItem("machinery", id)}
        onRemove={(id) => removeItem("machinery", id)}
      />

      <button type="submit" className={styles.submitBtn}>
        {initialData ? "Update Project" : "Add Project"}
      </button>
    </form>
  );
}

// CHIP SELECT COMPONENT
function ChipSelect({ label, items, selected, onAdd, onRemove }) {
  const [search, setSearch] = useState("");

  // Filter items by search and exclude already selected
  const filtered = items.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) && !selected.includes(i.id)
  );

  return (
    <div className={styles.chipSelectBox}>
      <label>{label}</label>

      {/* Selected Chips */}
      <div className={styles.chipContainer}>
        {selected.map((id) => {
          const item = items.find((i) => i.id === id);
          return (
            <span key={id} className={styles.chip}>
              {item?.name || "Unknown"}
              <button
                type="button"
                className={styles.removeChip}
                onClick={() => onRemove(id)}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder={`Search ${label}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.chipInput}
      />

      {/* Dropdown */}
      {search && filtered.length > 0 && (
        <div className={styles.dropdown}>
          {filtered.map((i) => (
            <div
              key={i.id}
              className={styles.dropdownItem}
              onClick={() => {
                onAdd(i.id);
                setSearch("");
              }}
            >
              {i.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
