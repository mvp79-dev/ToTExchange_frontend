import * as React from "react";
import HPModal from "@/components/common/HPModal";
import { IAdminProductListItem } from "@/interfaces/product";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";
import { productService } from "@/service/productService";
import { EPRODUCT_STATUS } from "@/app/constants/products";

interface IProps {
  deletingProduct: IAdminProductListItem | null;
  onDeleteSuccess: () => void;
  onCancelDelete: () => void;
}

function ModalConfirmDeleteProduct({
  deletingProduct,
  onDeleteSuccess,
  onCancelDelete,
}: IProps) {
  const [isDeletingProduct, setIsDeletingProduct] = React.useState(false);
  const { t } = useTranslation();

  async function deleteProducthandler() {
    setIsDeletingProduct(true);

    const requestList = [
      productService.updateProductVisibilityStatus(
        deletingProduct!.id,
        EPRODUCT_STATUS.INACTIVE
      ),
    ];

    if (!deletingProduct!.isComposed && deletingProduct!.productItems[0]) {
      requestList.push(
        productService.updateSubProductVisibilityStatus(
          deletingProduct!.productItems[0].id,
          EPRODUCT_STATUS.INACTIVE
        )
      );
    }

    const [[response, error]] = await Promise.all(requestList);

    setIsDeletingProduct(false);

    if (error) {
      console.log("deleteProducthandler", error);
      return;
    }

    onDeleteSuccess();
  }

  return (
    <HPModal
      open={!!deletingProduct}
      onClose={onCancelDelete}
      title={null}
      footer={null}
      className={styles["confirm-delete-modal"]}
    >
      <h4 className={styles["confirm-delete-modal__title"]}>
        {t("productManagement.Are you really want to delete product", {
          id: deletingProduct?.id,
        })}
      </h4>
      <div className={styles["confirm-delete-modal__info"]}>
        <p className={styles["confirm-delete-modal__info__sku"]}>
          SKU: {deletingProduct?.SKU}
        </p>
        <img
          src={deletingProduct?.productUrl[0].url}
          width={320}
          height={320}
          className={styles["confirm-delete-modal__info__img"]}
        />
      </div>
      <div className={styles["confirm-delete-modal__actions"]}>
        <Button onClick={onCancelDelete}>{t("myOrder.btn.cancel")}</Button>
        <Button
          type="primary"
          danger
          loading={isDeletingProduct}
          onClick={deleteProducthandler}
        >
          {t("productManagement.Delete")}
        </Button>
      </div>
    </HPModal>
  );
}

export default ModalConfirmDeleteProduct;
