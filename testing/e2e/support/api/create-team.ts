import axios from 'axios';
import { registerUser } from '@testing/e2e/support/api/register-user.ts';
import { generateUserData } from '@testing/shared/data-generators.ts';

export const createTeamViaApi = async (
  userData: ReturnType<typeof generateUserData>,
): Promise<{ id: string; name: string }> => {
  const { teamName } = userData;

  await registerUser(userData);

  const { data } = await axios.get<{ data: Array<{ id: string; name: string }> }>(
    `${process.env.NEXT_PUBLIC_API_URL}/teams`,
    { timeout: 5000 },
  );

  const team = data.data.find((t) => t.name === teamName);
  if (!team) throw new Error(`Team "${teamName}" was not found after creation`);
  return team;
};
