export interface StaffMapping {
  staff_pass_id: string;
  team_name: string;
  created_at: Date;
}

export interface LookupStaffPassResponse {
  success: boolean;
  message: string;
  data: { team_name: string; created_at: Date } | null;
}
