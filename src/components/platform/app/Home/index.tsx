import { Col, Row } from "antd";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { sectionHealth, sectionInfoList, sectionStrategy } from "@/app/mock";
import greenHeartIcon from "@/assets/icons/home-green-heart.svg";
import greenLineIcon from "@/assets/icons/home-green-line-icon.svg";
import lineIcon from "@/assets/icons/home-line-icon.svg";
import greenPeople from "@/assets/icons/home-people-icon.svg";
import sectionAboutImage from "@/assets/images/home-section-about.jpg";
import sectionIntroImage from "@/assets/images/home-section-intro.jpg";
import sectionStrategyBanner from "@/assets/images/home-section-strategy.jpg";
import style from "./style.module.scss";

import { generatePath, useNavigate } from "react-router-dom";
import {
  getAverageRating,
  getTotalPriceProduct,
} from "@/app/common/transformDataResponse";
import { ERoutePath } from "@/app/constants/path";
import cartIcon from "@/assets/icons/home-list-icon-cart.svg";
import shippingIcon from "@/assets/icons/home-list-icon-shipping.svg";
import storeIcon from "@/assets/icons/home-list-icon-store.svg";
import { IProductDetails } from "@/interfaces/product";
import { productService } from "@/service/productService";
import deco1 from "@/assets/images/home-deco-1.svg";
import deco2 from "@/assets/images/home-deco-1.svg";
import deco3 from "@/assets/images/home-deco-3.svg";
import UserLayout from "@/components/layouts/UserLayout";
import HPCarousel from "@/components/common/HPCarousel";
import ProductItem from "@/components/common/ProductItem";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import SlideBanner from "./SlideBanner";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function Home() {
  const [products, setProducts] = useState<IProductDetails[]>([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isTablet = useMediaQuery({ maxWidth: EResponsiveBreakpoint.xl });
  const isMobile = useMediaQuery({ maxWidth: EResponsiveBreakpoint.xs });

  const navigateToProductDetail = (itemId: number) => {
    navigate(
      generatePath(ERoutePath.PRODUCT_DETAIL, {
        id: String(itemId),
      })
    );
  };

  const goToDetailArticleHandler = (link: string) => {
    window.open(link, "_blank", "noopener noreferrer");
  };

  useEffect(() => {
    const fetchListProduct = async () => {
      const rs = await productService.projectList({ page: 1, size: 20 });
      setProducts(rs.data);
    };
    fetchListProduct();
  }, []);

  return (
    <UserLayout>
      <div className={style.home}>
        <div className={style.banner}>
          <SlideBanner />
        </div>
        <div className={style.sectionWrapper}>
          <div className={style.sectionAboutUs}>
            <div className={style.sectionAboutUs__content}>
              <div>
                <div className={style.titleSection}>
                  <img src={greenLineIcon} alt="" />
                  <span className={classNames(style.greenText)}>
                    {t("homePage.sectionAbout.subTile")}
                  </span>
                </div>
                <div className={style.sectionAboutUs__title}>
                  <h2 className={style.titleMain}>
                    {t("homePage.sectionAbout.title")}
                  </h2>
                  <p className={style.titleSub}>
                    {t("homePage.sectionAbout.content")}
                  </p>
                  <span> {t("homePage.viewMore")}</span>
                  <div className={style.sectionAboutUs__wrapperBox}>
                    <div className={style.sectionAboutUs__box}>
                      <img src={greenHeartIcon} alt="" />
                      <div>
                        <h3>345</h3>
                        <p>{t("homePage.sectionAbout.happyCustomer")}</p>
                      </div>
                    </div>
                    <div className={style.sectionAboutUs__box}>
                      <img src={greenPeople} alt="" />
                      <div>
                        <h3>600</h3>
                        <p>{t("homePage.sectionAbout.successCustomer")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.sectionAboutUs__image}>
              <img src={sectionIntroImage} alt="" />
            </div>
          </div>
        </div>
        <div className={style.sectionInfo}>
          <div className={style.sectionWrapper}>
            <div className={style.decoBg2}>
              <img src={deco2} />
            </div>
            <div className={style.decoBg3}>
              <img src={deco3} />
            </div>
            <div className={style.title}>
              <h2 className={style.titleMain}>
                {t("homePage.sectionInfo.title")}
              </h2>
              <p>{t("homePage.sectionInfo.content")}</p>
            </div>
            {!isMobile ? (
              <div className={style.content}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {sectionInfoList(t).map((item, index) => (
                    <Col key={index} span={8} xs={24} md={8}>
                      <div className={style.sectionCard}>
                        <img src={item.thumbnail} alt="" />
                        {/* <div className={style.info}>
                        <p className={style.textTitle}>{item.title}</p>
                        <p className={style.textContent}>{item.content}</p>
                        <p className={style.textMore}>
                          {t("homePage.viewMore")}
                        </p>
                      </div> */}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <HPCarousel
                slidesToShow={3}
                responsive={[
                  {
                    breakpoint: EResponsiveBreakpoint.sm, // Define your mobile breakpoint
                    settings: {
                      slidesToShow: 1, // Number of slides to show on mobile
                    },
                  },
                ]}
              >
                {sectionInfoList(t).map((item, index) => (
                  <div className={style.sectionInfo__mobileList} key={index}>
                    <img
                      className={style.thumbnail}
                      src={item.thumbnail}
                      alt=""
                    />
                  </div>
                ))}
              </HPCarousel>
            )}
          </div>
        </div>
        <div className={style.sectionProduct}>
          <div className={style.sectionWrapper}>
            <div className={style.title}>
              <h2 className={style.titleMain}>
                {t("homePage.sectionProduct.title")}
              </h2>
              <p>{t("homePage.sectionProduct.content")}</p>
            </div>
            <HPCarousel
              slidesToShow={4}
              responsive={[
                {
                  breakpoint: EResponsiveBreakpoint.md, // Define your mobile breakpoint
                  settings: {
                    slidesToShow: 3, // Number of slides to show on mobile
                  },
                },
                {
                  breakpoint: EResponsiveBreakpoint.sm, // Define your mobile breakpoint
                  settings: {
                    slidesToShow: 2, // Number of slides to show on mobile
                  },
                },
              ]}
            >
              {products?.map((item, index) => (
                <div key={index} style={contentStyle}>
                  <ProductItem
                    totalRating={item?.rating?.length || 0}
                    averageRating={getAverageRating(item?.rating || [])}
                    marked={false}
                    thumbnail={item?.productUrl[0]?.url}
                    price={getTotalPriceProduct(item?.productItem)}
                    title={item?.name}
                    onClick={() => navigateToProductDetail(item?.id)}
                  />
                </div>
              ))}
            </HPCarousel>
          </div>
        </div>
        <div className={style.sectionStrategy}>
          <div className={style.leftBanner}>
            <img src={sectionStrategyBanner} alt="banner" />
          </div>
          <div className={style.rightContent}>
            <div className={style.content}>
              <div>
                <img src={lineIcon} alt="" />
                <span>{t("homePage.sectionStrategy.subTitle")}</span>
              </div>
              <h3 className={style.content_title}>
                {t("homePage.sectionStrategy.title")}
              </h3>
              <p className={style.content_subTitle}>
                {t("homePage.sectionStrategy.content")}
              </p>
              <div>
                <h4 className={style.sectionStrategy__desc}>
                  {" "}
                  {t("homePage.sectionStrategy.reasons")}
                </h4>
                {sectionStrategy(t).map((item, index) => {
                  return (
                    <p className={style.sectionStrategy__desc} key={index}>
                      <span>{index + 1}</span>
                      {item.content}
                    </p>
                  );
                })}
              </div>
              {/* <div className={style.strategy__box}>
                <div className={style.strategy__image}>
                  <img src={strategyIcon} alt="" />
                </div>
                <div className={style.strategy__content}>
                  <h4 className={style.strategy__contentTitle}>
                    {t("homePage.sectionStrategy.list1.title")}
                  </h4>
                  <p className={style.strategy__contentSubTitle}>
                    {t("homePage.sectionStrategy.list1.content")}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className={style.sectionWrapper}>
          <div className={style.sectionAboutUs}>
            <div className={style.decoBg4}>
              <img src={deco3} />
            </div>
            {!isTablet && (
              <div className={style.decoBg5}>
                <img src={deco1} />
              </div>
            )}

            <div className={style.sectionAboutUs__content}>
              <div>
                <div className={style.titleSection}>
                  <img src={greenLineIcon} alt="" />
                  <span className={classNames(style.greenText)}>
                    {t("homePage.sectionAboutUs.subTitle")}
                  </span>
                </div>
                <div className={style.sectionAboutUs__title}>
                  <h2 className={style.titleMain}>
                    {t("homePage.sectionAboutUs.title")}
                  </h2>
                  <p className={style.titleSub}>
                    {t("homePage.sectionAboutUs.content")}
                  </p>
                  <span> {t("homePage.viewMore")}</span>
                  <div className={style.sectionAboutUs__wrapperBox}>
                    <div className={style.sectionAboutUs__box}>
                      <img src={greenHeartIcon} alt="" />
                      <div>
                        <h3>345</h3>
                        <p> {t("homePage.sectionAboutUs.happyCustomer")}</p>
                      </div>
                    </div>
                    <div className={style.sectionAboutUs__box}>
                      <img src={greenPeople} alt="" />
                      <div>
                        <h3>600</h3>
                        <p> {t("homePage.sectionAboutUs.successCustomer")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.sectionAboutUs__image}>
              <img src={sectionAboutImage} alt="" />
            </div>
          </div>
        </div>
        <div className={style.sectionHeath}>
          <div className={style.sectionWrapper}>
            <div className={style.title}>
              <h2 className={style.titleMain}>
                {t("homePage.sectionHeath.title")}
              </h2>
              <p className={style.titleSub}>
                {t("homePage.sectionHeath.content")}
              </p>
            </div>
            <HPCarousel
              slidesToShow={3}
              responsive={[
                {
                  breakpoint: EResponsiveBreakpoint.sm, // Define your mobile breakpoint
                  settings: {
                    slidesToShow: 1, // Number of slides to show on mobile
                  },
                },
              ]}
            >
              {sectionHealth(t).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    goToDetailArticleHandler(item.link);
                  }}
                  className={style["sectionHeath__item"]}
                >
                  <div className={style.sectionHeath__card}>
                    <img src={item.thumbnail} alt="" />
                    <div className={style.sectionHeath__info}>
                      <p className={style.sectionHeath__textTitle}>
                        {item.title}
                      </p>
                      <p className={style.sectionHeath__date}>{item.date}</p>
                      <p className={style.sectionHeath__textContent}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </HPCarousel>
          </div>
        </div>
        <div className={style.sectionBenefit}>
          <div className={style.sectionWrapper}>
            <div className={style.sectionBenefit__content}>
              <div className={style.decoBg6}>
                <img src={deco2} />
              </div>
              <div className={style.decoBg7}>
                <img src={deco3} />
              </div>
              <div className={style.sectionBenefitTitle}>
                <img src={greenLineIcon} alt="" />
                <span className={style.sectionTitle}>
                  {t("homePage.sectionBenefit.subTitle")}
                </span>
              </div>
              <div className={style.title}>
                <h2> {t("homePage.sectionBenefit.title")}</h2>
                <p>{t("homePage.sectionBenefit.content")}</p>
              </div>
            </div>
            <div className={style.sectionBenefit__list}>
              <div className={style.sectionBenefit__listBoxWrapper}>
                <div className={style.sectionBenefit__box}>
                  <img src={shippingIcon} />
                  <h5>{t("homePage.sectionBenefit.item1.title")}</h5>
                  {/* <p>{t("homePage.sectionBenefit.item1.content")}</p> */}
                </div>
                <div className={style.sectionBenefit__box}>
                  <img src={storeIcon} />
                  <h5>{t("homePage.sectionBenefit.item2.title")}</h5>
                  <p>{t("homePage.sectionBenefit.item2.content")}</p>
                </div>
                <div className={style.sectionBenefit__box}>
                  <img src={cartIcon} />
                  <h5>{t("homePage.sectionBenefit.item3.title")}</h5>
                  {/* <p>{t("homePage.sectionBenefit.item3.content")}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
