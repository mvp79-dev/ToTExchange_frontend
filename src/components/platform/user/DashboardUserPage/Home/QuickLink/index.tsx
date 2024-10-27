import { ERoutePath } from "@/app/constants/path";
import { useAppSelector } from "@/app/hooks";
import IconEnrollDistributor from "@/assets/icons/enrollDistributor.svg";
import IconLegBusinessSnapshot from "@/assets/icons/legBusinessSnapshot.svg";
import IconManageMySubscriptions from "@/assets/icons/manageMySubscriptions.svg";
import IconMyPersonalWebsite from "@/assets/icons/myPersonalWebsite.svg";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import style from "./style.module.scss";
import HPTooltip from "@/components/common/HPTooltip";
import HPCarousel from "@/components/common/HPCarousel";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";
import classNames from "classnames";

enum EKeyQuickLink {
  enrollDistributor = "EnrollDistributor",
  personalWebsite = "PersonalWebsite",
  mySubscriptions = "MySubscriptions",
  leftLeg = "LeftLeg",
  rightLeg = "RightLeg",
}
interface IQuickLink {
  label: string;
  link: string;
  icon: ReactNode;
  bgColor: string;
  primaryColor: string;
  targetBlank?: boolean;
  key: EKeyQuickLink;
}

export default function QuickLink() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);

  const dataLinks: IQuickLink[] = [
    {
      label: t("dashboardUser.quickLink.textEnrollDistributor"),
      link: ERoutePath.PROFILE,
      icon: <img src={IconEnrollDistributor} alt="" />,
      bgColor: "#DCFCE7",
      primaryColor: "#52C41A",
      key: EKeyQuickLink.enrollDistributor,
    },
    {
      label: t("dashboardUser.quickLink.textMyPersonalWebsite"),
      link: user?.personalWebsite ?? "",
      icon: <img src={IconMyPersonalWebsite} alt="" />,
      bgColor: "#FFF4DE",
      primaryColor: "#FAAD14",
      targetBlank: true,
      key: EKeyQuickLink.personalWebsite,
    },
    {
      label: t("dashboardUser.quickLink.textManageMySubscriptions"),
      link: ERoutePath.MARKETPLACE,
      icon: <img src={IconManageMySubscriptions} alt="" />,
      bgColor: "#FFE2E5",
      primaryColor: "#F5222D",
      key: EKeyQuickLink.mySubscriptions,
    },
    {
      label: t("dashboardUser.quickLink.textLeftLeg"),
      link: "",
      icon: <img src={IconLegBusinessSnapshot} alt="" />,
      bgColor: "#E6F4FF",
      primaryColor: "#1677FF",
      key: EKeyQuickLink.leftLeg,
    },
    {
      label: t("dashboardUser.quickLink.textRightLeg"),
      link: "",
      icon: <img src={IconLegBusinessSnapshot} alt="" />,
      bgColor: "#F3E8FF",
      primaryColor: "#BB6BD9",
      key: EKeyQuickLink.rightLeg,
    },
  ];

  const checkLink = (key: EKeyQuickLink, link: string) => {
    if (key === EKeyQuickLink.personalWebsite) {
      if (link) return "";
      return t("dashboardUser.quickLink.tooltipWebsite");
    }
  };
  return (
    <div className={style.quickLink}>
      <div>
        <span className={style.title}>
          {t("dashboardUser.quickLink.title")}
        </span>
        {/* <span className={style.date}>
          {t("dashboardUser.quickLink.textDate")}: 08/15/2023, 1:04 PM
        </span> */}
      </div>
      <div className={style.quickLinkList}>
        {dataLinks.map((data, index) => (
          <HPTooltip
            key={index}
            title={checkLink(data.key, data.link)}
            icon={
              <Link
                className={style.quickLinkItem}
                style={{ backgroundColor: data.bgColor }}
                to={data.link}
                target={data.link && data.targetBlank ? "_blank" : ""}
              >
                <div
                  className={style.image}
                  style={{ backgroundColor: data.primaryColor }}
                >
                  {data.icon}
                </div>
                <span className={style.label}>{data.label}</span>
              </Link>
            }
          />
        ))}
      </div>
      <div
        className={classNames(style.quickLinkList, style.quickLinkList__mobile)}
      >
        <HPCarousel
          slidesToShow={3}
          responsive={[
            {
              breakpoint: EResponsiveBreakpoint.sm,
              settings: {
                slidesToShow: 1.25,
              },
            },
          ]}
        >
          {dataLinks.map((data, index) => (
            <HPTooltip
              key={index}
              title={checkLink(data.key, data.link)}
              icon={
                <Link
                  className={style.quickLinkItem}
                  style={{ backgroundColor: data.bgColor }}
                  to={data.link}
                  target={data.link && data.targetBlank ? "_blank" : ""}
                >
                  <div
                    className={style.image}
                    style={{ backgroundColor: data.primaryColor }}
                  >
                    {data.icon}
                  </div>
                  <span className={style.label}>{data.label}</span>
                </Link>
              }
            />
          ))}
        </HPCarousel>
      </div>
    </div>
  );
}
