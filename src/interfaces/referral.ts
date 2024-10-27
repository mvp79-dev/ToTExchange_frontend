import { EDirectionType, EGenealogyType } from "./user";

export interface IReferralTreeNode {
  id: number;
  name: string;
  refCode: number | string;

  children?: IReferralTreeNode[];
}

interface IGenealogyNode {
  id: number;
  nftVipExpiration: string | null;
  name: string;
  boughtNft: boolean;
  refCode: string;
  createdAt: string;
  type: EGenealogyType;
  hasChildren: boolean;
}

export interface IGenealogyBinaryTree {
  id: number;
  user: IGenealogyNode;
  ancestorId?: number;
  nodeDirection?: EDirectionType;
  children: [null | IGenealogyBinaryTree, null | IGenealogyBinaryTree];
}

export interface IDescendantNodeResponse {
  id: number;
  ancestorId: number;
  descendantId: number;
  pathLength: number;
  direction: EDirectionType;
  descendant: IGenealogyNode;
}
