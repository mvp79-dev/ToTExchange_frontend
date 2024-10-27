import { EDefaultValue } from "@/app/constants/config";
import { ERoutePath } from "@/app/constants/path";
import { useAppSelector } from "@/app/hooks";
import store from "@/app/store";
import { cartAction } from "@/features/cart/cartSlice";
import { productAPIAdapter } from "@/helpers/adapters/ProductAdapter";
import { IBreadcrumb } from "@/interfaces/common";
import {
  IProductDetailResponse,
  IProductItem,
  IProductItemDetail,
  IProductListItem,
} from "@/interfaces/product";
import { productService } from "@/service/productService";
import { userServices } from "@/service/userService";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Tabs, TabsProps } from "antd";
import classNames from "classnames";
import _ from "lodash";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HeartIcon, ShareIcon } from "../../../../assets/icons";
import UserLayout from "../../../layouts/UserLayout";
import CategoryHeroImage from "../shared/HeroImage";
import ProductIllustration from "../shared/ProductIllustration";
import RegisterAffiliateBanner from "../shared/RegisterAffiliate";
// import AdditionalInfo from "./components/AdditionalInfo";
import ProductDescription from "./components/Description";
import RelatedProductList from "./components/RelatedProduct";
import ProductReviews from "./components/Reviews";
import styles from "./style.module.scss";
import NotFoundPage from "@/components/common/NotFound";
import { productAction } from "@/features/product/productSlice";
import LoadingPlaceholder from "@/components/common/Loader/LoadingPlaceholder";
import HPCopyText from "@/components/common/HPCopyText";
import { useMediaQuery } from "react-responsive";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";

enum EInformationTab {
  DESCRIPTION = "DESCRIPTION",
  ADDITION_INFO = "ADDITION_INFO",
  REVIEWS = "REVIEWS",
}

function ProductDetailPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { totalItems } = useAppSelector((state) => state.product.reviews);

  const isMobile = useMediaQuery({ maxWidth: EResponsiveBreakpoint.sm - 1 });

  const [imageHover, setImageHover] = useState<string>();
  const [productSub, setProductSub] = useState<IProductItem>();
  const [activeTab, setActiveTab] = useState<EInformationTab>(
    EInformationTab.DESCRIPTION
  );
  const [detailProduct, setDetailProduct] = useState<IProductItemDetail | null>(
    null
  );
  const [detailProductCode, setDetailProductCode] = useState<number>();
  const [relatedProducts, setRelatedProducts] = useState<IProductListItem[]>(
    []
  );
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.user);
  const { condition } = useAppSelector((state) => state.product.reviews);
  const [loading, setLoading] = useState<boolean>(false);

  const isComposedProduct = !!detailProduct?.isComposed;

  const categories = useMemo(() => {
    const categoriesList: IBreadcrumb[] = [
      {
        label: t("header.menuUser.home"),
        link: ERoutePath.HOME,
        isActive: false,
      },
      {
        label: t("header.menuUser.shop"),
        link: ERoutePath.PRODUCTS,
        isActive: false,
      },
    ];
    if (detailProduct?.categories) {
      categoriesList.push({
        label: _.capitalize(detailProduct.name[i18n.language] ?? ""),
        link: ERoutePath.PRODUCT_DETAIL.replace(
          ":id",
          String(detailProduct.id) || ""
        ) as ERoutePath,
        isActive: true,
      });
    }
    return categoriesList;
  }, [
    detailProduct?.categories,
    detailProduct?.id,
    detailProduct?.name,
    i18n.language,
    t,
  ]);
  const quantityLimit = useMemo(() => {
    return productSub
      ? productSub.quantity
      : detailProduct?.productItem.reduce(
          (total, item) => item.quantity + total,
          0
        );
  }, [detailProduct?.productItem, productSub]);

  const salePrice =
    (productSub ? productSub.price : detailProduct?.price ?? 0) -
    ((productSub ? productSub.price : detailProduct?.price ?? 0) *
      (detailProduct?.salePercentage ?? 0)) /
      100;

  const productInformationTabs = useMemo<TabsProps["items"]>(() => {
    return [
      {
        key: EInformationTab.DESCRIPTION,
        label: (
          <span className={styles["product-detail__addition-info__tab-title"]}>
            {t("products.description")}
          </span>
        ),
        children: (
          <ProductDescription
            description={detailProduct?.description[i18n.language] ?? ""}
            className={
              styles["product-detail__addition-info__content-container"]
            }
          />
        ),
      },
      // {
      //   key: EInformationTab.ADDITION_INFO,
      //   label: (
      //     <span className={styles["product-detail__addition-info__tab-title"]}>
      //       {t("products.additional_information")}
      //     </span>
      //   ),
      //   children: (
      //     <AdditionalInfo
      //       additionalInfo={detailProduct?.information[i18n.language] ?? ""}
      //       className={
      //         styles["product-detail__addition-info__content-container"]
      //       }
      //     />
      //   ),
      // },
      {
        key: EInformationTab.REVIEWS,
        label: (
          <span className={styles["product-detail__addition-info__tab-title"]}>
            {t("products.reviews_count", {
              count: totalItems ?? 0,
            })}
          </span>
        ),
        children: (
          <ProductReviews
            productName={detailProduct?.name[i18n.language] ?? ""}
            className={
              styles["product-detail__addition-info__content-container"]
            }
          />
        ),
      },
    ];
  }, [
    detailProduct?.description,
    detailProduct?.name,
    i18n.language,
    t,
    totalItems,
  ]);

  function switchInfoTabHandler(tab: string) {
    setActiveTab(tab as EInformationTab);
  }

  function addMoreBuyQuantity() {
    if (Number(quantityLimit || 0) <= buyQuantity) return;
    setBuyQuantity((quantity) => quantity + 1);
  }

  function reduceBuyQuantity() {
    if (buyQuantity === 1) return;
    setBuyQuantity((quantity) => (quantity === 1 ? 1 : quantity - 1));
  }

  function productQuantityUpdateHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, "");

    const quantity = Number(value);

    if (quantity > (quantityLimit || 0)) {
      setBuyQuantity(Math.trunc(quantity / 10));

      return;
    }

    setBuyQuantity(quantity);
  }

  const getProductData = useCallback(async () => {
    setLoading(true);
    const prodId = Number(productId);
    if (prodId !== 0 && !prodId) return;
    const [productData, error] = await productService.getProductDetail(prodId);
    if (error) {
      setLoading(false);
      setDetailProductCode(Number((error as any).status));
      return;
    }
    setLoading(false);
    setDetailProductCode(undefined);
    setDetailProduct(
      productAPIAdapter.convertAPIDetailResponseToDetailProductItem(
        productData as IProductDetailResponse
      )
    );
  }, [productId]);

  const addToCart = async () => {
    if (Number(quantityLimit) <= 0 || buyQuantity === 0) return;

    if (isComposedProduct && !productSub) {
      toast.error(t("products.detail.chooseRequire"));
      return;
    }
    const productId = isComposedProduct
      ? productSub?.id
      : detailProduct?.productItem[0].id;
    setIsProcessing(true);
    const [_res, error] = await userServices.addToCart({
      itemId: Number(productId),
      quantity: buyQuantity,
    });

    setIsProcessing(false);
    if (error) {
      if (error.response?.status === 400 && error.response.data.code === 2) {
        toast.error(t("products.out of stock"));
        return;
      }

      toast.error(error?.data?.message);
    } else {
      store.dispatch(cartAction.getCartInfoRequest());
      toast.success(t("cart.messageAddProductToCartSuccess"));
    }
  };

  const handleAddToCart = async () => {
    return !user ? navigate(ERoutePath.LOGIN) : await addToCart();
  };

  useEffect(() => {
    getProductData();
  }, [getProductData]);

  useEffect(() => {
    const getRelatedProducts = async () => {
      if (detailProduct?.categoryId !== 0 && !detailProduct?.categoryId) {
        return;
      }
      const [relatedProducts, error] = await productService.getProductList({
        page: EDefaultValue.PAGINATION_PAGE,
        size: EDefaultValue.PAGINATION_PAGE_SIZE,
        categoryId: String(detailProduct.categoryId),
      });

      if (error) {
        setRelatedProducts([]);
        return;
      }
      setRelatedProducts(
        relatedProducts!.data
          .filter((el) => el.id !== detailProduct.id)
          .map((product) =>
            productAPIAdapter.convertAPIListResponseToProductItem(product)
          )
      );
    };

    getRelatedProducts();
  }, [
    detailProduct,
    detailProduct?.categoryId,
    detailProduct?.id,
    i18n.language,
  ]);

  useEffect(() => {
    store.dispatch(
      productAction.getReviewsRequest({
        ...condition,
        productId: Number(productId),
      })
    );
  }, [condition, productId]);

  useEffect(() => {
    return () => {
      store.dispatch(productAction.resetConditionReviews());
    };
  }, [productId]);

  if (loading) return <LoadingPlaceholder isLoading={loading} />;

  return (
    <UserLayout>
      {detailProductCode === 404 ? (
        <NotFoundPage />
      ) : (
        <div>
          <CategoryHeroImage categories={categories} />
          <div className={styles["product-detail__container"]}>
            <div className={styles["product-detail__summary-info"]}>
              <ProductIllustration
                images={detailProduct?.images ?? []}
                imageHover={imageHover}
                subItemImage={productSub?.imgUrl}
                setProductSub={() => {
                  productSub && setProductSub({ ...productSub, imgUrl: "" });
                }}
              />
              <div
                className={styles["product-detail__summary-info__container"]}
              >
                <h3 className={styles["product-detail__summary-info__name"]}>
                  {detailProduct?.name[i18n.language] ?? ""}
                </h3>
                {!!user && (
                  <p>
                    <span
                      className={
                        styles["product-detail__summary-info__sale-price"]
                      }
                    >
                      ${salePrice}
                    </span>
                    {(detailProduct?.salePercentage ?? 0) > 0 && (
                      <span
                        className={
                          styles["product-detail__summary-info__origin-price"]
                        }
                      >
                        ${productSub ? productSub.price : detailProduct?.price}
                      </span>
                    )}
                  </p>
                )}
                <div
                  className={styles["product-detail__summary-info__describe"]}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        detailProduct?.summaryDescription[i18n.language] ?? "",
                    }}
                  />
                </div>
                {isComposedProduct && (
                  <div className={styles["product-detail__summary-subItem"]}>
                    {detailProduct?.productItem.map((el) => (
                      <div
                        onMouseEnter={() => setImageHover(el.imgUrl)}
                        onMouseLeave={() => setImageHover("")}
                        onClick={() => setProductSub(el)}
                        key={el.id}
                        className={
                          productSub?.id === el.id
                            ? styles["product-detail__summary-subItem__active"]
                            : ""
                        }
                      >
                        {el.value}
                      </div>
                    ))}
                  </div>
                )}

                {isMobile && (
                  <div>
                    {Number(quantityLimit) <= 0 ? (
                      <div
                        style={{ opacity: 0.6 }}
                        className={classNames(
                          styles["product-detail__summary-info__amount-alert"],
                          styles["product-detail__summary-info__waring"]
                        )}
                      >
                        {t("products.out of stock")}
                      </div>
                    ) : (
                      <div
                        style={{ opacity: 0.6 }}
                        className={
                          styles["product-detail__summary-info__amount-alert"]
                        }
                      >
                        {t("products.products available", {
                          count: quantityLimit,
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className={styles["product-detail__summary-info__action"]}>
                  <Input
                    addonBefore={
                      <MinusOutlined
                        onClick={reduceBuyQuantity}
                        className={buyQuantity === 1 ? styles.disable : ""}
                      />
                    }
                    addonAfter={
                      <PlusOutlined
                        onClick={addMoreBuyQuantity}
                        className={
                          Number(quantityLimit || 0) <= buyQuantity
                            ? styles.disable
                            : ""
                        }
                      />
                    }
                    value={buyQuantity}
                    onChange={productQuantityUpdateHandler}
                    className={styles["product-detail__summary-info__quantity"]}
                  />
                  <Button
                    className={classNames(
                      styles["product-detail__summary-info__add-to-cart-btn"],
                      styles["cart-btn"],
                      "ant-btn-custom"
                    )}
                    onClick={handleAddToCart}
                    loading={isProcessing}
                    disabled={isProcessing || Number(quantityLimit) <= 0}
                  >
                    {t("products.Add_to_Cart")}
                  </Button>
                  {!isMobile && (
                    <div>
                      {Number(quantityLimit) <= 0 ? (
                        <div
                          style={{ opacity: 0.6 }}
                          className={classNames(
                            styles[
                              "product-detail__summary-info__amount-alert"
                            ],
                            styles["product-detail__summary-info__waring"]
                          )}
                        >
                          {t("products.out of stock")}
                        </div>
                      ) : (
                        <div
                          style={{ opacity: 0.6 }}
                          className={
                            styles["product-detail__summary-info__amount-alert"]
                          }
                        >
                          {t("products.products available", {
                            count: quantityLimit,
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={styles["product-detail__summary-info__actions"]}
                >
                  <HPCopyText
                    icon={<></>}
                    content={window.location.origin.concat(
                      window.location.pathname
                    )}
                  >
                    <Button
                      type="text"
                      className={classNames(
                        styles["product-detail__summary-info__actions-btn"],
                        styles[
                          "product-detail__summary-info__actions-btn--share"
                        ]
                      )}
                    >
                      <ShareIcon /> {t("share")}
                    </Button>
                  </HPCopyText>
                  <Button
                    type="text"
                    className={classNames(
                      styles["product-detail__summary-info__actions-btn"],
                      styles[
                        "product-detail__summary-info__actions-btn--favourite"
                      ]
                    )}
                  >
                    <HeartIcon /> {t("products.Add_to_wishlist")}
                  </Button>
                </div>
                <div
                  className={styles["product-detail__summary-info__recap-info"]}
                >
                  <p>
                    <span>{t("products.SKU")}: </span>
                    <span>{detailProduct?.sku ?? ""}</span>
                  </p>
                  <p>
                    <span>{t("products.categories")}: </span>
                    <span>
                      {(detailProduct?.categories || []).map((category) => (
                        <Link
                          key={category.id}
                          to={generatePath(ERoutePath.PRODUCTS)}
                          className={
                            styles[
                              "product-detail__summary-info__recap-info__category-link"
                            ]
                          }
                        >
                          {category.name[i18n.language]}
                        </Link>
                      ))}
                    </span>
                  </p>
                  <p>
                    <span>{t("products.tags")}: </span>
                    <span>{(detailProduct?.tags || []).join(", ")}</span>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Tabs
                centered
                className={
                  styles["product-detail__addition-info__tab-container"]
                }
                activeKey={activeTab}
                items={productInformationTabs}
                onChange={switchInfoTabHandler}
              />
              {!user && (
                <div
                  className={
                    styles[
                      "product-detail__addition-info__content-container-link"
                    ]
                  }
                >
                  <Link
                    to={ERoutePath.REGISTER}
                    className={styles["product-detail__refer-link"]}
                  >
                    {t("products.Become a distributor to enjoy our offers")}
                  </Link>
                </div>
              )}
            </div>
            <div>
              <RelatedProductList products={relatedProducts} />
            </div>
          </div>
          <RegisterAffiliateBanner />
        </div>
      )}
    </UserLayout>
  );
}

export default ProductDetailPage;
