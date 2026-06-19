import Cookies from 'js-cookie';

import { db } from '@/fake-api/db';
import { AUTH_COOKIE, authenticate, hash } from '@/fake-api/utils';
import {
  Comment,
  CommentSeedData,
  Credentials,
  Discussion,
  DiscussionSeedData,
  Entity,
  Team,
  TeamData,
  UserData,
} from '@testing/shared/types.ts';

export const seedTeam = async (teamProperties: TeamData): Promise<Team> => {
  return db.team.create(teamProperties);
};

export const seedUser = async (userData: UserData): Promise<Omit<Entity<UserData>, 'teamName'>> => {
  const user = await db.user.create({ ...userData, password: hash(userData.password) });
  return {
    ...user,
    password: userData.password,
  };
};

export const seedDiscussion = async (discussionData: DiscussionSeedData): Promise<Discussion> => {
  return db.discussion.create(discussionData);
};

export const seedComment = async (commentData: CommentSeedData): Promise<Comment> => {
  return db.comment.create(commentData);
};

export const loginAsUser = async (user: Credentials) => {
  const authUser = await authenticate(user);
  Cookies.set(AUTH_COOKIE, authUser.jwt);
  return authUser;
};
