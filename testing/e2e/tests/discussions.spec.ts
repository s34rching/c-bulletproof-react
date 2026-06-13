import { expect, test } from '../fixtures/pages';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators';
import { UserRoles } from '@testing/shared/types.ts';
import { createTeamViaApi } from '@testing/e2e/support/api/create-team.ts';
import { createDiscussion } from '@testing/e2e/support/api/create-discussion.ts';

test.describe('"Discussions" page', () => {
  test.describe('Admin', () => {
    test.describe('Create', () => {
      let adminData = generateUserData(UserRoles.ADMIN);

      test.beforeAll(async () => {
        await createTeamViaApi(adminData);
      });

      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await discussionsPage.open('/app/discussions');
        await discussionsPage.initiateDiscussionCreation();
      });

      test('"Admin" user should be able to create a new public discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: true });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = await discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });

      test('"Admin" user should be able to create a new private discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: false });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = await discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });
    });

    test.describe('View', () => {
      let adminData = generateUserData(UserRoles.ADMIN);
      let discussions = Array.from({ length: 10 }, () => generateDiscussionData());

      test.beforeAll(async () => {
        await createTeamViaApi(adminData);
      });

      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(adminData);
        await Promise.all(discussions.map((d) => createDiscussion(adminData, d)));
        await discussionsPage.open('/app/discussions');
      });

      test('"Admin" user should be able to view discussions list', async ({ discussionsPage }) => {
        await Promise.all(discussions.map(async (dt) => {
          const discussionRow = await discussionsPage.getDiscussionByName(dt.title);

          await expect(discussionRow).toBeVisible();
        }));
      });
    })
  });
});
