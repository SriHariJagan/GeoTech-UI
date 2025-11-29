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
import styles from "./HomeDashboard.module.css";

export default function HomeDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        setData(result);
      } catch {
        // Dummy fallback
        setData({
          projects: {
            total: 32,
            ongoing: 14,
            hold: 5,
            completed: 13
          },
          supervisors: {
            total: 20,
            assigned: 12,
            idle: 8
          },
          vendors: {
            total: 18,
            active: 14,
            pending: 4
          },
          machinery: {
            total: 40,
            working: 22,
            maintenance: 6,
            idle: 12
          }
        });
      }
    }
    fetchStats();
  }, []);

  if (!data) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.dashboardWrapper}>
      
      <h2 className={styles.title}>Overview Dashboard</h2>

      {/* PROJECTS */}
      <Section title="Projects">
        <Card
          title="Total Projects"
          count={data.projects.total}
          icon={<FiFolder />}
          onClick={() => navigate("/projects")}
        />
        <Card
          title="Ongoing Projects"
          count={data.projects.ongoing}
          icon={<FiClock />}
          onClick={() => navigate("/projects?status=ongoing")}
        />
        <Card
          title="Hold Projects"
          count={data.projects.hold}
          icon={<FiPackage />}
          onClick={() => navigate("/projects?status=hold")}
        />
        <Card
          title="Completed Projects"
          count={data.projects.completed}
          icon={<FiFolder />}
          onClick={() => navigate("/projects?status=completed")}
        />
      </Section>

      {/* SUPERVISORS */}
      <Section title="Supervisors">
        <Card
          title="Total Supervisors"
          count={data.supervisors.total}
          icon={<FiUsers />}
          onClick={() => navigate("/supervisors")}
        />
        <Card
          title="Assigned Supervisors"
          count={data.supervisors.assigned}
          icon={<FiUserCheck />}
          onClick={() => navigate("/supervisors?status=working")}
        />
        <Card
          title="Idle Supervisors"
          count={data.supervisors.idle}
          icon={<FiUserX />}
          onClick={() => navigate("/supervisors?status=idle")}
        />
      </Section>

      {/* VENDORS */}
      <Section title="Vendors">
        <Card
          title="Total Vendors"
          count={data.vendors.total}
          icon={<FiPackage />}
          // onClick={() => navigate("/vendors")}
        />
        <Card
          title="Active Vendors"
          count={data.vendors.active}
          icon={<FiTool />}
          // onClick={() => navigate("/vendors?status=active")}
        />
        <Card
          title="Pending Vendors"
          count={data.vendors.pending}
          icon={<FiClock />}
          // onClick={() => navigate("/vendors?status=pending")}
        />
      </Section>

      {/* MACHINERY */}
      <Section title="Machinery">
        <Card
          title="Total Machinery"
          count={data.machinery.total}
          icon={<FiTruck />}
          onClick={() => navigate("/machinery")}
        />
        <Card
          title="Working"
          count={data.machinery.working}
          icon={<FiTool />}
          onClick={() => navigate("/machinery?status=working")}
        />
        <Card
          title="Under Maintenance"
          count={data.machinery.maintenance}
          icon={<FiTruck />}
          onClick={() => navigate("/machinery?status=maintenance")}
        />
        <Card
          title="Idle Machinery"
          count={data.machinery.idle}
          icon={<FiClock />}
          onClick={() => navigate("/machinery?status=idle")}
        />
      </Section>

    </div>
  );
}

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
    <div className={styles.card} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className={styles.cardIcon}>{icon}</div>
      <p className={styles.cardTitle}>{title}</p>
      <h3 className={styles.cardCount}>{count}</h3>
    </div>
  );
}
