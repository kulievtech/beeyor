import { test as base, Page } from "@playwright/test";
import MyAccountPage from "@pages/my-account/MyAccountPage";
import { login } from "helpers/login";

/**
 * Define a custom fixture that logs in before each test.
 */

type AuthFixtures = {
  page: Page;
  user: { username: string; password: string };
};

export const test = base.extend<AuthFixtures>({
  page: async ({ page }, use) => {
    await login(page);
    await use(page);
  },

  // Fixed user fixture
  user: async ({}, use) => {
    const userData = { username: "students", password: "Default1!" };
    await use(userData); // This makes `user` available in your tests
  },
});
