import AdminLayout from "@/components/layouts/AdminLayout";
import styles from "./styles.module.scss";
import { Button, Form, UploadFile } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import ProductEditForm from "../components/ProductEditForm";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { TProductCreationForm } from "@/interfaces/product";
import { useUploadFile } from "@/app/hooks";
import { productAPIAdapter } from "@/helpers/adapters/ProductAdapter";
import { productService } from "@/service/productService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const defaultForm: Partial<TProductCreationForm> = {
  brand: "",
  category: undefined,
  images: [],
  inStock: "0",
  en: {
    name: "",
    description: "",
  },
  vi: {
    name: "",
    description: "",
  },
  sellPrice: "",
  isComposedProduct: false,
};

function CreateProductPage() {
  const [form] = Form.useForm<TProductCreationForm>();
  const navigator = useNavigate();
  const { uploadFile } = useUploadFile();
  const { t } = useTranslation();
  function goBackHandler() {
    navigator(-1);
  }

  const createProductErrorHandler = (error: any) => {
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

  async function createProductHandler() {
    try {
      const formData = await form.validateFields();
      const productAvatars = formData.images;
      const images = await Promise.all(
        productAvatars.map((image) => uploadFile(image.originFileObj as File))
      );

      formData.uploadedImages = images as string[];

      if (!formData.isComposedProduct) {
        const payload =
          productAPIAdapter.convertSingleProductCreateformToAPIPayload(
            formData
          );

        const [_response, error] = await productService.createProduct(payload);

        if (error) {
          return createProductErrorHandler(error);
        }

        toast.success(t("productManagement.Product create success"));
        form.resetFields();

        return;
      }

      const subProductImageLinks = await Promise.all(
        formData.products.map((product) =>
          uploadFile(product.images[0].originFileObj as File)
        )
      );
      formData.products.forEach((product, i) => {
        product.imgUrl = subProductImageLinks[i] as string;
      });

      const payload =
        productAPIAdapter.convertComposedProductCreateFormToAPIPayload(
          formData
        );

      const [_response, error] = await productService.createProduct(payload);

      if (error) {
        return createProductErrorHandler(error);
      }

      toast.success(t("productManagement.Product create success"));
      form.resetFields();
    } catch (error) {
      console.log("Validate error: ", error);
    }
  }

  return (
    <AdminLayout>
      <main className={styles["product-create-page"]}>
        <div className={styles["product-create-page__header"]}>
          <div className={styles["product-create-page__header__title"]}>
            <Button
              icon={<LeftOutlined />}
              className={styles["product-create-page__header__btn--back"]}
              onClick={goBackHandler}
            />
            <h4>{t("productManagement.Add new product")}</h4>
          </div>
          <Button
            type="primary"
            className={classNames(
              styles["product-create-page__header__btn--save"],
              styles["btn"]
            )}
            onClick={createProductHandler}
          >
            Save
          </Button>
        </div>
        <Form<TProductCreationForm>
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={defaultForm}
        >
          <ProductEditForm />
        </Form>
      </main>
    </AdminLayout>
  );
}

export default CreateProductPage;
