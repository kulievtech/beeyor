import { Page } from "@playwright/test";

export async function login(page: Page) {
  const { goToLoginPage, goToStartPage } = await import("actions/navigation");

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
