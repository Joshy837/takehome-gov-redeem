import getStaffMapping from "../utils/getStaffMapping";
import { LookupStaffPassResponse } from "../interfaces/staffMappingTypes";

const MESSAGES = {
  emptyInput: "Invalid input: Staff Pass ID cannot be empty.",
  notFound: (staffPassId: string) =>
    `No record found for Staff Pass ID: '${staffPassId}'.`,
  found: (staffPassId: string, teamName: string, createdAt: string) =>
    `Staff Pass ID '${staffPassId}' found.\nTeam Name: ${teamName}\nCreated At: ${createdAt}`,
};

/**
 * Look up a staff pass ID from a given list of staff mappings and return a structured response.
 * @param staffPassId The staff pass ID to search for.
 * @returns { success: boolean, message: string, data: { team_name: string, created_at: Date } | null }
 */
const lookupStaffPass = (staffPassId: string): LookupStaffPassResponse => {
  const trimmedStaffPassId = staffPassId.trim();

  if (!trimmedStaffPassId) {
    return {
      success: false,
      message: MESSAGES.emptyInput,
      data: null,
    };
  }

  const staffMappings = getStaffMapping();
  const staff = staffMappings.find(
    (entry) => entry.staff_pass_id === trimmedStaffPassId
  );

  return staff
    ? {
        success: true,
        message: MESSAGES.found(
          trimmedStaffPassId,
          staff.team_name,
          staff.created_at.toLocaleString() // Format date nicely
        ),
        data: { team_name: staff.team_name, created_at: staff.created_at },
      }
    : {
        success: false,
        message: MESSAGES.notFound(trimmedStaffPassId),
        data: null,
      };
};

export default lookupStaffPass;
