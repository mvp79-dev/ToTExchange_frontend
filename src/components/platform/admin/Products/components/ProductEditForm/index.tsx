import * as React from "react";
import { Checkbox, Form, Tabs } from "antd";
import SingleProductForm from "./SingleProductForm";
import { useTranslation } from "react-i18next";
import ComposedProductForm from "./ComposedProductForm";
import styles from "./styles.module.scss";
import { TProductCreationForm } from "@/interfaces/product";
import { useAppSelector } from "@/app/hooks";
import { useMemo } from "react";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import { EKeyTranslations } from "@/interfaces/common";

interface IProps {
  isEdit?: boolean;
}

function ProductEditForm({ isEdit = false }: IProps) {
  const { t, i18n } = useTranslation();
  const [activeLanguageVersion, setActiveLanguageVersion] = React.useState(
    EKeyTranslations.en
  );

  const formInstance = Form.useFormInstance<TProductCreationForm>();

  const isComposedProduct = Form.useWatch<TProductCreationForm>(
    ["isComposedProduct"],
    formInstance
  );

  const categoriesList = useAppSelector((state) => state.app.listCategory);

  const categoriesOptions = useMemo(() => {
    const categoriesChildren: Array<{
      label: string;
      options: { label: string; value: number }[];
    }> = [];

    categoriesList.forEach((category) => {
      const categoryName = transformLanguageData(
        i18n.language as EKeyTranslations,
        category.name
      );

      const subCategories: { label: string; value: number }[] = [];

      category.children.forEach((childCategory) => {
        subCategories.push({
          label: transformLanguageData(
            i18n.language as EKeyTranslations,
            childCategory.name
          ),
          value: childCategory.id,
        });
      });

      categoriesChildren.push({
        label: categoryName,
        options: subCategories,
      });
    });

    return categoriesChildren;
  }, [categoriesList, i18n.language]);

  return (
    <div>
      <Tabs
        className={styles["page-tabs"]}
        activeKey={activeLanguageVersion}
        items={[
          {
            key: EKeyTranslations.en,
            label: t("productManagement.English version"),
          },
          {
            key: EKeyTranslations.vi,
            label: t("productManagement.Vietnamese version"),
          },
        ]}
        onChange={(key) => {
          setActiveLanguageVersion(key as EKeyTranslations);
        }}
      />

      <Form.Item<TProductCreationForm>
        className={`${styles["edit-form__item"]} ${styles["composed-option"]}`}
        name="isComposedProduct"
        label={t("productManagement.Composed Product")}
        valuePropName="checked"
        hidden
      >
        <Checkbox />
      </Form.Item>

      {isComposedProduct ? (
        <ComposedProductForm
          languageVersion={activeLanguageVersion}
          categoriesOptions={categoriesOptions}
          isEdit={isEdit}
        />
      ) : (
        <SingleProductForm
          languageVersion={activeLanguageVersion}
          categoriesOptions={categoriesOptions}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}

export default ProductEditForm;
