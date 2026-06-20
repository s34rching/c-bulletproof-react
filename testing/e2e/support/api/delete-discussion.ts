import { request } from '@playwright/test';

import { RequestHandler } from '@testing/shared/request-handler';
import { Discussion, UserData } from '@testing/shared/types';

import { getJwtToken } from '../../../shared/helpers/api/get-jwt-token';

export const deleteDiscussion = async (userData: UserData, discussionId: string): Promise<Discussion> => {
  const token = await getJwtToken(userData);

  const context = await request.newContext();
  const handler = new RequestHandler(process.env.NEXT_PUBLIC_API_URL!, context);

  try {
    const response = await handler
      .path(`/discussions/${discussionId}`)
      .headers({ Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE!}=${token}` })
      .deleteRequest(200);

    return response.data;
  } catch (e) {
    if (e instanceof Object) {
      Error.captureStackTrace(e, deleteDiscussion);
    }
    throw e;
  } finally {
    await context.dispose();
  }
};
