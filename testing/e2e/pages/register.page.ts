import { BasePage } from './base.page';
import { type Locator, type Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly teamNameInput: Locator;
  readonly teamSwitch: Locator;
  readonly teamNameSelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.teamNameInput = page.locator('input[name="teamName"]');
    this.teamSwitch = page.locator('button[role="switch"]');
    this.teamNameSelect = page.locator('select[name="teamId"]');
    this.submitButton = page.locator('button[type="submit"]');
  }
}
