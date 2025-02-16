import getRedemptions from "../utils/getRedemptions";
import getStaffMapping from "../utils/getStaffMapping";
import { RedemptionStatus } from "../interfaces/redemptionTypes";

const MESSAGES = {
  emptyInput: "Invalid input: Team name cannot be empty.",
  invalidTeam: (teamName: string) =>
    `Invalid team name: '${teamName}'. This team does not exist in the staff records.`,
  alreadyRedeemed: (teamName: string) =>
    `Team '${teamName}' has already redeemed.`,
  canRedeem: (teamName: string) =>
    `Team '${teamName}' has not redeemed yet. Eligible for redemption.`,
};

/**
 * Verify if a team can redeem based on the redemption data and a given team name.
 * @param team_name The team name to verify.
 * @returns A structured object containing isValid, canRedeem, and a message.
 */
const verifyRedemption = (team_name: string): RedemptionStatus => {
  const trimmedTeamName = team_name.trim();

  if (!trimmedTeamName) {
    return {
      isValid: false,
      canRedeem: false,
      message: MESSAGES.emptyInput,
    };
  }

  const redemptions = getRedemptions();
  const staffMappings = getStaffMapping();

  const isValid = staffMappings.some(
    (team) => team.team_name.trim() === trimmedTeamName
  );
  if (!isValid) {
    return {
      isValid: false,
      canRedeem: false,
      message: MESSAGES.invalidTeam(trimmedTeamName),
    };
  }

  const alreadyRedeemed = redemptions.some(
    (r) => r.team_name.trim() === trimmedTeamName
  );
  if (alreadyRedeemed) {
    return {
      isValid: true,
      canRedeem: false,
      message: MESSAGES.alreadyRedeemed(trimmedTeamName),
    };
  }

  return {
    isValid: true,
    canRedeem: true,
    message: MESSAGES.canRedeem(trimmedTeamName),
  };
};

export default verifyRedemption;
