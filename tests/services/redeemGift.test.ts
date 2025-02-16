import redeemGift from "../../src/services/redeemGift";
import verifyRedemption from "../../src/services/verifyRedemption";
import createRedemption from "../../src/utils/createRedemption";
import {
  RedemptionStatus,
  RedeemGiftResponse,
} from "../../src/interfaces/redemptionTypes";

jest.mock("../../src/services/verifyRedemption");
jest.mock("../../src/utils/createRedemption");

describe("redeemGift", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return failure if team name is empty", () => {
    const expectedResponse: RedeemGiftResponse = {
      success: false,
      message: "Invalid input: Team name cannot be empty.",
    };

    expect(redeemGift("")).toEqual(expectedResponse);
    expect(redeemGift("   ")).toEqual(expectedResponse);
  });

  test("should return failure if team name is invalid", () => {
    const teamName = "InvalidTeam";
    const mockRedemptionStatus: RedemptionStatus = {
      isValid: false,
      canRedeem: false,
      message: `Invalid team name: '${teamName}'. This team does not exist in the staff records.`,
    };

    (verifyRedemption as jest.Mock).mockReturnValue(mockRedemptionStatus);

    const expectedResponse: RedeemGiftResponse = {
      success: false,
      message: mockRedemptionStatus.message,
    };

    expect(redeemGift(teamName)).toEqual(expectedResponse);
  });

  test("should return failure if team has already redeemed", () => {
    const teamName = "TeamA";
    const mockRedemptionStatus: RedemptionStatus = {
      isValid: true,
      canRedeem: false,
      message: `Team '${teamName}' has already redeemed.`,
    };

    (verifyRedemption as jest.Mock).mockReturnValue(mockRedemptionStatus);

    const expectedResponse: RedeemGiftResponse = {
      success: false,
      message: mockRedemptionStatus.message,
    };

    expect(redeemGift(teamName)).toEqual(expectedResponse);
  });

  test("should redeem successfully if team is eligible", () => {
    const teamName = "TeamB";
    const mockRedemptionStatus: RedemptionStatus = {
      isValid: true,
      canRedeem: true,
      message: `Team '${teamName}' has not redeemed yet. Eligible for redemption.`,
    };

    (verifyRedemption as jest.Mock).mockReturnValue(mockRedemptionStatus);
    (createRedemption as jest.Mock).mockImplementation(() => {});

    const expectedResponse: RedeemGiftResponse = {
      success: true,
      message: `Success! Team '${teamName}' has redeemed their gift.`,
    };

    expect(redeemGift(teamName)).toEqual(expectedResponse);
    expect(createRedemption).toHaveBeenCalledWith(teamName);
  });

  test("should handle leading and trailing spaces in team name", () => {
    const untrimmedTeamName = "  TrimmedTeam  ";
    const trimmedTeamName = "TrimmedTeam";

    const mockRedemptionStatus: RedemptionStatus = {
      isValid: true,
      canRedeem: true,
      message: `Team '${trimmedTeamName}' has not redeemed yet. Eligible for redemption.`,
    };

    (verifyRedemption as jest.Mock).mockReturnValue(mockRedemptionStatus);
    (createRedemption as jest.Mock).mockImplementation(() => {});

    const expectedResponse: RedeemGiftResponse = {
      success: true,
      message: `Success! Team '${trimmedTeamName}' has redeemed their gift.`,
    };

    expect(redeemGift(untrimmedTeamName)).toEqual(expectedResponse);
    expect(createRedemption).toHaveBeenCalledWith(trimmedTeamName);
  });
});
