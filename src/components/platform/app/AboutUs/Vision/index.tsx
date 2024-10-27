import { ERoutePath } from "@/app/constants/path";
import CategoryHeroImage from "@/components/platform/product/shared/HeroImage";
import { IBreadcrumb } from "@/interfaces/common";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import classNames from "classnames";
import about1Image from "@/assets/images/about-vision-1.png";
import about2Image from "@/assets/images/about-vision-2.png";
import about3Image from "@/assets/images/about-vision-3.png";
import { useLayoutEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import FooterBanner from "@/components/common/FooterBanner";

type TContent = {
  title: string;
  content: string;
  url_image: string;
};

const listContents = (t: TFunction<"translation", undefined>): TContent[] => {
  return [
    {
      title: t("aboutUs.vision.mission.title"),
      content: t("aboutUs.vision.mission.content"),
      url_image: about1Image,
    },
    {
      title: t("aboutUs.vision.vision.title"),
      content: t("aboutUs.vision.vision.content"),
      url_image: about2Image,
    },
    {
      title: t("aboutUs.vision.goal.title"),
      content: t("aboutUs.vision.goal.content"),
      url_image: about3Image,
    },
  ];
};

const categoriesList = (
  t: TFunction<"translation", undefined>
): IBreadcrumb[] => {
  return [
    {
      label: t("header.menu.home"),
      link: ERoutePath.HOME,
      isActive: false,
    },
    {
      label: t("header.menu.about us"),
      link: ERoutePath.ABOUT_US,
      isActive: false,
    },
    {
      label: t("header.menu.aiming"),
      link: ERoutePath.ABOUT_US_VISION,
      isActive: true,
    },
  ];
};
function AboutVisionPage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (!user?.isAdded) {
      navigate(ERoutePath.HOME);
    }
  }, [navigate, user?.isAdded]);

  return (
    <main>
      <CategoryHeroImage categories={categoriesList(t)} />
      <div className={styles.aboutVision}>
        <div className={styles.content__wrapper}>
          {listContents(t).map((data: TContent, index: number) => {
            return (
              <div
                key={index}
                className={classNames(
                  styles.content__row,
                  index === 1 && styles.content__reverse
                )}
              >
                <div className={styles.content__boxLeft}>
                  <h3>{data.title}</h3>
                  <p>{data.content}</p>
                </div>
                <div className={styles.content__boxRight}>
                  <img className={styles.img} src={data.url_image} />
                </div>
              </div>
            );
          })}
          <p className={styles.content__bottomText}>
            {t("aboutUs.vision.bottomText")}
          </p>
        </div>
      </div>
      <FooterBanner />
    </main>
  );
}

export default AboutVisionPage;
