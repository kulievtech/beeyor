import test, { expect } from "@playwright/test";
import { login } from "helpers/login";

test("Helper - Verify a user can login", async ({ page }) => {
  const accountPage = await login(page);
  const logOutText = await accountPage.getLogOutText();
  expect(logOutText).toBe("Log out");
});
