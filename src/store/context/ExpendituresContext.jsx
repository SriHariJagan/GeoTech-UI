// src/context/ExpendituresContext.jsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import * as expenditureAPI from "../../api/expenditures.api";

const ExpendituresContext = createContext();

export const ExpendituresProvider = ({ children }) => {
  const [expenditures, setExpenditures] = useState([]);
  const [projectExpenditures, setProjectExpenditures] = useState([]);
  const [projectDetailed, setProjectDetailed] = useState(null);

  const [loadingExpenditures, setLoadingExpenditures] = useState(false);
  const [errorExpenditures, setErrorExpenditures] = useState(null);

  /* ================= ADMIN: ALL AGGREGATED ================= */
  const loadExpenditures = useCallback(async () => {
    try {
      setLoadingExpenditures(true);
      setErrorExpenditures(null);

      const data =
        await expenditureAPI.getAllProjectsExpendituresAggregated();

      setExpenditures(data || []);
    } catch (err) {
      console.error(err);
      setErrorExpenditures(err);
    } finally {
      setLoadingExpenditures(false);
    }
  }, []);

  /* ================= SUPERVISOR: PROJECT ================= */
  const loadProjectExpenditures = useCallback(async (projectId) => {
    try {
      setLoadingExpenditures(true);
      setErrorExpenditures(null);

      const data =
        await expenditureAPI.getProjectExpenditures(projectId);

      setProjectExpenditures(data || []);
    } catch (err) {
      console.error(err);
      setErrorExpenditures(err);
    } finally {
      setLoadingExpenditures(false);
    }
  }, []);

  /* ================= ADMIN: DETAILED ================= */
  const loadProjectDetailed = useCallback(async (projectId) => {
    try {
      setLoadingExpenditures(true);
      setErrorExpenditures(null);

      const data =
        await expenditureAPI.getProjectDetailed(projectId);

      setProjectDetailed(data || null);
    } catch (err) {
      console.error(err);
      setErrorExpenditures(err);
    } finally {
      setLoadingExpenditures(false);
    }
  }, []);

  /* ================= CRUD ================= */

  const addExpenditure = useCallback(
    async (payload) => {
      await expenditureAPI.createExpenditure(payload);
      await loadExpenditures();
    },
    [loadExpenditures]
  );

  const editExpenditure = useCallback(
    async (id, payload) => {
      await expenditureAPI.updateExpenditure(id, payload);
      await loadExpenditures();
    },
    [loadExpenditures]
  );

  const removeExpenditure = useCallback(
    async (id) => {
      await expenditureAPI.deleteExpenditure(id);
      await loadExpenditures();
    },
    [loadExpenditures]
  );

  return (
    <ExpendituresContext.Provider
      value={{
        expenditures,
        projectExpenditures,
        projectDetailed,
        loadingExpenditures,
        errorExpenditures,
        loadExpenditures,
        loadProjectExpenditures,
        loadProjectDetailed,
        addExpenditure,
        editExpenditure,
        removeExpenditure,
      }}
    >
      {children}
    </ExpendituresContext.Provider>
  );
};

export const useExpenditures = () =>
  useContext(ExpendituresContext);