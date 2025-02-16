import fs from "fs";
import createRedemption from "../../src/utils/createRedemption";
import getRedemptions from "../../src/utils/getRedemptions";
import { REDEMPTION_FILE } from "../../src/config/filepaths";
import { Redemption } from "../../src/interfaces/redemptionTypes";

jest.mock("fs");
jest.mock("../../src/utils/getRedemptions");

describe("createRedemption", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const getWrittenData = () => {
    const [filePath, fileContents] = (fs.writeFileSync as jest.Mock).mock
      .calls[0];
    return { filePath, data: JSON.parse(fileContents) };
  };

  test("adds a new redemption and saves it", () => {
    const existingRedemptions: Redemption[] = [
      { team_name: "TEAM_A", redeemed_at: new Date("2023-12-01T12:00:00Z") },
    ];
    (getRedemptions as jest.Mock).mockReturnValue(existingRedemptions);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    createRedemption("TEAM_B");

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const { filePath, data } = getWrittenData();

    expect(filePath).toBe(REDEMPTION_FILE);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      team_name: "TEAM_A",
      redeemed_at: "2023-12-01T12:00:00.000Z",
    });
    expect(data[1]).toMatchObject({
      team_name: "TEAM_B",
      redeemed_at: expect.any(String),
    });
  });

  test("creates the first redemption entry if no data exists", () => {
    (getRedemptions as jest.Mock).mockReturnValue([]);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    createRedemption("TEAM_FIRST");

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const { filePath, data } = getWrittenData();

    expect(filePath).toBe(REDEMPTION_FILE);
    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      team_name: "TEAM_FIRST",
      redeemed_at: expect.any(String),
    });
  });

  test("handles file write errors gracefully", () => {
    (getRedemptions as jest.Mock).mockReturnValue([]);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error("File system error");
    });

    expect(() => createRedemption("TEAM_FAIL")).toThrow("File system error");
  });
});
