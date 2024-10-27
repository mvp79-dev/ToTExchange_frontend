import style from "./style.module.scss";
import HPCarousel from "@/components/common/HPCarousel";
import slide_image_1 from "../../../../../assets/images/slide-bg-1.png";
import slide_image_2 from "../../../../../assets/images/slide-bg-2.png";
import { useTranslation } from "react-i18next";
export default function SlideBanner() {
  const { t } = useTranslation();
  return (
    <div className={style.homeSlide}>
      <HPCarousel autoplay autoPlaySpeed={0}>
        <div className={style.slideBox}>
          <div className={style.slideContent1}>
            <div>
              <h2>Happy365Global</h2>
              <p>{t("homePage.bannerContent")}</p>
            </div>
          </div>
          <img src={slide_image_1} />
        </div>
        <div className={style.slideBox}>
          <div className={style.slideContent2}>
            <div>
              <h2>Happy365Global</h2>
              <p>{t("homePage.bannerContent")}</p>
            </div>
          </div>
          <img src={slide_image_2} />
        </div>
      </HPCarousel>
    </div>
  );
}
