import { useEffect, useMemo, useState } from "react";
import { useUsers } from "../../store/context/UserContext";
import Modal from "../../Components/Modal/Modal";
import UserForm from "../../components/Forms/UserForm";
import styles from "./Users.module.css";
import { ROLES } from "../../constants/roles";

/* ---------------- STATUS HELPER ---------------- */
const getUserStatus = (user) => {
  // User created but invitation not sent yet
  if (!user.invited_at && !user.invite_accepted_at) {
    return "pending";
  }

  // Invitation sent but not yet accepted
  if (user.invited_at && !user.invite_accepted_at) {
    return "invited";
  }

  // Invitation accepted and account active
  if (user.invite_accepted_at && user.is_active) {
    return "active";
  }

  // Invitation accepted but disabled by admin
  if (user.invite_accepted_at && !user.is_active) {
    return "disabled";
  }

  return "disabled";
};

export default function Users() {
  const {
    users = [],
    loading,
    loadUsers,
    addUser,
    inviteNewUser,
    updateUser,
    removeUser,
  } = useUsers();

  /* ---------------- MODAL STATES ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmInviteUser, setConfirmInviteUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  /* ---------------- INVITE STATUS ---------------- */
  const [inviteStatus, setInviteStatus] = useState({});

  /* ---------------- FILTERS ---------------- */
  const [filters, setFilters] = useState({
    email: "",
    role: "",
    status: "",
  });

  /* ---------------- LOAD USERS ---------------- */
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* ---------------- FILTER HELPERS ---------------- */
  const handleFilterChange = (e) =>
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));

  const clearFilters = () => setFilters({ email: "", role: "", status: "" });

  const uniqueValues = (key) => [
    ...new Set(users.map((u) => u[key]).filter(Boolean)),
  ];

  /* ---------------- FILTER DATA ---------------- */
  const filteredData = useMemo(() => {
    return users
      .filter((u) => u.role?.toLowerCase() !== ROLES.SUPERADMIN.toLowerCase())
      .filter((u) => {
        const status = getUserStatus(u);

        return (
          (!filters.email || u.email === filters.email) &&
          (!filters.role || u.role === filters.role) &&
          (!filters.status || filters.status === status)
        );
      });
  }, [users, filters]);

  /* ---------------- SUBMIT (ADD / EDIT) ---------------- */
  const handleSubmit = async (payload) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, payload);
    } else {
      await addUser(payload);
    }

    setSelectedUser(null);
    setIsModalOpen(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>User Management</h2>

        <div className={styles.headerActions}>
          <button
            className={styles.refresh_btn}
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Refreshing
              </>
            ) : (
              <>
                <span className={styles.refreshIcon}>⟳</span>
                Refresh
              </>
            )}
          </button>

          <button
            className={styles.addBtn}
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          >
            + Create User
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <select
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
        >
          <option value="">Select Email</option>
          {uniqueValues("email").map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">Select Role</option>
          {uniqueValues("role").map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="disabled">Disabled</option>
        </select>

        <button className={styles.clearBtn} onClick={clearFilters}>
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
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.loadingRow}>
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredData.map((u) => {
                const status = getUserStatus(u);
                const inviteDisabled =
                  u.invite_accepted_at ||
                  inviteStatus[u.id] === "sent" ||
                  inviteStatus[u.id] === "sending";

                return (
                  <tr key={u.id}>
                    <td>{u.full_name || "-"}</td>
                    <td>{u.email}</td>
                    <td>{u.contact}</td>
                    <td>
                      <span className={styles.tag}>{u.role}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          status === "active"
                            ? styles.active
                            : status === "invited"
                              ? styles.invited
                              : status === "pending"
                                ? styles.pending
                                : styles.disabled
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleString()
                        : "Never"}
                    </td>

                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setSelectedUser(u);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      {!u.invite_accepted_at && (
                        <button
                          className={styles.editBtn}
                          disabled={inviteDisabled}
                          onClick={() => setConfirmInviteUser(u)}
                        >
                          {inviteStatus[u.id] === "sending"
                            ? "Sending..."
                            : inviteStatus[u.id] === "sent"
                              ? "Invitation Sent"
                              : "Send Invite"}
                        </button>
                      )}

                      <button
                        className={styles.deleteBtn}
                        onClick={() => setConfirmDeleteUser(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm initialData={selectedUser} onSubmit={handleSubmit} />
      </Modal>

      {/* INVITE CONFIRM MODAL */}
      <Modal
        isOpen={!!confirmInviteUser}
        onClose={() => setConfirmInviteUser(null)}
      >
        <h3>Send Invitation</h3>
        <p>
          Invite <b>{confirmInviteUser?.email}</b>?
        </p>

        <button
          className={styles.confirmBtn}
          disabled={inviteStatus[confirmInviteUser?.id] === "sending"}
          onClick={async () => {
            const userId = confirmInviteUser.id;

            setInviteStatus((p) => ({
              ...p,
              [userId]: "sending",
            }));

            try {
              await inviteNewUser({
                email: confirmInviteUser.email,
                role: confirmInviteUser.role,
                full_name: confirmInviteUser.full_name,
              });

              setInviteStatus((p) => ({
                ...p,
                [userId]: "sent",
              }));

              setConfirmInviteUser(null);
            } catch {
              setInviteStatus((p) => ({
                ...p,
                [userId]: "idle",
              }));
            }
          }}
        >
          Send Invitation
        </button>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!confirmDeleteUser}
        onClose={() => setConfirmDeleteUser(null)}
      >
        <h3>Delete User</h3>
        <p>
          Are you sure you want to delete <b>{confirmDeleteUser?.email}</b>?
        </p>

        <div className={styles.confirmBtns}>
          <button
            className={styles.cancelBtn}
            onClick={() => setConfirmDeleteUser(null)}
          >
            Cancel
          </button>

          <button
            className={styles.deleteConfirmBtn}
            onClick={async () => {
              await removeUser(confirmDeleteUser.id);
              setConfirmDeleteUser(null);
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
