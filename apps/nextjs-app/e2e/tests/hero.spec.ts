import { expect, test } from '../fixtures/pages';
import { createUser } from '@/testing/data-generators';

test.describe('"Hero" page', () => {
  test('user should be able to open auth page', async ({ heroPage }) => {
    await heroPage.open('/');
    await heroPage.getStartedButton.click();
    await heroPage.waitUrlContains(/\/auth\/login$/);
    await expect(heroPage.getStartedButton).toBeHidden();
  })
})