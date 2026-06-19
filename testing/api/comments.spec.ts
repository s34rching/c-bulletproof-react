import { expect } from '@playwright/test';

import { generateCommentData, generateUserData } from '@testing/shared/data-generators';
import { test } from '@testing/shared/fixtures';
import { postCommentSchema } from '@testing/shared/schemas/comments/POST_comment';

test.describe('Comments API', () => {
  test('user with "ADMIN" role should be able to create a comment', async ({ requestHandler }) => {
    const adminUserData = generateUserData();

    const admin = await requestHandler
      .url(process.env.NEXT_PUBLIC_API_URL!)
      .path('/auth/register')
      .payload(adminUserData)
      .postRequest(200);

    const createCommentResponse = await requestHandler
      .url(process.env.NEXT_PUBLIC_API_URL!)
      .path('/comments')
      .headers({
        Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE}=${admin.jwt}`,
      })
      .payload(generateCommentData())
      .postRequest(200);

    const result = postCommentSchema.safeParse(createCommentResponse);

    expect(result.success).toBeTruthy();
  });
});
