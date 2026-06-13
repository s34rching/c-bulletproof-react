import axios from 'axios';
import { Discussion, DiscussionData, UserData } from '@testing/shared/types.ts';
import { loginUser } from '@testing/e2e/support/api/login-user.ts';

export const createDiscussionViaApi = async (
  userData: UserData,
  discussionParams: DiscussionData,
): Promise<Discussion> => {
  const { title, body, public: isPublic } = discussionParams;

  const token = await loginUser(userData);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/discussions`,
    {
      title,
      body,
      public: isPublic,
    },
    {
      headers: { Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE}=${token}` },
      timeout: 5000,
    },
  );

  if (response.status !== 200) {
    throw new Error(`Failed to create discussion: ${response.status}`);
  }

  return response.data;
};
