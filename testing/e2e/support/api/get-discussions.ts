import { request } from '@playwright/test';

import { RequestHandler } from '@testing/shared/request-handler.ts';
import { Discussion, UserData } from '@testing/shared/types';

import { getJwtToken } from '../../../shared/helpers/api/get-jwt-token';

export const getDiscussions = async (userData: UserData): Promise<Discussion[]> => {
  const token = await getJwtToken(userData);

  const context = await request.newContext();
  const handler = new RequestHandler(process.env.NEXT_PUBLIC_API_URL!, context);

  try {
    const getDiscussionsResponse = await handler
      .path('/discussions')
      .headers({ Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE!}=${token}` })
      .getRequest(200);

    return getDiscussionsResponse.data;
  } catch (e) {
    if (e instanceof Object) {
      Error.captureStackTrace(e, getDiscussions);
    }
    throw e;
  } finally {
    await context.dispose();
  }
};
