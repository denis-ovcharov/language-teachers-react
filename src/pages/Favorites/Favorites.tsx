import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { firestore } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import type { Teacher } from "../../types";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import styles from "./Favorites.module.css";
import Loader from "../../components/Loader/Loader";

export default function Favorites() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Завантажуємо favorites з Firestore
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const userRef = doc(firestore, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setFavorites(snap.data().favorites ?? []);
        } else {
          await setDoc(userRef, { favorites: [] });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
  }, [user]);

  // Завантажуємо вчителів коли favorites готові
  useEffect(() => {
    if (!user || favorites.length === 0) return;

    const fetchTeachers = async () => {
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

    void fetchTeachers();
  }, [favorites, user]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const isFav = favorites.includes(id);

    // Оптимістичний апдейт UI
    setFavorites((prev) =>
      isFav ? prev.filter((f) => f !== id) : [...prev, id],
    );
    setTeachers((prev) => prev.filter((t) => t.id !== id));

    await updateDoc(userRef, {
      favorites: isFav ? arrayRemove(id) : arrayUnion(id),
    });
  };

  if (loading) return <Loader />;

  return (
    <div className={`container ${styles.wrapper}`}>
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
