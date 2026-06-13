import axios from 'axios';
import { Discussion, UserData } from '@testing/shared/types.ts';
import { loginUser } from '@testing/e2e/support/api/login-user.ts';

export const getDiscussions = async (userData: UserData): Promise<Discussion[]> => {
  const token = await loginUser(userData);

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/discussions`, {
    headers: { Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE}=${token}` },
    timeout: 5000,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to get discussion: ${response.status}`);
  }

  return response.data.data;
};
