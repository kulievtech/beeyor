import BasePage from "@pages/BasePage";

/**
 * Cart Page page object
 * URL: /cart
 */

export default class CartPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement("//h1[contains(., 'Cart')]");
  }
}
