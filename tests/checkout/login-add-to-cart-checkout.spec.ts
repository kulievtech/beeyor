import { test } from "fixtures/auth";
import { goToHomePage } from "actions/navigation";
import { expect } from "@playwright/test";

test(
  "Login and add a product to the cart and checkout",
  { tag: ["@regression"] },
  async ({ page }) => {
    // Step 1 & 2: Login is handled by auth fixture, now go to home page
    const homePage = await goToHomePage(page);
    await homePage.waitUntilPageIsLoaded();

    // Step 3: Add one of the products to the cart
    const productsTable = homePage.getTrendingProductsTable();
    const products = await productsTable.getCurrentProducts();

    expect(products.length).toBeGreaterThan(0);

    const firstProduct = products[0];
    const productTitle = await firstProduct.getTitle();
    await firstProduct.addToCart();

    // Step 4: Go to the cart page
    const cartPage = await firstProduct.clickViewCart();
    await cartPage.waitUntilPageIsLoaded();

    // Step 5: Verify the product is added to the cart
    const cartItemsTable = cartPage.getCartItemsTable();
    const cartItems = await cartItemsTable.getCartItems();

    expect(cartItems.length).toBeGreaterThan(0);

    // Verify our product is in the cart
    const cartItemTitles = await Promise.all(
      cartItems.map((item) => item.getTitle()),
    );
    const productInCart = cartItemTitles.some((title) =>
      title.includes(productTitle),
    );
    expect(productInCart).toBeTruthy();

    // Step 6 & 7: Proceed to checkout page and verify it's loaded
    const checkoutPage = await cartPage.clickCheckout();
    await checkoutPage.waitUntilPageIsLoaded();

    // Verify checkout page is loaded by checking for key elements
    const isCheckoutFormVisible = await checkoutPage.isCheckoutFormVisible();
    expect(isCheckoutFormVisible).toBeTruthy();
  },
);
