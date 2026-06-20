import { createDiscussion } from '@testing/e2e/support/api/create-discussion';
import { deleteDiscussion } from '@testing/e2e/support/api/delete-discussion';
import { getTeams } from '@testing/e2e/support/api/get-teams';
import { registerUser } from '@testing/e2e/support/api/register-user';
import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators';
import { Discussion, Team, UserData } from '@testing/shared/types';

import { expect, test } from '../../shared/fixtures';
import { getDiscussions } from '../support/api/get-discussions';

test.describe('Discussions', () => {
  const teamOneAdminData: UserData = generateUserData();
  const teamTwoAdminData: UserData = generateUserData();
  let teamOne: Team;
  let teamTwo: Team;
  let teamOneUserData: UserData;
  let teamTwoUserData: UserData;

  test.beforeAll(async () => {
    await registerUser(teamOneAdminData);
    await registerUser(teamTwoAdminData);

    const teams = await getTeams();
    teamOne = teams.find((team: Team) => team.name === teamOneAdminData.teamName);
    teamTwo = teams.find((team: Team) => team.name === teamTwoAdminData.teamName);

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

  test.describe('View', () => {
    let teamOneDiscussions: Discussion[];
    let teamTwoDiscussions: Discussion[];

    test.beforeAll(async () => {
      const teamOneDiscussionsData = Array.from({ length: 5 }, () => generateDiscussionData({ public: false }));
      const teamTwoDiscussionsData = Array.from({ length: 5 }, () => generateDiscussionData({ public: false }));
      teamOneDiscussions = await Promise.all(
        teamOneDiscussionsData.map(async (d) => {
          return createDiscussion(teamOneAdminData, teamOne.id, d);
        }),
      );

      teamTwoDiscussions = await Promise.all(
        teamTwoDiscussionsData.map(async (d) => {
          return createDiscussion(teamTwoAdminData, teamTwo.id, d);
        }),
      );
    });

    test.afterAll(async () => {
      await Promise.all(
        teamOneDiscussions.map(async (discussion) => {
          await deleteDiscussion(teamOneAdminData, discussion.id);
        }),
      );

      await Promise.all(
        teamTwoDiscussions.map(async (discussion) => {
          await deleteDiscussion(teamTwoAdminData, discussion.id);
        }),
      );
    });

    test.describe('Admin', () => {
      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneAdminData);
        await discussionsPage.open('/app/discussions');
      });

      test('User with "ADMIN" role should be able to see discussions in the list', async ({ discussionsPage }) => {
        await Promise.all(
          teamOneDiscussions.map(async (dt) => {
            const discussionRow = discussionsPage.getDiscussionByName(dt.title);
            await expect(discussionRow).toBeVisible();
          }),
        );
      });

      test('User with "ADMIN" role should be able to see only their team disucssions', async ({ discussionsPage }) => {
        const discussions = await discussionsPage.getDiscussions();
        await expect(discussions).toHaveCount(teamOneDiscussions.length);
      });
    });

    test.describe('User', () => {
      test.beforeEach(async ({ discussionsPage }) => {
        await discussionsPage.loginViaApi(teamOneUserData);
        await discussionsPage.open('/app/discussions');
      });

      test('User with "USER" role should be able to see discussions in the list', async ({ discussionsPage }) => {
        await Promise.all(
          teamOneDiscussions.map(async (dt) => {
            const discussionRow = discussionsPage.getDiscussionByName(dt.title);
            await expect(discussionRow).toBeVisible();
          }),
        );
      });

      test('User with "USER" role should be able to see only their team disucssions', async ({ discussionsPage }) => {
        const discussions = await discussionsPage.getDiscussions();
        await expect(discussions).toHaveCount(teamOneDiscussions.length);
      });
    });
  });

  test.describe('Delete', () => {
    let shouldCleanDiscussion = false;
    let discussion: Discussion;

    test.beforeEach(async () => {
      const discussionData = generateDiscussionData({ public: false });

      discussion = await createDiscussion(teamOneAdminData, teamOne.id, discussionData);
    });

    test.afterEach(async () => {
      if (shouldCleanDiscussion) {
        await deleteDiscussion(teamOneAdminData, discussion.id);
      }
    });

    test.describe('Admin', () => {
      test('User with "ADMIN" role should be able to delete discussion in the list', async ({ discussionsPage }) => {
        shouldCleanDiscussion = false;

        const deleteDiscussionUrl = `${process.env.NEXT_PUBLIC_API_URL}/discussions/${discussion.id}`;

        await discussionsPage.loginViaApi(teamOneAdminData);
        await discussionsPage.open('/app/discussions');

        const deleteDiscussionPromise = discussionsPage.page.waitForResponse(deleteDiscussionUrl);
        await discussionsPage.deleteDiscussion(discussion.title);
        await deleteDiscussionPromise;
        await expect(discussionsPage.noDiscussionsBanner).toBeVisible();
      });
    });

    test.describe('User', () => {
      test('User with "USER" role should NOT be able to delete discussion in the list', async ({ discussionsPage }) => {
        shouldCleanDiscussion = true;

        await discussionsPage.loginViaApi(teamOneUserData);
        await discussionsPage.open('/app/discussions');

        const discussions = await discussionsPage.getDiscussions();
        await expect(discussions).toHaveCount(1);
        const deleteDiscussionButton = discussionsPage.getDeleteDiscussionButtonByName(discussion.title);
        await expect(deleteDiscussionButton).toHaveCount(0);
      });
    });
  });
});
