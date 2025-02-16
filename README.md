# GovRedeem - Gift Redemption System

## Overview

This project is a CLI-based system designed for GovRedeem to manage team-based gift redemptions. It allows staff members to verify redemption eligibility and redeem gifts based on their team allocations.

## Problem Statement

### Scenario

It's the Christmas season, and you have been assigned to distribute gifts to teams in your department. Each team can send a representative to redeem their gift. At the redemption counter, the representative must show their staff pass ID as proof of identity.

### Data Structure

You're given a CSV file that maps staff pass IDs to team names, where each staff member belongs to only one team. The CSV file has the following format:

```
staff_pass_id team_name created_at
STAFF_H123804820G BASS 1623772799000
MANAGER_T999888420B RUST 1623772799000
BOSS_T000000001P RUST 1623872111000
```

Each team is allowed one redemption. Once redeemed, no other members from the same team can redeem again.

## Features

### Look up Staff Pass ID

Retrieves the associated team name using a staff pass ID.

### Verify if a Team Can Redeem

Checks if a team has already redeemed their gift.

### Redeem a Gift

Allows eligible teams to redeem and updates the redemption data.

### Data Persistence

Prevents duplicate redemptions.

### Input Validation

Handles leading/trailing spaces, empty inputs, and case sensitivity.

### Automated Testing

Uses Jest for unit testing.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Git (to clone the repository)

### Installation

#### Clone the Repository

Open Terminal / Command Prompt and run:

```bash
git clone https://github.com/Joshy837/takehome-gov-redeem.git
cd takehome-gov-redeem
```

#### Install Dependencies

```bash
npm install
```

### Run the Project

```bash
npm run dev
```

### Running the CLI

Once the system starts, you'll see the following interactive menu:

```
MENU:

1. Look up Staff Pass ID
2. Verify if a team can redeem
3. Redeem a gift
Type 'exit' to quit.
Select an option (1/2/3):
```

Simply enter a number (1/2/3) and follow the prompts.

### Running Tests

To run all tests, use:

```bash
npm test
```

This executes Jest test cases to ensure functionality is working correctly.

## Project Structure

```
gov-redeem/
│── node_modules/
│── src/
│   ├── config/
│   │   ├── filepaths.ts
│   │   ├── messages.ts
│   ├── data/
│   │   ├── redemption-data.json
│   │   ├── staff-id-to-team-mapping-long.csv
│   │   ├── staff-id-to-team-mapping.csv
│   ├── interfaces/
│   │   ├── redemptionTypes.ts
│   │   ├── staffMappingTypes.ts
│   ├── services/
│   │   ├── lookupStaffPass.ts
│   │   ├── redeemGift.ts
│   │   ├── verifyRedemption.ts
│   ├── types/
│   │   ├── redemptionTypes.ts
│   │   ├── staffMappingTypes.ts
│   ├── utils/
│   │   ├── createRedemption.ts
│   │   ├── getRedemptions.ts
│   │   ├── getStaffMapping.ts
│   │   ├── resetRedemptionData.ts
│   ├── index.ts
│── tests/
│   ├── services/
│   │   ├── lookupStaffPass.test.ts
│   │   ├── redeemGift.test.ts
│   │   ├── verifyRedemption.test.ts
│   ├── utils/
│   │   ├── createRedemptions.test.ts
│   │   ├── getRedemptions.test.ts
│   │   ├── getStaffMapping.test.ts
│   │   ├── resetRedemptionData.test.ts
│   ├── index.test.ts
│── .gitignore
│── jest.config.js
│── tsconfig.json
│── package-lock.json
│── package.json
│── README.md
```

## Example Usage

### Looking up a Staff Pass ID

```
Enter Staff Pass ID: BOSS_T000000001P
Staff Pass ID: BOSS_T000000001P
Team Name: RUST
Created At: 2021-06-16 10:15:11
```

### Checking if a Team Can Redeem

```
Enter Team Name: RUST
Team 'RUST' has already redeemed.
```

### Redeeming a Gift

```
Enter Team Name: BASS
Success! Team 'BASS' has redeemed their gift.
```

## Tests

### Overview

The project includes a comprehensive suite of tests to ensure the functionality of the system. The tests are written using Jest and cover various aspects of the application, including services and utility functions.

### Running Tests

To run all tests, use:

```bash
npm test
```

This command will execute all test cases and provide a summary of the test results.

### Test Structure

The tests are organized in the `tests` directory, mirroring the structure of the `src` directory. Each service and utility function has corresponding test files to validate their behavior.

### Example Test

Here is an example of a test for the `lookupStaffPass` service:

```typescript
import { lookupStaffPass } from "../../src/services/lookupStaffPass";

test("should return team name for a valid staff pass ID", () => {
  const teamName = lookupStaffPass("BOSS_T000000001P");
  expect(teamName).toBe("RUST");
});
```

This test checks if the `lookupStaffPass` function correctly returns the team name for a given staff pass ID.
