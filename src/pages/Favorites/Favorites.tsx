import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import type { Teacher } from "../../types";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (!user) return [];
    const stored = localStorage.getItem(`favorites_${user.uid}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || favorites.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const snapshot = await get(ref(db, "teachers"));
        if (!snapshot.exists()) return;
        const data = snapshot.val();
        const all: Teacher[] = Object.entries(data).map(([id, value]) => ({
          ...(value as Omit<Teacher, "id">),
          id,
        }));
        setTeachers(all.filter((t) => favorites.includes(t.id)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchFavorites();
  }, [favorites, user]);

  const handleToggleFavorite = (id: string) => {
    if (!user) return;
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(updated));
      setTeachers((prevTeachers) =>
        prevTeachers.filter((t) => updated.includes(t.id)),
      );
      return updated;
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {teachers.length === 0 ? (
        <p className={styles.empty}>No favorite teachers yet.</p>
      ) : (
        <ul className={styles.list}>
          {teachers.map((teacher) => (
            <li key={teacher.id}>
              <TeacherCard
                teacher={teacher}
                isFavorite={favorites.includes(teacher.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
