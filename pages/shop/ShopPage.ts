import BasePage from "@pages/BasePage";
import CartComponent from "@pages/CartComponent";

/**
 * Dashboard Page page object
 * URL: /dashboard
 */

export default class ShopPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement("//h2[contains(., 'Trending Products')]");
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
}
