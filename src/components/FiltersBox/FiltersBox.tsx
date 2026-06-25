import { useState, useRef, useEffect } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
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

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  formatOption?: (value: string) => string;
}

function Dropdown({
  label,
  options,
  value,
  onChange,
  formatOption,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayValue = formatOption ? formatOption(value) : value;

  return (
    <div className={styles.group} ref={ref}>
      <label className={styles.label}>{label}</label>
      <div className={styles.select} onClick={() => setOpen(!open)}>
        <span className={styles.selectValue}>{displayValue}</span>
        <IoChevronDownOutline
          size={20}
          className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}
        />
      </div>
      {open && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option}
              className={`${styles.option} ${value === option ? styles.optionActive : ""}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {formatOption ? formatOption(option) : option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
      <Dropdown
        label="Languages"
        options={LANGUAGES}
        value={language}
        onChange={onLanguageChange}
      />
      <Dropdown
        label="Level of knowledge"
        options={LEVELS}
        value={level}
        onChange={onLevelChange}
      />
      <Dropdown
        label="Price"
        options={PRICES}
        value={price}
        onChange={onPriceChange}
        formatOption={(v) => (v === "All" ? "All" : `${v} $`)}
      />
    </div>
  );
}
