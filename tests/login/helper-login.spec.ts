import test, { expect } from "@playwright/test";
import { login } from "utilities/login";

test("Helper Login - Verify a user can login", { tag: ["@smoke"] }, async ({ page }) => {
  const accountPage = await login(page);
  const logOutText = await accountPage.getLogOutText();
  expect(logOutText).toBe("Log out");
});
