import lookupStaffPass from "../../src/services/lookupStaffPass";
import getStaffMapping from "../../src/utils/getStaffMapping";
import { StaffMapping } from "../../src/interfaces/staffMappingTypes";

jest.mock("../../src/utils/getStaffMapping");

describe("lookupStaffPass", () => {
  const mockStaffMappings: StaffMapping[] = [
    {
      staff_pass_id: "STAFF_001",
      team_name: "Team Alpha",
      created_at: new Date("2024-01-10T08:00:00Z"),
    },
    {
      staff_pass_id: "STAFF_002",
      team_name: "Team Beta",
      created_at: new Date("2024-01-11T09:30:00Z"),
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return success with correct team name and formatted timestamp for a valid staff pass ID", () => {
    (getStaffMapping as jest.Mock).mockReturnValue(mockStaffMappings);

    const result = lookupStaffPass("STAFF_001");

    expect(result).toEqual({
      success: true,
      message: `Staff Pass ID 'STAFF_001' found.\nTeam Name: Team Alpha\nCreated At: ${mockStaffMappings[0].created_at.toLocaleString()}`,
      data: {
        team_name: "Team Alpha",
        created_at: mockStaffMappings[0].created_at,
      },
    });
  });

  test("should return failure message if staff pass ID is not found", () => {
    (getStaffMapping as jest.Mock).mockReturnValue(mockStaffMappings);

    const result = lookupStaffPass("STAFF_999");

    expect(result).toEqual({
      success: false,
      message: "No record found for Staff Pass ID: 'STAFF_999'.",
      data: null,
    });
  });

  test("should return failure message if staff mappings are empty", () => {
    (getStaffMapping as jest.Mock).mockReturnValue([]);

    const result = lookupStaffPass("STAFF_001");

    expect(result).toEqual({
      success: false,
      message: "No record found for Staff Pass ID: 'STAFF_001'.",
      data: null,
    });
  });

  test("should handle case sensitivity and return failure for mismatched case", () => {
    (getStaffMapping as jest.Mock).mockReturnValue(mockStaffMappings);

    const result = lookupStaffPass("staff_001"); // Lowercase, should not match

    expect(result).toEqual({
      success: false,
      message: "No record found for Staff Pass ID: 'staff_001'.",
      data: null,
    });
  });

  test("should handle leading/trailing spaces and still find the staff pass ID", () => {
    (getStaffMapping as jest.Mock).mockReturnValue(mockStaffMappings);

    const result = lookupStaffPass("  STAFF_001  "); // With spaces

    expect(result).toEqual({
      success: true,
      message: `Staff Pass ID 'STAFF_001' found.\nTeam Name: Team Alpha\nCreated At: ${mockStaffMappings[0].created_at.toLocaleString()}`,
      data: {
        team_name: "Team Alpha",
        created_at: mockStaffMappings[0].created_at,
      },
    });
  });

  test("should return failure if an empty string is provided", () => {
    (getStaffMapping as jest.Mock).mockReturnValue(mockStaffMappings);

    const result = lookupStaffPass("");

    expect(result).toEqual({
      success: false,
      message: "Invalid input: Staff Pass ID cannot be empty.",
      data: null,
    });
  });

  test("should return failure if only spaces are provided", () => {
    (getStaffMapping as jest.Mock).mockReturnValue(mockStaffMappings);

    const result = lookupStaffPass("   "); // Only spaces

    expect(result).toEqual({
      success: false,
      message: "Invalid input: Staff Pass ID cannot be empty.",
      data: null,
    });
  });
});
