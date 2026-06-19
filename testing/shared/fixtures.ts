import { test as base } from '@playwright/test';

import { DiscussionsPage } from '@testing/e2e/pages/discussions.page';
import { RequestHandler } from '@testing/shared/request-handler';

import { HeroPage } from '../e2e/pages/hero.page';
import { LoginPage } from '../e2e/pages/login.page';
import { RegisterPage } from '../e2e/pages/register.page';

type Fixtures = {
  heroPage: HeroPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  discussionsPage: DiscussionsPage;
  requestHandler: RequestHandler;
};

export const test = base.extend<Fixtures>({
  heroPage: async ({ page }, use) => {
    await use(new HeroPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  discussionsPage: async ({ page }, use) => {
    await use(new DiscussionsPage(page));
  },

  requestHandler: async ({ request }, use) => {
    const handler = new RequestHandler(process.env.NEXT_PUBLIC_API_URL!, request);
    await use(handler);
  },
});

export { expect } from '@playwright/test';
