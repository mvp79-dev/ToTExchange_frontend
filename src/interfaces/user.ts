import { EActivityAction } from "@/app/constants/socket";
import { EBuyNftStatus } from "@/service/marketplaceService";

export interface IUserInfo {
  id: number;
  name: string;
  email: string;
  userName: string;
  phoneNumber: string;
  emailStatus: number;
  createdAt: string;
  updatedAt: string;
  refCode: string;
  balance: number;
  status: number;
  work: string;
  country: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  company: string;
  personalWebsite: string;
  birthday: null;
  preferredName: string;
  preferredLanguage: string;
  replicatedSiteText: string;
  fax: string;
  pager: string;
  other: string;
  preferredPlacement: string;
  holdingTankStatus: boolean;
  autoRenew: boolean;
  boughtNft: boolean;
  childrenRank: string;
  imageProfile: string;
  nftVipExpiration: string;
  rank: string;
  role: EUserRole;
  nftId: string;
  hasChildren?: boolean;
  isAdded?: boolean;
  point?: number;
}

export interface IMySponsor extends IUserInfo {
  buyNftAt: null;
  personalSponsoredAmount: 1;
  totalDownline: 1;
}

export interface IBodyUpdateProfile {
  firstName?: string;
  lastName?: string;
  name?: string;
  company?: string;
  personalWebsite?: string;
  birthday?: string;
  preferredName?: string;
  preferredLanguage?: string;
  holdingTankStatus: boolean;
  replicatedSiteText?: string;
}

export interface IMyNFT {
  boughtNft: boolean;
  nftVipExpiration: string;
  autoRenew: boolean;
  buyNftAt: string;
  nftId: string;
  buyNftStatus: EBuyNftStatus;
  id: number;
  customId: string;
  nftExpiredAt: Date;
  autoUpgrade: boolean;
  vipExpiredAt: null;
  userId: number;
  buyNFtTxHash: string;
  nftMintTo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInfoWithdrawToday {
  limit: number;
  withdraw_today: number;
}

export enum EUserRole {
  collaborator = "collaborator",
  customer = "customer",
  admin = "admin",
  employee = "employee",
}

export enum EDirectionType {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
}

export interface IActivityTimeline {
  id: number;
  action: number;
  status: EActivityAction;
  amount: null;
  hashCustom: string;
  description: string;
  userId: number;
  userCurrBalance: number;
  createdAt: string;
  updatedAt: string;
  nft?: IMyNFT;
  withDrawRequest: {
    amount: number;
    ActivityHistoryId: number;
    createdAt: string;
    createdBy: number;
    id: number;
    network: string;
    reason: null;
    receiverAddress: string;
    receiverEmail: string;
    receiverId: string;
    status: number;
    tokenAddress: string;
    txHash: string;
    type: number;
    updatedAt: string;
  };
}
export enum ITypeCommission {
  PRODUCT = "PRODUCT",
  NFT = "NFT",
}
export interface ICommissionHistory {
  id: number;
  userId: number;
  currentTotalCommission: number;
  previousBalance: number;
  adjustment: number;
  balanceForward: number;
  type: ITypeCommission;
  createdAt: string;
  grantor: {
    id: number;
    name: string;
    userName: string;
    email: string;
  };
}

export interface IBusinessSnapshot {
  personallySponsoredActiveAmountInRightLeg: number;
  personallySponsoredActiveAmountInLeftLeg: number;
  rightLegWeeklyCommissionAmount: number;
  leftLegWeeklyCommissionAmount: number;
}

export interface ITeamGrowthStatistics {
  distId: number;
  name: string;
  commissionActive: boolean;
  frontLineAmount: number;
  totalDownlineAmount: number;
  deepestLevel: number;
  lastThreeDaysGrowthPercentOfTeam: number;
  lastThirtyDaysGrowthPercentOfTeam: number;
  newUserAmount: number;
}

export enum EGenealogyType {
  ACTIVE = "ACTIVE",
  CANCEL = "CANCEL",
  NEW_ENROLLMENT = "NEW_ENROLLMENT",
  PERSONALLY_SPONSORED = "PERSONALLY_SPONSORED",
}
