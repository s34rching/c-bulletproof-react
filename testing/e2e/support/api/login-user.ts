import axios from 'axios';

import { generateUserData } from '@testing/shared/data-generators';

export const loginUser = async (
  userData: Pick<ReturnType<typeof generateUserData>, 'email' | 'password'>,
): Promise<string> => {
  const { email, password } = userData;
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    { email, password },
    { timeout: 5000 },
  );
  if (response.status !== 200) {
    throw new Error(`Failed to login user: ${response.status}`);
  }
  return response.data.jwt as string;
};
