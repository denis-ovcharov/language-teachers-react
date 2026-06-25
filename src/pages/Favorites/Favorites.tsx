import { useState, useEffect, useMemo } from "react";
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
import FiltersBox from "../../components/FiltersBox/FiltersBox";

export default function Favorites() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  // стейт для фільтрів
  const [language, setLanguage] = useState("All");
  const [level, setLevel] = useState("All");
  const [price, setPrice] = useState("All");

  // фільтрація
  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      if (language !== "All" && !t.languages.includes(language)) return false;
      if (level !== "All" && !t.levels.includes(level)) return false;
      if (price !== "All" && t.price_per_hour !== Number(price)) return false;
      return true;
    });
  }, [teachers, language, level, price]);

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
        setFavoritesLoaded(true); // сигнал що favorites готові
      }
    };

    void fetchFavorites();
  }, [user]);

  // Завантажуємо вчителів коли favorites готові
  useEffect(() => {
    if (!favoritesLoaded) return;

    const fetchTeachers = async () => {
      if (favorites.length === 0) {
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

    void fetchTeachers();
  }, [favoritesLoaded, favorites, user]);

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
      <FiltersBox
        language={language}
        level={level}
        price={price}
        onLanguageChange={setLanguage}
        onLevelChange={setLevel}
        onPriceChange={setPrice}
      />
      {filtered.length === 0 ? (
        <p className={styles.empty}>No favorite teachers yet.</p>
      ) : (
        <ul className={styles.list}>
          {filtered.map((teacher) => (
            <li key={teacher.id}>
              <TeacherCard
                teacher={teacher}
                isFavorite={favorites.includes(teacher.id)}
                onToggleFavorite={handleToggleFavorite}
                activeLevel={level === "All" ? undefined : level}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
