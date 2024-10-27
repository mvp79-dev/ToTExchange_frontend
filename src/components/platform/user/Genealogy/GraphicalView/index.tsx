import * as React from "react";
import { generateReferalTree } from "@/app/common/generateReferalTreeNode";
import { IGenealogyBinaryTree } from "@/interfaces/referral";
import { Tree } from "react-organizational-chart";
import ReferralTreeNode from "../components/ReferralTreeNode";
import { userServices } from "@/service/userService";
import { useAppSelector } from "@/app/hooks";
import { genealogyAdapter } from "@/helpers/adapters/GenealogyTreeAdapter";
import { EDirectionType, EGenealogyType } from "@/interfaces/user";
import _cloneDeep from "lodash/cloneDeep";
import styles from "./styles.module.scss";

function GraphicalView() {
  const user = useAppSelector((state) => state.user.user);
  const [dataNodeMap, setDataNodeMap] = React.useState(() => {
    const dataMap = new Map<number, IGenealogyBinaryTree>();

    if (!user) {
      return dataMap;
    }

    dataMap.set(user.id, {
      id: user.id,
      user: {
        id: user.id,
        boughtNft: user.boughtNft,
        createdAt: user.createdAt,
        hasChildren: true,
        name: user.name,
        nftVipExpiration: user.nftVipExpiration,
        refCode: user.refCode,
        type: EGenealogyType.ACTIVE,
      },
      children: [null, null],
    });

    return dataMap;
  });

  const rfTreeNodeMap = React.useRef(new Map<number, IGenealogyBinaryTree>());

  const firstNode = React.useMemo(
    () => dataNodeMap.values().next().value,
    [dataNodeMap]
  );

  const getTreeNodes = React.useCallback(async (nodeId: number) => {
    const [data, error] = await userServices.getDirectDescendants(nodeId);

    if (error) {
      return;
    }

    const treeNodes = data!.data.map(
      genealogyAdapter.transformDescendantNodeResponseToTreeNode
    );

    const updatedTreeNode = new Map<number, IGenealogyBinaryTree>(
      rfTreeNodeMap.current
    );

    treeNodes.forEach((treeNode) => {
      updatedTreeNode.set(treeNode.user.id, _cloneDeep(treeNode));
    });

    rfTreeNodeMap.current = new Map<number, IGenealogyBinaryTree>(
      updatedTreeNode
    );

    for (const node of updatedTreeNode.values()) {
      if (node.ancestorId) {
        const direction = node.nodeDirection as EDirectionType;

        const parentNode = updatedTreeNode.get(
          node.ancestorId
        ) as IGenealogyBinaryTree;

        if (direction === EDirectionType.LEFT) {
          parentNode.children[0] = node;
        } else {
          parentNode.children[1] = node;
        }
      }
    }

    setDataNodeMap(updatedTreeNode);
  }, []);

  const treeNodes = React.useMemo(() => {
    return dataNodeMap
      .values()
      .next()
      .value?.children.map((item: IGenealogyBinaryTree | null) =>
        generateReferalTree(item, getTreeNodes)
      );
  }, [dataNodeMap, getTreeNodes]);

  React.useEffect(() => {
    if (!user?.id) {
      return;
    }

    if (dataNodeMap.size === 0) {
      const dataNode = new Map<number, IGenealogyBinaryTree>();

      dataNode.set(user.id, {
        id: user.id,
        user: {
          id: user.id,
          boughtNft: user.boughtNft,
          createdAt: user.createdAt,
          hasChildren: true,
          name: user.name,
          nftVipExpiration: user.nftVipExpiration,
          refCode: user.refCode,
          type: EGenealogyType.ACTIVE,
        },
        children: [null, null],
      });

      setDataNodeMap(dataNode);
    }

    rfTreeNodeMap.current.set(user.id, {
      id: user.id,
      user: {
        id: user.id,
        boughtNft: user.boughtNft,
        createdAt: user.createdAt,
        hasChildren: true,
        name: user.name,
        nftVipExpiration: user.nftVipExpiration,
        refCode: user.refCode,
        type: EGenealogyType.ACTIVE,
      },
      children: [null, null],
    });

    getTreeNodes(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTreeNodes, user]);

  return (
    <div className={styles["genealogy-tree"]}>
      <Tree
        lineWidth="2px"
        lineColor="#D9D9D9"
        lineBorderRadius="0"
        label={firstNode ? <ReferralTreeNode nodeInfo={firstNode} /> : null}
      >
        {treeNodes}
      </Tree>
    </div>
  );
}

export default GraphicalView;
