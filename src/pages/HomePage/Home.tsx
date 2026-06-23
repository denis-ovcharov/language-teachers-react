import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <section>
        <div className={styles.container}>
          <div className={styles.left_side}>
            <h1 className={styles.title}>
              Unlock your potential with the best{" "}
              <span className={styles.language}>language</span> tutors
            </h1>
            <p>
              Embark on an Exciting Language Journey with Expert Language
              Tutors: Elevate your language proficiency to new heights by
              connecting with highly qualified and experienced tutors.
            </p>
            <button className={styles.button}>Get started</button>
          </div>
          <div>
            <img className={styles.image} src="/block.jpg" alt="" />
          </div>
        </div>
      </section>
    </>
  );
}
