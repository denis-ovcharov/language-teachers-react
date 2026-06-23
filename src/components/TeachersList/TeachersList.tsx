/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  ref,
  query,
  limitToFirst,
  orderByKey,
  startAfter,
  get,
} from "firebase/database";
import { db } from "../../lib/firebase";
import type { Teacher } from "../../types";
import TeacherCard from "../TeacherCard/TeacherCard";
import styles from "./TeachersList.module.css";

const PAGE_SIZE = 4;

interface TeachersListProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function TeachersList({
  favorites,
  onToggleFavorite,
}: TeachersListProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async (startKey?: string) => {
    setLoading(true);
    try {
      const teachersRef = ref(db, "teachers");
      const q = startKey
        ? query(
            teachersRef,
            orderByKey(),
            startAfter(startKey),
            limitToFirst(PAGE_SIZE),
          )
        : query(teachersRef, orderByKey(), limitToFirst(PAGE_SIZE));

      const snapshot = await get(q);
      if (!snapshot.exists()) {
        setHasMore(false);
        return;
      }

      const data = snapshot.val();
      const loaded: Teacher[] = Object.entries(data).map(([id, value]) => ({
        ...(value as Omit<Teacher, "id">),
        id,
      }));

      setTeachers((prev) => [...prev, ...loaded]);
      setLastKey(loaded[loaded.length - 1].id);
      if (loaded.length < PAGE_SIZE) setHasMore(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            <TeacherCard
              teacher={teacher}
              isFavorite={favorites.includes(teacher.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={() => fetchTeachers(lastKey ?? undefined)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
