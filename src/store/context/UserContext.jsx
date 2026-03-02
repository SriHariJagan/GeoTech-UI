import { createContext, useContext, useState, useCallback } from "react";
import {
  getUsersAdmin,
  createUser,
  updateUser,
  inviteUser,
  deleteUser,
} from "../../api/auth.api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD USERS ---------------- */
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUsersAdmin();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- CREATE USER ---------------- */
  const addUser = useCallback(
    async (data) => {
      await createUser(data);
      await loadUsers();
    },
    [loadUsers]
  );

  /* ---------------- UPDATE USER ---------------- */
  const updateExistingUser = useCallback(
    async (id, data) => {
      await updateUser(id, data);
      await loadUsers();
    },
    [loadUsers]
  );

  /* ---------------- INVITE USER ---------------- */
  const inviteNewUser = useCallback(
    async (data) => {
      await inviteUser(data);
      await loadUsers();
    },
    [loadUsers]
  );

  /* ---------------- DELETE USER ---------------- */
  const removeUser = useCallback(
    async (id) => {
      await deleteUser(id);
      await loadUsers();
    },
    [loadUsers]
  );

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        loadUsers,
        addUser,
        updateUser: updateExistingUser,
        inviteNewUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be inside UserProvider");
  return ctx;
};
