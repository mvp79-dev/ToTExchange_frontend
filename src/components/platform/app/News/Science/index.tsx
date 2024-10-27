import { Col, Row } from "antd";
import { newsMockData } from "../dataMock";
import style from "./style.module.scss";
import CategoryHeroImage from "@/components/platform/product/shared/HeroImage";
import { TFunction } from "i18next";
import { IBreadcrumb } from "@/interfaces/common";
import { ERoutePath } from "@/app/constants/path";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export interface INewPost {
  id: number;
  title: string;
  updated_at: string;
  short_description: string;
  linkImage: string;
}

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

export function NewsSciencePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const viewDetail = (id: number) => {
    navigate(`${ERoutePath.NEWS_SCIENCE}/${id}`);
  };
  return (
    <div>
      <CategoryHeroImage categories={categoriesList(t)} />
      <div className={style.news}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {newsMockData.map((item: INewPost, index: number) => (
            <Col key={item.id} xs={24} md={8}>
              <div
                className={style.news__post}
                onClick={() => viewDetail(item.id)}
              >
                <img src={item.linkImage} />
                <h3>{item.title}</h3>
                <p className={style.date}>{item.updated_at}</p>
                <p className={style.description}>{item.short_description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
