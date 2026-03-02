import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/context/AuthContext";
import { ROLES } from "../../../constants/roles";
import styles from "./Login.module.css";

const ROLE_REDIRECT = {
  [ROLES.SUPERADMIN]: "/dashboard",
  [ROLES.SUPERVISOR]: "/my-projects",
};

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (!loading) {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const user = await loginUser(form);

      const redirectPath = ROLE_REDIRECT[user.role];
      if (!redirectPath) throw new Error("Unauthorized role");

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>GeoTech Login</h1>
        <p className={styles.subtitle}>
          Sign in to manage projects & reports
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@geotech.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          © {new Date().getFullYear()} GeoTech
        </div>
      </div>
    </div>
  );
};

export default Login;
