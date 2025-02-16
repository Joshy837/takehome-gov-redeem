import fs from "fs";
import getRedemptions from "../../src/utils/getRedemptions";

jest.mock("fs");

describe("getRedemptions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return an array of redemption objects when JSON file is valid", () => {
    const mockJsonData = JSON.stringify([
      { team_name: "BASS", redeemed_at: 1623772799000 },
      { team_name: "RUST", redeemed_at: 1623872111000 },
    ]);

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockJsonData);

    const result = getRedemptions();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      team_name: "BASS",
      redeemed_at: new Date(1623772799000),
    });
    expect(result[1]).toEqual({
      team_name: "RUST",
      redeemed_at: new Date(1623872111000),
    });
  });

  test("should return an empty array if the file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = getRedemptions();
    expect(result).toEqual([]);
  });

  test("should throw an error if JSON data is invalid", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("invalid json");

    expect(() => getRedemptions()).toThrow(
      "Error loading redemptions: Unexpected token"
    );
  });

  test("should throw an error if JSON does not contain an array", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ team_name: "BASS" })
    );

    expect(() => getRedemptions()).toThrow(
      "Invalid redemption data format. Expected an array."
    );
  });

  test("should convert timestamps into Date objects", () => {
    const mockJsonData = JSON.stringify([
      { team_name: "TEAM_A", redeemed_at: 1700000000000 },
    ]);

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockJsonData);

    const result = getRedemptions();

    expect(result).toHaveLength(1);
    expect(result[0].redeemed_at).toBeInstanceOf(Date);
  });
});
