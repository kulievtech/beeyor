import { Page, Locator } from "@playwright/test";

/**
 * BaseComponent
 *
 * A lightweight base class for Playwright page objects that centralizes common operations
 * performed against a scoped Locator. Intended to be extended by concrete component/page
 * objects to reuse common interaction patterns (clicking, filling, querying text/visibility,
 * and waiting for elements) without repeatedly resolving the same root locator.
 *
 * The instance maintains:
 * - protected page: the Playwright Page instance associated with the provided Locator.
 * - protected element: the root Locator that scopes all interactions performed by this class.
 *
 */

export default class BaseComponent {
  page: Page;
  element: Locator;

  constructor(element: Locator) {
    this.element = element;
    this.page = element.page();
  }

  async click(selector: string) {
    await this.element.locator(selector).click();
  }

  async hover(selector: string) {
    await this.element.locator(selector).hover();
  }

  async fill(selector: string, value: string) {
    await this.element.locator(selector).fill(value);
  }

  async getText(selector: string, timeout = 5000): Promise<string> {
    const locator = this.element.locator(selector);
    await locator.waitFor({ state: "visible", timeout });
    return await locator.innerText();
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.element.locator(selector).isVisible();
  }

  async waitForElement(selector: string, timeout = 10000): Promise<void> {
    await this.element.locator(selector).waitFor({ state: "visible", timeout });
  }
}
