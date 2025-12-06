import BasePage from "@pages/BasePage";

/**
 * Checkout Page - page object
 * URL: /checkout
 */

export default class CheckoutPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement("//p[@role='heading'][contains(., 'Order summary')]");
  }
}
