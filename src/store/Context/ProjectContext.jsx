import { createContext, useState, useEffect } from "react";

export const ProjectContext = createContext();

export default function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:5000/api/projects";

  const dummyProjects = [
    {
      id: 1,
      name: "Urban Infrastructure Upgrade Phase 2",
      location: "Dhaka",
      vendor: "GeoSolution Inc.",
      supervisor: "Ahmed Ali",
      status: "Active",
      progress: 75,
      totalBH: 120,
      completedBH: 90,
    },
    {
      id: 2,
      name: "Green Energy Initiative – Wind Farm Site Selection",
      location: "Chattogram",
      vendor: "EarthMovers Ltd.",
      supervisor: "Fatima Khan",
      status: "On Hold",
      progress: 40,
      totalBH: 80,
      completedBH: 32,
    },
    {
      id: 3,
      name: "Coastal Erosion Study – Southern Coastline",
      location: "Khulna",
      vendor: "HydroTech Corp.",
      supervisor: "Rajesh Kumar",
      status: "Completed",
      progress: 100,
      totalBH: 50,
      completedBH: 50,
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  // ===========================================================
  // FETCH PROJECTS
  // ===========================================================
  const fetchProjects = async () => {
    setLoading(true);

    try {
      const res = await fetch(backendURL);

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setProjects(data.length ? data : dummyProjects);

    } catch (err) {
      console.log("⚠ Backend offline — using dummy data");
      setProjects(dummyProjects);

    } finally {
      setLoading(false);
    }
  };

  // ===========================================================
  // ADD PROJECT (Optimistic)
  // ===========================================================
  const addProject = async (project) => {
    const tempId = Date.now(); // temporary ID
    const newProject = { ...project, id: tempId };

    // ⭐ Instant UI update
    setProjects((prev) => [...prev, newProject]);

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();

      // Replace temp project with actual API project
      setProjects((prev) =>
        prev.map((p) => (p.id === tempId ? saved : p))
      );
    } catch {
      console.log("⚠ Backend offline — stored locally");
      // Keep the local one, no rollback needed
    }
  };

  // ===========================================================
  // UPDATE PROJECT (Optimistic)
  // ===========================================================
  const updateProject = async (updated) => {
    // ⭐ Instant UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );

    console.log(updated);

    try {
      const res = await fetch(`${backendURL}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error();

    } catch {
      console.log("⚠ Backend offline — keeping local updated version");
    }
  };

  // ===========================================================
  // DELETE PROJECT (Optimistic)
  // ===========================================================
  const deleteProject = async (id) => {
    // ⭐ Instant UI removal
    const backup = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

    } catch {
      console.log("⚠ Backend offline — restoring");
      // Rollback only if backend fails
      setProjects(backup);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        loading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
