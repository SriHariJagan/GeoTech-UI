// src/store/Context/ProjectContext.jsx
import { createContext, useState, useEffect } from "react";

export const ProjectContext = createContext();

export default function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:5000/api/projects";

  // NOTE: supervisors & machinery stored as full objects inside each project
  const dummyProjects = [
    {
      id: 1,
      name: "Urban Infrastructure Upgrade Phase 2",
      location: "Dhaka",
      vendor: "GeoSolution Inc.",
      supervisors: [
        { id: 1, name: "Ahmed Ali", contact: "01712345678", email: "ahmed@example.com", status: "working" },
      ],
      machinery: [
        { id: 11, name: "Excavator X200", type: "Excavator", status: "Working" },
        { id: 12, name: "Crane C350", type: "Crane", status: "Idle" },
      ],
      status: "Active",
      progress: 75,
      totalBH: 120,
      completedBH: 90,
      // when a daily report was last updated (ISO date string)
      reportUpdatedAt: "2025-11-28",
    },
    {
      id: 2,
      name: "Green Energy Initiative – Wind Farm Site Selection",
      location: "Chattogram",
      vendor: "EarthMovers Ltd.",
      supervisors: [
        { id: 2, name: "Fatima Khan", contact: "01798765432", email: "fatima@example.com", status: "idle" },
      ],
      machinery: [{ id: 13, name: "Bulldozer B150", type: "Bulldozer", status: "Maintenance" }],
      status: "On Hold",
      progress: 40,
      totalBH: 80,
      completedBH: 32,
      reportUpdatedAt: null,
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  // FETCH
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(backendURL);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      // Expect backend to return projects where supervisors & machinery are objects or ids.
      // If backend returns ids, transform on backend or modify below to resolve ids.
      setProjects(data.length ? data : dummyProjects);
    } catch (err) {
      console.warn("⚠ Backend offline — using dummyProjects");
      setProjects(dummyProjects);
    } finally {
      setLoading(false);
    }
  };

  // ADD (optimistic)
  const addProject = async (project) => {
    const tempId = Date.now();
    const newProject = { ...project, id: tempId };
    setProjects((prev) => [...prev, newProject]);

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === tempId ? saved : p)));
    } catch {
      console.warn("⚠ Add project failed — kept locally");
    }
  };

  // UPDATE (optimistic)
  const updateProject = async (updated) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    try {
      const res = await fetch(`${backendURL}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
    } catch {
      console.warn("⚠ Update project failed — kept local change");
    }
  };

  // DELETE
  const deleteProject = async (id) => {
    const backup = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`${backendURL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      console.warn("⚠ Delete failed — restored locally");
      setProjects(backup);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        fetchProjects,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
