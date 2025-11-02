import BaseComponent from "@pages/BaseComponent";
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
    return this.getText("//div[contains(@class, 'title')]");
  }

  async getPrice(): Promise<number | null> {
    try {
      const numText = await this.getText("//span[contains(@class, 'Price-amount')]");
      return parseNumeric(numText);
    } catch (error) {
      console.error("Failed to get price:", error);
      return null;
    }
  }

  async addToCart() {
    await this.hover("//img");
    await this.waitForElement("//a[contains(@aria-label, 'Add to cart')]");
    await this.click("//a[contains(@aria-label, 'Add to cart')]");
  }
}
