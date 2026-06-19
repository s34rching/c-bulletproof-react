import { deleteDiscussion } from '@testing/e2e/support/api/delete-discussion.ts';
import { getTeams } from '@testing/e2e/support/api/get-teams';
import { registerUser } from '@testing/e2e/support/api/register-user';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators';
import { Team, UserData } from '@testing/shared/types';

import { expect, test } from '../../shared/fixtures';
import { getDiscussions } from '../support/api/get-discussions';

test.describe('Discussions', () => {
  const teamOneAdminData: UserData = generateUserData();
  const teamTwoAdminData: UserData = generateUserData();
  let teamOneUserData: UserData;
  let teamTwoUserData: UserData;

  test.beforeAll(async () => {
    await registerUser(teamOneAdminData);
    await registerUser(teamTwoAdminData);

    const teams = await getTeams();
    const teamOne = teams.find((team: Team) => team.name === teamOneAdminData.teamName);
    const teamTwo = teams.find((team: Team) => team.name === teamTwoAdminData.teamName);

    teamOneUserData = generateUserData({ teamId: teamOne.id });
    teamTwoUserData = generateUserData({ teamId: teamTwo.id });

    await registerUser(teamOneUserData);
    await registerUser(teamTwoUserData);
  });

  test.describe('Create', () => {
    test.describe('Admin', () => {
      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneAdminData);
        await discussionsPage.open('/app/discussions');
        await discussionsPage.initiateDiscussionCreation();
      });

      test.afterAll(async () => {
        const discussions = await getDiscussions(teamOneAdminData);

        await Promise.all(
          discussions.map(async (discussion) => {
            await deleteDiscussion(teamOneAdminData, discussion.id);
          }),
        );
      });

      test('User with "ADMIN" role should be able to create public discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: true });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });

      test('User with "ADMIN" role should be able to create private discussion', async ({ discussionsPage }) => {
        const discussionData = generateDiscussionData({ public: false });

        await discussionsPage.createDiscussionDialog.fillDiscussionForm(discussionData);
        await discussionsPage.createDiscussionDialog.submitDiscussionCreation();

        const discussionRow = discussionsPage.getDiscussionByName(discussionData.title);
        await expect(discussionRow).toBeVisible();
      });
    });

    test.describe('User', () => {
      test('User with "USER" role should NOT be able to create discussion', async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneUserData);
        await discussionsPage.open('/app/discussions');
        await expect(discussionsPage.noDiscussionsBanner).toBeVisible();
        await expect(discussionsPage.createDiscussionButton).toHaveCount(0);
      });
    });
  });
});
