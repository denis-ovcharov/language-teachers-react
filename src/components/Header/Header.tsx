import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import styles from "./Header.module.css";
import { LuLogIn } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";

type ModalType = "login" | "register" | null;

export default function Header() {
  const { user, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);

  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <svg width={28} height={28}>
            <use href="/language-teachers-react/ukraine.svg"></use>
          </svg>
          LearnLingo
        </Link>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.link} ${pathname === "/language-teachers-react" ? styles.active : ""}`}
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
            <button className={styles.logoutBtn} onClick={logout}>
              Log out
              <FiLogOut size={20} color="orange" />
            </button>
          ) : (
            <>
              <button
                className={styles.loginBtn}
                onClick={() => setModal("login")}
              >
                <LuLogIn size={20} color="orange" /> Log in
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
