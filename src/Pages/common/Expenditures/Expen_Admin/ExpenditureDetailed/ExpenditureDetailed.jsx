import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ExpenditureDetailed.module.css";
import { useExpenditures } from "../../../../../store/context/ExpendituresContext";

const ExpenditureDetailed = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { loadProjectDetailed, projectDetailed } = useExpenditures();
  const [dummyData, setDummyData] = useState(null);

  useEffect(() => {
    // loadProjectDetailed(projectId); // Uncomment for real API

    // Dummy data with misc remarks
    setDummyData({
      project_id: projectId,
      project_name: "Coal Survey",
      company_name: "ABC Pvt Ltd",
      department: "Mining",
      location: "Odisha",
      start_date: "2026-01-01",
      end_date: "2026-01-10",
      duration: "10 Days",
      grand_total: 46100,
      manpower: [
        { name: "Ravi Kumar", travel: 2500, accom: 1500, da: 1000, vehicle_hire: 2000, jcb_hydra: 500, tractor_trolly_water: 400, local_vehicle_hire: 300, sample_transport: 600, misc: 250, total: 9150, remarks: "Extra travel due to site change" },
        { name: "Suresh", travel: 2500, accom: 1500, da: 1000, vehicle_hire: 2000, jcb_hydra: 500, tractor_trolly_water: 400, local_vehicle_hire: 300, sample_transport: 600, misc: 250, total: 8950, remarks: "DA adjusted for holiday" },
      ],
      vendors: [
        { name: "Sai Transport", vendor_total: 15000, accom: 2000, vehicle_hire: 5000, jcb_hydra: 2000, tractor_trolly_water: 1000, local_vehicle_hire: 800, sample_transport: 1500, misc: 700, total_exp: 28000, remarks: "Late delivery penalty included" },
        { name: "Ganesh Rentals", vendor_total: 12000, accom: 1000, vehicle_hire: 3000, jcb_hydra: 1000, tractor_trolly_water: 500, local_vehicle_hire: 400, sample_transport: 800, misc: 500, total_exp: 19000, remarks: "Discount applied" },
      ],
    });
  }, [projectId, loadProjectDetailed]);

  const data = projectDetailed || dummyData;

  if (!data) return <div>Loading...</div>;

  const sumRow = (arr, key) =>
    arr.reduce((acc, item) => acc + (item[key] || 0), 0);

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
      <h1 className={styles.heading}>Project Expenditure: {data.project_name}</h1>

      <div className={styles.projectInfo}>
        <div><strong>Company:</strong> {data.company_name}</div>
        <div><strong>Department:</strong> {data.department}</div>
        <div><strong>Location:</strong> {data.location}</div>
        <div><strong>Duration:</strong> {data.start_date} - {data.end_date} ({data.duration})</div>
        <div><strong>Grand Total:</strong> ₹ {data.grand_total.toLocaleString()}</div>
      </div>

      {/* Supervisors */}
      <div className={styles.section}>
        <h2>Supervisors / Manpower</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th><th>Travel</th><th>Accom</th><th>DA</th><th>Vehicle Hire</th><th>JCB/Hydra</th>
                <th>Tractor/Trolly/Water</th><th>Local Vehicle Hire</th><th>Sample Transport</th><th>Misc</th><th>Total</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.manpower.map((m, idx) => (
                <tr key={idx}>
                  <td>{m.name}</td>
                  <td>{m.travel}</td><td>{m.accom}</td><td>{m.da}</td><td>{m.vehicle_hire}</td><td>{m.jcb_hydra}</td>
                  <td>{m.tractor_trolly_water}</td><td>{m.local_vehicle_hire}</td><td>{m.sample_transport}</td><td>{m.misc}</td>
                  <td>{m.total}</td>
                  <td>{m.remarks}</td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td><strong>Total</strong></td>
                <td>{sumRow(data.manpower, "travel")}</td>
                <td>{sumRow(data.manpower, "accom")}</td>
                <td>{sumRow(data.manpower, "da")}</td>
                <td>{sumRow(data.manpower, "vehicle_hire")}</td>
                <td>{sumRow(data.manpower, "jcb_hydra")}</td>
                <td>{sumRow(data.manpower, "tractor_trolly_water")}</td>
                <td>{sumRow(data.manpower, "local_vehicle_hire")}</td>
                <td>{sumRow(data.manpower, "sample_transport")}</td>
                <td>{sumRow(data.manpower, "misc")}</td>
                <td>{sumRow(data.manpower, "total")}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendors */}
      <div className={styles.section}>
        <h2>Vendors</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th><th>Vendor Total</th><th>Accom</th><th>Vehicle Hire</th><th>JCB/Hydra</th>
                <th>Tractor/Trolly/Water</th><th>Local Vehicle Hire</th><th>Sample Transport</th><th>Misc</th><th>Total Exp</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.vendors.map((v, idx) => (
                <tr key={idx}>
                  <td>{v.name}</td>
                  <td>{v.vendor_total}</td><td>{v.accom}</td><td>{v.vehicle_hire}</td><td>{v.jcb_hydra}</td>
                  <td>{v.tractor_trolly_water}</td><td>{v.local_vehicle_hire}</td><td>{v.sample_transport}</td><td>{v.misc}</td><td>{v.total_exp}</td>
                  <td>{v.remarks}{console.log(v)}</td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td><strong>Total</strong></td>
                <td>{sumRow(data.vendors, "vendor_total")}</td>
                <td>{sumRow(data.vendors, "accom")}</td>
                <td>{sumRow(data.vendors, "vehicle_hire")}</td>
                <td>{sumRow(data.vendors, "jcb_hydra")}</td>
                <td>{sumRow(data.vendors, "tractor_trolly_water")}</td>
                <td>{sumRow(data.vendors, "local_vehicle_hire")}</td>
                <td>{sumRow(data.vendors, "sample_transport")}</td>
                <td>{sumRow(data.vendors, "misc")}</td>
                <td>{sumRow(data.vendors, "total_exp")}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenditureDetailed;