import { expect, test } from '../fixtures/pages';
import { createUser, generateUser } from '@testing/shared/data-generators';
import { registerUser } from '@testing/e2e/support/api/register-user';
import { createTeam } from '@testing/shared/test-utils';
import 'dotenv/config';
import { waitFor } from '@testing-library/react';

test.describe('"Register" page', () => {
  test.describe('New user', () => {
    let userData: ReturnType<typeof generateUser>;

    test.beforeEach(async () => {
      userData = createUser();
    })

    test('TC-E-001: User should be able to register in app', async ({ registerPage, loginPage }) => {
      await loginPage.open('/auth/login');
      await loginPage.registerLink.click();

      await loginPage.waitUrlContains(/\/register/);
      await registerPage.firstNameInput.fill(userData.firstName);
      await registerPage.lastNameInput.fill(userData.lastName);
      await registerPage.emailInput.fill(userData.email);
      await registerPage.passwordInput.fill(userData.password);
      await registerPage.teamNameInput.fill(userData.teamName);
      await registerPage.submitButton.click();

      await registerPage.waitUrlContains(/\/app/);
      await expect(registerPage.emailInput).toBeHidden();
    });

    test('TC-E-004: Selecting a team from the dropdown and submitting valid data registers the user under the selected team', async ({
      registerPage,
    }) => {
      const team = await createTeam({id: userData.teamId});
      await registerPage.open('/auth/register');

      await registerPage.firstNameInput.fill(userData.firstName);
      await registerPage.lastNameInput.fill(userData.lastName);
      await registerPage.emailInput.fill(userData.email);
      await registerPage.passwordInput.fill(userData.password);
      await registerPage.teamSwitch.setChecked(true);
      await expect(registerPage.teamNameSelect).toBeVisible();
      await expect(registerPage.teamNameSelect).toHaveValue('123');

      await registerPage.teamNameSelect.selectOption(team.name);
      await registerPage.submitButton.click();

      await registerPage.waitUrlContains(/\/app/);
      await expect(registerPage.emailInput).toBeHidden();
    });
  });

  test.describe('Registered user', () => {
    let userData: ReturnType<typeof generateUser>;

    test.beforeEach(async () => {
      userData = createUser();
      await registerUser(userData);
    });

    test('TC-E-003: Submitting the form with an email address already registered shows an error notification', async ({
      registerPage,
    }) => {
      await registerPage.open('/auth/register');

      await registerPage.firstNameInput.fill(userData.firstName);
      await registerPage.lastNameInput.fill(userData.lastName);
      await registerPage.emailInput.fill(userData.email);
      await registerPage.passwordInput.fill(userData.password);
      await registerPage.teamNameInput.fill(userData.teamName);
      await registerPage.submitButton.click();

      await expect(registerPage.eventAlert).toBeVisible();
      await expect(registerPage.eventAlert).toContainText('Error');
      await expect(registerPage.eventAlert).toContainText(
        'The user already exists',
      );
    });

    test('TC-E-002: An already-authenticated user who navigates to `/auth/register` is immediately redirected to `/app`', async ({ registerPage }) => {
      await registerPage.loginViaApi(userData);

      await registerPage.open('/auth/register');

      await registerPage.waitUrlContains(/\/app/);
      await expect(registerPage.emailInput).toBeHidden();
    });
  });
});
