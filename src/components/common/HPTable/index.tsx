import { Table, TablePaginationConfig, TableProps } from "antd";
import React, { ReactNode } from "react";
import style from "./style.module.scss";

export interface IColumn {
  title: string | ReactNode;
  dataIndex?: string;
  render?: any;
  key?: string;
  fixed?: any;
  width?: number | string;
  sorter?: (a: any, b: any) => any;
}

export enum TablePaginationPosition {
  "topLeft" = "topLeft",
  "topCenter" = "topCenter",
  "topRight" = "topRight",
  "bottomLeft" = "bottomLeft",
  "bottomCenter" = "bottomCenter",
  "bottomRight" = "bottomRight",
}
export interface IPaginationTable {
  page: number;
  pageSize: number;
}

export type PropsHpTable<T = any> = TableProps<T> & {
  columns: IColumn[];
  data: T[];
  loading?: boolean;
  className?: string;
  onRowClick?: (d: T, key?: string | number) => void;
  rowKey?: string | ((d: any) => string);
  summary?: (d: any) => React.ReactNode;
  rowSelection?: T;
  pagination?: {
    isShow: boolean;
    pageSize: number;
    totalPage: number;
    page: number;
    totalItem?: number;
    position?: TablePaginationPosition[];
    pageSizeOptions?: number[] | string[];
  };
  onChangePagination?: (data: IPaginationTable) => void;
};

export default function HPTable({
  columns,
  data,
  loading,
  className,
  onRowClick,
  rowKey,
  summary,
  rowSelection,
  pagination,
  onChangePagination,
  ...props
}: PropsHpTable) {
  return (
    <div className={style.table}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        className={className}
        summary={summary}
        rowSelection={rowSelection}
        showSorterTooltip={false}
        rowKey={rowKey}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => onRowClick && onRowClick(record, rowIndex), // click row
          };
        }}
        onChange={(p: TablePaginationConfig) => {
          p.current &&
            p.pageSize &&
            onChangePagination &&
            onChangePagination({
              page: p.pageSize !== pagination?.pageSize ? 1 : p.current,
              pageSize: p.pageSize,
            });
        }}
        pagination={
          pagination?.isShow
            ? {
                position: pagination.position ?? ["bottomLeft"],
                showSizeChanger: true,
                pageSizeOptions: pagination.pageSizeOptions ?? [
                  10, 20, 40, 80, 160,
                ],
                pageSize: pagination.pageSize,
                current: pagination.page,
                total:
                  pagination.totalItem ??
                  pagination.pageSize * pagination.totalPage,
                locale: { items_per_page: " / page" },
              }
            : false
        }
        {...props}
      />
    </div>
  );
}
