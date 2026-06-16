import Cookies from 'js-cookie';

import { db } from '@/fake-api/db';
import { AUTH_COOKIE, authenticate, hash } from '@/fake-api/utils';
import { createCommentData } from '@testing/shared/data-generators';
import { Credentials, DiscussionData, Entity, Team, TeamData, UserData, UserRoles } from '@testing/shared/types.ts';

export const seedTeam = async (teamProperties: TeamData): Promise<Team> => {
  return db.team.create(teamProperties);
};

export const seedUser = async (userData: UserData): Promise<Omit<Entity<UserData>, 'teamName'>> => {
  const user = await db.user.create({ ...userData, password: hash(userData.password) });
  return {
    ...user,
    password: userData.password,
    role: user.role as UserRoles,
  };
};

export const seedDiscussion = async (discussionData: DiscussionData) => {
  return db.discussion.create(discussionData);
};

export const seedComment = async (commentProperties?: any) => {
  const comment = createCommentData(commentProperties) as any;
  return db.comment.create(comment);
};

export const loginAsUser = async (user: Credentials) => {
  const authUser = await authenticate(user);
  Cookies.set(AUTH_COOKIE, authUser.jwt);
  return authUser;
};
