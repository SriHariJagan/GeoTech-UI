import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./derDetails.module.css";
import { DERContext } from "../../../store/Context/DERContext";

export default function DerDetails() {
  const { id } = useParams();
  const { dailyReports } = useContext(DERContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const report = dailyReports.find((r) => String(r.id) === String(id));

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.skeletonHeader}></div>
        <div className={styles.skeletonCard}></div>
        <div className={styles.skeletonCard}></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📄</div>
        <h2>No Report Found</h2>
        <p>The selected report doesn’t exist or was removed.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>{report.project}</h1>
        <p className={styles.subHeading}>
          Detailed view of daily execution activity
        </p>
      </div>

      <div className={styles.card}>
        <h3>General Information</h3>
        <div className={styles.infoGrid}>
          <p><strong>Project:</strong> {report.project}</p>
          <p><strong>Site Location:</strong> {report.siteLocation}</p>
          <p><strong>Vendor:</strong> {report.vendor}</p>
          <p><strong>Date:</strong> {report.date}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Drilling Details</h3>
        <div className={styles.infoGrid}>
          <p><strong>BH No:</strong> {report.bhoreholesNo}</p>
          <p><strong>Rig No:</strong> {report.rigNo}</p>
          <p><strong>Chainage:</strong> {report.chainage}</p>
          <p><strong>Depth Started:</strong> {report.depthStarted}m</p>
          <p><strong>Depth Completed:</strong> {report.depthCompleted}m</p>
          <p><strong>Total Drilled:</strong> {report.totalDepthDrilled}m</p>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Personnel</h3>
        <div className={styles.infoGrid}>
          <p><strong>Engineer:</strong> {report.engineer}</p>
          <p><strong>Client:</strong> {report.client}</p>
          <p><strong>Client Person:</strong> {report.clientPersonName}</p>
          <p><strong>Designation:</strong> {report.clientPersonDesignation}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Remarks</h3>
        <p className={styles.remarks}>{report.remarks || "No remarks added."}</p>
      </div>
    </div>
  );
}
