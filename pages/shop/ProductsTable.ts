import BaseComponent from "@pages/BaseComponent";
import CartPage from "@pages/cart/CartPage";
import parseNumeric from "helpers/parseNumeric";

export class ProductsTable extends BaseComponent {
  async getCurrentProducts(): Promise<Product[]> {
    const products = this.element.locator("//ul[contains(@class, 'products')]/li");
    await products.first().waitFor({ state: "visible" });
    return (await products.all()).map((product) => new Product(product));
  }
}

export class Product extends BaseComponent {
  async getTitle(): Promise<string> {
    try {
      return await this.getText("//div[contains(@class, 'title')]");
    } catch (error) {
      console.error("Failed to get title:", error);
      return "";
    }
  }

  async getPrice(): Promise<number> {
    try {
      const numText = await this.getText("//span[contains(@class, 'Price-amount')]");
      return parseNumeric(numText);
    } catch (error) {
      console.error("Failed to get price:", error);
      return 0;
    }
  }

  async addToCart(): Promise<void> {
    try {
      await this.hover("//img");
      await this.waitForElement("//a[contains(@aria-label, 'Add to cart')]");
      await this.click("//a[contains(@aria-label, 'Add to cart')]");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  }

  async isAddedToCart(): Promise<boolean> {
    const button = this.element.locator("//a[contains(@aria-label, 'Add to cart')]");
    await this.waitForElement("//a[@title='View cart']");
    const classAttr = await button.getAttribute("class");
    return classAttr?.includes("added") ?? false;
  }

  async clickViewCart(): Promise<CartPage> {
    try {
      await this.click("//a[@title='View cart']");
      return new CartPage(this.page);
    } catch (error) {
      console.error("Failed to click View Cart:", error);
      throw error;
    }
  }
}
