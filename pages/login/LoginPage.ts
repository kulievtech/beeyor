import BasePage from "@pages/BasePage";
import MyAccountPage from "@pages/my-account/MyAccountPage";

/**
 * Login Page page object
 * URL: /login
 */

export default class LoginPage extends BasePage {
  async waitUntilPageIsLoaded() {
    await this.waitForElement("//h2[normalize-space(text())='Login']");
  }

  async inputUsername(username: string): Promise<void> {
    await this.fill("#username", username);
  }

  async inputPassword(password: string): Promise<void> {
    await this.fill("#password", password);
  }

  async clickLoginButton(): Promise<MyAccountPage> {
    await this.click("//button[@name='login']");

    return new MyAccountPage(this.page);
  }

  // async login(username: string, password: string): Promise<MyAccountPage> {
  //   await this.fill("#username", username);
  //   await this.fill("#password", password);
  //   await this.click("//button[@name='login']");
  //   await this.page.waitForSelector(
  //     "//nav[@aria-label='Account pages']//li/a[normalize-space(text())='Log out']",
  //     { state: "visible" }
  //   );

  //   return new MyAccountPage(this.page);
  // }
}
