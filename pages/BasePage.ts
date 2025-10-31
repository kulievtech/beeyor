import { Page } from "@playwright/test";

/**
 * BasePage
 *
 * This page does: encapsulate common Playwright page actions and helpers used by specific page objects.
 *
 * A lightweight base class for Playwright page objects that centralizes common operations such as
 * navigation, element interaction, text retrieval, visibility checks, and waiting for elements.
 */

export default class BasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async click(selector: string) {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible" });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(selector: string, value: string) {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible" });
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  async getText(selector: string): Promise<string> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible" });
    await locator.scrollIntoViewIfNeeded();
    return (await locator.innerText()).trim();
  }

  async isVisible(selector: string): Promise<boolean> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible" });
    await locator.scrollIntoViewIfNeeded();
    return await locator.isVisible();
  }

  async waitForElement(selector: string): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible" });
    await locator.scrollIntoViewIfNeeded();
  }
}
