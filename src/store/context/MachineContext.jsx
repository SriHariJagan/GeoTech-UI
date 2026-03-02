import { createContext, useContext, useState, useCallback } from "react";
import {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
} from "../../api/machines.api";

const MachineContext = createContext(null);

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD MACHINES ---------------- */
  const loadMachines = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMachines();
      setMachines(res.data || []);
      console.log("Machines loaded:", res.data);
    } catch (err) {
      console.error("Failed to load machines", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- CRUD ---------------- */
  const addMachine = useCallback(async (data) => {
    await createMachine(data);
    loadMachines();
  }, [loadMachines]);

  const editMachine = useCallback(async (id, data) => {
    await updateMachine(id, data);
    loadMachines();
  }, [loadMachines]);

  const removeMachine = useCallback(async (id) => {
    await deleteMachine(id);
    loadMachines();
  }, [loadMachines]);

  return (
    <MachineContext.Provider
      value={{
        machines,
        loading,
        loadMachines,
        addMachine,
        editMachine,
        removeMachine,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => useContext(MachineContext);
