import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TeachersList from "../../components/TeachersList/TeachersList";
import FiltersBox from "../../components/FiltersBox/FiltersBox";
import styles from "./Teachers.module.css";

export default function Teachers() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (!user) return [];
    const stored = localStorage.getItem(`favorites_${user.uid}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [language, setLanguage] = useState("All");
  const [level, setLevel] = useState("All");
  const [price, setPrice] = useState("All");

  const handleToggleFavorite = (id: string) => {
    if (!user) return;
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className={styles.container}>
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
