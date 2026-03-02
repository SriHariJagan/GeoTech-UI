import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProjectDetails.module.css";
import { getProjectById } from "../../api/projects.api";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await getProjectById(id);
        console.log("Project data:", res.data);
        setProject(res.data);
      } catch (err) {
        console.error("Error loading project", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!project) return <div className={styles.error}>Project not found</div>;

  const progressPercentage =
    project.total_boreholes > 0
      ? Math.round(
          (project.completed_boreholes / project.total_boreholes) * 100
        )
      : 0;

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{project.name}</h2>
          <p className={styles.location}>📍 {project.location}</p>
        </div>

        <span
          className={`${styles.statusBadge} ${
            styles[project.status?.toLowerCase()]
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* ===== PROGRESS SECTION ===== */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Total Boreholes</h4>
          <p>{project.total_boreholes}</p>
        </div>

        <div className={styles.statCard}>
          <h4>Completed Boreholes</h4>
          <p>{project.completed_boreholes}</p>
        </div>

        <div className={styles.statCard}>
          <h4>Project ID</h4>
          <p>#{project.id}</p>
        </div>
      </div>

      {/* ===== SUPERVISORS ===== */}
      <Section title="Supervisors">
        {project.supervisors.length === 0 ? (
          <p className={styles.empty}>No supervisors assigned</p>
        ) : (
          project.supervisors.map((s) => (
            <div key={s.id} className={styles.listCard}>
              {s.full_name}
            </div>
          ))
        )}
      </Section>

      {/* ===== MACHINERY ===== */}
      <Section title="Machinery">
        {project.machinery.length === 0 ? (
          <p className={styles.empty}>No machines assigned</p>
        ) : (
          project.machinery.map((m) => (
            <div key={m.id} className={styles.listCard}>
              {m.machine_name}
            </div>
          ))
        )}
      </Section>

      {/* ===== VENDORS ===== */}
      <Section title="Vendors">
        {project.vendors.length === 0 ? (
          <p className={styles.empty}>No vendors assigned</p>
        ) : (
          project.vendors.map((v) => (
            <div key={v.id} className={styles.listCard}>
              {v.vendor_name}
            </div>
          ))
        )}
      </Section>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
}