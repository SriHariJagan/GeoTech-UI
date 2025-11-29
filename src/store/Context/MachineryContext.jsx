import { createContext, useState, useEffect } from "react";

export const MachineryContext = createContext();

export const MachineryProvider = ({ children }) => {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);

  // API URL
  const backendURL = "http://localhost:5000/api/machinery";

  // Dummy Fallback
  const dummyData = [
    {
      id: 1,
      name: "Excavator X200",
      type: "Excavator",
      lastMaintenance: "2025-11-01",
      status: "Working",
    },
    {
      id: 2,
      name: "Crane C350",
      type: "Crane",
      lastMaintenance: "2025-10-15",
      status: "Idle",
    },
  ];

  // FETCH MACHINES
  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const res = await fetch(backendURL);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMachinery(data.length ? data : dummyData);
    } catch {
      console.log("⚠ Backend offline — using dummy data");
      setMachinery(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, []);

  // ADD MACHINE
  const addMachine = async (machine) => {
    const tempId = Date.now();
    const newMachine = { ...machine, id: tempId };
    setMachinery((prev) => [...prev, newMachine]);

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(machine),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();

      setMachinery((prev) =>
        prev.map((m) => (m.id === tempId ? saved : m))
      );
    } catch {
      console.log("⚠ Backend offline — local only");
    }
  };

  // UPDATE MACHINE
  const updateMachine = async (id, updatedData) => {
    const updatedMachine = { ...updatedData, id };

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
      console.log("⚠ Backend offline — local update kept");
    }
  };

  // DELETE MACHINE
  const deleteMachine = async (id) => {
    const backup = machinery;
    setMachinery((prev) => prev.filter((m) => m.id !== id));

    try {
      const res = await fetch(`${backendURL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      console.log("⚠ Error — restored deleted machine");
      setMachinery(backup);
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
