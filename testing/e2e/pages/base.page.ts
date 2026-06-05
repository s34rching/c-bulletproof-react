import { type Locator, type Page } from '@playwright/test';
import { loginUser } from '@testing/e2e/support/api/login-user';

export class BasePage {
  readonly page: Page;
  readonly eventAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventAlert = page.locator('div.pointer-events-auto');
  }

  async open(path: string) {
    await this.page.goto(path);
  }

  async waitUrlContains(path: string | RegExp) {
    await this.page.waitForURL(path);
  }

  async loginViaApi(userData: { email: string; password: string }) {
    const jwt = await loginUser(userData);
    await this.page.context().addCookies([
      {
        name: 'bulletproof_react_app_token',
        value: jwt,
        url: process.env.NEXT_PUBLIC_URL,
      },
    ]);
  }
}
