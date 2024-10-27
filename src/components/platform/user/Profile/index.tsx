import { useTranslation } from "react-i18next";
import MyProfile from "./MyProfile";
import style from "./style.module.scss";
import PreferredPlacement from "./PreferredPlacement";
import { useState } from "react";
import classNames from "classnames";
import ModalEditProfile from "./MyProfile/Modal/ModalEditProfile";

enum EKeyTab {
  "myProfile" = "my-profile",
  "preferredPlacement" = "preferred-placement",
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [tabActive, setTabActive] = useState<EKeyTab>(EKeyTab.myProfile);
  const [openModalEditProfile, setOpenModalEditProfile] =
    useState<boolean>(false);

  const tabs: { label: string; key: EKeyTab }[] = [
    {
      key: EKeyTab.myProfile,
      label: t("profile.textMyProfile"),
    },
    {
      key: EKeyTab.preferredPlacement,
      label: t("profile.textPreferredPlacement"),
    },
  ];
  return (
    <>
      <div className={style.profilePage}>
        <div className={style.profilePage__menuLeft}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={classNames(tab.key === tabActive && style.activeMenu)}
              onClick={() => setTabActive(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className={style.profilePage__content}>
          {tabActive === EKeyTab.myProfile ? (
            <MyProfile openModalEdit={() => setOpenModalEditProfile(true)} />
          ) : (
            <PreferredPlacement />
          )}
        </div>
      </div>

      {openModalEditProfile && (
        <ModalEditProfile
          open={openModalEditProfile}
          onClose={() => setOpenModalEditProfile(false)}
        />
      )}
    </>
  );
}
