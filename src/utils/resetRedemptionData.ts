import fs from "fs";
import { REDEMPTION_FILE } from "../config/filepaths";
/**
 * Reset redemption data by clearing the JSON file on program start.
 */
const resetRedemptionData = () => {
  fs.writeFileSync(REDEMPTION_FILE, JSON.stringify([], null, 2));
};

export default resetRedemptionData;
