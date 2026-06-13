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

      test('TC-005: User with "ADMIN" role should be able to create a new public discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: true });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = await discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });

      test('TC-006: User with "ADMIN" role should be able to create a new private discussion', async ({
        discussionsPage,
      }) => {
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

      test('User with "ADMIN" role should be able to view discussions list', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await discussionsPage.open('/app/discussions');
        await Promise.all(
          discussions.map(async (dt) => {
            const discussionRow = await discussionsPage.getDiscussionByName(dt.title);

            await expect(discussionRow).toBeVisible();
          }),
        );
      });

      test('User with "USER" role should be able to view discussions list', async ({ discussionsPage }) => {
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

      const teamOnePrivateDiscussionData = generateDiscussionData({ public: true });
      const teamOnePublicDiscussionData = generateDiscussionData({ public: false });
      const teamTwoPrivateDiscussionData = generateDiscussionData({ public: true });
      const teamTwoPublicDiscussionData = generateDiscussionData({ public: false });

      test.beforeAll(async () => {
        const teamOne = await createTeamViaApi(teamOneAdminData);
        await registerUser({ ...teamOneUserData, teamId: teamOne.id });
        await createDiscussion(teamOneAdminData, teamOnePrivateDiscussionData);
        await createDiscussion(teamOneAdminData, teamOnePublicDiscussionData);

        await createTeamViaApi(teamTwoAdminData);
        await createDiscussion(teamTwoAdminData, teamTwoPrivateDiscussionData);
        await createDiscussion(teamTwoAdminData, teamTwoPublicDiscussionData);
      });

      test('User with "ADMIN" role should see only their team discussions', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneAdminData);
        await discussionsPage.open('/app/discussions');

        const teamOnePrivateDiscussion = await discussionsPage.getDiscussionByName(teamOnePrivateDiscussionData.title);
        await expect(teamOnePrivateDiscussion).toBeVisible();
        const teamOnePublicDiscussion = await discussionsPage.getDiscussionByName(teamOnePublicDiscussionData.title);
        await expect(teamOnePublicDiscussion).toBeVisible();
        const teamTwoPrivateDiscussion = await discussionsPage.getDiscussionByName(teamTwoPrivateDiscussionData.title);
        await expect(teamTwoPrivateDiscussion).toHaveCount(0);
        const teamTwoPublicDiscussion = await discussionsPage.getDiscussionByName(teamTwoPublicDiscussionData.title);
        await expect(teamTwoPublicDiscussion).toHaveCount(0);
      });

      test('User with "USER" role should see only their team discussions', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneUserData);
        await discussionsPage.open('/app/discussions');

        const teamOnePrivateDiscussion = await discussionsPage.getDiscussionByName(teamOnePrivateDiscussionData.title);
        await expect(teamOnePrivateDiscussion).toBeVisible();
        const teamOnePublicDiscussion = await discussionsPage.getDiscussionByName(teamOnePublicDiscussionData.title);
        await expect(teamOnePublicDiscussion).toBeVisible();
        const teamTwoPrivateDiscussion = await discussionsPage.getDiscussionByName(teamTwoPrivateDiscussionData.title);
        await expect(teamTwoPrivateDiscussion).toHaveCount(0);
        const teamTwoPublicDiscussion = await discussionsPage.getDiscussionByName(teamTwoPublicDiscussionData.title);
        await expect(teamTwoPublicDiscussion).toHaveCount(0);
      });
    });
  });
});
