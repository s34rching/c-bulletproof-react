import { expect, test } from '../fixtures/pages';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators';
import { UserRoles } from '@testing/shared/types.ts';
import { createTeamViaApi } from '@testing/e2e/support/api/create-team.ts';
import { registerUser } from '@testing/e2e/support/api/register-user.ts';

test.describe('"Discussions" page', () => {
  test.describe('Admin', () => {
    test.beforeEach(() => {
      const teamOwnerData = generateUserData(UserRoles.ADMIN);
      const team = createTeamViaApi(teamOwnerData);
    });

    test('"Admin" user should be able to create a new public discussion', async ({ discussionsPage }) => {
      const discussionData = generateDiscussionData();
      const teamAdminData = generateUserData(UserRoles.ADMIN);

      await registerUser(teamAdminData);
      await discussionsPage.loginViaApi(teamAdminData);

      await discussionsPage.open('/app/discussions');
      await discussionsPage.initiateDiscussionCreation();
      await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
      await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

      const discussionRow = await discussionsPage.getDiscussionByName(discussionData.title);
      await expect(discussionRow).toBeVisible();
    });
  });
});
