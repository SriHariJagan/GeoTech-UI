import { createContext, useState, useEffect } from "react";

export const MachineryContext = createContext();

export const MachineryProvider = ({ children }) => {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);

  // API URL (change only this)
  const backendURL = "http://localhost:5000/api/machinery";

  // Dummy Fallback Data
  const dummyData = [
    {
      id: 1,
      name: "Excavator X200",
      project: "Project Alpha",
      location: "Site A",
      lastMaintenance: "2025-11-01",
      supervisor: "John Doe",
    },
    {
      id: 2,
      name: "Crane C350",
      project: "Project Beta",
      location: "Site B",
      lastMaintenance: "2025-10-20",
      supervisor: "Jane Smith",
    },
    {
      id: 3,
      name: "Bulldozer B150",
      project: "Project Gamma",
      location: "Site C",
      lastMaintenance: "2025-10-15",
      supervisor: "Mike Johnson",
    },
  ];

  // ===========================================================
  // FETCH MACHINERY
  // ===========================================================
  const fetchMachinery = async () => {
    setLoading(true);

    try {
      const res = await fetch(backendURL);

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      setMachinery(data.length ? data : dummyData);
    } catch {
      console.log("⚠ Backend offline — using dummy machinery!");
      setMachinery(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, []);

  // ===========================================================
  // ADD MACHINE (Optimistic Update)
  // ===========================================================
  const addMachine = async (machine) => {
    const tempId = Date.now();
    const newMachine = { ...machine, id: tempId };

    // ⭐ Instant UI update
    setMachinery((prev) => [...prev, newMachine]);

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machine),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();

      // Replace temp machine with API one
      setMachinery((prev) =>
        prev.map((m) => (m.id === tempId ? saved : m))
      );
    } catch {
      console.log("⚠ Backend offline — keeping local machine");
    }
  };

  // ===========================================================
  // UPDATE MACHINE (Optimistic Update)
  // ===========================================================
  const updateMachine = async (id, updatedData) => {
    const updatedMachine = { ...updatedData, id };

    // ⭐ Instant UI update
    setMachinery((prev) =>
      prev.map((m) => (m.id === id ? updatedMachine : m))
    );

    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMachine),
      });

      if (!res.ok) throw new Error();
    } catch {
      console.log("⚠ Backend offline — keeping local update");
    }
  };

  // ===========================================================
  // DELETE MACHINE (Optimistic Update + Rollback)
  // ===========================================================
  const deleteMachine = async (id) => {
    const backup = machinery;

    // ⭐ Instant UI removal
    setMachinery((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch(`${backendURL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
    } catch {
      console.log("⚠ Backend offline — restoring deleted machine");
      setMachinery(backup); // rollback
    }
  };

  return (
    <MachineryContext.Provider
      value={{
        machinery,
        loading,
        addMachine,
        updateMachine,
        deleteMachine,
      }}
    >
      {children}
    </MachineryContext.Provider>
  );
};
