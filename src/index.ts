import readline from "readline";
import lookupStaffPass from "./services/lookupStaffPass";
import verifyRedemption from "./services/verifyRedemption";
import redeemGift from "./services/redeemGift";
import resetRedemptionData from "./utils/resetRedemptionData";
import {
  MENU_MESSAGES,
  LOOKUP_MESSAGES,
  REDEMPTION_MESSAGES,
  EXIT_MESSAGES,
  SYSTEM_MESSAGES,
} from "./config/messages";

const displayMenu = () => {
  console.log(MENU_MESSAGES.menuHeader);
  MENU_MESSAGES.menuOptions.forEach((option) => console.log(option));
};

const promptUser = (
  rl: readline.Interface,
  question: string,
  callback: (input: string) => void
) => {
  rl.question(question, (input) => {
    const trimmedInput = input.trim();
    if (trimmedInput.toLowerCase() === "exit") {
      console.log(EXIT_MESSAGES.exiting);
      rl.close();
    } else {
      callback(trimmedInput);
    }
  });
};

const handleUserInput = (rl: readline.Interface, option: string) => {
  switch (option) {
    case "1":
      promptUser(rl, LOOKUP_MESSAGES.enterStaffId, (staffPassId) => {
        console.log(lookupStaffPass(staffPassId).message);
        promptMenu(rl);
      });
      break;
    case "2":
      promptUser(rl, REDEMPTION_MESSAGES.enterTeamName, (teamName) => {
        console.log(verifyRedemption(teamName).message);
        promptMenu(rl);
      });
      break;
    case "3":
      promptUser(rl, REDEMPTION_MESSAGES.enterTeamName, (teamName) => {
        console.log(redeemGift(teamName).message);
        promptMenu(rl);
      });
      break;
    default:
      console.log(MENU_MESSAGES.invalidOption);
      promptMenu(rl);
  }
};

const promptMenu = (rl: readline.Interface) => {
  displayMenu();
  promptUser(rl, MENU_MESSAGES.promptOption, (option) =>
    handleUserInput(rl, option)
  );
};

export const main = async () => {
  try {
    resetRedemptionData();
    console.log(SYSTEM_MESSAGES.resetData);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    promptMenu(rl);
  } catch (error) {
    console.error(
      SYSTEM_MESSAGES.error(
        error instanceof Error ? error.message : String(error)
      )
    );
  }
};

if (require.main === module) {
  main();
}
