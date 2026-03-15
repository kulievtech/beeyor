import { Product } from "@pages/home/ProductsTable";
import { expect } from "@playwright/test";
import { goToCartPage, goToHomePage } from "actions/navigation";
import { test } from "fixtures/auth";

test.describe("Add Product to a Cart", { tag: ["@smoke"] }, () => {
  test("Add a product to cart in 'shop page' and verify it on 'cart page'", async ({
    page,
  }) => {
    // Navigate to the shop page
    const homePage = await goToHomePage(page);
    await homePage.waitUntilPageIsLoaded();

    // Get the trending products table
    const productsTable = homePage.getTrendingProductsTable();

    // Get the list of current products in the trending products table
    const products = await productsTable.getCurrentProducts();
    let product = products[0];
    for (const prod of products) {
      if (await prod.isProductPurchsable()) {
        product = prod;
        break;
      }
    }

    // Add the first product to the cart
    await product.addToCart();

    // Verify that the product is marked as added to cart
    const isAdded = await product.isAddedToCart();
    expect(isAdded).toBeTruthy();

    // Click on the "View Cart" button
    const cartPage = await product.clickViewCart();

    // Verify that we are on the cart page
    await cartPage.waitUntilPageIsLoaded();
    const cartItemsTable = cartPage.getCartItemsTable();
    const cartItems = await cartItemsTable.getCartItems();
    test.expect(cartItems.length).toBeGreaterThan(0);
  });

  test.afterEach(async ({ page }) => {
    // Clear the cart after each test to maintain test isolation
    const cartPage = await goToCartPage(page);
    await cartPage.waitUntilPageIsLoaded();
    const cartItemsTable = cartPage.getCartItemsTable();
    const cartItems = await cartItemsTable.getCartItems();
    for (const item of cartItems) {
      await item.removeItem();
    }
  });
});
