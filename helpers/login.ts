import { Page } from "@playwright/test";
import { goToLoginPage, goToStartPage } from "actions/navigation";

export async function login(page: Page) {
  // 1. Go to the start page
  await goToStartPage(page);

  // 2. Navigate to Login Page
  const loginPage = await goToLoginPage(page);
  await loginPage.waitUntilPageIsLoaded();

  // 3. Perform login
  await loginPage.inputUsername("students");
  await loginPage.inputPassword("Default1!");
  const accountPage = await loginPage.clickLoginButton();

  // 4. Wait for My Account Page to load
  await accountPage.waitUntilPageIsLoaded();

  // 5. Return MyAccountPage instance
  return accountPage;
}
