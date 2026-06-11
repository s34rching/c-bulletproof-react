import axios from 'axios';
import { generateUserData } from '@testing/shared/data-generators';
import { undefined } from 'zod';

export const registerUser = async (userData: ReturnType<typeof generateUserData>): Promise<void> => {
  const { firstName, lastName, email, password, teamName, teamId, role, bio } = userData;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      firstName,
      lastName,
      email,
      password,
      teamName,
      teamId,
      role,
      bio,
    },
    {
      timeout: 5000,
    },
  );

  if (response.status !== 200) {
    throw new Error(`Failed to register user: ${response.status}`);
  }
};
