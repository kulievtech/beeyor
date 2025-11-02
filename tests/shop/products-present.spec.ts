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

  test("Trending Products table is displayed", async () => {
    // 3. Get Trending Products table and current products
    const productsTable = shopPage.getTrendingProductsTable();
    const products = await productsTable.getCurrentProducts();

    // 4. Verify that there is at least one product displayed
    expect(products.length).toBeGreaterThan(0);
  });

  test("New Arrivals Products table is displayed", async () => {
    // 3. Get New Arrivals Products table and current products
    const productsTable = shopPage.getNewArrivalsProductsTable();
    const products = await productsTable.getCurrentProducts();

    // 4. Verify that there is at least one product displayed
    expect(products.length).toBeGreaterThan(0);
  });
});

const tables = ["Trending Products", "New Arrivals"];

// tables.forEach((tableName) => {
//   test.describe(`${tableName} Products Present`, { tag: ["@smoke"] }, () => {
//     test(`${tableName} table is displayed`, async ({ page }) => {
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

//       // 4. Verify that there is at least one product displayed
//       expect(products.length).toBeGreaterThan(0);
//     });
//   });
// });
