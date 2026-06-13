import { expect, test } from '../fixtures/pages';
import { generateUserData } from '@testing/shared/data-generators';
import { registerUser } from '../support/api/register-user';
import { UserRoles } from '@testing/shared/types.ts';

test.describe('"Login" page', () => {
  let userData = generateUserData(UserRoles.USER);

  test.describe('Registered user', () => {
    test.beforeAll(async () => {
      await registerUser(userData);
    });

    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open('/auth/login');
    });

    test('TC-001: User should be able to login with valid credentials', async ({ loginPage }) => {
      await loginPage.emailInput.fill(userData.email);
      await loginPage.passwordInput.fill(userData.password);
      await loginPage.loginButton.click();

      await loginPage.waitUrlContains(/\/app/);
      await expect(loginPage.emailInput).toBeHidden();
    });

    test('TC-018: User should be able to submit login with "Enter"', async ({ loginPage }) => {
      await loginPage.emailInput.fill(userData.email);
      await loginPage.passwordInput.fill(userData.password);
      await loginPage.passwordInput.press('Enter');

      await loginPage.waitUrlContains(/\/app/);
      await expect(loginPage.emailInput).toBeHidden();
    });

    test('TC-009: User should NOT be able to login with wrong password', async ({ loginPage }) => {
      const { password: randomPassword } = generateUserData(UserRoles.USER);

      await loginPage.emailInput.fill(userData.email);
      await loginPage.passwordInput.fill(randomPassword);
      await loginPage.loginButton.click();
      await expect(loginPage.eventAlert).toBeVisible();
      await expect(loginPage.eventAlert).toContainText('Invalid username or password');
    });
  });

  test.describe('Validations', () => {
    test('TC-005: User should see validation error while submitting empty email', async ({ loginPage }) => {
      await loginPage.open('/auth/login');
      await loginPage.passwordInput.fill(userData.password);
      await loginPage.loginButton.click();
      await expect(loginPage.emailInputAlert).toBeVisible();
      await expect(loginPage.emailInputAlert).toContainText('Required');
    });

    test('TC-006: User should see validation error while submitting email in wrong format', async ({ loginPage }) => {
      const { password } = generateUserData(UserRoles.USER);
      const withoutAtEmail = 'some.address';

      await loginPage.open('/auth/login');
      await loginPage.emailInput.fill(withoutAtEmail);
      await loginPage.passwordInput.fill(password);
      await loginPage.loginButton.click();

      const message = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);

      expect(message).toContain(withoutAtEmail);
    });

    test('TC-007: User should see validation error while submitting empty password', async ({ loginPage }) => {
      await loginPage.open('/auth/login');
      await loginPage.emailInput.fill(userData.email);
      await loginPage.loginButton.click();
      await expect(loginPage.passwordInputAlert).toBeVisible();
      await expect(loginPage.passwordInputAlert).toContainText('Required');
    });

    test('TC-010: User should NOT be able to login with non-existing email', async ({ loginPage }) => {
      const { email: nonExistingEmail, password } = generateUserData(UserRoles.USER);

      await loginPage.open('/auth/login');
      await loginPage.emailInput.fill(nonExistingEmail);
      await loginPage.passwordInput.fill(password);
      await loginPage.loginButton.click();
      await expect(loginPage.eventAlert).toBeVisible();
      await expect(loginPage.eventAlert).toContainText('Invalid username or password');
    });
  });

  test('TC-013: User should be able to see "Register" link', async ({ loginPage }) => {
    await loginPage.open('/auth/login');

    await expect(loginPage.registerLink).toBeVisible();
    await expect(loginPage.registerLink).toHaveAttribute('href', '/auth/register');
  });
});
