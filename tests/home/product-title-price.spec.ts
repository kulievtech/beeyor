import HomePage from "@pages/home/HomePage";
import { expect } from "@playwright/test";
import { goToHomePage } from "actions/navigation";
import { test } from "fixtures/auth";

test.describe(
  "Products Title and Price Present on the Shop Page",
  { tag: ["@smoke"] },
  () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
      // Go to Shop Page
      homePage = await goToHomePage(page);

      // Wait until page is loaded
      await homePage.waitUntilPageIsLoaded();
    });

    test("Trending Products have valid titles and prices", async () => {
      // Get Trending Products table and current products
      const productsTable = homePage.getTrendingProductsTable();
      const products = await productsTable.getCurrentProducts();

      // Verify that each product has a valid title and price
      for (const product of products) {
        const title = await product.getTitle();
        const price = await product.getPrice();
        // If product does not have a price, it returns 0
        if (price === 0) continue;

        expect.soft(title.length).toBeGreaterThan(1);
        expect.soft(typeof title).toBe("string");
        expect.soft(price).toBeGreaterThan(0);
        expect.soft(typeof price).toBe("number");
      }
    });

    test("New Arrivals Products have valid titles and prices", async () => {
      // 3. Get New Arrivals Products table and current products
      const productsTable = homePage.getNewArrivalsProductsTable();
      const products = await productsTable.getCurrentProducts();

      // 4. Verify that each product has a valid title and price
      for (const product of products) {
        const title = await product.getTitle();
        const price = await product.getPrice();
        // If product does not have a price, it returns 0
        if (price === 0) continue;

        expect.soft(title.length).toBeGreaterThan(1);
        expect.soft(typeof title).toBe("string");
        expect.soft(price).toBeGreaterThan(0);
        expect.soft(typeof price).toBe("number");
      }
    });
  },
);

const tables = ["Trending", "New Arrivals"];

tables.forEach((tableName) => {
  test.describe(
    `${tableName} Products Titles and Prices`,
    { tag: ["@smoke"] },
    () => {
      test(`${tableName} products have valid titles and prices`, async ({
        page,
      }) => {
        // Go to Shop Page
        const homePage = await goToHomePage(page);

        // Wait until page is loaded
        await homePage.waitUntilPageIsLoaded();

        // Get Products table and current products
        const productsTable =
          tableName === "Trending Products"
            ? homePage.getTrendingProductsTable()
            : homePage.getNewArrivalsProductsTable();

        const products = await productsTable.getCurrentProducts();

        // Verify that each product has a valid title and price
        for (const product of products) {
          const title = await product.getTitle();
          const price = await product.getPrice();
          if (price === null) continue;

          expect.soft(title.length).toBeGreaterThan(3);
          expect.soft(price).toBeGreaterThan(0);
        }
      });
    },
  );
});
