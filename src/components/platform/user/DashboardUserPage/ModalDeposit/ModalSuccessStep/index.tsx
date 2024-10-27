import styles from "./style.module.scss";
import successIcon from "@/assets/icons/modal-success.svg";
import HPButton from "@/components/common/Button";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { EHashProfile } from "../../../Profile/MyProfile/ActivityTimeline";

type Props = {
  isAdmin: boolean;
  onClose: () => void;
};

export default function ModalSuccessStep({ onClose, isAdmin }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: ERoutePath.PROFILE,
      hash: EHashProfile.activityTimeline,
    });
    onClose();
  };

  return (
    <div className={styles["modalSuccess"]}>
      <img src={successIcon} />
      <p className={styles["title"]}>{t("modal.modalDeposit.steps3.main")}</p>
      {!isAdmin && (
        <p className={styles["content"]}>
          {t("modal.modalDeposit.steps3.detail")}
        </p>
      )}
      <p>
        <strong>{t("dashboardUser.deposit.deposit info")}</strong>
      </p>
      {!isAdmin && (
        <div className={styles["btnGroup"]}>
          {/* <HPButton
          title={t("modal.modalDeposit.btn.btnViewWall")}
          wrapperClassName={styles["btn"]}
          // onClick={onPrevious}
        /> */}
          <HPButton
            title={t("modal.modalDeposit.btn.btnViewHistory")}
            onClick={handleClick}
            wrapperClassName={classNames(styles["btn"], styles["btnActive"])}
          />
        </div>
      )}
    </div>
  );
}
