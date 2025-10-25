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
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).innerText()).trim();
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async waitForElement(selector: string) {
    await this.page.locator(selector).waitFor({ state: "visible" });
  }
}
