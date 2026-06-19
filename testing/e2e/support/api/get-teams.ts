import { request } from '@playwright/test';

import { RequestHandler } from '@testing/shared/request-handler.ts';

export const getTeams = async () => {
  const context = await request.newContext();
  const handler = new RequestHandler(process.env.NEXT_PUBLIC_API_URL!, context);

  try {
    const getTeamsResponse = await handler
      .path('/teams')
      .headers({
        Accept: 'application/json',
        'Content-type': 'application/json',
      })
      .getRequest(200);

    return getTeamsResponse.data;
  } catch (e: unknown) {
    if (e instanceof Object) {
      Error.captureStackTrace(e, getTeams);
    }
    throw e;
  } finally {
    await context.dispose();
  }
};
