import axios from 'axios';
import { randEmail, randPassword, randUserName } from '@ngneat/falso';

export const createTeamViaApi = async (
  teamName: string,
): Promise<{ id: string; name: string }> => {
  await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      firstName: randUserName({ withAccents: false }),
      lastName: randUserName({ withAccents: false }),
      email: randEmail(),
      password: randPassword(),
      teamName,
      teamId: null,
    },
    { timeout: 5000 },
  );

  const { data } = await axios.get<{ data: Array<{ id: string; name: string }> }>(
    `${process.env.NEXT_PUBLIC_API_URL}/teams`,
    { timeout: 5000 },
  );

  const team = data.data.find((t) => t.name === teamName);
  if (!team) throw new Error(`Team "${teamName}" was not found after creation`);
  return team;
};
