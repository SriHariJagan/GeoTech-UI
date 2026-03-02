import { createContext, useContext, useState, useCallback } from "react";
import {
  getAllDailyReports,
  createDailyReport,
  updateDailyReport,
  deleteDailyReport,
} from "../../api/dailyExecution.api";

export const DERContext = createContext();

export const DERProvider = ({ children }) => {
  const [dailyReports, setDailyReports] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD ---------------- */
  const loadReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getAllDailyReports(filters);
      setDailyReports(res.data || []);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- CREATE ---------------- */
  const createReport = async (data) => {
    console.log("Creating report with data:", data);
    await createDailyReport(data);
    await loadReports();
  };

  /* ---------------- UPDATE ---------------- */
  const updateReportById = async (id, data) => {
    await updateDailyReport(id, data);
    await loadReports();
  };

  /* ---------------- DELETE ---------------- */
  const deleteReportById = async (id) => {
    await deleteDailyReport(id);
    await loadReports();
  };

  return (
    <DERContext.Provider
      value={{
        dailyReports,
        loading,
        loadReports,
        createReport,
        updateReport: updateReportById,
        deleteReport: deleteReportById,
      }}
    >
      {children}
    </DERContext.Provider>
  );
};

export const useDER = () => useContext(DERContext);
