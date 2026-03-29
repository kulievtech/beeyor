import BasePage from "@pages/BasePage";

/**
 * Checkout Page - page object
 * URL: /checkout
 */

export default class CheckoutPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement("//h2[contains(., 'Contact information')]");
  }

  async getCheckoutTitle(): Promise<string> {
    return await this.getText("//h2[contains(., 'Express Checkout')]");
  }

  async isCheckoutFormVisible(): Promise<boolean> {
    return await this.isVisible("//form[contains(@class, 'checkout')]");
  }

  async isPaymentMethodsVisible(): Promise<boolean> {
    return await this.isVisible("//h2[contains(., 'Express Checkout')]");
  }
}
