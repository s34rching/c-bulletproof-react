import axios from 'axios';
import { generateUser } from '@/testing/data-generators';

export const registerUser = async (userData: Partial<ReturnType<typeof generateUser>>): Promise<void> => {
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
  );

  if (response.status !== 200) {
    throw new Error(`Failed to register user: ${response.status}`);
  }
};
