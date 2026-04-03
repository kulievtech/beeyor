import BaseComponent from "@pages/BaseComponent";
import BasePage from "@pages/BasePage";
import CheckoutPage from "@pages/checkout/CheckoutPage";
import parseNumeric from "utilities/parseNumeric";

/**
 * Cart Page - page object
 * URL: /cart
 */

export default class CartPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement("//h1[contains(., 'Cart')]");
  }

  getCartItemsTable(): CartItemsTable {
    const tableLocator = this.page.locator(
      "//table[contains(@class, 'cart-items')]",
    );
    return new CartItemsTable(tableLocator);
  }

  async getSubtotal(): Promise<number> {
    const priceText = await this.getText(
      "//div[contains(@class, 'cart__sidebar')]//div[contains(@class, 'totals-item')][contains(., 'Subtotal')]//span[contains(@class, 'formatted-money-amount')]",
    );
    return parseNumeric(priceText);
  }

  async getTotal(): Promise<number> {
    const priceText = await this.getText(
      "//div[contains(@class, 'cart__sidebar')]//div[contains(@class, 'totals-item')][contains(., 'Total')]//span[contains(@class, 'formatted-money-amount')]",
    );
    return parseNumeric(priceText);
  }

  async clickApplePay(): Promise<void> {
    const frame = this.page.frameLocator(
      "//li[contains(@id, 'applePay')]//iframe",
    );
    await frame.locator("#apple-pay-button").click();
  }

  async clickLinkPay(): Promise<void> {
    const frame = this.page.frameLocator("//li[contains(@id, 'link')]//iframe");
    await frame.locator("#primary").click();
  }

  async clickCheckout(): Promise<CheckoutPage> {
    await this.click("//div[contains(@class, 'cart__submit')]//a");
    return new CheckoutPage(this.page);
  }
}

export class CartItemsTable extends BaseComponent {
  async getCartItems(): Promise<CartItem[]> {
    const items = this.element.locator("//tr[contains(@class, 'row')]");
    await items.first().waitFor({ state: "visible" });
    const allItems = await items.all();
    return allItems.map((item) => new CartItem(item));
  }
}

export class CartItem extends BaseComponent {
  async goToProductPage(): Promise<void> {
    // Find the product name link (has the wc-block-components-product-name class)
    await this.click("//a[contains(@class, 'product-name')]");
  }

  async getTitle(): Promise<string> {
    // Get the product name from the link with product-name class
    return await this.getText("//a[contains(@class, 'product-name')]");
  }

  async getPrice(): Promise<number> {
    // Get price from the generic element containing the price
    const priceText = await this.getText(
      "//div[contains(., '$')][not(contains(., 'Subtotal'))][not(contains(., 'Total'))][1]",
    );
    return parseNumeric(priceText);
  }

  async getDescription(): Promise<string> {
    return await this.getText("//p");
  }

  async getQuantity(): Promise<number> {
    const input = this.element.locator("input[type='number']");
    const value = await input.inputValue();
    return parseInt(value, 10);
  }

  async increaseQuantity(): Promise<void> {
    // Find the increase button after/near the input field
    // Try XPath to find button containing + or with specific aria-label
    const increaseBtn = this.element.locator("xpath=//button[contains(., '+') or contains(@aria-label, 'Increase') or contains(., ' +')]").first();
    
    if (await increaseBtn.isVisible().catch(() => false)) {
      await increaseBtn.click();
    } else {
      // Fallback: try to find by position (last button in the row)
      const buttons = this.element.locator("button");
      const count = await buttons.count();
      if (count > 0) {
        await buttons.nth(count - 1).click();
      }
    }
    
    // Wait for the page to process the click and update the DOM
    await this.page.waitForTimeout(1000);
  }

  async decreaseQuantity(): Promise<void> {
    // Find the decrease button before/near the input field  
    // Try XPath to find button containing − or - with specific aria-label
    const decreaseBtn = this.element.locator("xpath=//button[contains(., '−') or contains(., '-') or contains(@aria-label, 'Decrease')]").first();
    
    if (await decreaseBtn.isVisible().catch(() => false)) {
      await decreaseBtn.click();
    } else {
      // Fallback: try to find by position (first button in the row)
      const buttons = this.element.locator("button");
      if (await buttons.count() > 0) {
        await buttons.first().click();
      }
    }
    
    // Wait for the page to process the click and update the DOM
    await this.page.waitForTimeout(1000);
  }

  async removeItem(): Promise<void> {
    await this.click("//button[contains(@class, 'remove')]");
  }

  async getTotal(): Promise<number> {
    const totalText = await this.getText(".product-subtotal .amount");
    return parseNumeric(totalText);
  }
}
