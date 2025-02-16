import fs from "fs";
import resetRedemptionData from "../../src/utils/resetRedemptionData";
import { REDEMPTION_FILE } from "../../src/config/filepaths";

jest.mock("fs");

describe("resetRedemptionData", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should clear the redemption data file", () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    resetRedemptionData();

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      REDEMPTION_FILE,
      JSON.stringify([], null, 2)
    );
  });

  test("should handle file write errors gracefully", () => {
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error("File system error");
    });

    expect(() => resetRedemptionData()).toThrow("File system error");
  });
});
