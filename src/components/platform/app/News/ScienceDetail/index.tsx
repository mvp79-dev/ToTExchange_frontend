import CategoryHeroImage from "@/components/platform/product/shared/HeroImage";
import style from "./style.module.scss";
import { TFunction } from "i18next";
import { IBreadcrumb } from "@/interfaces/common";
import { ERoutePath } from "@/app/constants/path";
import { useTranslation } from "react-i18next";
import { newsScienceDetail } from "../dataMockScienceDetail";
import { LeftOutlined, ShareAltOutlined, TagOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import HPButton from "@/components/common/Button";
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
      label: t("header.menu.news"),
      link: ERoutePath.NEWS,
      isActive: false,
    },
    {
      label: t("header.menu.newsScience"),
      link: ERoutePath.NEWS_SCIENCE,
      isActive: true,
    },
  ];
};

export default function NewsScienceDetail() {
  const { t } = useTranslation();
  return (
    <div>
      <CategoryHeroImage categories={categoriesList(t)} />
      <div className={style.newsDetail}>
        <h3 className={style.title}>{newsScienceDetail.title}</h3>
        <div className={style.listSub}>
          <p className={style.date}>{newsScienceDetail.date}</p>
          <p className={style.tags}>
            <span className={style.icon}>
              <TagOutlined />
            </span>
            {newsScienceDetail.tags}
          </p>
          <p className={style.tags}>
            <span className={style.icon}>
              <ShareAltOutlined />
            </span>
            {t("share")}
          </p>
        </div>
        <p className={style.description}>{newsScienceDetail.describe}</p>
        {newsScienceDetail.sections.map((item, number) => {
          const itemParity = number % 2 !== 0;
          return (
            <div className={style.section} key={number}>
              <p className={style.title}>{item.title}</p>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} md={itemParity ? 24 : 14}>
                  <p className={style.description}>{item.description}</p>
                </Col>
                <Col xs={24} md={itemParity ? 24 : 10}>
                  {item?.image && <img src={item.image} />}
                </Col>
              </Row>
            </div>
          );
        })}
        <div className={style.groupBtn}>
          <HPButton title="PREVIOUS POST" className={style.btn} />
          <HPButton title="NEXT POST" className={style.btn} />
        </div>
      </div>
    </div>
  );
}
