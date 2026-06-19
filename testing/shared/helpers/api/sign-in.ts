import { request } from '@playwright/test';

import { RequestHandler } from '@testing/shared/request-handler.ts';
import { User } from '@testing/shared/types.ts';

export const signInViaApi = async (userData: { email: string; password: string }) => {
  const context = await request.newContext();
  const handler = new RequestHandler(process.env.NEXT_PUBLIC_API_URL!, context);

  try {
    const response: { user: User; jwt: string } = await handler.path('/auth/login').payload(userData).postRequest(200);

    return response.jwt;
  } catch (e: unknown) {
    if (e instanceof Object) {
      Error.captureStackTrace(e, signInViaApi);
    }
    throw e;
  } finally {
    await context.dispose();
  }
};
