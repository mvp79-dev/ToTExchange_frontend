import { useTranslation } from "react-i18next";
import HPDrawer from "@/components/common/HPDrawer";
import { Button, Slider, Tree } from "antd";
import { useState, useMemo, useEffect, useReducer } from "react";

import { useAppSelector } from "@/app/hooks";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import { IProductFilter } from "@/interfaces/product";

import { EKeyTranslations } from "@/interfaces/common";
import type { DataNode, EventDataNode } from "antd/es/tree";

import styles from "./styles.module.scss";

interface IProps {
  currentFilter: IProductFilter;
  open: boolean;
  onClose: () => void;
  onFilter: (filter: IProductFilter) => void;
}

interface ISelectCategories {
  parent: number[];
  children: Array<{
    key: number;
    parentKey: number;
  }>;
}

const selectedCategoriesInitValue: ISelectCategories = {
  children: [],
  parent: [],
};

enum ECategoryUpdateType {
  PARENT_UPDATE,
  CHILD_UPDATE,
}

type TCategoryNode = DataNode & {
  type: ECategoryUpdateType;
  parentKey?: number;
};

type TReducerUpdateParenCategory = {
  type: "TReducerUpdateParenCategory";
  data: {
    key: number;
    checked: boolean;
  };
};

type TReducerUpdateChildCategory = {
  type: "TReducerUpdateChildCategory";
  data: {
    key: number;
    checked: boolean;
    parentKey: number;
  };
};

type TReducerInitCatgoryTree = {
  type: "TReducerInitCatgoryTree";
  data: {
    parent: number[];
    children: { key: number; parentKey: number }[];
  };
};

type TReducerCategoryUpdate =
  | TReducerUpdateChildCategory
  | TReducerUpdateParenCategory
  | TReducerInitCatgoryTree;

function categoryFilterReducer(
  state: ISelectCategories,
  action: TReducerCategoryUpdate
): ISelectCategories {
  switch (action.type) {
    case "TReducerUpdateChildCategory": {
      const { children: currentChildren } = state;

      const categoryChildItem = {
        key: action.data.key,
        parentKey: action.data.parentKey,
      };

      const parent: number[] = [categoryChildItem.parentKey];
      const children: { key: number; parentKey: number }[] = action.data.checked
        ? currentChildren
            .filter((item) => item.parentKey === categoryChildItem.parentKey)
            .concat(categoryChildItem)
        : currentChildren.filter(
            (item) =>
              item.parentKey === categoryChildItem.parentKey &&
              item.key !== categoryChildItem.key
          );

      return {
        parent,
        children,
      };
    }

    case "TReducerUpdateParenCategory": {
      const { parent } = state;
      const updatedParent = action.data.checked
        ? [...parent, action.data.key]
        : parent.filter((key) => key !== action.data.key);

      return {
        children: [],
        parent: [...updatedParent],
      };
    }

    case "TReducerInitCatgoryTree": {
      return {
        children: [...action.data.children],
        parent: [...action.data.parent],
      };
    }

    default:
      break;
  }

  return state;
}

