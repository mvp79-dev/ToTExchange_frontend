import { Col, Row } from "antd";
import style from "./style.module.scss";
import leftArrowIcon from "@/assets/icons/white-left-arrow.svg";
import { salePolicyFooter, supportInfoFooter } from "../../../../app/mock";
import { useTranslation } from "react-i18next";

export default function HPAppFooter() {
  const { t } = useTranslation();
  return (
    <div className={style.appFooter}>
      <div className={style.appFooter__wrap}>
        <Row gutter={30} className={style["appFooter__row-section"]}>
          <Col span={6} xs={24} xl={6}></Col>
          <Col
            className={style["appFooter__row-section__col"]}
            span={6}
            xs={24}
            xl={6}
          >
            <p className={style["appFooter__mission"]}>{t("footer.mission")}</p>
            <p>
              <a
                href="https://maps.app.goo.gl/DFV5eADZSa6osAxH6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t("footer.mapAddress")}</span>
                <img src={leftArrowIcon} alt="" />
              </a>
              <span>55 E Campbell Ave, Campbell, CA 95008, USA</span>
            </p>
          </Col>
          <Col
            className={style["appFooter__row-section__col"]}
            span={6}
            xs={24}
            xl={6}
          >
            <h3 className={style["appFooter__contact__title"]}>
              {t("footer.supportInfoFooter.title")}
            </h3>
            {supportInfoFooter(t).map((item, index) => (
              <p key={index} className={style["appFooter__contact__item"]}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </p>
            ))}
          </Col>
          <Col span={6} xs={24} xl={6}></Col>
          {/* <Col className={style["appFooter__row-section__col"]} span={6}>
            <h3 className={style["appFooter__contact__title"]}>
              {t("footer.salePolicyFooter.title")}
            </h3>
            {salePolicyFooter(t).map((item, index) => (
              <p key={index} className={style["appFooter__contact__item"]}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </p>
            ))}
          </Col>
          <Col className={style["appFooter__row-section__col"]} span={6}>
            <h3 className={style["appFooter__contact__title"]}>
              {t("footer.contact.title")}
            </h3>
            <p className={style["appFooter__contact__item"]}>
              {t("footer.contact.item1")}: 1900 6522
            </p>
            <p className={style["appFooter__contact__item"]}>
              {t("footer.contact.item2")}: 1800 6162
            </p>
            <p className={style["appFooter__contact__item"]}>
              {t("footer.contact.item3")}: 8h - 21h
            </p>
          </Col> */}
        </Row>
      </div>
      <p className={style.sign}>© 2023 - {t("footer.license")}</p>
    </div>
  );
}
