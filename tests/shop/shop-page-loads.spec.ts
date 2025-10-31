import { expect } from "@playwright/test";
import { goToShopPage } from "actions/navigation";
import { test } from "fixtures/auth";

test(
  "Shop Page loads successfully",
  { tag: ["@regression"] },
  async ({ page }) => {
    const shopPage = await goToShopPage(page);
    await shopPage.waitUntilPageIsLoaded();
    const trendingNowText = await shopPage.getTrendingTitle();
    expect(trendingNowText).toBe("Trending Now");
  }
);
