import { faker } from '@faker-js/faker';

const getRandomId = (): string => faker.string.uuid({ version: 7 });

export const generateUser = () => ({
  id: getRandomId(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.exampleEmail(),
  password: faker.internet.password(),
  teamId: getRandomId(),
  teamName: faker.company.name(),
  role: 'ADMIN',
  bio: faker.person.bio(),
  createdAt: Date.now(),
});

export const createUser = <T extends Partial<ReturnType<typeof generateUser>>>(overrides?: T) => {
  return { ...generateUser(), ...overrides };
};

const generateTeam = () => ({
  id: getRandomId(),
  name: faker.company.name(),
  description: faker.company.catchPhrase(),
  createdAt: Date.now(),
});

export const createTeam = <T extends Partial<ReturnType<typeof generateTeam>>>(overrides?: T) => {
  return { ...generateTeam(), ...overrides };
};

const generateDiscussion = () => ({
  id: getRandomId(),
  title: `Discussion: ${faker.commerce.productName()}`,
  body: faker.word.words({ count: { min: 20, max: 40 } }),
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
  id: getRandomId(),
  body: faker.word.words({ count: { min: 10, max: 30 } }),
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
