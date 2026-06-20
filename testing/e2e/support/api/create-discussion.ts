import { request } from '@playwright/test';

import { RequestHandler } from '@testing/shared/request-handler.ts';
import { Discussion, DiscussionData, UserData } from '@testing/shared/types';

import { getJwtToken } from '../../../shared/helpers/api/get-jwt-token';

export const createDiscussion = async (
  userData: UserData,
  teamId: string,
  discussionParams: DiscussionData,
): Promise<Discussion> => {
  const { title, body, public: isPublic } = discussionParams;
  const requestPayload = {
    teamId,
    title,
    body,
    public: isPublic,
  };

  const token = await getJwtToken(userData);
  const context = await request.newContext();
  const handler = new RequestHandler(process.env.NEXT_PUBLIC_API_URL!, context);

  try {
    const createDiscussionResponse = await handler
      .path('/discussions')
      .headers({ Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE!}=${token}` })
      .payload(requestPayload)
      .postRequest(200);

    return createDiscussionResponse;
  } catch (e) {
    if (e instanceof Object) {
      Error.captureStackTrace(e, createDiscussion);
    }
    throw e;
  } finally {
    await context.dispose();
  }
};
