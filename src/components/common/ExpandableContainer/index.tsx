import classNames from "classnames";
import * as React from "react";

import styles from "./styles.module.scss";
import { CaretDownFilled } from "@ant-design/icons";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  headerClassname?: string;
  hasArrow?: boolean;
  maxHeight?: number | string;
  defaultOpen?: boolean;
  customExpandIcon?: (props: { isShow: boolean }) => React.ReactNode;
}

function ExpandableContainer({
  header,
  headerClassname,
  children,
  className,
  hasArrow = true,
  defaultOpen = false,
  maxHeight = "100%",
  customExpandIcon = ({ isShow }) => (
    <CaretDownFilled rotate={isShow ? 180 : 0} />
  ),
  ...props
}: IProps) {
  const [isShowChildren, setIsShowChildren] = React.useState(defaultOpen);

  function toggleShowLanguageList() {
    setIsShowChildren((isShow) => !isShow);
  }

  return (
    <div
      className={classNames(className, styles["container"])}
      {...props}
      style={{ "--max-height": maxHeight } as React.CSSProperties}
    >
      <div
        onClick={toggleShowLanguageList}
        className={classNames(styles["container__header"], headerClassname)}
      >
        <div>{header}</div>
        {hasArrow && customExpandIcon({ isShow: isShowChildren })}
      </div>
      <div
        className={classNames(styles["container__children-container"], {
          [styles.active]: isShowChildren,
        })}
      >
        {children}
      </div>
    </div>
  );
}

export default ExpandableContainer;
