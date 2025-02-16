export const MENU_MESSAGES = {
  menuHeader: "\nMENU:",
  menuOptions: [
    "1. Look up Staff Pass ID",
    "2. Verify if a team can redeem",
    "3. Redeem a gift",
    "Type 'exit' to quit.",
  ],
  promptOption: "Select an option (1/2/3): ",
  invalidOption: "Invalid option. Please enter 1, 2, 3, or 'exit'.",
};

export const LOOKUP_MESSAGES = {
  enterStaffId: "Enter Staff Pass ID: ",
};

export const REDEMPTION_MESSAGES = {
  enterTeamName: "Enter Team Name: ",
};

export const EXIT_MESSAGES = {
  exiting: "Exiting... Have a great day!",
  returningToMenu: "Returning to menu...\n",
};

export const SYSTEM_MESSAGES = {
  resetData: "Redemption data has been reset.\n",
  error: (error: string) => `Error: ${error}`,
};
