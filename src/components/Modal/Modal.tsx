import { useEffect } from "react";
import styles from "./Modal.module.css";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  variant?: "default" | "booking";
}

export default function Modal({ onClose, children, variant = "default" }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const modalClass = `${styles.modal} ${variant === "booking" ? styles.bookingModal : ""}`;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <RxCross2 size={30} />
        </button>
        {children}
      </div>
    </div>
  );
}
