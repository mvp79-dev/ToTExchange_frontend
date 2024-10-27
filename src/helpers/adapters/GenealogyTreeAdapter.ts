import {
  IDescendantNodeResponse,
  IGenealogyBinaryTree,
} from "@/interfaces/referral";

class GenealogyAdapter {
  transformDescendantNodeResponseToTreeNode(
    data: IDescendantNodeResponse
  ): IGenealogyBinaryTree {
    return {
      id: data.id,
      ancestorId: data.ancestorId,
      children: [null, null],
      user: data.descendant,
      nodeDirection: data.direction,
    };
  }
}

export const genealogyAdapter = new GenealogyAdapter();
