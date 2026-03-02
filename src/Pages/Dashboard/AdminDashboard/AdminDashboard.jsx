import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFolder,
  FiUsers,
  FiTruck,
  FiUserCheck,
  FiUserX,
  FiTool,
  FiClock,
  FiPackage
} from "react-icons/fi";
import styles from "./AdminDashboard.module.css";
import { getAdminDashboard } from "../../../api/dashboard.api";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getAdminDashboard();
        setData(res.data);
      } catch (error) {
        console.error("Dashboard API error:", error);

        // Fallback dummy data
        setData({
          projects: {
            total: 32,
            ongoing: 14,
            hold: 5,
            completed: 13,
            not_started: 0
          },
          supervisors: {
            total: 20,
            assigned: 12,
            idle: 8
          },
          vendors: {
            total: 18,
            active: 14,
            inactive: 4
          },
          machinery: {
            total: 40,
            working: 22,
            maintenance: 6,
            active: 5,
            idle: 7
          },
          reports: {
            total: 120,
            today: 8
          }
        });
      }
    }

    fetchStats();
  }, []);

  if (!data) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.dashboardWrapper}>
      <h2 className={styles.title}>Admin Overview Dashboard</h2>

      {/* PROJECTS */}
      <Section title="Projects">
        <Card
          title="Total Projects"
          count={data.projects.total}
          icon={<FiFolder />}
          onClick={() => navigate("projects")}
        />
        <Card
          title="Ongoing"
          count={data.projects.ongoing}
          icon={<FiClock />}
          onClick={() => navigate("projects?status=ongoing")}
        />
        <Card
          title="On Hold"
          count={data.projects.hold}
          icon={<FiPackage />}
          onClick={() => navigate("projects?status=onhold")}
        />
        <Card
          title="Completed"
          count={data.projects.completed}
          icon={<FiFolder />}
          onClick={() => navigate("projects?status=completed")}
        />
      </Section>

      {/* SUPERVISORS */}
      <Section title="Supervisors">
        <Card
          title="Total"
          count={data.supervisors.total}
          icon={<FiUsers />}
          onClick={() => navigate("supervisors")}
        />
        <Card
          title="Assigned"
          count={data.supervisors.assigned}
          icon={<FiUserCheck />}
          onClick={() => navigate("supervisors?status=active")}
        />
        <Card
          title="Idle"
          count={data.supervisors.idle}
          icon={<FiUserX />}
          onClick={() => navigate("supervisors?status=inactive")}
        />
      </Section>

      {/* VENDORS */}
      <Section title="Vendors">
        <Card
          title="Total"
          count={data.vendors.total}
          icon={<FiPackage />}
          onClick={() => navigate("vendors")}
        />
        <Card
          title="Active"
          count={data.vendors.active}
          icon={<FiTool />}
          onClick={() => navigate("vendors?status=active")}
        />
        <Card
          title="Inactive"
          count={data.vendors.inactive}
          icon={<FiClock />}
          onClick={() => navigate("vendors?status=inactive")}
        />
      </Section>

      {/* MACHINERY */}
      <Section title="Machinery">
        <Card
          title="Total"
          count={data.machinery.total}
          icon={<FiTruck />}
          onClick={() => navigate("machines")}
        />
        <Card
          title="Working"
          count={data.machinery.working}
          icon={<FiTool />}
          onClick={() => navigate("machines?status=working")}
        />
        <Card
          title="Maintenance"
          count={data.machinery.maintenance}
          icon={<FiTruck />}
          onClick={() => navigate("machines?status=maintenance")}
        />
        <Card
          title="Idle"
          count={data.machinery.idle}
          icon={<FiClock />}
          onClick={() => navigate("machines?status=idle")}
        />
      </Section>

      {/* REPORTS */}
      <Section title="Daily Reports">
        <Card
          title="Total Reports"
          count={data.reports?.total || 0}
          icon={<FiFolder />}
          onClick={() => navigate("daily-execution-report")}
        />
        <Card
          title="Today's Reports"
          count={data.reports?.today || 0}
          icon={<FiClock />}
          onClick={() => navigate("daily-execution-report")}
        />
      </Section>
    </div>
  );
}

/* ================= Reusable Components ================= */

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.grid}>{children}</div>
    </div>
  );
}

function Card({ title, count, icon, onClick }) {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className={styles.cardIcon}>{icon}</div>
      <p className={styles.cardTitle}>{title}</p>
      <h3 className={styles.cardCount}>{count}</h3>
    </div>
  );
}