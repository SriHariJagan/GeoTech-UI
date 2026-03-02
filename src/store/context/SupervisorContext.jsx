import { createContext, useContext, useState } from "react";
import { getSupervisors } from "../../api/supervisors.api";

const dummySupervisors = [
  {
    id: 1,
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    contact: "9876543210",
    is_active: true,
    updated_today: true,
    last_updated: "2026-02-27",
    total_projects: 2,
    total_working_days: 18,
    assigned_projects: [
      {
        id: 101,
        name: "Metro Rail Survey",
        location: "Hyderabad",
        status: "ongoing",
        assigned_at: "2026-02-01",
        is_active: true,
        working_days: 12,
      },
      {
        id: 102,
        name: "Highway Soil Testing",
        location: "Vijayawada",
        status: "completed",
        assigned_at: "2026-01-10",
        is_active: false,
        working_days: 6,
      },
    ],
  },
];

const SupervisorContext = createContext();

export const SupervisorProvider = ({ children }) => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSupervisors = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getSupervisors();

      // Safe fallback logic
      if (res?.data && res.data.length > 0) {
        setSupervisors(res.data);
      } else {
        setSupervisors(dummySupervisors);
      }
    } catch (err) {
      console.error("Error loading supervisors:", err);
      setError("Failed to load supervisors");
      setSupervisors(dummySupervisors); // fallback on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupervisorContext.Provider
      value={{
        supervisors,
        loadSupervisors,
        loading,
        error,
      }}
    >
      {children}
    </SupervisorContext.Provider>
  );
};

export const useSupervisors = () => useContext(SupervisorContext);