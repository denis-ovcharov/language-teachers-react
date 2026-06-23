import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import styles from "./Header.module.css";
import { LuLogIn } from "react-icons/lu";

type ModalType = "login" | "register" | null;

export default function Header() {
  const { user, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <svg width={28} height={28}>
            <use href="/public/ukraine.svg"></use>
          </svg>
          LearnLingo
        </Link>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/teachers">Teachers</Link>
          {user && <Link to="/favorites">Favorites</Link>}
        </nav>
        <div className={styles.actions}>
          {user ? (
            <button onClick={logout}>Log out</button>
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
