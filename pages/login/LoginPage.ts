import BasePage from "@pages/BasePage";
import MyAccountPage from "@pages/my-account/MyAccountPage";

/**
 * Login Page - page object
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
}
