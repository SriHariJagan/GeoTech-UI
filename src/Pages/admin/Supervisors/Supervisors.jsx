import {
  useState,
  useMemo,
  useEffect,
  useDeferredValue,
  Fragment,
} from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import styles from "./Supervisors.module.css";
import { useSupervisors } from "../../../store/context/SupervisorContext";
import { useLocation } from "react-router-dom";

export default function Supervisors() {
  const { supervisors, loadSupervisors, loading } = useSupervisors();
    const location = useLocation();


  const [expandedRow, setExpandedRow] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters((prev) => ({ ...prev, status: params.get("status") || "" }));
  }, [location.search]);

  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    loadSupervisors();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredData = useMemo(() => {
    return supervisors.filter((s) => {
      const matchesName =
        !deferredSearch ||
        s.name.toLowerCase().includes(deferredSearch.toLowerCase());

      const matchesStatus =
        filters.status === ""
          ? true
          : filters.status === "active"
          ? s.is_active
          : !s.is_active;

      return matchesName && matchesStatus;
    });
  }, [supervisors, deferredSearch, filters.status]);

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Supervisors</h2>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search supervisor..."
          value={filters.search}
          onChange={(e) =>
            setFilters((p) => ({ ...p, search: e.target.value }))
          }
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          className={styles.clearBtn}
          onClick={() => setFilters({ search: "", status: "" })}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Total Projects</th>
              <th>Total Working Days</th>
              <th>Projects</th>
              <th>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  No supervisors found
                </td>
              </tr>
            ) : (
              filteredData.map((s) => (
                <Fragment key={s.id}>
                  <tr className={styles.mainRow}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.contact || "-"}</td>

                    {/* STATUS */}
                    <td>
                      {s.is_active ? (
                        <span className={`${styles.badge} ${styles.active}`}>
                          <FaCheckCircle /> Active
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.inactive}`}>
                          <FaTimesCircle /> Inactive
                        </span>
                      )}

                      {s.updated_today && (
                        <span className={`${styles.badge} ${styles.updated}`}>
                          <FaClock /> Today
                        </span>
                      )}
                    </td>

                    <td>{s.total_projects}</td>
                    <td>{s.total_working_days}</td>

                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => toggleExpand(s.id)}
                      >
                        {expandedRow === s.id
                          ? "Hide"
                          : `View (${s.assigned_projects.length})`}
                      </button>
                    </td>

                    <td>{s.last_updated || "-"}</td>
                  </tr>

                  {/* EXPANDED PROJECTS */}
                  {expandedRow === s.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan="8">
                        <div className={styles.expandedContent}>
                          {s.assigned_projects.length === 0 ? (
                            <p className={styles.noData}>
                              No assigned projects
                            </p>
                          ) : (
                            <ul className={styles.projectList}>
                              {s.assigned_projects.map((p) => (
                                <li key={p.id} className={styles.projectItem}>
                                  {console.log(s, p)}
                                  <div className={styles.projectHeader}>
                                    <strong>{p.name}</strong>

                                    <span
                                      className={`${styles.projectStatus} ${
                                        p.is_active
                                          ? styles.activeProject
                                          : styles.inactiveProject
                                      }`}
                                    >
                                      {p.is_active
                                        ? "Active"
                                        : "Removed"}
                                    </span>
                                  </div>

                                  <div className={styles.projectMeta}>
                                    <span>📍 {p.location}</span>
                                    <span>Status: {p.status}</span>
                                    <span>
                                      Assigned: {p.assigned_at || "-"}
                                    </span>
                                    <span>
                                      Working Days: {p.working_days}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}