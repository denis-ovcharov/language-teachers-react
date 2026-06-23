import { useState } from "react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { PiBookOpenTextLight } from "react-icons/pi";
import type { Teacher } from "../../types";
import { useAuth } from "../../context/AuthContext";
import styles from "./TeacherCard.module.css";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import BookingForm from "../BookingForm/BookingForm";

interface TeacherCardProps {
  teacher: Teacher;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  activeLevel?: string;
}

export default function TeacherCard({
  teacher,
  isFavorite,
  onToggleFavorite,
  activeLevel,
}: TeacherCardProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleFavorite = () => {
    if (!user) {
      toast.error("This feature is available for authorized users only.");
      return;
    }
    onToggleFavorite(teacher.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img
          src={teacher.avatar_url}
          alt={teacher.name}
          className={styles.avatar}
        />
        <span className={styles.online} />
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <div>
            <p className={styles.languages}>Languages</p>
            <h3 className={styles.name}>
              {teacher.name} {teacher.surname}
            </h3>
          </div>
          <div className={styles.meta}>
            <span>
              <PiBookOpenTextLight size={16} /> Lessons online
            </span>
            <svg width={1} height={16}>
              <use href="/language-teachers-react/line.svg"></use>
            </svg>
            <span>Lessons done: {teacher.lessons_done}</span>
            <svg width={1} height={16}>
              <use href="/language-teachers-react/line.svg"></use>
            </svg>
            <span>
              <FaStar size={16} color="#F4C550" /> Rating: {teacher.rating}
            </span>
            <svg width={1} height={16}>
              <use href="/language-teachers-react/line.svg"></use>
            </svg>
            <span>
              Price / 1 hour:{" "}
              <b className={styles.price}>{teacher.price_per_hour}$</b>
            </span>
            <button className={styles.favorite} onClick={handleFavorite}>
              {isFavorite ? (
                <FaHeart size={20} color="#F4C550" />
              ) : (
                <FaRegHeart size={20} />
              )}
            </button>
          </div>
        </div>

        <p className={styles.info}>
          <span>Speaks: </span>
          <b className={styles.speaks_values}>{teacher.languages.join(", ")}</b>
        </p>
        <p className={styles.info}>
          <span>Lesson Info: </span>
          <b>{teacher.lesson_info}</b>
        </p>
        <p className={styles.info}>
          <span>Conditions: </span>
          <b>{teacher.conditions.join(" ")}</b>
        </p>

        {!isExpanded && (
          <button
            className={styles.readMore}
            onClick={() => setIsExpanded(true)}
          >
            Read more
          </button>
        )}

        {isExpanded && (
          <>
            <p className={styles.experience}>{teacher.experience}</p>
            <div className={styles.reviews}>
              {teacher.reviews.map((review, index) => (
                <div key={index} className={styles.review}>
                  <div className={styles.reviewer}>
                    <div className={styles.reviewerAvatar}>
                      {review.reviewer_name[0]}
                    </div>
                    <div>
                      <p className={styles.reviewerName}>
                        {review.reviewer_name}
                      </p>
                      <p className={styles.reviewerRating}>
                        <FaStar size={14} color="#F4C550" />{" "}
                        {review.reviewer_rating}
                      </p>
                    </div>
                  </div>
                  <p className={styles.comment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles.levels}>
          {teacher.levels.map((level) => (
            <span
              key={level}
              className={`${styles.level} ${activeLevel === level ? styles.levelActive : ""}`}
            >
              #{level}
            </span>
          ))}
        </div>

        {isExpanded && (
          <button
            className={styles.bookBtn}
            onClick={() => setIsBookingOpen(true)}
          >
            Book trial lesson
          </button>
        )}
      </div>
      {isBookingOpen && (
        <Modal onClose={() => setIsBookingOpen(false)}>
          <BookingForm
            teacher={teacher}
            onClose={() => setIsBookingOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
