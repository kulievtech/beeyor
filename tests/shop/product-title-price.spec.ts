import ShopPage from "@pages/shop/ShopPage";
import { expect } from "@playwright/test";
import { goToShopPage } from "actions/navigation";
import { test } from "fixtures/auth";

test.describe("Products Present on Shop Page", { tag: ["@smoke"] }, () => {
  let shopPage: ShopPage;

  test.beforeEach(async ({ page }) => {
    // 1. Go to Shop Page
    shopPage = await goToShopPage(page);

    // 2. Wait until page is loaded
    await shopPage.waitUntilPageIsLoaded();
  });

  test("Trending Products have valid titles and prices", async () => {
    // 3. Get Trending Products table and current products
    const productsTable = shopPage.getTrendingProductsTable();
    const products = await productsTable.getCurrentProducts();

    // 4. Verify that each product has a valid title and price
    for (const product of products) {
      const title = await product.getTitle();
      const price = await product.getPrice();
      if (price === null) continue;

      console.log({ title, price });

      expect.soft(title.length).toBeGreaterThan(3);
      expect.soft(price).toBeGreaterThan(0);
    }
  });

  test("New Arrivals Products have valid titles and prices", async () => {
    // 3. Get New Arrivals Products table and current products
    const productsTable = shopPage.getNewArrivalsProductsTable();
    const products = await productsTable.getCurrentProducts();

    // 4. Verify that each product has a valid title and price
    for (const product of products) {
      const title = await product.getTitle();
      const price = await product.getPrice();
      if (price === null) continue;

      expect.soft(title.length).toBeGreaterThan(3);
      expect.soft(price).toBeGreaterThan(0);
    }
  });
});

// const tables = ["Trending Products", "New Arrivals"];

// tables.forEach((tableName) => {
//   test.describe(`${tableName} Product Titles and Prices`, { tag: ["@smoke"] }, () => {
//     test(`${tableName} products have valid titles and prices`, async ({ page }) => {
//       // 1. Go to Shop Page
//       const shopPage = await goToShopPage(page);

//       // 2. Wait until page is loaded
//       await shopPage.waitUntilPageIsLoaded();

//       // 3. Get Products table and current products
//       const productsTable =
//         tableName === "Trending Products"
//           ? shopPage.getTrendingProductsTable()
//           : shopPage.getNewArrivalsProductsTable();

//       const products = await productsTable.getCurrentProducts();

//       // 4. Verify that each product has a valid title and price
//       for (const product of products) {
//         const title = await product.getTitle();
//         const price = await product.getPrice();
//         if (price === null) continue;

//         expect.soft(title.length).toBeGreaterThan(3);
//         expect.soft(price).toBeGreaterThan(0);
//       }
//     });
//   });
// });
