import { useTranslation } from "react-i18next";
import { ChevronRightIcon, FilterIcon } from "@/assets/icons";
import { Button, Divider, Dropdown, MenuProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import styles from "./Filter.module.scss";
import classNames from "classnames";
import { IProductFilter, TSortKey } from "@/interfaces/product";
import DrawerFilter from "../FilterDrawer";
import _cloneDeep from "lodash/cloneDeep";
import _capitalize from "lodash/capitalize";
import { EConfigKeys } from "@/app/constants/config";
import { useSearchParams } from "react-router-dom";

interface IProps {
  className?: string;
  pagination: {
    page: number;
    pageSize: number;
    totalItem: number;
  };

  onNavigateToPage: (page: number) => void;
  onFilter: (sortKet: TSortKey, filter: IProductFilter) => void;
}

function ProductListFilter({ className = "", pagination, onFilter }: IProps) {
  const { t } = useTranslation();
  const [isOpenDropdownSort, setIsOpenDropdownSort] = useState(false);
  const [activeSortType, setActiveSortType] = useState("");
  const [currentFilter, setCurrentFilter] = useState<IProductFilter>({
    price: {
      from: 0,
      to: 0,
    },
    childrenCategory: [],
    parentCategory: [],
  });
  const [isOpenningFilterDrawer, setIsOpenningFilterDrawer] = useState(false);

  const [queries] = useSearchParams();

  const filterOptions = useMemo(
    () => [
      { label: _capitalize(t("products.default_sort")), key: "" },
      // { label: t("products.Sort by popularity"), key: "asc" },
      // { label: t("products.Sort by latest"), key: "desc" },
      {
        label: t("products.Sort by price low to high"),
        key: "asc",
      },
      {
        label: t("products.Sort by price hight to low"),
        key: "desc",
      },
    ],
    [t]
  );

  const toggleSortDropdown = (isOpen: boolean) => {
    setIsOpenDropdownSort(isOpen);
  };

  const updateSortingHandler: MenuProps["onClick"] = (event) => {
    setActiveSortType(event.key);
    onFilter(event.key as TSortKey, currentFilter);
  };

  const filterProductHandler = (filter: IProductFilter) => {
    setCurrentFilter(_cloneDeep(filter));
    setIsOpenningFilterDrawer(false);
    onFilter(activeSortType as TSortKey, filter);
  };

  const activeSortOption = useMemo(() => {
    return (
      filterOptions.find((opt) => opt?.key === activeSortType) ??
      filterOptions[0]
    );
  }, [activeSortType, filterOptions]);

  const filterResult = useMemo(() => {
    const endItem = pagination.page * pagination.pageSize;

    return {
      fromItem:
        pagination.totalItem === 0
          ? 0
          : pagination.page + pagination.pageSize * (pagination.page - 1),
      toItem: endItem > pagination.totalItem ? pagination.totalItem : endItem,
      total: pagination.totalItem,
    };
  }, [pagination.page, pagination.pageSize, pagination.totalItem]);

  useEffect(() => {
    const queriesFilter = {
      price: {
        from: Number(queries.get(EConfigKeys.filterFromPrice)) || 0,
        to: Number(queries.get(EConfigKeys.filterToPrice)) || 0,
      },
      childrenCategory:
        queries.get(EConfigKeys.categoryChildrenId)?.split(",").map(Number) ||
        [],
      parentCategory:
        queries.get(EConfigKeys.categoryParentId)?.split(",").map(Number) || [],
    };

    setCurrentFilter(queriesFilter);
  }, [queries]);

  return (
    <div className={classNames(className, styles.filter)}>
      <div className={styles["filter__content-section"]}>
        <Button
          type="text"
          className={styles["filter__btn"]}
          onClick={() => setIsOpenningFilterDrawer(true)}
        >
          <FilterIcon />
          <span>{t("products.filter")}</span>
        </Button>

        <Divider className={styles["filter__divider"]} type="vertical" />

        <span className={styles["filter__result"]}>
          {t("products.filter_result", {
            from: filterResult.fromItem,
            to: filterResult.toItem,
            total: filterResult.total,
          })}
        </span>
      </div>

      <div className={styles["filter__content-section"]}>
        <Dropdown
          menu={{
            items: filterOptions,
            onClick: updateSortingHandler,
          }}
          open={isOpenDropdownSort}
          onOpenChange={toggleSortDropdown}
        >
          <Button type="text" className={styles["filter__filter-content"]}>
            {activeSortOption.label}
            <ChevronRightIcon />
          </Button>
        </Dropdown>
      </div>
      <DrawerFilter
        currentFilter={currentFilter}
        open={isOpenningFilterDrawer}
        onFilter={filterProductHandler}
        onClose={() => setIsOpenningFilterDrawer(false)}
      />
    </div>
  );
}

export default ProductListFilter;
