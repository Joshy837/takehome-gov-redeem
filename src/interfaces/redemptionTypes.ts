export interface Redemption {
  team_name: string;
  redeemed_at: Date;
}

export interface RedemptionStatus {
  isValid: boolean;
  canRedeem: boolean;
  message: string;
}

export interface RedeemGiftResponse {
  success: boolean;
  message: string;
}
