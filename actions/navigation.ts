import CartPage from "@pages/cart/CartPage";
import CheckoutPage from "@pages/checkout/CheckoutPage";
import LoginPage from "@pages/login/LoginPage";
import MyAccountPage from "@pages/my-account/MyAccountPage";
import ShopPage from "@pages/home/ShopPage";
import { Page } from "@playwright/test";
import { BASE_URL } from "models/Arguments";

const goToStartPage = async (page: Page): Promise<void> => {
  await page.goto(BASE_URL);
};

const goToCartPage = async (page: Page): Promise<CartPage> => {
  await page.click("//div[@id='modal-2-content']//span[contains(., 'Cart')]");

  return new CartPage(page);
};

const goToCheckoutPage = async (page: Page): Promise<CheckoutPage> => {
  await page.click(
    "//div[@id='modal-2-content']//span[contains(., 'Checkout')]",
  );

  return new CheckoutPage(page);
};

const goToMyAccountPage = async (page: Page): Promise<MyAccountPage> => {
  await page.click(
    "//div[@id='modal-2-content']//span[contains(., 'My Account')]",
  );

  return new MyAccountPage(page);
};

const goToShopPage = async (page: Page): Promise<ShopPage> => {
  await page.click("//div[@id='modal-2-content']//span[contains(., 'Shop')]");

  return new ShopPage(page);
};

const goToLoginPage = async (page: Page): Promise<LoginPage> => {
  await page.click("//a[contains(., 'Login')]");

  return new LoginPage(page);
};

export {
  goToStartPage,
  goToCartPage,
  goToCheckoutPage,
  goToMyAccountPage,
  goToShopPage,
  goToLoginPage,
};
