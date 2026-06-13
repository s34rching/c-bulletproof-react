import { expect, test } from '../fixtures/pages';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators';
import { UserRoles } from '@testing/shared/types.ts';
import { createTeamViaApi } from '@testing/e2e/support/api/create-team.ts';
import { createDiscussion } from '@testing/e2e/support/api/create-discussion.ts';
import { registerUser } from '@testing/e2e/support/api/register-user.ts';

test.describe('"Discussions" page', () => {
  test.describe('Create', () => {
    test.describe('Admin', () => {
      let adminData = generateUserData(UserRoles.ADMIN);

      test.beforeAll(async () => {
        await createTeamViaApi(adminData);
      });

      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await discussionsPage.open('/app/discussions');
        await discussionsPage.initiateDiscussionCreation();
      });

      test('TC-005: "Admin" user should be able to create a new public discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: true });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = await discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });

      test('TC-006: "Admin" user should be able to create a new private discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: false });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = await discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });
    });

    test.describe('User', () => {
      let adminData = generateUserData(UserRoles.ADMIN);
      let userData = generateUserData(UserRoles.USER);

      test.beforeAll(async () => {
        const team = await createTeamViaApi(adminData);
        await registerUser({ ...userData, teamId: team.id });
      });

      test('User with "USER" role should NOT be able to create discussion', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(userData);
        await discussionsPage.open('/app/discussions');
        await expect(discussionsPage.noDiscussionsBanner).toBeVisible();
        await expect(discussionsPage.createDiscussionButton).toHaveCount(0);
      });
    });
  });

  test.describe('View', () => {
    test.describe('Single team', () => {
      let adminData = generateUserData(UserRoles.ADMIN);
      let userData = generateUserData(UserRoles.USER);
      let discussions = Array.from({ length: 10 }, () => generateDiscussionData());

      test.beforeAll(async () => {
        const team = await createTeamViaApi(adminData);
        await registerUser({ ...userData, teamId: team.id });
        await Promise.all(discussions.map((d) => createDiscussion(adminData, d)));
      });

      test('"Admin" user should be able to view discussions list', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await discussionsPage.open('/app/discussions');
        await Promise.all(
          discussions.map(async (dt) => {
            const discussionRow = await discussionsPage.getDiscussionByName(dt.title);

            await expect(discussionRow).toBeVisible();
          }),
        );
      });

      test('"User" user should be able to view discussions list', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(userData);
        await discussionsPage.open('/app/discussions');
        await Promise.all(
          discussions.map(async (dt) => {
            const discussionRow = await discussionsPage.getDiscussionByName(dt.title);

            await expect(discussionRow).toBeVisible();
          }),
        );
      });
    });

    test.describe('Cross-team', () => {
      const teamOneAdminData = generateUserData(UserRoles.ADMIN);
      const teamTwoAdminData = generateUserData(UserRoles.ADMIN);
      const teamOneUserData = generateUserData(UserRoles.USER);

      const teamOneDiscussionData = generateDiscussionData({ public: true });
      const teamTwoDiscussionData = generateDiscussionData({ public: true });

      test.beforeAll(async () => {
        const teamOne = await createTeamViaApi(teamOneAdminData);
        await registerUser({ ...teamOneUserData, teamId: teamOne.id });
        await createDiscussion(teamOneAdminData, teamOneDiscussionData);

        await createTeamViaApi(teamTwoAdminData);
        await createDiscussion(teamTwoAdminData, teamTwoDiscussionData);
      });

      test('Team "ADMIN" should see only their team discussions', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneAdminData);
        await discussionsPage.open('/app/discussions');

        const teamOneDiscussion = await discussionsPage.getDiscussionByName(teamOneDiscussionData.title);
        await expect(teamOneDiscussion).toBeVisible();
        const teamTwoDiscussion = await discussionsPage.getDiscussionByName(teamTwoDiscussionData.title);
        await expect(teamTwoDiscussion).toHaveCount(0);
      });

      test('Team "USER" should see only their team discussions', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneUserData);
        await discussionsPage.open('/app/discussions');

        const teamOneDiscussion = await discussionsPage.getDiscussionByName(teamOneDiscussionData.title);
        await expect(teamOneDiscussion).toBeVisible();
        const teamTwoDiscussion = await discussionsPage.getDiscussionByName(teamTwoDiscussionData.title);
        await expect(teamTwoDiscussion).toHaveCount(0);
      });
    });
  });
});
