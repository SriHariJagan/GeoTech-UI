import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./AcceptInvite.module.css";
import axios from "axios";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing invite link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${import.meta.env.VITE_API_URL}/users/accept-invite`, {
        token,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError("Invite link is expired or already used.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Accept Invitation</h1>
        <p className={styles.subtitle}>
          Set your password to activate your account
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={loading}
        >
          {loading ? "Activating..." : "Activate Account"}
        </button>
      </form>
    </div>
  );
};

export default AcceptInvite;
