import MyAccountPage from "@pages/my-account/MyAccountPage";
import { expect } from "@playwright/test";
import { test } from "fixtures/auth";

test("User can see profile", { tag: ["@smoke"] }, async ({ page, user }) => {
  const myAccountPage = new MyAccountPage(page);
  const logOutText = await myAccountPage.getLogOutText();
  console.log(`Logged in user is: ${user.username}`);
  expect(logOutText).toBe("Log out");
});
