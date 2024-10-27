import ReferralTreeNode from "@/components/platform/user/Genealogy/components/ReferralTreeNode";
import { IGenealogyBinaryTree } from "@/interfaces/referral";
import { TreeNode } from "react-organizational-chart";

export function generateReferalTree(
  node: IGenealogyBinaryTree | null,
  loadMoreChildren?: (userId: number) => void
) {
  const nodeChildren: JSX.Element[] = [];

  if (node && (node.children[0] !== null || node.children[1] !== null)) {
    for (const childrenNode of node.children) {
      nodeChildren.push(generateReferalTree(childrenNode, loadMoreChildren));
    }
  }

  const treeNode = (
    <TreeNode
      className={!node ? "mute-node" : ""}
      label={
        <ReferralTreeNode nodeInfo={node} loadMoreChildren={loadMoreChildren} />
      }
      key={node?.id}
    >
      {nodeChildren}
    </TreeNode>
  );

  return treeNode;
}
