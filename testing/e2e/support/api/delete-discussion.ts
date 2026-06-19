import axios from 'axios';

import { getJwtToken } from '@testing/shared/helpers/api/sign-in';
import { Discussion, UserData } from '@testing/shared/types';

export const deleteDiscussion = async (userData: UserData, discussionId: string): Promise<Discussion> => {
  const token = await getJwtToken(userData);

  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/discussions/${discussionId}`, {
    headers: { Cookie: `${process.env.NEXT_PUBLIC_AUTH_COOKIE}=${token}` },
    timeout: 5000,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to delete discussion: ${response.status}`);
  }

  return response.data;
};
