import { type Locator, type Page } from '@playwright/test';

import { getJwtToken } from '../../shared/helpers/api/get-jwt-token.ts';
import { UserData } from '@testing/shared/types.ts';

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

  async loginViaApi(userData: UserData) {
    const jwt = await getJwtToken(userData);

    await this.page.context().addCookies([
      {
        name: process.env.NEXT_PUBLIC_AUTH_COOKIE!,
        value: jwt,
        url: process.env.NEXT_PUBLIC_URL,
      },
    ]);
  }
}
