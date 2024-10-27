export interface ICommissionListItem {
  id: number;
  period: { from: string; to: string };
  totalCommission: string;
  prevBalance: string;
  adjustment: string;
  totalPayout: string;
  forwardBalance: string;
}
