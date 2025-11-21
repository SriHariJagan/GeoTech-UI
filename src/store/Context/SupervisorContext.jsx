import { createContext, useState, useEffect } from "react";

export const SupervisorContext = createContext();

export default function SupervisorProvider({ children }) {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  // API URL (change later)
  const backendURL = "http://localhost:5000/api/supervisors";

  // Dummy fallback data
  const dummySupervisors = [
    {
      id: 1,
      name: "Ahmed Ali",
      project: "Urban Infrastructure Upgrade Phase 2",
      contact: "01712345678",
      email: "ahmed@example.com",
    },
    {
      id: 2,
      name: "Fatima Khan",
      project: "Wind Farm Site Selection",
      contact: "01798765432",
      email: "fatima@example.com",
    },
  ];

  useEffect(() => {
    fetchSupervisors();
  }, []);

  // ---------------------------------
  // FETCH + FALLBACK
  // ---------------------------------
  const fetchSupervisors = async () => {
    try {
      setLoading(true);

      const res = await fetch(backendURL);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setSupervisors(data.length > 0 ? data : dummySupervisors);
    } catch (err) {
      console.log("⚠ Backend unreachable → using dummy data");
      setSupervisors(dummySupervisors);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------
  // ADD SUPERVISOR (API → fallback)
  // ---------------------------------
  const addSupervisor = async (sup) => {
    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sup),
      });

      if (!res.ok) throw new Error("Add failed");

      await fetchSupervisors(); // reload from API
    } catch (err) {
      console.log("⚠ API offline → adding locally");
      setSupervisors((prev) => [...prev, { ...sup, id: Date.now() }]);
    }
  };

  // ---------------------------------
  // UPDATE SUPERVISOR (API → fallback)
  // ---------------------------------
  const updateSupervisor = async (id, updatedData) => {
    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

      await fetchSupervisors();
    } catch (err) {
      console.log("⚠ API offline → updating locally");
      setSupervisors((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
      );
    }
  };

  // ---------------------------------
  // DELETE SUPERVISOR (API → fallback)
  // ---------------------------------
  const deleteSupervisor = async (id) => {
    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchSupervisors();
    } catch (err) {
      console.log("⚠ API offline → deleting locally");
      setSupervisors((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <SupervisorContext.Provider
      value={{
        supervisors,
        loading,
        addSupervisor,
        updateSupervisor,
        deleteSupervisor,
      }}
    >
      {children}
    </SupervisorContext.Provider>
  );
}
