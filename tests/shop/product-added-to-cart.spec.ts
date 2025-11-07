import { expect } from "@playwright/test";
import { goToShopPage } from "actions/navigation";
import { test } from "fixtures/auth";

test.describe("Add Product to a Cart", () => {
  test("Add a product to cart in 'shop page' and verify it on 'cart page'", async ({
    page,
  }) => {
    // 1. Navigate to the shop page
    const shopPage = await goToShopPage(page);
    await shopPage.waitUntilPageIsLoaded();

    // 2. Get the trending products table
    const productsTable = shopPage.getTrendingProductsTable();

    // 3. Get the list of current products in the trending products table
    const products = await productsTable.getCurrentProducts();
    const firstProduct = products[0];

    // 4. Add the first product to the cart
    await firstProduct.addToCart();

    // 5. Verify that the product is marked as added to cart
    const isAdded = await firstProduct.isAddedToCart();
    expect(isAdded).toBeTruthy();

    // 6. Click on the "View Cart" button
    const cartPage = await firstProduct.clickViewCart();

    // 7. Verify that we are on the cart page
    await cartPage.waitUntilPageIsLoaded();
    // const cartItems = await cartPage.getCartItems();
    // test.expect(cartItems.length).toBeGreaterThan(0);
  });
});
