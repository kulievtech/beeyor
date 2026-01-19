import BaseComponent from "@pages/BaseComponent";
import BasePage from "@pages/BasePage";
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
}

class CartItemsTable extends BaseComponent {
  async getCartItems(): Promise<CartItem[]> {
    const items = this.element.locator("//tr[contains(@class, 'row')]");
    await items.first().waitFor({ state: "visible" });
    return (await items.all()).map((item) => new CartItem(item));
  }
}

class CartItem extends BaseComponent {
  async goToProductPage(): Promise<void> {
    await this.click(".product-name a");
  }

  async getTitle(): Promise<string> {
    return await this.getText(".product-name a");
  }

  async getPrice(): Promise<number> {
    const priceText = await this.getText(".product-price .amount");
    return parseNumeric(priceText);
  }

  async getDescription(): Promise<string> {
    return await this.getText(".product-name .description");
  }

  async getQuantity(): Promise<number> {
    const qtyText = await this.getText(".product-quantity input");
    return parseInt(qtyText, 10);
  }

  async increaseQuantity(): Promise<void> {
    await this.click(".quantity-increase");
  }

  async decreaseQuantity(): Promise<void> {
    await this.click(".quantity-decrease");
  }

  async removeItem(): Promise<void> {
    await this.click(".remove-item");
  }

  async getTotal(): Promise<number> {
    const totalText = await this.getText(".product-subtotal .amount");
    return parseFloat(totalText.replace(/[^0-9.-]+/g, ""));
  }
}
