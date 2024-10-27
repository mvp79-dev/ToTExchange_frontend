import { Pagination, PaginationProps } from "antd";
import classNames from "classnames";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

type Props = {
  showSizeChanger?: boolean;
  totalItem: number;
  pageSize: number;
  currentPage: number;
  className?: string;
  onChange: (page: number, pageSize: number) => void;
  onShowSizeChange?: (currentPage: number, pageSize: number) => void;
  isShowTotalItems?: boolean;
};

export default function HPPagination({
  showSizeChanger = true,
  totalItem,
  pageSize,
  currentPage,
  className = "",
  onChange,
  onShowSizeChange,
  isShowTotalItems = true,
}: Props) {
  const { t } = useTranslation();

  const handleChangePage = (page: number, pageSize: number) => {
    onChange(page, pageSize);
  };

  const handleShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    onShowSizeChange && onShowSizeChange(current, pageSize);
  };

  return (
    <div className={classNames(style.hpPagination, className)}>
      {isShowTotalItems && (
        <span>{t("products.filterResult", { count: totalItem })}</span>
      )}
      <Pagination
        total={totalItem}
        showSizeChanger={showSizeChanger}
        pageSize={pageSize}
        current={currentPage}
        onChange={handleChangePage}
        onShowSizeChange={handleShowSizeChange}
      />
    </div>
  );
}
