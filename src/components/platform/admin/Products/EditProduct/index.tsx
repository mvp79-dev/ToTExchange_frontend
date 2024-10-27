import * as React from "react";
import { useUploadFile } from "@/app/hooks";
import AdminLayout from "@/components/layouts/AdminLayout";
import { TProductCreationForm } from "@/interfaces/product";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Form, type UploadFile } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ProductEditForm from "../components/ProductEditForm";
import styles from "./styles.module.scss";
import { productService } from "@/service/productService";
import { productAPIAdapter } from "@/helpers/adapters/ProductAdapter";
import { EKeyTranslations } from "@/interfaces/common";
import { toast } from "react-toastify";
import { ERoutePath } from "@/app/constants/path";

function EditProductPage() {
  const [form] = Form.useForm<TProductCreationForm>();
  const navigator = useNavigate();
  const { uploadFile } = useUploadFile();
  const { t, i18n } = useTranslation();
  const params = useParams();
  const [productData, setProductData] = React.useState<
    TProductCreationForm | undefined
  >();
  const productId = params.id;

  function goBackHandler() {
    navigator(-1);
  }

  const createProductErrorHandler = (error: any) => {
    console.log("createProductErrorHandler: ", error);

    const messages = error.data.message;

    const fieldsErrors = messages
      .map((message: string) => {
        if (message.startsWith("This product name has been taken")) {
          return {
            name: "name",
            errors: [t("productManagement.This product name has been taken")],
          };
        }
        if (message.startsWith("This product SKU has been taken")) {
          return {
            name: "SKU",
            errors: [t("productManagement.This product SKU has been taken")],
          };
        }

        return undefined;
      })
      .filter(
        (field: { name: string; errors: string[] } | undefined) => !!field
      );

    form.setFields(fieldsErrors);
  };

  async function editProductHandler() {
    try {
      const formData = await form.validateFields();
      const uploadedImages: string[] = [];
      const uploadImages: UploadFile[] = [];

      formData.images.forEach((fileItem) => {
        if (fileItem.originFileObj) {
          uploadImages.push(fileItem);
        } else {
          uploadedImages.push(fileItem.url || "");
        }
      });

      const images = await Promise.all(
        uploadImages.map(
          (image) => uploadFile(image.originFileObj as File) as Promise<string>
        )
      );

      formData.uploadedImages = uploadedImages.concat(...images);

      if (!formData.vi.description) {
        formData.vi.description = productData?.vi.description ?? "";
      }

      if (!formData.en.description) {
        formData.en.description = productData?.en.description ?? "";
      }

      if (!formData.isComposedProduct) {
        const payload =
          productAPIAdapter.convertSingleProductCreateformToAPIPayload(
            formData,
            true
          );

        payload.imgUrl = formData.uploadedImages[0];

        const [_response, error] = await productService.updateProduct(
          productId as string,
          payload
        );

        if (error) {
          return createProductErrorHandler(error);
        }

        toast.success(t("productManagement.Product edit success"));
        navigator(ERoutePath.ADMIN_PRODUCTS);

        return;
      }

      const subProductImageLinks = await Promise.all(
        formData.products
          .filter((product) => !!product.images[0].originFileObj)
          .map((product) => uploadFile(product.images[0].originFileObj as File))
      );
      formData.products.forEach((product, i) => {
        product.imgUrl = subProductImageLinks[i] as string;
      });

      const payload =
        productAPIAdapter.convertComposedProductCreateFormToAPIPayload(
          formData,
          true
        );

      payload.imgUrl = formData.uploadedImages[0];

      const [_response, error] = await productService.updateProduct(
        productId as string,
        payload
      );

      if (error) {
        return createProductErrorHandler(error);
      }

      toast.success(t("productManagement.Product edit success"));
      navigator(ERoutePath.ADMIN_PRODUCTS);
    } catch (error) {
      console.log("Validate error: ", error);
    }
  }

  React.useEffect(() => {
    async function getProductDetail() {
      if (!productId) {
        return;
      }

      const [response, error] = await productService.getAdminProductDetail(
        productId
      );

      if (error) {
        console.log("Get detail product error", error);
        return;
      }

      const productForm =
        productAPIAdapter.convertDetailProductAdminAPIToProductData(
          response!.data
        );
      form.setFieldsValue(productForm);
      setProductData(productForm);
    }

    getProductDetail();
  }, [form, i18n.language, productId]);

  return (
    <AdminLayout>
      <main className={styles["product-edit-page"]}>
        <div className={styles["product-edit-page__header"]}>
          <div className={styles["product-edit-page__header__title"]}>
            <Button
              icon={<LeftOutlined />}
              className={styles["product-edit-page__header__btn--back"]}
              onClick={goBackHandler}
            />
            <h4>{t("productManagement.Edit product")}</h4>
          </div>
          <Button
            type="primary"
            className={classNames(
              styles["product-edit-page__header__btn--save"],
              styles["btn"]
            )}
            onClick={editProductHandler}
          >
            Save
          </Button>
        </div>
        <Form<TProductCreationForm>
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={productData}
        >
          <ProductEditForm isEdit />
        </Form>
      </main>
    </AdminLayout>
  );
}

export default EditProductPage;
