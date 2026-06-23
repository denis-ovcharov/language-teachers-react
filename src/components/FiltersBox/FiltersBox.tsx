import styles from "./FiltersBox.module.css";

const LANGUAGES = [
  "All",
  "English",
  "French",
  "German",
  "Spanish",
  "Mandarin Chinese",
  "Italian",
  "Korean",
  "Vietnamese",
];
const LEVELS = [
  "All",
  "A1 Beginner",
  "A2 Elementary",
  "B1 Intermediate",
  "B2 Upper-Intermediate",
  "C1 Advanced",
  "C2 Proficient",
];
const PRICES = ["All", "10", "20", "25", "27", "28", "30", "32", "35"];

interface FiltersBoxProps {
  language: string;
  level: string;
  price: string;
  onLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onPriceChange: (value: string) => void;
}

export default function FiltersBox({
  language,
  level,
  price,
  onLanguageChange,
  onLevelChange,
  onPriceChange,
}: FiltersBoxProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <label className={styles.label}>Languages</label>
        <select
          className={styles.select}
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Level of knowledge</label>
        <select
          className={styles.select}
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Price</label>
        <select
          className={styles.select}
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
        >
          {PRICES.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All" : `${p} $`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
