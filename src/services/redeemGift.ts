import verifyRedemption from "./verifyRedemption";
import {
  RedemptionStatus,
  RedeemGiftResponse,
} from "../interfaces/redemptionTypes";
import createRedemption from "../utils/createRedemption";

const MESSAGES = {
  emptyInput: "Invalid input: Team name cannot be empty.",
  success: (teamName: string) =>
    `Success! Team '${teamName}' has redeemed their gift.`,
};

/**
 * Attempts to redeem a gift for a team.
 * @param teamName The name of the team attempting to redeem.
 * @returns A structured response indicating success or failure.
 */
const redeemGift = (teamName: string): RedeemGiftResponse => {
  const trimmedTeamName = teamName.trim();

  if (!trimmedTeamName) {
    return { success: false, message: MESSAGES.emptyInput };
  }

  const redemptionStatus: RedemptionStatus = verifyRedemption(trimmedTeamName);

  if (!redemptionStatus.isValid || !redemptionStatus.canRedeem) {
    return { success: false, message: redemptionStatus.message };
  }

  createRedemption(trimmedTeamName);
  return { success: true, message: MESSAGES.success(trimmedTeamName) };
};

export default redeemGift;
