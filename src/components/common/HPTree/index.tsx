import { CaretDownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import { Key } from "antd/es/table/interface";
import { DataNode } from "antd/es/tree";
import { TreeLeafIcon, TreeProps } from "antd/es/tree/Tree";
import { ReactNode } from "react";
import style from "./style.module.scss";

type Props = {
  showLine?:
    | boolean
    | {
        showLeafIcon: boolean | TreeLeafIcon;
      };
  switcherIcon?: ReactNode;
  showIcon?: boolean;
  defaultExpandAll?: boolean;
  defaultExpandParent?: boolean;
  multiple?: boolean;
  defaultExpandedKeys?: Key[];
  defaultSelectedKeys?: Key[];
  onSelect?: TreeProps["onSelect"];
  treeData: DataNode[];
  height?: number;
  onExpand?: TreeProps["onExpand"];
};

export default function HPTree({
  showLine = true,
  switcherIcon = <CaretDownOutlined />,
  showIcon = true,
  defaultExpandAll = false,
  onSelect,
  treeData,
  defaultExpandParent = false,
  multiple = false,
  defaultExpandedKeys,
  defaultSelectedKeys,
  height,
  onExpand,
}: Props) {
  return (
    <div className={style.hpTree}>
      <Tree
        showLine={showLine}
        switcherIcon={switcherIcon}
        showIcon={showIcon}
        defaultExpandAll={defaultExpandAll}
        defaultExpandParent={defaultExpandParent}
        defaultExpandedKeys={defaultExpandedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelect={onSelect}
        treeData={treeData}
        height={height}
        multiple={multiple}
        onExpand={onExpand}
      />
    </div>
  );
}
