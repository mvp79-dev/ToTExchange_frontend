import { HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { Rate } from "antd";
import style from "./style.module.scss";
import HPButton from "../Button";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import { EKeyTranslations } from "@/interfaces/common";
import { useAppSelector } from "@/app/hooks";

interface IProductItemProps {
  salePercentage?: number;
  title: string;
  totalRating: number;
  averageRating: number;
  price: number;
  marked: boolean;
  thumbnail: string;
  onAddToCart?: () => void;
  onClick?: () => void;
}

export default function ProductItem({
  salePercentage,
  title,
  totalRating,
  averageRating,
  price,
  marked,
  thumbnail,
  onAddToCart,
  onClick,
}: IProductItemProps) {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.stopPropagation();
    onAddToCart && onAddToCart();
  };
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.user);
  return (
    <div onClick={onClick} className={style.productItem}>
      <div className={style.thumbnail}>
        {!!salePercentage && (
          <span className={style.saleOff}>{salePercentage}% OFF</span>
        )}
        <span className={style.marked}>
          <HeartFilled
            className={classNames(style.marked, marked && style.activeMarked)}
          />
        </span>
        <img src={thumbnail} alt="product thumbnail" />
      </div>
      <div className={style.content}>
        <h3 className={style.title}>
          {transformLanguageData(i18n.language as EKeyTranslations, title)}
        </h3>
      </div>
      <div className={style.buttonWrapper}>
        <div className={style.rating}>
          <Rate disabled defaultValue={averageRating} />
          <span className={style.total}>({totalRating})</span>
        </div>
        {!!user && (
          <div className={style.price}>
            <span className={style.highlightText}>${price}</span>
            {salePercentage && <span>${price}</span>}
          </div>
        )}
        <HPButton
          title={t("cart.addToCart")}
          icon={<ShoppingCartOutlined className={style.iconCart} />}
          className={style.button}
          onClick={handleAddToCart}
        />
      </div>
    </div>
  );
}
