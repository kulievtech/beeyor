import { test as base, Page } from "@playwright/test";
import { login } from "utilities/login";

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

    // Provide the logged-in page to the test
    await use(page);
  },

  // Fixed user fixture
  user: async ({}, use) => {
    const userData = { username: "students", password: "Default1!" };

    // This makes `user` available in your tests
    await use(userData);
  },
});
