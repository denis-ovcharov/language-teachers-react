import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <section>
        <div className={styles.container}>
          <div className={styles.title_and_img}>
            <div className={styles.left_side}>
              <h1 className={styles.title}>
                Unlock your potential with the best{" "}
                <span className={styles.language}>language</span> tutors
              </h1>
              <p className={styles.text}>
                Embark on an Exciting Language Journey with Expert Language
                Tutors: Elevate your language proficiency to new heights by
                connecting with highly qualified and experienced tutors.
              </p>
              <Link to={"/teachers"} className={styles.button}>
                Get started
              </Link>
            </div>
            <div>
              <img
                className={styles.image}
                src="/language-teachers-react/block.jpg"
                alt=""
              />
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.num_descr_box}>
              <p className={styles.num}>32,000 +</p>
              <p className={styles.descr}>Experienced tutors</p>
            </div>
            <div className={styles.num_descr_box}>
              <p className={styles.num}>300,000 +</p>
              <p className={styles.descr}>5-star tutor reviews</p>
            </div>
            <div className={styles.num_descr_box}>
              <p className={styles.num}>120 +</p>
              <p className={styles.descr}>Subjects taught</p>
            </div>
            <div className={styles.num_descr_box}>
              <p className={styles.num}>200 +</p>
              <p className={styles.descr}>Tutor nationalities</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
