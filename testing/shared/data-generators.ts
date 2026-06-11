import { faker } from '@faker-js/faker';

const getRandomId = (): string => faker.string.uuid({ version: 7 });

export const generateUserData = () => ({
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

export const createUserData = <T extends Partial<ReturnType<typeof generateUserData>>>(overrides?: T) => {
  return { ...generateUserData(), ...overrides };
};

const generateTeamData = () => ({
  id: getRandomId(),
  name: faker.company.name(),
  description: faker.company.catchPhrase(),
  createdAt: Date.now(),
});

export const createTeamData = <T extends Partial<ReturnType<typeof generateTeamData>>>(overrides?: T) => {
  return { ...generateTeamData(), ...overrides };
};

const generateDiscussionData = () => ({
  id: getRandomId(),
  title: `Discussion: ${faker.commerce.productName()}`,
  body: faker.word.words({ count: { min: 20, max: 40 } }),
  createdAt: Date.now(),
  public: true,
});

export const createDiscussionData = <T extends Partial<ReturnType<typeof generateDiscussionData>>>(
  overrides?: T & {
    authorId?: string;
    teamId?: string;
  },
) => {
  return { ...generateDiscussionData(), ...overrides };
};

const generateCommentData = () => ({
  id: getRandomId(),
  body: faker.word.words({ count: { min: 10, max: 30 } }),
  createdAt: Date.now(),
});

export const createCommentData = <T extends Partial<ReturnType<typeof generateCommentData>>>(
  overrides?: T & {
    authorId?: string;
    discussionId?: string;
  },
) => {
  return { ...generateCommentData(), ...overrides };
};
