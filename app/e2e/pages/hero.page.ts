import { BasePage } from './base.page';
import { type Locator, type Page } from '@playwright/test';

export class HeroPage extends BasePage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly alanRepoButton: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.getStartedButton = page.getByRole('button', { name: 'Get Started' });
    this.alanRepoButton = page.getByRole('button', { name: 'Github Repo' });
  }
}