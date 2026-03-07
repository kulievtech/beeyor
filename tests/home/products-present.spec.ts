import HomePage from "@pages/home/HomePage";
import { expect } from "@playwright/test";
import { goToHomePage } from "actions/navigation";
import { test } from "fixtures/auth";

test.describe("Products Present on Shop Page", { tag: ["@smoke"] }, () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    // 1. Go to Shop Page
    homePage = await goToHomePage(page);

    // 2. Wait until page is loaded
    await homePage.waitUntilPageIsLoaded();
  });

  test("Trending Products table is displayed", async () => {
    // 3. Get Trending Products table and current products
    const productsTable = homePage.getTrendingProductsTable();
    const products = await productsTable.getCurrentProducts();

    // 4. Verify that there is at least one product displayed
    expect(products.length).toBeGreaterThan(0);
  });

  test("New Arrivals Products table is displayed", async () => {
    // 3. Get New Arrivals Products table and current products
    const productsTable = homePage.getNewArrivalsProductsTable();
    const products = await productsTable.getCurrentProducts();

    // 4. Verify that there is at least one product displayed
    expect(products.length).toBeGreaterThan(0);
  });
});

const tables = ["Trending", "New Arrivals"];

tables.forEach((tableName) => {
  test.describe(
    `${tableName} Products Present on Shop Page`,
    { tag: ["@smoke"] },
    () => {
      test(`${tableName} Products is displayed`, async ({ page }) => {
        // 1. Go to Shop Page
        const homePage = await goToHomePage(page);

        // 2. Wait until page is loaded
        await homePage.waitUntilPageIsLoaded();

        // 3. Get Products table and current products
        const productsTable =
          tableName === "Trending"
            ? homePage.getTrendingProductsTable()
            : homePage.getNewArrivalsProductsTable();

        const products = await productsTable.getCurrentProducts();

        // 4. Verify that there is at least one product displayed
        expect(products.length).toBeGreaterThan(0);
      });
    },
  );
});
