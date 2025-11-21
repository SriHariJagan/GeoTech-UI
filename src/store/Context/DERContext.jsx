import { createContext, useState, useEffect } from "react";

export const DERContext = createContext();

export const DERProvider = ({ children }) => {
  const [dailyReports, setDailyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // API URL
  const API_URL = "http://localhost:5000/api/daily-reports";

  // Dummy fallback data
  const dummyData = [
    {
      id: 1,
      project: "Project Alpha",
      siteLocation: "Site A",
      vendor: "ABC Supplies",
      bhoreholesNo: 3,
      rigNo: "Rig-12",
      chainage: "C-001",
      depthStarted: 0,
      depthCompleted: 30,
      depthInSoil: 10,
      depthInSoftRock: 10,
      depthInHardRock: 10,
      totalDepthDrilled: 30,
      engineer: "John Smith",
      client: "XYZ Corp",
      clientPersonName: "Alice Johnson",
      clientPersonDesignation: "Site Manager",
      remarks: "Smooth drilling",
      date: "2025-11-20",
    },
    {
      id: 2,
      project: "Project Beta",
      siteLocation: "Site B",
      vendor: "DEF Contractors",
      bhoreholesNo: 2,
      rigNo: "Rig-03",
      chainage: "C-002",
      depthStarted: 0,
      depthCompleted: 25,
      depthInSoil: 5,
      depthInSoftRock: 10,
      depthInHardRock: 10,
      totalDepthDrilled: 25,
      engineer: "Sarah Lee",
      client: "LMN Corp",
      clientPersonName: "Bob Martin",
      clientPersonDesignation: "Project Lead",
      remarks: "Soft rock slower than expected",
      date: "2025-11-20",
    },
  ];

  // ------------------------------
  // FETCH WITH FALLBACK
  // ------------------------------
  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setDailyReports(data.length > 0 ? data : dummyData);
    } catch (err) {
      console.log("⚠ API Offline — Using Dummy Data");
      setDailyReports(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ------------------------------------
  // UPDATE REPORT (API + FALLBACK)
  // ------------------------------------
  const updateReport = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

      await fetchReports(); // Refresh from server
    } catch (err) {
      console.log("⚠ API Offline — Updating locally");

      // Local fallback update
      setDailyReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
      );
    }
  };

  // ------------------------------------
  // DELETE REPORT (API + FALLBACK)
  // ------------------------------------
  const deleteReport = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchReports(); // Refresh server data
    } catch (err) {
      console.log("⚠ API Offline — Deleting locally");

      // Local fallback delete
      setDailyReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <DERContext.Provider
      value={{
        dailyReports,
        loading,
        updateReport,
        deleteReport,
      }}
    >
      {children}
    </DERContext.Provider>
  );
};
