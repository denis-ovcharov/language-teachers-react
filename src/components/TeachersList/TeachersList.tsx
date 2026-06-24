import { useState, useEffect, useMemo } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase";
import type { Teacher } from "../../types";
import TeacherCard from "../TeacherCard/TeacherCard";
import styles from "./TeachersList.module.css";
import Loader from "../Loader/Loader";

const PAGE_SIZE = 4;

interface TeachersListProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  language: string;
  level: string;
  price: string;
}

export default function TeachersList({
  favorites,
  onToggleFavorite,
  language,
  level,
  price,
}: TeachersListProps) {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const snapshot = await get(ref(db, "teachers"));
        if (!snapshot.exists()) return;
        const data = snapshot.val();
        const loaded: Teacher[] = Object.entries(data).map(([id, value]) => ({
          ...(value as Omit<Teacher, "id">),
          id,
        }));
        setAllTeachers(loaded);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchTeachers();
  }, []);

  const filtered = useMemo(() => {
    return allTeachers.filter((t) => {
      if (language !== "All" && !t.languages.includes(language)) return false;
      if (level !== "All" && !t.levels.includes(level)) return false;
      if (price !== "All" && t.price_per_hour !== Number(price)) return false;
      return true;
    });
  }, [allTeachers, language, level, price]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ul className={styles.list}>
            {visible.map((teacher) => (
              <li key={teacher.id}>
                <TeacherCard
                  teacher={teacher}
                  isFavorite={favorites.includes(teacher.id)}
                  onToggleFavorite={onToggleFavorite}
                  activeLevel={level === "All" ? undefined : level}
                />
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              className={styles.loadMore}
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
}
