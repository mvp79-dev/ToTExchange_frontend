import HPSelect from "@/components/common/Inputs/HPSelect";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

export default function PreferredPlacement() {
  const { t } = useTranslation();
  return (
    <div className={style.preferredPlacement}>
      <div className={style.header}>
        <div className={style.title}>
          <div>{t("profile.preferredPlacement.title")}:</div>
          <span>{t("profile.preferredPlacement.content")}</span>
        </div>
        <div className={style.action}>
          <Button className="ant-btn-custom">
            {t("profile.preferredPlacement.btnSave")}
          </Button>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.label}>
          {t("profile.preferredPlacement.labelSelect")}:
        </div>
        <HPSelect
          defaultValue={"Not Specified"}
          options={[{ label: "Not Specified", value: "Not Specified" }]}
          onChange={() => {}}
        />
      </div>

      <div className={style.action}>
        <Button className="ant-btn-custom">
          {t("profile.preferredPlacement.btnSave")}
        </Button>
      </div>
    </div>
  );
}
