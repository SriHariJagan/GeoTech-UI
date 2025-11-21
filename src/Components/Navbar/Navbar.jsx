import { useState, useRef, useEffect } from "react";
import { Menu, Sun, Moon, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  };

  const links = [
    { label: "Projects", path: "/projects" },
    { label: "Daily Execution Report", path: "/daily-execution" },
    { label: "Supervisors", path: "/supervisors" },
    { label: "Vendors", path: "/vendors" },
    { label: "Machinery Details", path: "/machinery" },
  ];

  // Stagger animation for mobile items
  const itemVariant = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25 },
    },
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">Geotech</Link>
      </div>

      {/* Desktop Menu */}
      <div className={styles.desktopMenu}>
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Right */}
      <div className={styles.rightSide}>
        {/* Theme Button */}
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
                <NavLink
                  to="/profile"
                  className={styles.dropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  Profile
                </NavLink>

                <button
                  className={styles.logoutBtn}
                  onClick={() => setProfileOpen(false)}
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

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileSlideMenu}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
          >
            {/* Header */}
            <div className={styles.mobileHeader}>
              <div className={styles.mobileTitle}>Menu</div>

              <button
                className={styles.closeButton}
                onClick={() => setMenuOpen(false)}
              >
                <X className={styles.icon} />
              </button>
            </div>

            {/* Items */}
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
                    onClick={() => setMenuOpen(false)}
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
