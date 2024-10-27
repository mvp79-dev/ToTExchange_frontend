import * as React from "react";
import HPEditor from "@/components/common/HPEditor";
import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { IComposedProductCreationForm } from "@/interfaces/product";
import { UPLOAD_IMAGE_MAX_COUNT } from "@/app/constants/config";
import { EKeyTranslations } from "@/interfaces/common";
import HPModal from "@/components/common/HPModal";

const TypedFormItem = Form.Item<IComposedProductCreationForm>;

interface IProps {
  categoriesOptions: Array<{
    label: string;
    options: { label: string; value: number }[];
  }>;
  languageVersion: EKeyTranslations;
  isEdit?: boolean;
}

const SUB_PRODUCT_AVATAR_MAX_COUNT = 1;

function ComposedProductForm({
  categoriesOptions,
  languageVersion,
  isEdit,
}: IProps) {
  const { t } = useTranslation();
  const form = Form.useFormInstance<IComposedProductCreationForm>();
  const productId = form.getFieldValue("id");
  const [isShowDesriptionModal, setIsShowDesriptionModal] =
    React.useState(false);

  const cancelUpdateDescription = () => {
    setIsShowDesriptionModal(false);
    form.resetFields([languageVersion, "description"]);
  };

  return (
    <Row gutter={30}>
      <Col span={24}>
        <Row gutter={[30, 20]}>
          {!!productId && (
            <Col span={12}>
              <TypedFormItem
                className={styles["edit-form__item"]}
                label={t("productManagement.Product ID")}
                name="id"
              >
                <Input disabled />
              </TypedFormItem>
            </Col>
          )}
          <Col span={12}>
            <TypedFormItem
              className={styles["edit-form__item"]}
              label={t("products.SKU")}
              name="SKU"
              rules={[
                {
                  required: true,
                  message: t("productManagement.This field is required"),
                },
              ]}
            >
              <Input />
            </TypedFormItem>
          </Col>
          <Col span={12}>
            {Object.values(EKeyTranslations).map((language) => {
              return (
                <TypedFormItem
                  key={language}
                  hidden={language !== languageVersion}
                  className={styles["edit-form__item"]}
                  label={t("productManagement.Product name")}
                  name={[language, "name"]}
                  rules={[
                    {
                      required: true,
                      message: t("productManagement.This field is required"),
                    },
                  ]}
                >
                  <Input />
                </TypedFormItem>
              );
            })}
          </Col>
          <Col span={12}>
            <TypedFormItem
              className={styles["edit-form__item"]}
              label={t("productManagement.Category")}
              name="category"
              rules={[
                {
                  required: true,
                  message: t("productManagement.This field is required"),
                },
              ]}
            >
              <Select options={categoriesOptions} />
            </TypedFormItem>
          </Col>
          {/* <Col span={12}>
            <TypedFormItem
              className={styles["edit-form__item"]}
              label={t("productManagement.Brand")}
              name="brand"
            >
              <Input />
            </TypedFormItem>
          </Col> */}
          <Col span={12}>
            <TypedFormItem
              className={styles["edit-form__item"]}
              label={t("productManagement.Tags")}
              name="tags"
              validateTrigger={["onChange", "onBlur"]}
              rules={[{}]}
            >
              <Input />
            </TypedFormItem>
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              className={`${styles["edit-form__item__btn"]} ${styles.btn}`}
              onClick={() => {
                setIsShowDesriptionModal(true);
              }}
            >
              {t(`productManagement.${isEdit ? "Edit" : "Add"} description`)}
            </Button>
          </Col>
          <Col span={24}>
            <TypedFormItem
              className={`${styles["edit-form__item"]} ${styles["edit-form__item__upload-field"]} ${styles["show-list"]}`}
              label={t("productManagement.Product image")}
              name="images"
              valuePropName="fileList"
              rules={[
                {
                  required: true,
                  validator: (_, files: File[]) => {
                    if (files.length < 1) {
                      return Promise.reject(
                        t("productManagement.This field is required")
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                maxCount={UPLOAD_IMAGE_MAX_COUNT}
                beforeUpload={() => false}
                itemRender={(
                  originNode,
                  file,
                  files: UploadFile[],
                  { remove: removeFile }
                ) => {
                  return (
                    <div
                      className={
                        styles[
                          "edit-form__item__upload__preview-file-container"
                        ]
                      }
                    >
                      <img
                        src={file.thumbUrl}
                        alt=""
                        width={180}
                        className={
                          styles["edit-form__item__upload__preview-file"]
                        }
                      />
                      <Button icon={<CloseOutlined />} onClick={removeFile} />
                    </div>
                  );
                }}
              >
                <span className={styles["edit-form__item__upload"]}>
                  <PlusOutlined />
                  <span>{t("productManagement.Upload")}</span>
                </span>
              </Upload>
            </TypedFormItem>
          </Col>
        </Row>
        <Form.List name="products">
          {(fields, { add, remove }, { errors }) => {
            return (
              <div>
                <div className={styles["edit-form__item__custom-label"]}>
                  <p>{t("productManagement.Sub Products")}</p>
                  <Button icon={<PlusOutlined />} onClick={add} />
                </div>
                <Row gutter={[30, 20]}>
                  {fields.map(({ key, name, ...restField }, i) => {
                    return (
                      <React.Fragment key={key}>
                        <Col
                          span={24}
                          className={styles["edit-form__item__compose-title"]}
                        >
                          <p>#{i + 1}</p>
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            className={styles["edit-form__item"]}
                            label={t("productManagement.Attribute")}
                            name={[name, "value"]}
                            rules={[
                              {
                                required: true,
                                message: t(
                                  "productManagement.This field is required"
                                ),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            className={styles["edit-form__item"]}
                            label={t("productManagement.In Stock")}
                            name={[name, "quantity"]}
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[
                              {
                                required: true,
                                validator: (_, val = "") => {
                                  const inStockValue = Number(val.trim());

                                  if (!inStockValue) {
                                    return Promise.reject(
                                      t(
                                        "productManagement.This field is required"
                                      )
                                    );
                                  }

                                  return Promise.resolve();
                                },
                                validateTrigger: "onBlur",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        {/* <Col span={12}>
                          <Form.Item
                            className={styles["edit-form__item"]}
                            label={t("productManagement.Cost Price")}
                            name={[name, "cost"]}
                          >
                            <Input />
                          </Form.Item>
                        </Col> */}
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            className={styles["edit-form__item"]}
                            label={t("productManagement.Sell Price")}
                            name={[name, "price"]}
                            getValueFromEvent={(event) => {
                              const value = event.target.value;
                              const normalizedValue = value.replace(
                                /[^0-9.]/g,
                                ""
                              );

                              return normalizedValue;
                            }}
                            normalize={(value: string, prevValue: string) => {
                              const firstDotPosition = value.indexOf(".");
                              const lastDotPosition = value.lastIndexOf(".");

                              return firstDotPosition === lastDotPosition
                                ? value
                                : prevValue;
                            }}
                            rules={[
                              {
                                required: true,
                                message: t(
                                  "productManagement.This field is required"
                                ),
                              },
                            ]}
                          >
                            <Input
                              prefix="$"
                              onBlur={(event) => {
                                const enteredPrice = event.target.value;

                                if (enteredPrice.endsWith(".")) {
                                  form.setFieldValue(
                                    ["products", name, "price"],
                                    enteredPrice.slice(0, -1)
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            className={`${styles["edit-form__item"]} ${styles["edit-form__item__upload-field"]}`}
                            label={t("productManagement.Product image")}
                            name={[name, "images"]}
                            valuePropName="fileList"
                            getValueFromEvent={(e: any) => {
                              if (Array.isArray(e)) {
                                return e;
                              }
                              return e?.fileList;
                            }}
                            rules={[
                              {
                                required: true,
                                validator: (_, files: File[] = []) => {
                                  if (files.length < 1) {
                                    return Promise.reject(
                                      t(
                                        "productManagement.This field is required"
                                      )
                                    );
                                  }

                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Upload
                              listType="picture-card"
                              maxCount={SUB_PRODUCT_AVATAR_MAX_COUNT}
                              beforeUpload={() => false}
                              itemRender={(
                                originNode,
                                file,
                                files: UploadFile[],
                                { remove: removeFile }
                              ) => {
                                return (
                                  <div
                                    className={
                                      styles[
                                        "edit-form__item__upload__preview-file-container"
                                      ]
                                    }
                                  >
                                    <img
                                      src={file.thumbUrl}
                                      alt=""
                                      width={180}
                                      className={
                                        styles[
                                          "edit-form__item__upload__preview-file"
                                        ]
                                      }
                                    />
                                    <Button
                                      icon={<CloseOutlined />}
                                      onClick={removeFile}
                                    />
                                  </div>
                                );
                              }}
                            >
                              <div
                                className={styles["edit-form__item__upload"]}
                              >
                                <PlusOutlined />
                                <span>{t("productManagement.Upload")}</span>
                              </div>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    );
                  })}
                </Row>
              </div>
            );
          }}
        </Form.List>
      </Col>
      <HPModal
        open={isShowDesriptionModal}
        onClose={cancelUpdateDescription}
        onOK={() => {
          setIsShowDesriptionModal(false);
        }}
        closeIcon={<CloseOutlined />}
        title={null}
        textCustomBtnConfirm={t("productManagement.Update")}
        width={1200}
      >
        {Object.values(EKeyTranslations).map((language) => {
          return (
            <TypedFormItem
              key={language}
              hidden={language !== languageVersion}
              className={`${styles["edit-form__item"]} ${styles["description-field"]}`}
              label={t("products.description")}
              name={[language, "description"]}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  validator: () => {
                    return Promise.resolve();
                  },
                  validateTrigger: "onBlur",
                },
              ]}
              valuePropName="data"
              getValueFromEvent={(_e: any, editor: any) => {
                const data = editor.getData();

                return data;
              }}
            >
              <HPEditor className={styles["ck-editor"]} />
            </TypedFormItem>
          );
        })}
      </HPModal>
    </Row>
  );
}

export default ComposedProductForm;
