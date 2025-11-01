export type WalletTxnKind = 'play_payout' | 'bonus' | 'adjustment' | 'withdraw';

export interface WalletTxn {
  id: string;
  kind: WalletTxnKind;
  amountCents: number;
  ref: string;
  ts: string;
  notes?: string;
}

export interface WalletSummary {
  balanceCents: number;
  last30d: {
    plays: number;
    payoutCents: number;
  };
  rates: {
    perCompletePlayCentsRange: [number, number];
  };
}
