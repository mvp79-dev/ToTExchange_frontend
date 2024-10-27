import classNames from "classnames";
import styles from "./styles.module.scss";

interface IProps extends React.AllHTMLAttributes<HTMLDivElement> {}

function TimeLineItem({ children, className, ...props }: IProps) {
  return (
    <div className={classNames(styles["timeline-item"], className)} {...props}>
      <div className={styles["timeline-item__tail"]} />
      <div>{children}</div>
    </div>
  );
}

export default TimeLineItem;
