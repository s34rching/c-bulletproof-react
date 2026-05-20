import { test as base } from '@playwright/test';
import { HeroPage } from '../pages/hero.page';

type Pages = {
  heroPage: HeroPage;
};

export const test = base.extend<Pages>({
  heroPage: async ({ page }, use) => {
    await use(new HeroPage(page));
  },
});

export { expect } from '@playwright/test';
