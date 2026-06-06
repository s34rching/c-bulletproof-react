import axios from 'axios';
import { generateUser } from '@testing/shared/data-generators';

export const registerUser = async (
  userData: ReturnType<typeof generateUser>,
): Promise<void> => {
  const { firstName, lastName, email, password, teamName } = userData;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      firstName,
      lastName,
      email,
      password,
      teamName,
      teamId: null,
    },
    {
      timeout: 5000,
    },
  );

  if (response.status !== 200) {
    throw new Error(`Failed to register user: ${response.status}`);
  }
};
