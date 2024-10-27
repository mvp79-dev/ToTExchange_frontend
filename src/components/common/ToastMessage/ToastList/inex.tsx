import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Toast from "../Toast/Toast";
import { IToastCustom, IToastPosition } from "../interface";
import "./toastList.css";
import classNames from "classnames";

type Props = {
  position: IToastPosition;
  removeToast: (id: number) => void;
  data: IToastCustom[];
};

const ToastList = ({ data, position, removeToast }: Props) => {
  const listRef = useRef(null);

  const handleScrolling = (el: any) => {
    const isTopPosition = ["top-left", "top-right"].includes(position);
    if (isTopPosition) {
      el?.scrollTo(0, el.scrollHeight);
    } else {
      el?.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    handleScrolling(listRef.current);
  }, [position, data]);

  const sortedData = position.includes("bottom")
    ? [...data].reverse()
    : [...data];

  return (
    sortedData.length > 0 && (
      <div
        className={classNames("toast-list", `toast-list--${position}`)}
        aria-live="assertive"
        ref={listRef}
      >
        {sortedData.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(Number(toast.id))}
          />
        ))}
      </div>
    )
  );
};

ToastList.defaultProps = {
  position: "bottom-right",
};

ToastList.propTypes = {
  data: PropTypes.array.isRequired,
  position: PropTypes.string.isRequired,
  removeToast: PropTypes.func.isRequired,
};

export default ToastList;
