import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DailyReportDetails.module.css";
import { getDailyReportById } from "../../api/dailyExecution.api";

export default function DailyReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await getDailyReportById(id);
        setReport(res.data);
      } catch (err) {
        console.error("Error loading report", err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!report) return <div className={styles.error}>Report not found</div>;

  const depthPercentage =
    report.total_depth > 0
      ? Math.round((report.depth_completed / report.total_depth) * 100)
      : 0;

  return (
    <div className={styles.container}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Borehole #{report.borehole_no}</h2>
          <p className={styles.sub}>
            📅 {report.report_date} | 📍 {report.site_location}
          </p>
        </div>
      </div>

      {/* ================= DEPTH PROGRESS ================= */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Depth Progress</span>
          <span>{depthPercentage}%</span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${depthPercentage}%` }}
          />
        </div>
      </div>

      {/* ================= GRID DETAILS ================= */}
      <div className={styles.grid}>
        <Card label="Project ID" value={`#${report.project_id}`} />
        <Card label="Vendor ID" value={`#${report.vendor_id}`} />
        <Card label="Rig No" value={report.rig_no} />
        <Card label="Type of Rig" value={report.type_of_rig} />
        <Card label="Chainage" value={report.chainage} />
        <Card label="Client" value={report.client} />
        <Card
          label="Client Contact"
          value={`${report.client_person_name} (${report.client_person_designation})`}
        />
      </div>

      {/* ================= DEPTH BREAKDOWN ================= */}
      <Section title="Depth Breakdown">
        <div className={styles.depthGrid}>
          <DepthCard label="Started Depth" value={report.depth_started} />
          <DepthCard label="Completed Depth" value={report.depth_completed} />
          <DepthCard label="Soil Depth" value={report.soil_depth} />
          <DepthCard label="Soft Rock Depth" value={report.soft_rock_depth} />
          <DepthCard label="Hard Rock Depth" value={report.hard_rock_depth} />
          <DepthCard label="Total Depth" value={report.total_depth} />
        </div>
      </Section>

      {/* ================= CREATOR INFO ================= */}
      <Section title="Created By">
        <div className={styles.creatorCard}>
          <p>
            <strong>{report.creator?.full_name}</strong>
          </p>
          <span className={styles.role}>{report.creator?.role}</span>
        </div>
      </Section>

      {/* ================= REMARKS ================= */}
      <Section title="Remarks">
        <div className={styles.remarksBox}>
          {report.remarks || "No remarks provided"}
        </div>
      </Section>
    </div>
  );
}

/* Reusable Components */

function Card({ label, value }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <p>{value || "-"}</p>
    </div>
  );
}

function DepthCard({ label, value }) {
  return (
    <div className={styles.depthCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}
