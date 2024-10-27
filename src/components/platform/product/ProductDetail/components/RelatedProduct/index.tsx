import { useTranslation } from "react-i18next";

import { Col, Row } from "antd";
import { generatePath, useNavigate } from "react-router-dom";
import { IProductListItem } from "@/interfaces/product";
import { ERoutePath } from "@/app/constants/path";
import ProductItem from "@/components/common/ProductItem";

import styles from "./styles.module.scss";

interface IProps {
  products: IProductListItem[];
}

function RelatedProductList({ products }: IProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToProductDetail = (itemId: number) => {
    navigate(
      generatePath(ERoutePath.PRODUCT_DETAIL, {
        id: String(itemId),
      })
    );
  };

  return (
    <div className={styles["related-product"]}>
      <h4 className={styles["related-product__title"]}>
        {t("products.related_products")}
      </h4>
      <Row gutter={[30, 36]}>
        {products.map((item) => (
          <Col
            className={styles["related-product__product-item"]}
            span={6}
            key={item.id}
            xs={12}
            md={6}
          >
            <ProductItem
              {...item}
              onClick={() => navigateToProductDetail(item.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default RelatedProductList;