function DrawerFilter({ currentFilter, open, onClose, onFilter }: IProps) {
  const { t, i18n } = useTranslation();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedCategoriesTree, dispatchCategoryFilterReducer] = useReducer(
    categoryFilterReducer,
    selectedCategoriesInitValue
  );
  const categories = useAppSelector((state) => state.app.listCategory);

  const categoriesTree = useMemo(() => {
    const categoryTree: TCategoryNode[] = categories.map((category) => ({
      title: (
        <span>
          {transformLanguageData(
            i18n.language as EKeyTranslations,
            category.name
          )}
          <span className="category-count">({category.count ?? 0})</span>
        </span>
      ),
      children: category.children.map((childCategory) => ({
        title: (
          <span>
            {transformLanguageData(
              i18n.language as EKeyTranslations,
              childCategory.name
            )}
            <span className="category-count">
              ({childCategory.product.length ?? 0})
            </span>
          </span>
        ),
        key: childCategory.id,
        isLeaf: true,
        type: ECategoryUpdateType.CHILD_UPDATE,
        parentKey: category.id,
      })),
      key: category.id,
      type: ECategoryUpdateType.PARENT_UPDATE,
    }));

    return categoryTree;
  }, [categories, i18n.language]);

  const checkedKey = useMemo(() => {
    const parentKeys = selectedCategoriesTree.parent;
    const childrenKeys = selectedCategoriesTree.children.map(
      (childCategory) => childCategory.key
    );

    return childrenKeys.concat(...parentKeys);
  }, [selectedCategoriesTree]);

  const categoryItemSelectHandler = (nodeInfo: {
    node: EventDataNode<TCategoryNode>;
  }) => {
    const isChecked = nodeInfo.node.checked;

    if (nodeInfo.node.type === ECategoryUpdateType.PARENT_UPDATE) {
      dispatchCategoryFilterReducer({
        type: "TReducerUpdateParenCategory",
        data: {
          key: nodeInfo.node.key as number,
          checked: !isChecked,
        },
      });

      return;
    }

    dispatchCategoryFilterReducer({
      type: "TReducerUpdateChildCategory",
      data: {
        key: nodeInfo.node.key as number,
        checked: !isChecked,
        parentKey: nodeInfo.node.parentKey as number,
      },
    });
  };

  const priceRangeUpdateHandler = (range: [number, number]) => {
    setPriceRange(range);
  };

  const filterProductHandler = () => {
    onFilter({
      price: {
        from: priceRange[0],
        to: priceRange[1],
      },
      childrenCategory: selectedCategoriesTree.children.map(
        (childCategoryItem) => childCategoryItem.key
      ),
      parentCategory: selectedCategoriesTree.parent,
    });
  };

  useEffect(() => {
    if (open) {
      setPriceRange([currentFilter.price.from, currentFilter.price.to]);
      if (currentFilter.childrenCategory.length) {
        dispatchCategoryFilterReducer({
          type: "TReducerInitCatgoryTree",
          data: {
            children: currentFilter.childrenCategory.map((childCateId) => ({
              key: childCateId,
              parentKey: currentFilter.parentCategory[0],
            })),
            parent: [currentFilter.parentCategory[0]],
          },
        });
      } else {
        dispatchCategoryFilterReducer({
          type: "TReducerInitCatgoryTree",
          data: {
            children: [],
            parent: currentFilter.parentCategory,
          },
        });
      }
    }
  }, [
    currentFilter.childrenCategory,
    currentFilter.parentCategory,
    currentFilter.price.from,
    currentFilter.price.to,
    open,
  ]);

  return (
    <HPDrawer
      onClose={onClose}
      open={open}
      title={t("products.filter")}
      placement="left"
      className={styles["filter-drawer"]}
      destroyOnClose
    >
      <h5 className={styles["filter-drawer__label"]}>
        {t("products.Product Categories")}
      </h5>
      <Tree<TCategoryNode>
        className={styles["filter-drawer__categories"]}
        checkable
        checkStrictly
        treeData={categoriesTree}
        switcherIcon={null}
        expandedKeys={selectedCategoriesTree.parent}
        selectedKeys={[]}
        checkedKeys={checkedKey}
        onSelect={(_, nodeInfo) => categoryItemSelectHandler(nodeInfo)}
        onCheck={(_, nodeInfo) => categoryItemSelectHandler(nodeInfo)}
      />

      <p className={styles["filter-drawer__label"]}>
        {t("products.Filter by Price")}
      </p>
      <Slider
        className={styles["filter-drawer__price-slider"]}
        range
        value={priceRange}
        onChange={priceRangeUpdateHandler}
        min={0}
        max={1000}
      />
      <div className={styles["filter-drawer__action"]}>
        <p>
          {t("products.Price")}: ${priceRange[0]} - ${priceRange[1]}
        </p>
        <Button
          className={styles["filter-btn"]}
          type="primary"
          onClick={filterProductHandler}
        >
          {t("products.filter")}
        </Button>
      </div>
    </HPDrawer>
  );
}

export default DrawerFilter;
