import styles from "./styles.module.scss";

function SpinnerLoader() {
  return (
    <div className={styles["loader-wrapper"]}>
      <div className={styles["loader-spinner"]}></div>
    </div>
  );
}

export default SpinnerLoader;
