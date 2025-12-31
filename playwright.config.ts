import { defineConfig } from "@playwright/test";

export default defineConfig({
  /* Look for test files in the "tests" directory. */
  testDir: "./tests",
  /* Makes all tests within a single file run in parallel across multiple worker processes, rather than sequentially */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  /* Prevent tests marked with .only from being run during a test execution */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  /* Automatically re-runs failed tests or flaky assertions to improve stability. */
  /* Allows tests to pass on transient network issues or temporary UI glitches */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  /* Workers are isolated OS processes that run your tests in parallel, each with its own browser instance. 
  /* Allows for faster execution by handling multiple test files or scenarios concurrently without interfering with each other */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. */
  /* A reporter transforms raw test execution data into human-readable formats. */
  /* Provides summaries, detailed failure information (errors, call stacks, screenshots, traces), and progress updates for debugging, collaboration, and CI/CD pipelines */
  reporter: process.env.CI ? "blob" : "html",
  /* Max time one test can run (30s) */
  timeout: 30 * 1000,
  /* The use object is a central place for defining options that configure 
  the browser, browser context, and general testing environment for all tests or for specific test projects */
  use: {
    /* Determines whether the browser runs with or without a visible graphical user interface (GUI). */
    headless: true,
    /* Sets the maximum time (in milliseconds) that Playwright will wait for a specific user action (like click(), fill(), check(), etc.) to complete. */
    actionTimeout: 20_000,
    /* Enables the recording of a detailed trace file (trace.zip) for your test execution. */
    /* This file can be viewed in the Playwright Trace Viewer GUI tool to help you debug test failures by providing a comprehensive, time-travel view of everything that happened during the test run. */
    trace: "off",
    /* Sets the default viewport size for all tests */
    /* This is useful for ensuring consistent test results across different screen sizes and resolutions */
    viewport: { width: 1920, height: 1080 },
    /* Used to control the recording of test execution videos for debugging and reporting purposes. By default, video recording is turned off. */
    video: "retain-on-failure",
    /* Controls the recording of screenshots for debugging and reporting purposes. By default, screenshot recording is turned off. */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        viewport: null, // disables Playwright's fixed viewport
        launchOptions: {
          args: ["--start-maximized"], // starts browser maximized
        },
      },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
