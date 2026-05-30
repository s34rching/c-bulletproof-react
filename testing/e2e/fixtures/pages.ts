import { test as base } from '@playwright/test';
import { HeroPage } from '../pages/hero.page';
import { LoginPage } from '../pages/login.page';

type Pages = {
  heroPage: HeroPage;
  loginPage: LoginPage;
};

export const test = base.extend<Pages>({
  heroPage: async ({ page }, use) => {
    await use(new HeroPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
