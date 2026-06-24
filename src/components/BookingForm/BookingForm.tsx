import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Teacher } from "../../types";
import styles from "./BookingForm.module.css";
import toast from "react-hot-toast";

const schema = yup.object({
  reason: yup.string().required("Please select a reason"),
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
});

type FormData = yup.InferType<typeof schema>;

const REASONS = [
  "Career and business",
  "Lesson for kids",
  "Living abroad",
  "Exams and coursework",
  "Culture, travel or hobby",
];

interface BookingFormProps {
  teacher: Teacher;
  onClose: () => void;
}

export default function BookingForm({ teacher, onClose }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { reason: "Career and business" },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success("Your trial lesson has been booked!");
    onClose();
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Book trial lesson</h2>
      <p className={styles.subtitle}>
        Our experienced tutor will assess your current language level, discuss
        your learning goals, and tailor the lesson to your specific needs.
      </p>

      <div className={styles.teacher}>
        <img
          src={teacher.avatar_url}
          alt={teacher.name}
          className={styles.avatar}
        />
        <div>
          <p className={styles.teacherLabel}>Your teacher</p>
          <p className={styles.teacherName}>
            {teacher.name} {teacher.surname}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <p className={styles.question}>
          What is your main reason for learning {teacher.languages[0]}?
        </p>

        <div className={styles.reasons}>
          {REASONS.map((reason) => (
            <label key={reason} className={styles.radio}>
              <input
                type="radio"
                value={reason}
                {...register("reason")}
                className={styles.radioInput}
              />
              {reason}
            </label>
          ))}
          {errors.reason && (
            <span className={styles.error}>{errors.reason.message}</span>
          )}
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className={styles.input}
            />
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName.message}</span>
            )}
          </div>
          <div className={styles.field}>
            <input
              {...register("email")}
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>
          <div className={styles.field}>
            <input
              {...register("phone")}
              placeholder="Phone number"
              className={styles.input}
            />
            {errors.phone && (
              <span className={styles.error}>{errors.phone.message}</span>
            )}
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Book
        </button>
      </form>
    </div>
  );
}
