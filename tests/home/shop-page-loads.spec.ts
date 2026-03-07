import { expect } from "@playwright/test";
import { goToHomePage } from "actions/navigation";
import { test } from "fixtures/auth";

test(
  "Shop Page loads successfully",
  { tag: ["@regression"] },
  async ({ page }) => {
    const homePage = await goToHomePage(page);
    await homePage.waitUntilPageIsLoaded();
    const trendingNowText = await homePage.getTrendingTitle();
    expect(trendingNowText).toBe("Trending Now");
  },
);
