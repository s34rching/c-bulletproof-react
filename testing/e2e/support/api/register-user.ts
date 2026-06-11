import axios from 'axios';
import { UserData } from '@testing/shared/types.ts';

export const registerUser = async (userData: UserData): Promise<void> => {
  const { firstName, lastName, email, password, teamName, teamId } = userData;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      firstName,
      lastName,
      email,
      password,
      teamName,
      teamId
    },
    {
      timeout: 5000,
    },
  );

  if (response.status !== 200) {
    throw new Error(`Failed to register user: ${response.status}`);
  }
};
