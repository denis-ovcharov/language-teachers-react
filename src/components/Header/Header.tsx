import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import styles from "./Header.module.css";
import { LuLogIn } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

type ModalType = "login" | "register" | null;

export default function Header() {
  const { user, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { pathname } = useLocation();

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile menu when route changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link to="/" className={styles.logo}>
          <svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_4_550)">
              <path
                d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z"
                fill="#FFDA44"
              />
              <path
                d="M0 14C0 6.26806 6.26806 0 14 0C21.7319 0 28 6.26806 28 14"
                fill="#338AF3"
              />
            </g>
            <defs>
              <clipPath id="clip0_4_550">
                <rect width="28" height="28" fill="white" />
              </clipPath>
            </defs>
          </svg>
          LearnLingo
        </Link>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
          >
            Home
          </Link>
          <Link
            to="/teachers"
            className={`${styles.link} ${pathname === "/teachers" ? styles.active : ""}`}
          >
            Teachers
          </Link>
          {user && (
            <Link
              to="/favorites"
              className={`${styles.link} ${pathname === "/favorites" ? styles.active : ""}`}
            >
              Favorites
            </Link>
          )}
        </nav>
        <div className={styles.actions}>
          {user ? (
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Log out
              <FiLogOut size={20} color="#f4c550" />
            </button>
          ) : (
            <>
              <button
                className={styles.loginBtn}
                onClick={() => setModal("login")}
              >
                <LuLogIn size={20} color="#f4c550" /> Log in
              </button>
              <button
                className={styles.regBtn}
                onClick={() => setModal("register")}
              >
                Registration
              </button>
            </>
          )}
        </div>

        {/* Burger Button for mobile */}
        <button
          className={styles.burgerBtn}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <RxHamburgerMenu size={28} />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`${styles.drawerBackdrop} ${isMenuOpen ? styles.drawerBackdropOpen : ""}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.drawerCloseBtn}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <RxCross2 size={28} />
          </button>
          <nav className={styles.drawerNav}>
            <Link
              to="/"
              className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>
            <Link
              to="/teachers"
              className={`${styles.link} ${pathname === "/teachers" ? styles.active : ""}`}
            >
              Teachers
            </Link>
            {user && (
              <Link
                to="/favorites"
                className={`${styles.link} ${pathname === "/favorites" ? styles.active : ""}`}
              >
                Favorites
              </Link>
            )}
          </nav>
          <div className={styles.drawerActions}>
            {user ? (
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Log out
                <FiLogOut size={20} color="#f4c550" />
              </button>
            ) : (
              <>
                <button
                  className={styles.loginBtn}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setModal("login");
                  }}
                >
                  <LuLogIn size={20} color="#f4c550" /> Log in
                </button>
                <button
                  className={styles.regBtn}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setModal("register");
                  }}
                >
                  Registration
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal === "login" ? (
            <LoginForm onClose={() => setModal(null)} />
          ) : (
            <RegistrationForm onClose={() => setModal(null)} />
          )}
        </Modal>
      )}
    </header>
  );
}
