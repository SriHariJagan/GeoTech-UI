import { createContext, useContext, useEffect, useState } from "react";
import { login } from "../../api/auth.api";
import { decodeToken } from "../../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore session
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded || decoded.exp * 1000 < Date.now()) {
      logout();
    } else {
      setUser({
        id: decoded.user_id,
        email: decoded.email,
        role: decoded.role.toUpperCase(), // normalize
      });
    }

    setLoading(false);
  }, []);

  // 🔐 Login
  const loginUser = async (credentials) => {
    const res = await login(credentials); // ✅ now works
    const { access_token } = res.data;

    const decoded = decodeToken(access_token);
    if (!decoded) throw new Error("Invalid token received");

    const userData = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role.toUpperCase(),
    };

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData; // 🔥 important
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: Boolean(user),
        loading,
        loginUser,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
