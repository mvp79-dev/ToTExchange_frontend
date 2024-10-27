import { useAppSelector } from "@/app/hooks";
import iconTreeUserActive from "@/assets/icons/tree_user_active.svg";
import iconTreeUserCancel from "@/assets/icons/tree_user_cancel.svg";
import iconTreeUserNewEnrollment from "@/assets/icons/tree_user_new_enrollment.svg";
import iconTreeUserPersonal from "@/assets/icons/tree_user_personaly_sponsored.svg";
import HPTree from "@/components/common/HPTree";
import { EDirectionType, EGenealogyType } from "@/interfaces/user";
import { userServices } from "@/service/userService";
import { TreeProps } from "antd";
import { DataNode } from "antd/es/tree";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import style from "./style.module.scss";
type Props = {};

export default function TreeView() {
  const [dataNode, setDataNode] = useState<DataNode[]>([]);
  const [keyExpanded, setKeyExpanded] = useState<string[]>([]);
  const user = useAppSelector((state) => state.user.user);

  const renderIcon = (type: EGenealogyType) => {
    switch (type) {
      case EGenealogyType.ACTIVE:
        return <img src={iconTreeUserActive} />;
      case EGenealogyType.CANCEL:
        return <img src={iconTreeUserCancel} />;
      case EGenealogyType.NEW_ENROLLMENT:
        return <img src={iconTreeUserNewEnrollment} />;
      default:
        return <img src={iconTreeUserPersonal} />;
    }
  };

  const updateTreeData = (
    list: DataNode[],
    key: React.Key,
    children: DataNode[]
  ): DataNode[] => {
    return list.map((node) => {
      if (node.key == key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      setKeyExpanded((prev) => _.uniq([...prev, `${key}`]));
      return node;
    });
  };

  const getTreeNodes = useCallback(async (nodeKey: number) => {
    const [data, error] = await userServices.getDirectDescendants(nodeKey);
    if (error) {
      return [];
    }
    if (!data?.data) return [];
    if (data?.data.length <= 0) return [];
    return data.data;
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const getNode = async () => {
      const data = await getTreeNodes(user?.id);

      const nodeData = [
        {
          title: `${user.name}`,
          key: `${user?.id}`,
          icon: <img src={iconTreeUserActive} />,
          children: data.map((el, index) => {
            return {
              title: `${el.descendant.name} (${
                el.direction === EDirectionType.LEFT ? "L" : "R"
              })`,
              key: `${el.descendantId}`,
              isLeaf: !el.descendant.hasChildren,
              icon: renderIcon(el.descendant.type),
            };
          }),
        },
      ];
      setDataNode(nodeData);
    };
    getNode();
  }, [getTreeNodes, user?.id, user?.name]);

  const onExpand: TreeProps["onExpand"] = async (selectedKeys, info) => {
    const { key } = info.node;
    if (
      key == user?.id ||
      !info.expanded ||
      keyExpanded.includes(key.toString())
    )
      return;
    const data = await getTreeNodes(Number(key));

    const nodeData = data.map((el, index) => {
      return {
        title: `${el.descendant.name} (${
          el.direction === EDirectionType.LEFT ? "L" : "R"
        })`,
        key: `${el.descendantId}`,
        isLeaf: !el.descendant.hasChildren,
        icon: renderIcon(el.descendant.type),
      };
    });
    setDataNode((origin) => updateTreeData(origin, key, nodeData));
  };

  return (
    <div className={style.treeView}>
      <HPTree
        showLine={true}
        showIcon
        onExpand={onExpand}
        treeData={dataNode}
        height={1000}
        multiple
      />
    </div>
  );
}
