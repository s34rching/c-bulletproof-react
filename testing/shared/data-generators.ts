import { faker } from '@faker-js/faker';

import {
  DiscussionData,
  Discussion,
  Team,
  TeamData,
  User,
  UserData,
  DiscussionSeedData,
  CommentData,
  CommentSeedData,
  Comment,
} from '@testing/shared/types.ts';

const getRandomId = (): string => faker.string.uuid({ version: 7 });

export const generateUserData = (overrides?: Partial<UserData>): UserData => ({
  firstName: overrides?.firstName || faker.person.firstName(),
  lastName: overrides?.lastName || faker.person.lastName(),
  email: overrides?.email || faker.internet.exampleEmail(),
  password: overrides?.password || faker.internet.password(),
  teamId: overrides?.teamId || undefined,
  teamName: overrides?.teamName || faker.company.name(),
  bio: overrides?.bio || faker.person.bio(),
});

export const generateUser = (overrides?: Partial<UserData>): User => ({
  id: getRandomId(),
  createdAt: Date.now(),
  ...generateUserData(overrides),
});

export const generateTeamData = (overrides?: Partial<TeamData>): TeamData => ({
  name: overrides?.name || faker.company.name(),
  description: overrides?.description || faker.company.catchPhrase(),
});

export const generateTeam = (overrides?: Partial<TeamData>): Team => ({
  id: getRandomId(),
  createdAt: Date.now(),
  ...generateTeamData(overrides),
});

export const generateDiscussionData = (overrides?: Partial<DiscussionData>): DiscussionData => ({
  title: overrides?.title || faker.commerce.productName(),
  body: overrides?.body || faker.word.words({ count: { min: 20, max: 40 } }),
  public: overrides?.public ?? true,
});

export const generateDiscussionSeedData = (overrides?: Partial<DiscussionSeedData>): DiscussionSeedData => ({
  authorId: overrides?.authorId || getRandomId(),
  teamId: overrides?.teamId || getRandomId(),
  ...generateDiscussionData(overrides),
});

export const generateDiscussion = (overrides?: Partial<Omit<Discussion, 'id' | 'createdAt'>>): Discussion => ({
  id: getRandomId(),
  createdAt: Date.now(),
  ...generateDiscussionSeedData(overrides),
});

export const generateCommentData = (overrides?: Partial<CommentData>): CommentData => ({
  body: overrides?.body || faker.word.words({ count: { min: 10, max: 30 } }),
});

export const generateCommentSeedData = (overrides?: Partial<CommentSeedData>): CommentSeedData => ({
  authorId: overrides?.authorId || getRandomId(),
  discussionId: overrides?.discussionId || getRandomId(),
  ...generateCommentData(overrides),
});

export const generateComment = (overrides?: Partial<Omit<Comment, 'id' | 'createdAt'>>): Comment => ({
  id: getRandomId(),
  createdAt: Date.now(),
  ...generateCommentSeedData(overrides),
});
