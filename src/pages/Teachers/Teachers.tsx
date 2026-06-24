import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import TeachersList from "../../components/TeachersList/TeachersList";
import FiltersBox from "../../components/FiltersBox/FiltersBox";
import styles from "./Teachers.module.css";

export default function Teachers() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  const [language, setLanguage] = useState("All");
  const [level, setLevel] = useState("All");
  const [price, setPrice] = useState("All");

  // Завантажуємо favorites з Firestore при логіні
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      const userRef = doc(firestore, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setFavorites(snap.data().favorites ?? []);
      } else {
        await setDoc(userRef, { favorites: [] });
        setFavorites([]);
      }
    };

    void fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) return;

    const ref = doc(firestore, "users", user.uid);
    const isFav = favorites.includes(id);

    // Оптимістичний апдейт UI
    setFavorites((prev) =>
      isFav ? prev.filter((f) => f !== id) : [...prev, id],
    );

    // Синхронізуємо з Firestore
    await updateDoc(ref, {
      favorites: isFav ? arrayRemove(id) : arrayUnion(id),
    });
  };

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
      <TeachersList
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        language={language}
        level={level}
        price={price}
      />
    </div>
  );
}
