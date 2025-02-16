import fs from "fs";
import getStaffMapping from "../../src/utils/getStaffMapping";
import { STAFF_MAPPING_FILE } from "../../src/config/filepaths";

jest.mock("fs");

describe("getStaffMapping", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return an array of staff mappings when CSV file is valid", () => {
    const mockCsvData = `staff_pass_id,team_name,created_at
STAFF_H123804820G,BASS,1623772799000
MANAGER_T999888420B,RUST,1623772799000`;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    const result = getStaffMapping();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      staff_pass_id: "STAFF_H123804820G",
      team_name: "BASS",
      created_at: new Date(1623772799000),
    });
    expect(result[1]).toEqual({
      staff_pass_id: "MANAGER_T999888420B",
      team_name: "RUST",
      created_at: new Date(1623772799000),
    });
  });

  test("should throw an error if file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => getStaffMapping()).toThrow(
      `Error: File not found at ${STAFF_MAPPING_FILE}`
    );
  });

  test("should throw an error if CSV file is empty", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      "staff_pass_id,team_name,created_at"
    );

    expect(() => getStaffMapping()).toThrow(
      "Error: CSV file must have at least one data row."
    );
  });

  test("should throw an error if headers are missing", () => {
    const mockCsvData = `invalid_header1,invalid_header2,invalid_header3
STAFF_H123804820G,BASS,1623772799000`;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    expect(() => getStaffMapping()).toThrow(
      "Error: CSV file missing required headers."
    );
  });

  test("should trim spaces and properly parse CSV values", () => {
    const mockCsvData = `staff_pass_id, team_name, created_at
 STAFF_H123804820G , BASS , 1623772799000 `;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    const result = getStaffMapping();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      staff_pass_id: "STAFF_H123804820G",
      team_name: "BASS",
      created_at: new Date(1623772799000),
    });
  });
});
