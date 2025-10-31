import { expect } from "@playwright/test";
import { test } from "fixtures/auth";

test("User can see profile", async ({ myAccountPage, user }) => {
  const logOutText = await myAccountPage.getLogOutText();
  console.log(`Logged in user is: ${user.username}`);
  expect(logOutText).toBe("Log out");
});
