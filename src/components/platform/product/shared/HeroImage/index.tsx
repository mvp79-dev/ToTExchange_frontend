import * as React from "react";
import HeroImg from "../../../../../assets/images/product-section-bg-img.jpg";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ChevronRightIcon } from "../../../../../assets/icons";
import classNames from "classnames";
import { IBreadcrumb } from "@/interfaces/common";

interface IProps {
  categories: IBreadcrumb[];
  title?: string;
  heroImage?: string;
}

function CategoryHeroImage({ categories, title }: IProps) {
  const { t } = useTranslation();

  return (
    <div
      className={styles["hero-img"]}
      style={{
        backgroundImage: `url(${HeroImg})`,
        backgroundSize: "160%",
        backgroundPosition: "center 62%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <h1 className={styles["hero-img__title"]}>
          {title || t("header.menuUser.shop")}
        </h1>
        <ul className={styles["hero-img__list"]}>
          {categories.map((category, i) => (
            <React.Fragment key={category.link}>
              <li>
                <NavLink
                  className={classNames(styles["hero-img__list__link"], {
                    [styles.active]: category.isActive,
                  })}
                  to={category.link}
                  end
                >
                  {category.label}
                </NavLink>
              </li>
              {i < categories.length - 1 && (
                <span>
                  <ChevronRightIcon
                    className={styles["hero-img__list__next-icon"]}
                  />
                </span>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryHeroImage;
