import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExpendituresAdmin.module.css";
import { useExpenditures } from "../../../../store/context/ExpendituresContext";

const ExpendituresAdmin = () => {
  const { loadExpenditures } = useExpenditures(); // only loadExpenditures from context
  const [expenditures, setExpenditures] = useState([]); // local state for dummy
  const [openProjectId, setOpenProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadExpenditures();
  }, [loadExpenditures]);

  useEffect(() => {
    // Dummy data
    setExpenditures([
      {
        project_id: 1,
        project_name: "Coal Survey",
        company_name: "ABC Pvt Ltd",
        department: "Mining",
        location: "Odisha",
        start_date: "2026-01-01",
        end_date: "2026-01-10",
        duration: "10 Days",
        grand_total: 46100,
        manpower_names: "Ravi Kumar, Suresh",
        manpower_totals: {
          travel: 5000,
          accom: 3000,
          da: 2000,
          vehicle_hire: 4000,
          jcb_hydra_other: 1000,
          tractor_trolly_water: 800,
          local_vehicle_hire: 600,
          sample_transport: 1200,
          misc: 500,
          total: 18100,
        },
        vendor_names: "Sai Transport, Ganesh Rentals",
        vendor_totals: {
          vendor_total_exp: 15000,
          accom: 2000,
          vehicle_hire: 5000,
          jcb_hydra_other: 2000,
          tractor_trolly_water: 1000,
          local_vehicle_hire: 800,
          sample_transport: 1500,
          misc: 700,
          total_exp: 28000,
        },
      },
      {
        project_id: 2,
        project_name: "Iron Ore Survey",
        company_name: "XYZ Ltd",
        department: "Mining",
        location: "Jharkhand",
        start_date: "2026-02-05",
        end_date: "2026-02-15",
        duration: "11 Days",
        grand_total: 56000,
        manpower_names: "Karan, Ajay",
        manpower_totals: {
          travel: 6000,
          accom: 4000,
          da: 2500,
          vehicle_hire: 4500,
          jcb_hydra_other: 1200,
          tractor_trolly_water: 900,
          local_vehicle_hire: 700,
          sample_transport: 1500,
          misc: 600,
          total: 21900,
        },
        vendor_names: "Ramesh Logistics, Shree Rentals",
        vendor_totals: {
          vendor_total_exp: 17000,
          accom: 2500,
          vehicle_hire: 5500,
          jcb_hydra_other: 2200,
          tractor_trolly_water: 1100,
          local_vehicle_hire: 900,
          sample_transport: 1600,
          misc: 800,
          total_exp: 34100,
        },
      },
    ]);
  }, []);

  const toggleProject = (projectId) => {
    setOpenProjectId(openProjectId === projectId ? null : projectId);
  };

  const viewDetailed = (projectId) => {
    navigate(`/admin/expenditures/${projectId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Projects Expenditures</h1>

      {expenditures.map((proj) => (
        <div key={proj.project_id} className={styles.projectCard}>
          {/* Project Header */}
          <div
            className={styles.projectHeader}
            onClick={() => toggleProject(proj.project_id)}
          >
            <div>
              <strong>{proj.project_name}</strong> | {proj.company_name} | {proj.department} | {proj.location}
            </div>
            <div>
              <span>
                {proj.start_date} - {proj.end_date} ({proj.duration})
              </span>
              <span style={{ marginLeft: "1rem", fontWeight: "600" }}>
                Grand Total: {proj.grand_total.toLocaleString()}
              </span>
              <button
                className={styles.viewButton}
                onClick={(e) => {
                  e.stopPropagation(); // prevent card toggle
                  viewDetailed(proj.project_id);
                }}
              >
                View Details
              </button>
            </div>
          </div>

          {/* Collapsible Details */}
          {openProjectId === proj.project_id && (
            <div className={styles.projectDetails}>
              {/* Supervisors */}
              <div className={styles.section}>
                <h3 className={styles.supervisorHeader}>Supervisors</h3>
                <table className={styles.subTable}>
                  <thead>
                    <tr>
                      <th>Name(s)</th>
                      <th>Travel</th>
                      <th>Accom</th>
                      <th>DA</th>
                      <th>Vehicle Hire</th>
                      <th>JCB/Hydra</th>
                      <th>Tractor/Trolly/Water</th>
                      <th>Local Vehicle Hire</th>
                      <th>Sample Transport</th>
                      <th>Misc</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{proj.manpower_names}</td>
                      <td>{proj.manpower_totals.travel}</td>
                      <td>{proj.manpower_totals.accom}</td>
                      <td>{proj.manpower_totals.da}</td>
                      <td>{proj.manpower_totals.vehicle_hire}</td>
                      <td>{proj.manpower_totals.jcb_hydra_other}</td>
                      <td>{proj.manpower_totals.tractor_trolly_water}</td>
                      <td>{proj.manpower_totals.local_vehicle_hire}</td>
                      <td>{proj.manpower_totals.sample_transport}</td>
                      <td>{proj.manpower_totals.misc}</td>
                      <td>{proj.manpower_totals.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Vendors */}
              <div className={styles.section}>
                <h3 className={styles.vendorHeader}>Vendors</h3>
                <table className={styles.subTable}>
                  <thead>
                    <tr>
                      <th>Name(s)</th>
                      <th>Vendor Total</th>
                      <th>Accom</th>
                      <th>Vehicle Hire</th>
                      <th>JCB/Hydra</th>
                      <th>Tractor/Trolly/Water</th>
                      <th>Local Vehicle Hire</th>
                      <th>Sample Transport</th>
                      <th>Misc</th>
                      <th>Total Exp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{proj.vendor_names}</td>
                      <td>{proj.vendor_totals.vendor_total_exp}</td>
                      <td>{proj.vendor_totals.accom}</td>
                      <td>{proj.vendor_totals.vehicle_hire}</td>
                      <td>{proj.vendor_totals.jcb_hydra_other}</td>
                      <td>{proj.vendor_totals.tractor_trolly_water}</td>
                      <td>{proj.vendor_totals.local_vehicle_hire}</td>
                      <td>{proj.vendor_totals.sample_transport}</td>
                      <td>{proj.vendor_totals.misc}</td>
                      <td>{proj.vendor_totals.total_exp}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpendituresAdmin;