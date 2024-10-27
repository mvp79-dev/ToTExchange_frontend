import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button, Tag } from "antd";
import { IAdminProductListItem } from "@/interfaces/product";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import { EKeyTranslations } from "@/interfaces/common";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.scss";
import TableAdmin from "../../../TableAdmin";
import { EPRODUCT_STATUS } from "@/app/constants/products";
import { generatePath, useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";

interface IProps {
  data: IAdminProductListItem[];
  pagination: {
    currentPage: number;
    totalPage: number;
    pageSize: number;
    totalItem?: number;
    onChange: (page: { page: number; pageSize: number }) => void;
  };

  onDeleteProduct: (product: IAdminProductListItem) => void;
  onShowHiddenProduct: (productId: IAdminProductListItem) => void;
}

function ProductListTable({
  data,
  pagination,
  onDeleteProduct,
  onShowHiddenProduct,
}: IProps) {
  const { i18n, t } = useTranslation();
  const navigator = useNavigate();

  const columns = React.useMemo(() => {
    return [
      {
        title: "ID",
        key: "id",
        dataIndex: "id",
        render(_v: string, productItem: IAdminProductListItem) {
          return (
            <img
              className={styles["product-list-item__avatar"]}
              src={productItem.productUrl[0].url}
              alt={productItem.name}
              width={42}
              height={42}
            />
          );
        },
      },
      {
        title: "SKU",
        key: "SKU",
        dataIndex: "SKU",
      },
      {
        title: t("products.comment_post_comment_username"),
        key: "name",
        dataIndex: "name",
        render: (name: string) => (
          <span>
            {transformLanguageData(i18n.language as EKeyTranslations, name)}
          </span>
        ),
      },
      {
        title: t("productManagement.Sell Price"),
        key: "price",
        dataIndex: "price",
        width: "10%",
        render: (price: number) => <span>${price}</span>,
      },
      {
        title: t("productManagement.Sold"),
        key: "sold",
        width: "10%",
        dataIndex: "sold",
      },
      {
        title: t("productManagement.In Stock"),
        key: "inStock",
        width: "10%",
        dataIndex: "inStock",
      },
      {
        title: t("productManagement.Rating"),
        key: "starAverage",
        dataIndex: "starAverage",
        render: (rating: number) => {
          if (rating) {
            return (
              <span>
                <StarOutlined /> {rating}
              </span>
            );
          }

          return <span>---</span>;
        },
      },
      {
        title: t("adminOrders.tableColumn.status"),
        key: "status",
        dataIndex: "status",
        render: (status: EPRODUCT_STATUS) => {
          return status === EPRODUCT_STATUS.INACTIVE ? (
            <Tag color="#f5222d">{t("productManagement.inactive")}</Tag>
          ) : (
            <Tag color="#9dca00">{t("productManagement.active")}</Tag>
          );
        },
      },
      {
        title: " ",
        key: "action",
        render: (_v: unknown, productItem: IAdminProductListItem) => (
          <div className={styles["product-list-item__actions"]}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                navigator(
                  generatePath(ERoutePath.ADMIN_PRODUCTS_EDIT, {
                    id: String(productItem.id),
                  })
                );
              }}
            />
            <Button
              icon={
                productItem.status === EPRODUCT_STATUS.ACTIVE ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeOutlined />
                )
              }
              onClick={() => {
                if (productItem.status === EPRODUCT_STATUS.ACTIVE) {
                  onDeleteProduct(productItem);
                  return;
                }

                onShowHiddenProduct(productItem);
              }}
            />
          </div>
        ),
      },
    ];
  }, [i18n.language, navigator, onDeleteProduct, onShowHiddenProduct, t]);

  return (
    <TableAdmin
      className={styles["product-list"]}
      rowSelection={{}}
      data={data}
      columns={columns}
      rowKey="id"
      onChangePagination={pagination.onChange}
      pagination={{
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItem: pagination.totalItem,
        isShow: true,
      }}
    />
  );
}

export default ProductListTable;
