import test, { expect } from "@playwright/test";
import { goToLoginPage, goToStartPage } from "actions/navigation";

test(
  "Plain Login - Verify a user can login",
  { tag: ["@smoke", "@regression"] },
  async ({ page }) => {
    // Go to the start page
    await goToStartPage(page);

    // Navigate to Login Page and wait until it's loaded
    const loginPage = await goToLoginPage(page);

    // Waint until Login Page is loaded
    await loginPage.waitUntilPageIsLoaded();

    // Input username
    await loginPage.inputUsername("students");

    // Input password
    await loginPage.inputPassword("Default1!");

    // Click Login button and get MyAccountPage
    const accountPage = await loginPage.clickLoginButton();

    // Wait until My Account Page is loaded
    await accountPage.waitUntilPageIsLoaded();

    // Get Log out text
    const logOutText = await accountPage.getLogOutText();

    // Verify Login was successful and Log out text is visible
    expect(logOutText).toBe("Log out");
  },
);
