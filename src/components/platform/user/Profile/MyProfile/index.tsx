import { EFormatDate } from "@/app/common/formatDate";
import { CameraFilled, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AvatarDefault from "@/assets/images/avatar-default.jpg";
import style from "./style.module.scss";
import { useAppSelector, useUploadFile } from "@/app/hooks";
import InfoAddress from "./InfoAddress";
import ActivityTimeline from "./ActivityTimeline";
import { ChangeEvent, useRef, useState } from "react";
import ModalEditContactInformation from "./Modal/ModalEditContactInformation";
import SpinnerLoader from "@/components/common/Loader/SpinnerLoader";
import { userServices } from "@/service/userService";
import { EDirectionType, EUserRole } from "@/interfaces/user";
import HPCopyText from "@/components/common/HPCopyText";
import { ERoutePath } from "@/app/constants/path";
import { EKeySearchUrlRegister } from "@/interfaces/common";

type Props = {
  openModalEdit: () => void;
};

type TUploadedAvatarResponse = Awaited<
  ReturnType<typeof userServices.uploadAvatar>
>[0];

export default function MyProfile({ openModalEdit }: Props) {
  const { t } = useTranslation();
  const { user, mySponsor } = useAppSelector((state) => state.user);
  const [openEditContact, setOpenEditContact] = useState<boolean>(false);

  const { isUploading, uploadFile, successData } = useUploadFile<
    string,
    TUploadedAvatarResponse
  >(userServices.uploadAvatar, (data) => data?.data.imageProfile ?? "");

  const rfAvatarFileInp = useRef<HTMLInputElement>(null);

  const handleCloseModalEditContact = () => {
    setOpenEditContact(false);
  };

  function openFilePickerhandler() {
    if (isUploading) {
      return;
    }

    rfAvatarFileInp.current!.value = "";
    rfAvatarFileInp.current!.click();
  }

  function fileSelectedHandler(event: ChangeEvent<HTMLInputElement>) {
    const selectedAvatar = event.target.files?.[0];

    if (!selectedAvatar) {
      return;
    }
    uploadFile(selectedAvatar);
  }

  const renderReferralLink = (direction: EDirectionType) => {
    const hostName = window.location.origin;
    return `${hostName}${ERoutePath.REGISTER}?${EKeySearchUrlRegister.referralCode}=${user?.refCode}&${EKeySearchUrlRegister.direction}=${direction}`;
  };

  return (
    <>
      <div className={style.profilePageInfoUser}>
        <div className={style.infoUser}>
          <div className={style.infoUser__boxImage}>
            <div className={style.infoUser__top}>
              <div className={style.infoUser__image}>
                <div
                  className={style["infoUser__image__container"]}
                  onClick={openFilePickerhandler}
                >
                  {isUploading ? (
                    <SpinnerLoader />
                  ) : (
                    <img
                      src={successData ?? (user?.imageProfile || AvatarDefault)}
                      alt=""
                    />
                  )}
                  <div className={style["overlay"]}>
                    <CameraFilled />
                  </div>
                  <input
                    ref={rfAvatarFileInp}
                    type="file"
                    className={style["infoUser__image__container__file-input"]}
                    onChange={fileSelectedHandler}
                  />
                </div>
                <div className={style.infoUser__image__name}>
                  <span>{user?.name}</span>
                  <span>
                    {user?.role === EUserRole.collaborator
                      ? t("profile.textDistributor")
                      : t("profile.textCustomer")}
                  </span>
                  <div>
                    {t("profile.textJoinDate")}:{" "}
                    {dayjs(user?.createdAt).format(EFormatDate["MM/DD/YYYY"])}
                  </div>
                </div>
              </div>
              <div
                className={style.infoUserEnrollment__edit}
                onClick={openModalEdit}
              >
                <EditOutlined />
                <span>{t("profile.btnEdit")}</span>
              </div>
            </div>
            {user?.refCode && (
              <div className={style.infoUser__referralLink}>
                <p>{t("profile.Referral link")}</p>
                <div>
                  <div className={style["infoUser__referralLink-link"]}>
                    <span>{t("profile.LEFT Branch")}</span>
                    <HPCopyText
                      content={renderReferralLink(EDirectionType.LEFT)}
                    />
                  </div>
                  <span className={style["infoUser__referralLink-link"]}>
                    <span>{t("profile.RIGHT Branch")}</span>
                    <HPCopyText
                      content={renderReferralLink(EDirectionType.RIGHT)}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className={style.infoUser__infoOther}>
            <div className={style.infoUser__infoOther__text}>
              <div className={style.infoUser__infoOther__item}>
                <div>{t("profile.textRank")}:</div>
                {/* <span>{user?.rank || "N/A"}</span> */}
                <span>{t("profile.Promoter")}</span>
              </div>
              <div className={style.infoUser__infoOther__item}>
                <div>{t("profile.textEmail")}:</div>
                <span>{user?.email}</span>
              </div>
              <div className={style.infoUser__infoOther__item}>
                <div>{t("profile.textPhone")}:</div>
                <span>+84 {user?.phoneNumber.substring(1)}</span>
              </div>
              <div className={style.infoUser__infoOther__item}>
                <div>{t("modal.modalEditContactInformation.inputWork")}:</div>
                <span>{user?.work}</span>
              </div>
              <div className={style.infoUser__infoOther__item}>
                <div>
                  {t("modal.modalEditContactInformation.inputCountry")}:
                </div>
                <span>{user?.country.toUpperCase()}</span>
              </div>
              <div className={style.infoUser__infoOther__item}>
                <div>
                  {t("modal.modalEditContactInformation.inputPostalCode")}:
                </div>
                <span>{user?.postalCode}</span>
              </div>
            </div>
            <div
              className={style.infoUser__infoOther__edit}
              onClick={() => setOpenEditContact(true)}
            >
              <EditOutlined />
              <span>{t("profile.btnEdit")}</span>
            </div>
          </div>
        </div>
        <div className={style.infoUserEnrollment}>
          <div className={style.infoUserEnrollment__title}>
            <span>{t("profile.textEnrollmentInfo")}</span>
          </div>
          <div className={style.box}>
            {/* <div>
              <span className={style.infoUserEnrollment__label}>
                {t("profile.textPayoutMethod")}:{" "}
              </span>
              <span>Promoter</span>
            </div> */}
            <div>
              <span className={style.infoUserEnrollment__label}>
                {t("profile.textSponsorPhone")}:{" "}
              </span>
              {mySponsor?.phoneNumber
                ? `+84 ${String(mySponsor?.phoneNumber).substring(1)}`
                : ""}
            </div>
            {/* <div>
              <span className={style.infoUserEnrollment__label}>
                {t("profile.textPayment")}:{" "}
              </span>
              <span className={style.highlightText}>
                Tuyet Vu Thi ( 1650244_L)
              </span>
            </div> */}
            <div>
              <span className={style.infoUserEnrollment__label}>
                {t("profile.textPersonallySponsored")}:{" "}
              </span>
              {mySponsor?.personalSponsoredAmount}
            </div>
            <div>
              <span className={style.infoUserEnrollment__label}>
                {t("profile.textSponsor")}:{" "}
              </span>
              <span className={style.highlightText}>{mySponsor?.name}</span>
            </div>
            <div>
              <span className={style.infoUserEnrollment__label}>
                {t("profile.textTotalDownline")}:{" "}
              </span>
              {mySponsor?.totalDownline}
            </div>
          </div>
        </div>
      </div>
      <InfoAddress />
      <ActivityTimeline />
      <ModalEditContactInformation
        open={openEditContact}
        onClose={handleCloseModalEditContact}
      />
    </>
  );
}
