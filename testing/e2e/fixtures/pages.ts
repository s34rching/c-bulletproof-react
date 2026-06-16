import { test as base } from '@playwright/test';

import { HeroPage } from '../pages/hero.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

type Pages = {
  heroPage: HeroPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = base.extend<Pages>({
  heroPage: async ({ page }, use) => {
    await use(new HeroPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from '@playwright/test';
