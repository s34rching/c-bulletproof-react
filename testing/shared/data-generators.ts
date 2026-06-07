const getRandomString = () => Math.random().toString(36).slice(2, 10);

export const generateUser = () => ({
  id: crypto.randomUUID() + Math.random(),
  firstName: `User${getRandomString()}`,
  lastName: `User${getRandomString()}`,
  email: `${getRandomString()}@example.com`,
  password: `Pwd${getRandomString()}!`,
  teamId: crypto.randomUUID(),
  teamName: `Company${getRandomString()}`,
  role: 'ADMIN',
  bio: `Bio text ${getRandomString()}`,
  createdAt: Date.now(),
});

export const createUser = <T extends Partial<ReturnType<typeof generateUser>>>(overrides?: T) => {
  return { ...generateUser(), ...overrides };
};

const generateTeam = () => ({
  id: crypto.randomUUID(),
  name: `Company${getRandomString()}`,
  description: `Description ${getRandomString()}`,
  createdAt: Date.now(),
});

export const createTeam = <T extends Partial<ReturnType<typeof generateTeam>>>(overrides?: T) => {
  return { ...generateTeam(), ...overrides };
};

const generateDiscussion = () => ({
  id: crypto.randomUUID(),
  title: `Discussion ${getRandomString()}`,
  body: `Body text ${getRandomString()}`,
  createdAt: Date.now(),
  public: true,
});

export const createDiscussion = <T extends Partial<ReturnType<typeof generateDiscussion>>>(
  overrides?: T & {
    authorId?: string;
    teamId?: string;
  },
) => {
  return { ...generateDiscussion(), ...overrides };
};

const generateComment = () => ({
  id: crypto.randomUUID(),
  body: `Comment ${getRandomString()}`,
  createdAt: Date.now(),
});

export const createComment = <T extends Partial<ReturnType<typeof generateComment>>>(
  overrides?: T & {
    authorId?: string;
    discussionId?: string;
  },
) => {
  return { ...generateComment(), ...overrides };
};
