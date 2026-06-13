import { faker } from '@faker-js/faker';

import { DiscussionData, Discussion, Team, TeamData, User, UserData, UserRoles } from '@testing/shared/types.ts';

const getRandomId = (): string => faker.string.uuid({ version: 7 });

export const generateUserData = (role: UserRoles, overrides?: Partial<UserData>): UserData => ({
  role,
  firstName: overrides?.firstName || faker.person.firstName(),
  lastName: overrides?.lastName || faker.person.lastName(),
  email: overrides?.email || faker.internet.exampleEmail(),
  password: overrides?.password || faker.internet.password(),
  teamId: overrides?.teamId || undefined,
  teamName: overrides?.teamName || faker.company.name(),
  bio: overrides?.bio || faker.person.bio(),
});

export const generateUser = (role: UserRoles, overrides?: Partial<UserData>): User => {
  return {
    id: getRandomId(),
    createdAt: Date.now(),
    ...generateUserData(role, overrides),
  };
};

export const generateTeamData = (overrides?: Partial<TeamData>): TeamData => ({
  name: overrides?.name || faker.company.name(),
  description: overrides?.description || faker.company.catchPhrase(),
});

export const generateTeam = (overrides?: Partial<TeamData>): Team => {
  return {
    id: getRandomId(),
    createdAt: Date.now(),
    ...generateTeamData(overrides),
  };
};

export const generateDiscussionData = (overrides?: Partial<DiscussionData>): DiscussionData => ({
  title: overrides?.title || faker.commerce.productName(),
  body: overrides?.body || faker.word.words({ count: { min: 20, max: 40 } }),
  public: overrides?.public || true,
});

export const generateDiscussion = (overrides?: Partial<Omit<Discussion, 'id' | 'createAt'>>): Discussion => {
  return {
    id: getRandomId(),
    createdAt: Date.now(),
    authorId: overrides?.authorId || getRandomId(),
    teamId: overrides?.teamId || getRandomId(),
    ...generateDiscussionData(overrides),
  };
};

export const generateCommentData = () => ({
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
