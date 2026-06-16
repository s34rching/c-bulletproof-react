import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly emailInputAlert: Locator;
  readonly passwordInput: Locator;
  readonly passwordInputAlert: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.emailInput = page.getByLabel('Email Address');
    this.emailInputAlert = page
      .locator('div')
      .filter({ has: page.getByLabel('Email Address') })
      .locator('div[role="alert"]');
    this.passwordInput = page.getByLabel('Password');
    this.passwordInputAlert = page
      .locator('div')
      .filter({ has: page.getByLabel('Password') })
      .locator('div[role="alert"]');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }
}
