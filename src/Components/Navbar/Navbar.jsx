import { useState, useRef, useEffect } from "react";
import { Menu, Sun, Moon, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/context/AuthContext";
import styles from "./Navbar.module.css";
import { ROLES } from "../../constants/roles";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
    );
  };

  // 🔐 Role-based links
  const adminLinks = [
    // { label: "Dashboard", path: "/admin" },
    { label: "Projects", path: "/admin/projects" },
    { label: "Daily Execution", path: "/admin/daily-execution-report" },
    { label: "Supervisors", path: "/admin/supervisors" },
    { label: "Vendors", path: "/admin/vendors" },
    { label: "Machinery", path: "/admin/machines" },
    { label: "Users", path: "/admin/users" },
    { label: "Expenditures", path: "/admin/expenditures" },
  ];

  const supervisorLinks = [
    { label: "My Projects", path: "/supervisor/my-projects" },
    { label: "Daily Execution", path: "/supervisor/daily-execution-report" },
  ];

  const links = role === ROLES.SUPERADMIN  ? adminLinks : supervisorLinks;

  const itemVariant = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to={role === ROLES.SUPERADMIN ? "/admin" : "/supervisor"}>
          GeoTech
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className={styles.desktopMenu}>
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.active}`
                : styles.navItem
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Right */}
      <div className={styles.rightSide}>
        {/* Theme */}
        <button onClick={toggleTheme} className={styles.iconButton}>
          <Sun className={`${styles.icon} ${styles.lightIcon}`} />
          <Moon className={`${styles.icon} ${styles.darkIcon}`} />
        </button>

        {/* Profile */}
        <div className={styles.profileWrapper} ref={profileRef}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className={styles.iconButton}
          >
            <User className={styles.icon} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={styles.profileDropdown}
              >
                <div className={styles.profileInfo}>
                  <p>{user?.email}</p>
                  <span>{user?.role}</span>
                </div>

                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.iconButton} ${styles.hamburgerButton}`}
          onClick={() => setMenuOpen(true)}
        >
          <Menu className={styles.icon} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileSlideMenu}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
          >
            <div className={styles.mobileHeader}>
              <div className={styles.mobileTitle}>Menu</div>
              <button
                className={styles.closeButton}
                onClick={() => setMenuOpen(false)}
              >
                <X className={styles.icon} />
              </button>
            </div>

            <motion.div
              className={styles.mobileMenuInner}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ staggerChildren: 0.08 }}
            >
              {links.map((link) => (
                <motion.div key={link.label} variants={itemVariant}>
                  <NavLink
                    to={link.path}
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(false);
                    }}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.mobileNavItem} ${styles.mobileActive}`
                        : styles.mobileNavItem
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
