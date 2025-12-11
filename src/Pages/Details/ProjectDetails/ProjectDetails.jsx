import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import styles from "./projectDetails.module.css";
import { ProjectContext } from "../../../store/Context/ProjectContext";

export default function ProjectDetails() {
  const { id } = useParams();
  const { projects } = useContext(ProjectContext);

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Simulate loading (replace with real API call)
    setLoading(true);

    const timer = setTimeout(() => {
      const matched = projects?.find(
        (p) => String(p.id) === String(id)
      );
      setProject(matched || null);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [id, projects]);

  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.skeletonHeader}></div>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}></div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // NOT FOUND STATE
  // ----------------------------------------------------------
  if (!project) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚠️</div>
        <h2>Project Not Found</h2>
        <p>
          The project you’re trying to view does not exist or may have been removed.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------
  // MAIN CONTENT
  // ----------------------------------------------------------
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>{project.name}</h1>
        <p className={styles.subHeading}>
          A complete overview of project information, progress and team.
        </p>
      </div>

      <div className={styles.cardGrid}>
        {/* PROJECT INFO */}
        <div className={styles.card}>
          <h3>Project Information</h3>
          <div className={styles.infoGrid}>
            <p><strong>Location:</strong> <span>{project.location || "—"}</span></p>
            <p><strong>Vendor:</strong> <span>{project.vendor || "—"}</span></p>
            <p><strong>Status:</strong> <span>{project.status || "—"}</span></p>
            <p><strong>Progress:</strong> <span>{project.progress || 0}%</span></p>
          </div>
        </div>

        {/* BH INFO */}
        <div className={styles.card}>
          <h3>BH Progress</h3>
          <div className={styles.infoGrid}>
            <p><strong>Total BH:</strong> <span>{project.totalBH || 0}</span></p>
            <p><strong>Completed BH:</strong> <span>{project.completedBH || 0}</span></p>
          </div>
        </div>

        {/* SUPERVISORS */}
        <div className={styles.card}>
          <h3>Supervisors</h3>
          <div className={styles.tagList}>
            {project.supervisors?.length ? (
              project.supervisors.map((s) => (
                <span key={s.id} className={styles.tag}>{s.name}</span>
              ))
            ) : (
              <p className={styles.emptyText}>No supervisors assigned</p>
            )}
          </div>
        </div>

        {/* MACHINERY */}
        <div className={styles.card}>
          <h3>Machinery</h3>
          <div className={styles.tagList}>
            {project.machinery?.length ? (
              project.machinery.map((m) => (
                <span key={m.id} className={styles.tag}>{m.name}</span>
              ))
            ) : (
              <p className={styles.emptyText}>No machinery added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
