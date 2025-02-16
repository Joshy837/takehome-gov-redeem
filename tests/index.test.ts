import * as readline from "readline";
import { main } from "../src/index";
import resetRedemptionData from "../src/utils/resetRedemptionData";
import lookupStaffPass from "../src/services/lookupStaffPass";
import { MENU_MESSAGES, EXIT_MESSAGES } from "../src/config/messages";

// 1. Mock all dependencies
jest.mock("readline");
jest.mock("../src/services/lookupStaffPass");
jest.mock("../src/services/verifyRedemption");
jest.mock("../src/services/redeemGift");
jest.mock("../src/utils/resetRedemptionData");

describe("Interactive Console Application", () => {
  let mockRl: {
    question: jest.Mock;
    close: jest.Mock;
    emit?: (eventName: string, line: string) => void;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    console.log = jest.fn();

    mockRl = {
      question: jest.fn(),
      close: jest.fn(),
    };

    mockRl.emit = (eventName: string, line: string) => {
      if (eventName === "line") {
        const lastCall =
          mockRl.question.mock.calls[mockRl.question.mock.calls.length - 1];
        const callback = lastCall?.[1];
        if (callback) callback(line);
      }
    };

    // Ensure `readline.createInterface()` returns the mocked object
    (readline.createInterface as jest.Mock).mockReturnValue(mockRl);
  });

  test("should reset redemption data on startup", () => {
    main();
    expect(resetRedemptionData).toHaveBeenCalledTimes(1);
  });

  test("should handle lookupStaffPass correctly when found", () => {
    const mockStaffPassId = "BOSS_T000000001P";
    const mockResponse = {
      success: true,
      message: `Staff Pass ID '${mockStaffPassId}' found.`,
      data: {
        team_name: "TeamX",
        created_at: new Date("2024-01-10T08:00:00Z"),
      },
    };

    (lookupStaffPass as jest.Mock).mockReturnValue(mockResponse);

    main();
    mockRl.emit!("line", "1");
    mockRl.emit!("line", mockStaffPassId);

    expect(lookupStaffPass).toHaveBeenCalledWith(mockStaffPassId);
    expect(console.log).toHaveBeenCalledWith(mockResponse.message);
  });

  test("should exit the program when user types 'exit'", () => {
    main();
    mockRl.emit!("line", "exit");

    expect(console.log).toHaveBeenCalledWith(EXIT_MESSAGES.exiting);
    expect(mockRl.close).toHaveBeenCalled();
  });

  test("should display invalid option message for incorrect input", () => {
    main();
    mockRl.emit!("line", "99");

    expect(console.log).toHaveBeenCalledWith(MENU_MESSAGES.invalidOption);
  });
});
