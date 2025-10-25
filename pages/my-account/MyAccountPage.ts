import BasePage from "@pages/BasePage";
import CartComponent from "@pages/CartComponent";

/**
 * My Account Page page object
 * URL: /my-account
 */

export default class MyAccountPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement(
      "//nav[@aria-label='Account pages']//li/a[normalize-space(text())='Log out']"
    );
  }

  async openCart(): Promise<CartComponent> {
    await this.page.click("//button[contains(@aria-label, 'items in cart')]");
    await this.waitForElement(
      "//div[contains(@class, 'cart')][@role='dialog']"
    );

    return new CartComponent(
      this.page.locator("//div[contains(@class, 'cart')][@role='dialog']")
    );
  }

  async getLogOutText(): Promise<string> {
    try {
      return await this.getText(
        "//nav[@aria-label='Account pages']//li/a[normalize-space(text())='Log out']"
      );
    } catch (error) {
      console.error("Failed to get log out text:", error);
      return "";
    }
  }
}
