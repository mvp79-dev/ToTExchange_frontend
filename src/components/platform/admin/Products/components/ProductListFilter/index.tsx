import {
  CaretDownOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { ERoutePath } from "@/app/constants/path";
import { EAdminProductSortBy } from "@/app/constants/products";
import * as React from "react";
import { EConfigKeys } from "@/app/constants/config";

interface IProps {
  onSearch: (keyword: string) => void;
  onSort: (sortBy: EAdminProductSortBy) => void;
}

function ProductListFilter({ onSearch, onSort }: IProps) {
  const { t } = useTranslation();
  const rfIsMounted = React.useRef(false);
  const [queries] = useSearchParams();

  const [keyword, setKeyword] = React.useState(() => {
    const keyword = queries.get(EConfigKeys.searchKeyword) ?? "";

    return keyword;
  });

  const [sortBy, setSortBy] = React.useState<EAdminProductSortBy>(() => {
    const sortBy =
      Number(queries.get(EConfigKeys.sortBy)) || EAdminProductSortBy.NEWEST;

    return sortBy;
  });

  React.useEffect(() => {
    if (!rfIsMounted.current) {
      rfIsMounted.current = true;
      return;
    }

    onSearch(keyword);
  }, [keyword, onSearch]);

  React.useEffect(() => {
    onSort(sortBy);
  }, [onSort, sortBy]);

  return (
    <div className={styles["product-filter"]}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Product search"
        className={styles["product-filter__search-bar"]}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <div className={styles["product-filter__actions"]}>
        <div>
          <span>Sort by</span>
          <Select
            value={sortBy}
            className={styles["product-filter__sort-by-select"]}
            options={[
              {
                value: EAdminProductSortBy.NEWEST,
                label: t("products.Sort by latest"),
              },
              {
                value: EAdminProductSortBy.OLDEST,
                label: t("productManagement.Oldest"),
              },
              {
                value: EAdminProductSortBy.PRICE_ASC,
                label: t("products.Sort by price low to high"),
              },
              {
                value: EAdminProductSortBy.PRICE_DESC,
                label: t("products.Sort by price hight to low"),
              },
              {
                value: EAdminProductSortBy.RATING_DESC,
                label: t("productManagement.Least rating"),
              },
              {
                value: EAdminProductSortBy.RATING_ASC,
                label: t("productManagement.Highest rating"),
              },
            ]}
            suffixIcon={<CaretDownOutlined />}
            onChange={(event) => setSortBy(event)}
          />
        </div>
        <Link
          to={ERoutePath.ADMIN_PRODUCTS_CREATE}
          className={styles["product-filter__create-link"]}
        >
          <PlusOutlined /> <span>Add product</span>
        </Link>
      </div>
    </div>
  );
}

export default ProductListFilter;
