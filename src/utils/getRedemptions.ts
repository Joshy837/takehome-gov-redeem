import fs from "fs";
import { Redemption } from "../interfaces/redemptionTypes";
import { REDEMPTION_FILE } from "../config/filepaths";

/**
 * Loads redemption data from a JSON file and converts `redeemed_at` into Date objects.
 * @returns An array of Redemption objects.
 */
const getRedemptions = (): Redemption[] => {
  if (!fs.existsSync(REDEMPTION_FILE)) {
    console.warn(
      `Warning: File not found at ${REDEMPTION_FILE}. Returning empty array.`
    );
    return [];
  }

  try {
    const data = fs.readFileSync(REDEMPTION_FILE, "utf8");
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid redemption data format. Expected an array.");
    }

    return parsed.map((r) => ({
      team_name: String(r.team_name),
      redeemed_at: new Date(r.redeemed_at),
    }));
  } catch (error) {
    throw new Error(
      `Error loading redemptions: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export default getRedemptions;
