import { Col, Empty, Row } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createSearchParams,
  generatePath,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { EConfigKeys, EDefaultValue } from "@/app/constants/config";
import { ERoutePath } from "@/app/constants/path";
import HPPagination from "@/components/common/HPPagination";
import ProductItem from "@/components/common/ProductItem";
import UserLayout from "@/components/layouts/UserLayout";
import { productAPIAdapter } from "@/helpers/adapters/ProductAdapter";
import { IBreadcrumb } from "@/interfaces/common";
import {
  IProductDetails,
  IProductFilter,
  IProductListItem,
  TSortKey,
} from "@/interfaces/product";
import { productService } from "@/service/productService";
import CategoryHeroImage from "../shared/HeroImage";
import RegisterAffiliateBanner from "../shared/RegisterAffiliate";
import ProductListFilter from "./components/Filter";
import styles from "./style.module.scss";
import LoadingPlaceholder from "@/components/common/Loader/LoadingPlaceholder";
import classNames from "classnames";

function ProductListPage() {
  const { t } = useTranslation();
  const categories: IBreadcrumb[] = [
    { label: t("home"), link: ERoutePath.HOME, isActive: false },
    {
      label: t("header.menuUser.shop"),
      link: ERoutePath.PRODUCTS,
      isActive: true,
    },
  ];
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    currentPage: EDefaultValue.PAGINATION_PAGE,
    pageSize: EDefaultValue.PAGINATION_PAGE_SIZE,
    totalItem: 0,
  });

  const [productList, setProductList] = useState<IProductListItem[]>([]);
  const [isGettingData, setIsGettingData] = useState(false);

  const [queries, setQueries] = useSearchParams(window.location.search);

  const rfIsUpdatedQueries = useRef(false);

  const navigateToProductDetail = (itemId: number) => {
    navigate(
      generatePath(ERoutePath.PRODUCT_DETAIL, {
        id: String(itemId),
      })
    );
  };

  // Update queries without duplicate API call
  const safeUpdateQueries = useCallback(
    (queries: URLSearchParams) => {
      rfIsUpdatedQueries.current = true;
      setQueries(queries);
    },
    [setQueries]
  );

  const getProductList = useCallback(
    async (
      page = EDefaultValue.PAGINATION_PAGE,
      pageSize = EDefaultValue.PAGINATION_PAGE_SIZE,
      orderBy?: TSortKey,
      categoryParentId_in?: string,
      categoryId_in?: string,
      price_gte?: number,
      price_lte?: number
    ) => {
      const sort_by = !orderBy ? "created_at" : "price";
      setIsGettingData(true);
      const [response, error] = await productService.getProductList({
        page,
        size: pageSize,
        order_by: orderBy || "desc",
        sort_by,
        categoryParentId_in,
        categoryId_in,
        price_gte,
        price_lte,
      });

      setIsGettingData(false);
      if (error) {
        return;
      }

      setPagination((pagination) => ({
        ...pagination,
        totalItem: response!.meta.count,
      }));

      setProductList(
        response!.data.map((item: IProductDetails) =>
          productAPIAdapter.convertAPIListResponseToProductItem(item)
        )
      );
    },
    []
  );

  const productFilterHandler = useCallback(
    async (sortKey: TSortKey, filter: IProductFilter) => {
      const categoryParentId = filter.parentCategory.join(",") || undefined;
      const categoryChildrenId = filter.childrenCategory.join(",") || undefined;

      getProductList(
        pagination.currentPage,
        pagination.pageSize,
        sortKey,
        categoryParentId,
        categoryChildrenId,
        filter.price.from || 0,
        filter.price.to || undefined
      );

      const newQueries = createSearchParams(queries);

      newQueries.set(EConfigKeys.page, String(pagination.currentPage));
      newQueries.set(EConfigKeys.pageSize, String(pagination.pageSize));
      categoryParentId &&
        newQueries.set(EConfigKeys.categoryParentId, categoryParentId);
      categoryChildrenId &&
        newQueries.set(EConfigKeys.categoryChildrenId, categoryChildrenId);

      if (pagination.currentPage === EDefaultValue.PAGINATION_PAGE) {
        newQueries.delete(EConfigKeys.page);
      }

      if (pagination.pageSize === EDefaultValue.PAGINATION_PAGE_SIZE) {
        newQueries.delete(EConfigKeys.pageSize);
      }

      if (!categoryParentId) {
        newQueries.delete(EConfigKeys.categoryParentId);
      }

      if (!categoryChildrenId) {
        newQueries.delete(EConfigKeys.categoryChildrenId);
      }

      safeUpdateQueries(newQueries);
    },
    [
      getProductList,
      pagination.currentPage,
      pagination.pageSize,
      queries,
      safeUpdateQueries,
    ]
  );

  const updatePaginationHandler = (page: number, pageSize: number) => {
    setPagination({ ...pagination, currentPage: page, pageSize: pageSize });

    const newQueries = createSearchParams(queries);

    newQueries.set(EConfigKeys.page, String(page));
    newQueries.set(EConfigKeys.pageSize, String(pageSize));

    if (page === EDefaultValue.PAGINATION_PAGE) {
      newQueries.delete(EConfigKeys.page);
    }

    if (pageSize === EDefaultValue.PAGINATION_PAGE_SIZE) {
      newQueries.delete(EConfigKeys.pageSize);
    }

    safeUpdateQueries(newQueries);

    getProductList(
      page,
      pageSize,
      (newQueries.get(EConfigKeys.sortBy) as TSortKey) || undefined
    );
  };

  useEffect(() => {
    if (rfIsUpdatedQueries.current) {
      rfIsUpdatedQueries.current = false;

      return;
    }

    const currentFilter = {
      price: {
        from: Number(queries.get(EConfigKeys.filterFromPrice)) || 0,
        to: Number(queries.get(EConfigKeys.filterToPrice)) || undefined,
      },
      childrenCategory: queries.get(EConfigKeys.categoryChildrenId) || "",
      parentCategory: queries.get(EConfigKeys.categoryParentId) || "",
    };

    getProductList(
      EDefaultValue.PAGINATION_PAGE,
      EDefaultValue.PAGINATION_PAGE_SIZE,
      "desc",
      currentFilter.parentCategory,
      currentFilter.childrenCategory,
      currentFilter.price.from || 0,
      currentFilter.price.to
    );
  }, [getProductList, queries]);

  return (
    <UserLayout>
      <div>
        <CategoryHeroImage categories={categories} />
        <div className={styles["product-list__container"]}>
          <ProductListFilter
            className={styles["product-list__filter"]}
            pagination={{
              page: pagination.currentPage,
              pageSize: pagination.pageSize,
              totalItem: pagination.totalItem,
            }}
            onFilter={productFilterHandler}
            onNavigateToPage={(page) =>
              updatePaginationHandler(page, pagination.pageSize)
            }
          />
          <LoadingPlaceholder
            isLoading={isGettingData}
            className={classNames(styles["product-list__loading-container"], {
              [styles["isLoading"]]: isGettingData,
            })}
          >
            <Row gutter={[30, 36]} className={styles["product-list__list"]}>
              {productList.length > 0 ? (
                productList.map((item) => (
                  <Col
                    className={styles["product-list__list__item"]}
                    span={6}
                    xs={12}
                    md={6}
                    key={item.id}
                  >
                    <ProductItem
                      {...item}
                      onClick={() => navigateToProductDetail(item.id)}
                    />
                  </Col>
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Row>
          </LoadingPlaceholder>

          {Boolean(Number(productList.length)) && (
            <HPPagination
              {...pagination}
              className={styles["product-list__pagination"]}
              onChange={updatePaginationHandler}
            />
          )}
        </div>
        <RegisterAffiliateBanner />
      </div>
    </UserLayout>
  );
}

export default ProductListPage;
