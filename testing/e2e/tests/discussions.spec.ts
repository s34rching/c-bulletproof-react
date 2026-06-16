import { createTeamViaApi } from '@testing/e2e/support/api/create-team.ts';
import { deleteDiscussion } from '@testing/e2e/support/api/delete-discussion.ts';
import { getDiscussions } from '@testing/e2e/support/api/get-discussion.ts';
import { registerUser } from '@testing/e2e/support/api/register-user.ts';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators';
import { Discussion, UserRoles } from '@testing/shared/types.ts';

import { expect, test } from '../fixtures/pages';
import { createDiscussionViaApi } from '../support/api/create-discussion.ts';

test.describe('"Discussions" page', () => {
  test.describe('Create', () => {
    test.describe('Admin', () => {
      const adminData = generateUserData(UserRoles.ADMIN);

      test.beforeAll(async () => {
        await createTeamViaApi(adminData);
      });

      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await discussionsPage.open('/app/discussions');
        await discussionsPage.initiateDiscussionCreation();
      });

      test.afterAll(async () => {
        const discussions: Discussion[] = await getDiscussions(adminData);

        await Promise.all(
          discussions.map(async (discussion) => {
            await deleteDiscussion(adminData, discussion.id);
          }),
        );
      });

      test('TC-005: User with "ADMIN" role should be able to create a new public discussion', async ({
        discussionsPage,
      }) => {
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
      const adminData = generateUserData(UserRoles.ADMIN);
      const userData = generateUserData(UserRoles.USER);

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
      const adminData = generateUserData(UserRoles.ADMIN);
      const userData = generateUserData(UserRoles.USER);
      const discussions = Array.from({ length: 10 }, () => generateDiscussionData());

      test.beforeAll(async () => {
        const team = await createTeamViaApi(adminData);
        await registerUser({ ...userData, teamId: team.id });
        await Promise.all(discussions.map((d) => createDiscussionViaApi(adminData, d)));
      });

      test('User with "ADMIN" role should be able to view discussions list', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await discussionsPage.open('/app/discussions');
        await Promise.all(
          discussions.map(async (dt) => {
            const discussionRow = discussionsPage.getDiscussionByName(dt.title);
            await expect(discussionRow).toBeVisible();
          }),
        );
      });

      test('User with "USER" role should be able to view discussions list', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(userData);
        await discussionsPage.open('/app/discussions');
        await Promise.all(
          discussions.map(async (dt) => {
            const discussionRow = discussionsPage.getDiscussionByName(dt.title);
            await expect(discussionRow).toBeVisible();
          }),
        );
      });
    });

    test.describe('Cross-team', () => {
      const teamOneAdminData = generateUserData(UserRoles.ADMIN);
      const teamTwoAdminData = generateUserData(UserRoles.ADMIN);
      const teamOneUserData = generateUserData(UserRoles.USER);

      const teamOnePrivateDiscussionData = generateDiscussionData({ public: false });
      const teamOnePublicDiscussionData = generateDiscussionData({ public: true });
      const teamTwoPrivateDiscussionData = generateDiscussionData({ public: false });
      const teamTwoPublicDiscussionData = generateDiscussionData({ public: true });

      test.beforeAll(async () => {
        const teamOne = await createTeamViaApi(teamOneAdminData);
        await registerUser({ ...teamOneUserData, teamId: teamOne.id });
        await createDiscussionViaApi(teamOneAdminData, teamOnePrivateDiscussionData);
        await createDiscussionViaApi(teamOneAdminData, teamOnePublicDiscussionData);

        await createTeamViaApi(teamTwoAdminData);
        await createDiscussionViaApi(teamTwoAdminData, teamTwoPrivateDiscussionData);
        await createDiscussionViaApi(teamTwoAdminData, teamTwoPublicDiscussionData);
      });

      test('User with "ADMIN" role should see only their team discussions', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneAdminData);
        await discussionsPage.open('/app/discussions');

        const teamOnePrivateDiscussion = discussionsPage.getDiscussionByName(teamOnePrivateDiscussionData.title);
        await expect(teamOnePrivateDiscussion).toBeVisible();
        const teamOnePublicDiscussion = discussionsPage.getDiscussionByName(teamOnePublicDiscussionData.title);
        await expect(teamOnePublicDiscussion).toBeVisible();
        const teamTwoPrivateDiscussion = discussionsPage.getDiscussionByName(teamTwoPrivateDiscussionData.title);
        await expect(teamTwoPrivateDiscussion).toHaveCount(0);
        const teamTwoPublicDiscussion = discussionsPage.getDiscussionByName(teamTwoPublicDiscussionData.title);
        await expect(teamTwoPublicDiscussion).toHaveCount(0);
      });

      test('User with "USER" role should see only their team discussions', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneUserData);
        await discussionsPage.open('/app/discussions');

        const teamOnePrivateDiscussion = discussionsPage.getDiscussionByName(teamOnePrivateDiscussionData.title);
        await expect(teamOnePrivateDiscussion).toBeVisible();
        const teamOnePublicDiscussion = discussionsPage.getDiscussionByName(teamOnePublicDiscussionData.title);
        await expect(teamOnePublicDiscussion).toBeVisible();
        const teamTwoPrivateDiscussion = discussionsPage.getDiscussionByName(teamTwoPrivateDiscussionData.title);
        await expect(teamTwoPrivateDiscussion).toHaveCount(0);
        const teamTwoPublicDiscussion = discussionsPage.getDiscussionByName(teamTwoPublicDiscussionData.title);
        await expect(teamTwoPublicDiscussion).toHaveCount(0);
      });
    });
  });

  test.describe('Delete', () => {
    let discussion: Discussion;
    const adminData = generateUserData(UserRoles.ADMIN);
    const userData = generateUserData(UserRoles.USER);

    test.beforeAll(async () => {
      const team = await createTeamViaApi(adminData);
      await registerUser({ ...userData, teamId: team.id });
    });

    test.beforeEach(async () => {
      discussion = await createDiscussionViaApi(adminData, generateDiscussionData({ public: false }));
    });

    test('User with "ADMIN" role should be able to delete discussion in the list', async ({ discussionsPage }) => {
      const deleteDiscussionUrl = `${process.env.NEXT_PUBLIC_API_URL}/discussions/${discussion.id}`;

      await discussionsPage.loginViaApi(adminData);
      await discussionsPage.open('/app/discussions');

      const deleteDiscussionPromise = discussionsPage.page.waitForResponse(deleteDiscussionUrl);
      await discussionsPage.deleteDiscussion(discussion.title);
      await deleteDiscussionPromise;
      await expect(discussionsPage.noDiscussionsBanner).toBeVisible();
    });

    test('User with "USER" role should NOT be able to delete discussion in the list', async ({ discussionsPage }) => {
      await discussionsPage.loginViaApi(userData);
      await discussionsPage.open('/app/discussions');

      const discussionRow = discussionsPage.getDeleteDiscussionButtonByName(discussion.title);
      await expect(discussionRow).toHaveCount(0);
    });
  });
});
