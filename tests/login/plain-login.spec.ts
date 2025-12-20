import test, { expect } from "@playwright/test";
import { goToLoginPage, goToStartPage } from "actions/navigation";

test(
  "Plain Login - Verify a user can login",
  { tag: ["@smoke", "@regression"] },
  async ({ page }) => {
    // 1. Go to the start page
    await goToStartPage(page);

    // 2. Navigate to Login Page and wait until it's loaded
    const loginPage = await goToLoginPage(page);

    // 3. Waint until Login Page is loaded
    await loginPage.waitUntilPageIsLoaded();

    // 4. Input username
    await loginPage.inputUsername("students");

    // 5. Input password
    await loginPage.inputPassword("Default1!");

    // 6. Click Login button and get MyAccountPage
    const accountPage = await loginPage.clickLoginButton();

    // 7. Wait until My Account Page is loaded
    await accountPage.waitUntilPageIsLoaded();

    // 8. Get Log out text
    const logOutText = await accountPage.getLogOutText();

    // 9. Verify Login was successful and Log out text is visible
    expect(logOutText).toBe("Log out");
  }
);
