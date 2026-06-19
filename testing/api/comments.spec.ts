import { expect } from '@playwright/test';

import { generateDiscussionData, generateUserData } from '@testing/shared/data-generators.ts';
import { test } from '@testing/shared/fixtures.ts';
import { postDiscussionSchema } from '@testing/shared/schemas/POST_discussion';
import { UserRoles } from '@testing/shared/types';

test.describe('Comments API', () => {
  test('user with "ADMIN" role should be able to create a comment', async ({ requestHandler }) => {
    const adminUserData = generateUserData(UserRoles.ADMIN);

    const admin = await requestHandler
      .url(process.env.NEXT_PUBLIC_API_URL!)
      .path('/auth/register')
      .payload(adminUserData)
      .postRequest(200);

    const createDiscussionResponse = await requestHandler
      .url(process.env.NEXT_PUBLIC_API_URL!)
      .path('/discussions')
      .headers({
        Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE}=${admin.jwt}`,
      })
      .payload(generateDiscussionData())
      .postRequest(200);

    const isSuccess = postDiscussionSchema.parse(createDiscussionResponse);

    expect(isSuccess).toBeTruthy();
  });
});
