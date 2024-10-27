import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProductListFilter from "./components/ProductListFilter";
import ProductListTable from "./components/ProductListTable";

import styles from "./styles.module.scss";
import { EConfigKeys, EDefaultValue } from "@/app/constants/config";
import { IAdminProductListItem } from "@/interfaces/product";
import { productService } from "@/service/productService";
import { productAPIAdapter } from "@/helpers/adapters/ProductAdapter";
import { IPaginationTable } from "@/components/common/HPTable";
import { EAdminProductSortBy, EPRODUCT_STATUS } from "@/app/constants/products";
import _debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import ModalConfirmDeleteProduct from "./components/ModalConfirmDeleteProduct";

export default function ProductManagementAdmin() {
  const [pagination, setPagination] = React.useState({
    currentPage: EDefaultValue.PAGINATION_PAGE,
    pageSize: EDefaultValue.PAGINATION_PAGE_SIZE,
    totalItem: 0,
    totalPage: 0,
  });
  const [productList, setProductList] = React.useState<IAdminProductListItem[]>(
    []
  );
  const [deletingProduct, setDeletingProduct] =
    React.useState<IAdminProductListItem | null>(null);

  const rfIsGettingProduct = React.useRef(false);
  const rfIsUnmounted = React.useRef(false);

  const [, setQueries] = useSearchParams();

  const getProductList = React.useCallback(
    async (
      page = EDefaultValue.PAGINATION_PAGE,
      pageSize = EDefaultValue.PAGINATION_PAGE_SIZE,
      orderBy = EAdminProductSortBy.NEWEST,
      keyword?: string
    ) => {
      if (rfIsGettingProduct.current) {
        return;
      }

      rfIsGettingProduct.current = true;

      let sort_by = "created_at";
      let order_by: "asc" | "desc" = "asc";

      switch (orderBy) {
        case EAdminProductSortBy.OLDEST:
          order_by = "desc";
          break;

        case EAdminProductSortBy.PRICE_ASC:
          sort_by = "price";

          break;

        case EAdminProductSortBy.PRICE_DESC:
          sort_by = "price";
          order_by = "desc";
          break;
        case EAdminProductSortBy.RATING_ASC:
          sort_by = "starAverage";

          break;
        case EAdminProductSortBy.RATING_DESC:
          sort_by = "starAverage";
          order_by = "desc";
          break;

        default:
          break;
      }

      const [response, error] = await productService.getAdminProductList({
        page,
        size: pageSize,
        sort_by,
        order_by,
        filter: keyword || undefined,
      });

      rfIsGettingProduct.current = false;

      if (error) {
        return;
      }
      setPagination((pagination) => ({
        ...pagination,
        totalItem: response!.meta.count,
        totalPage: response!.meta.totalPages,
      }));
      setProductList(
        response!.data.map((item) =>
          productAPIAdapter.convertAPIAdminListToProductListItem(item)
        )
      );
    },
    []
  );

  const searchProductHandler = React.useMemo(() => {
    return _debounce((keyword: string) => {
      if (rfIsUnmounted.current) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);

      const sortBy = Number(searchParams.get(EConfigKeys.orderBy)) || undefined;

      if (keyword) {
        searchParams.set(EConfigKeys.searchKeyword, keyword);
      } else {
        searchParams.delete(EConfigKeys.searchKeyword);
      }

      setQueries(searchParams);

      getProductList(
        EDefaultValue.PAGINATION_PAGE,
        EDefaultValue.PAGINATION_PAGE_SIZE,
        sortBy,
        keyword
      );
    }, 500);
  }, [getProductList, setQueries]);

  const sortProductHandler = React.useCallback(
    (sortBy: EAdminProductSortBy) => {
      if (rfIsUnmounted.current) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);

      const keyword = searchParams.get(EConfigKeys.searchKeyword) ?? "";

      searchParams.set(EConfigKeys.orderBy, String(sortBy));

      setQueries(searchParams);

      getProductList(
        EDefaultValue.PAGINATION_PAGE,
        EDefaultValue.PAGINATION_PAGE_SIZE,
        sortBy,
        keyword
      );
    },
    [getProductList, setQueries]
  );

  const updatePaginationHandler = ({ page, pageSize }: IPaginationTable) => {
    setPagination({ ...pagination, currentPage: page, pageSize: pageSize });

    getProductList(page, pageSize);
  };

  const showHiddenProductHandler = React.useCallback(
    async (product: IAdminProductListItem) => {
      const requestList = [
        productService.updateProductVisibilityStatus(
          product.id,
          EPRODUCT_STATUS.ACTIVE
        ),
      ];

      if (!product.isComposed && product.productItems[0]) {
        requestList.push(
          productService.updateSubProductVisibilityStatus(
            product.productItems[0].id,
            EPRODUCT_STATUS.ACTIVE
          )
        );
      }

      const [[_response, error]] = await Promise.all(requestList);

      if (error) {
        console.log("deleteProducthandler", error);
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);

      const keyword = searchParams.get(EConfigKeys.searchKeyword) ?? "";
      const sortBy = Number(searchParams.get(EConfigKeys.orderBy)) || undefined;

      getProductList(
        pagination.currentPage,
        pagination.pageSize,
        sortBy,
        keyword
      );
    },
    [getProductList, pagination.currentPage, pagination.pageSize]
  );

  const tryDeleteProductHandler = React.useCallback(
    (product: IAdminProductListItem) => {
      setDeletingProduct(product);
    },
    []
  );

  const successDeleteProductHandler = () => {
    setDeletingProduct(null);
    const searchParams = new URLSearchParams(window.location.search);

    const keyword = searchParams.get(EConfigKeys.searchKeyword) ?? "";
    const sortBy = Number(searchParams.get(EConfigKeys.orderBy)) || undefined;

    getProductList(
      pagination.currentPage,
      pagination.pageSize,
      sortBy,
      keyword
    );
  };

  const cancelDeleteProductHandler = () => {
    setDeletingProduct(null);
  };

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const keyword = searchParams.get(EConfigKeys.searchKeyword) ?? "";
    const sortBy = Number(searchParams.get(EConfigKeys.orderBy)) || undefined;

    getProductList(
      EDefaultValue.PAGINATION_PAGE,
      EDefaultValue.PAGINATION_PAGE_SIZE,
      sortBy,
      keyword
    );

    return () => {
      rfIsUnmounted.current = true;
    };
  }, [getProductList]);

  return (
    <AdminLayout>
      <main className={styles["product-list-page"]}>
        <ProductListFilter
          onSearch={searchProductHandler}
          onSort={sortProductHandler}
        />
        <ProductListTable
          data={productList}
          pagination={{
            currentPage: pagination.currentPage,
            pageSize: pagination.pageSize,
            totalItem: pagination.totalItem,
            totalPage: pagination.totalPage,
            onChange: updatePaginationHandler,
          }}
          onDeleteProduct={tryDeleteProductHandler}
          onShowHiddenProduct={showHiddenProductHandler}
        />
      </main>

      <ModalConfirmDeleteProduct
        deletingProduct={deletingProduct}
        onCancelDelete={cancelDeleteProductHandler}
        onDeleteSuccess={successDeleteProductHandler}
      />
    </AdminLayout>
  );
}
