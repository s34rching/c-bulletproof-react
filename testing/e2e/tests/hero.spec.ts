import { expect, test } from '../fixtures/pages';

test.describe('"Hero" page', () => {
  test.beforeEach(async ({ heroPage }) => {
    await heroPage.open('/');
  })

  test('user should be able to open auth page', async ({ heroPage }) => {
    await heroPage.getStartedButton.click();
    await heroPage.waitUrlContains(/\/auth\/login$/);
    await expect(heroPage.getStartedButton).toBeHidden();
  })

  test('user should be able to see author\'s "Github" profile', async ({ heroPage }) => {
    await expect(heroPage.alanRepoButton).toBeVisible();
  })
})

