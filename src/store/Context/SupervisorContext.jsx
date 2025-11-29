import { createContext, useState, useEffect } from "react";

export const SupervisorContext = createContext();

export default function SupervisorProvider({ children }) {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:5000/api/supervisors";

  const dummySupervisors = [
    {
      id: 1,
      name: "Ahmed Ali",
      contact: "01712345678",
      email: "ahmed@example.com",
      status: "working",
      reportUpdatedToday: true,
      lastReportUpdated: "2025-01-18",
    },
    {
      id: 2,
      name: "Fatima Khan",
      contact: "01798765432",
      email: "fatima@example.com",
      status: "idle",
      reportUpdatedToday: false,
      lastReportUpdated: "2025-01-16",
    },
  ];

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const res = await fetch(backendURL);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setSupervisors(data.length > 0 ? data : dummySupervisors);
    } catch {
      console.log("⚠ Using dummy supervisors (backend offline)");
      setSupervisors(dummySupervisors);
    } finally {
      setLoading(false);
    }
  };

  const addSupervisor = async (sup) => {
    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sup),
      });

      if (!res.ok) throw new Error("Add failed");
      await fetchSupervisors();
    } catch {
      console.log("⚠ Local Add");
      setSupervisors((prev) => [...prev, { ...sup, id: supervisors.length + 1 }]);
    }
  };

  const updateSupervisor = async (id, updatedData) => {
    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");
      await fetchSupervisors();
    } catch {
      console.log("⚠ Local Update");
      setSupervisors((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
      );
    }
  };

  const deleteSupervisor = async (id) => {
    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchSupervisors();
    } catch {
      console.log("⚠ Local Delete");
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
