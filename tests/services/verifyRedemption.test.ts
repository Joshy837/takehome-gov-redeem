import verifyRedemption from "../../src/services/verifyRedemption";
import getRedemptions from "../../src/utils/getRedemptions";
import getStaffMapping from "../../src/utils/getStaffMapping";
import { RedemptionStatus } from "../../src/interfaces/redemptionTypes";

jest.mock("../../src/utils/getRedemptions");
jest.mock("../../src/utils/getStaffMapping");

describe("verifyRedemption", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return failure if team name is empty", () => {
    const expectedResult: RedemptionStatus = {
      isValid: false,
      canRedeem: false,
      message: "Invalid input: Team name cannot be empty.",
    };

    expect(verifyRedemption("")).toEqual(expectedResult);
    expect(verifyRedemption("   ")).toEqual(expectedResult);
  });

  test("should return invalid team message if team does not exist", () => {
    (getStaffMapping as jest.Mock).mockReturnValue([
      { team_name: "Team A" },
      { team_name: "Team B" },
    ]);

    (getRedemptions as jest.Mock).mockReturnValue([]);

    const teamName = "NonExistentTeam";
    const expectedResult: RedemptionStatus = {
      isValid: false,
      canRedeem: false,
      message: `Invalid team name: '${teamName}'. This team does not exist in the staff records.`,
    };

    expect(verifyRedemption(teamName)).toEqual(expectedResult);
  });

  test("should return already redeemed message if the team has redeemed", () => {
    (getStaffMapping as jest.Mock).mockReturnValue([
      { team_name: "Team A" },
      { team_name: "Team B" },
    ]);

    (getRedemptions as jest.Mock).mockReturnValue([
      { team_name: "Team A", redeemed_at: Date.now() },
    ]);

    const teamName = "Team A";
    const expectedResult: RedemptionStatus = {
      isValid: true,
      canRedeem: false,
      message: `Team '${teamName}' has already redeemed.`,
    };

    expect(verifyRedemption(teamName)).toEqual(expectedResult);
  });

  test("should return eligible message if the team has not redeemed", () => {
    (getStaffMapping as jest.Mock).mockReturnValue([
      { team_name: "Team A" },
      { team_name: "Team B" },
    ]);

    (getRedemptions as jest.Mock).mockReturnValue([
      { team_name: "Team A", redeemed_at: Date.now() },
    ]);

    const teamName = "Team B";
    const expectedResult: RedemptionStatus = {
      isValid: true,
      canRedeem: true,
      message: `Team '${teamName}' has not redeemed yet. Eligible for redemption.`,
    };

    expect(verifyRedemption(teamName)).toEqual(expectedResult);
  });

  test("should handle leading and trailing spaces in team name", () => {
    (getStaffMapping as jest.Mock).mockReturnValue([
      { team_name: "TrimmedTeam" },
    ]);

    (getRedemptions as jest.Mock).mockReturnValue([]);

    const teamName = "  TrimmedTeam  "; // Input with spaces
    const expectedResult: RedemptionStatus = {
      isValid: true,
      canRedeem: true,
      message: `Team 'TrimmedTeam' has not redeemed yet. Eligible for redemption.`,
    };

    expect(verifyRedemption(teamName)).toEqual(expectedResult);
  });

  test("should return failure if team name consists only of spaces", () => {
    const expectedResult: RedemptionStatus = {
      isValid: false,
      canRedeem: false,
      message: "Invalid input: Team name cannot be empty.",
    };

    expect(verifyRedemption("   ")).toEqual(expectedResult);
  });
});
