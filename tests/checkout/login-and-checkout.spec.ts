import { Product } from "@pages/home/ProductsTable";
import { expect } from "@playwright/test";
import CartPage from "@pages/cart/CartPage";
import { goToCartPage, goToHomePage } from "actions/navigation";
import { test } from "fixtures/auth";
import { BASE_URL } from "models/Arguments";

test.describe("Login and Checkout Flow", { tag: ["@smoke"] }, () => {
  test("Login, add product to cart, and proceed to checkout", async ({
    page,
  }) => {
    // 1. Login is automatically done by auth fixture
    // 2. Navigate to the home page
    const homePage = await goToHomePage(page);
    await homePage.waitUntilPageIsLoaded();

    // 3. Get the trending products table and add a product to the cart
    const productsTable = homePage.getTrendingProductsTable();
    const products = await productsTable.getCurrentProducts();

    // Find a purchasable product
    let product = products[0];
    for (const prod of products) {
      if (await prod.isProductPurchsable()) {
        product = prod;
        break;
      }
    }

    // Add the product to the cart
    await product.addToCart();

    // 4. Click "View Cart" to go to the cart page
    const cartPage = await product.clickViewCart();
    await cartPage.waitUntilPageIsLoaded();

    // 5. Verify the product is added to the cart
    const cartItemsTable = cartPage.getCartItemsTable();
    const cartItems = await cartItemsTable.getCartItems();
    expect(cartItems.length).toBeGreaterThan(0);

    // Verify the total amount is correct
    const cartTotal = await cartPage.getTotal();
    expect(cartTotal).toBeGreaterThan(0);

    // 6. Proceed to checkout page
    const checkoutPage = await cartPage.clickCheckout();

    // 7. Verify checkout page is loaded
    await checkoutPage.waitUntilPageIsLoaded();
    const isCheckoutFormVisible = await checkoutPage.isCheckoutFormVisible();
    expect(isCheckoutFormVisible).toBeTruthy();
  });

  test.afterEach(async ({ page }) => {
    // Clear the cart after each test to maintain test isolation
    // Navigate directly to cart page instead of using modal navigation
    await page.goto(`${BASE_URL}/cart/`);
    const cartPage = new CartPage(page);
    await cartPage.waitUntilPageIsLoaded();
    const cartItemsTable = cartPage.getCartItemsTable();
    const cartItems = await cartItemsTable.getCartItems();
    for (const item of cartItems) {
      await item.removeItem();
    }
  });
});
