import Cookies from 'js-cookie';

import { db } from '@/testing/mocks/db';
import { AUTH_COOKIE, authenticate, hash } from '@/testing/mocks/utils';
import {
  createDiscussion as generateDiscussion,
  createUser as generateUser,
  createTeam as generateTeam,
  createComment as generateComment,
} from '@testing/shared/data-generators';

export const createTeam = async (
  teamProperties?: any,
): Promise<ReturnType<typeof generateTeam>> => {
  const team = generateTeam(teamProperties) as any;
  return db.team.create(team);
};

export const createUser = async (userProperties?: any) => {
  const user = generateUser(userProperties) as any;
  await db.user.create({ ...user, password: hash(user.password) });
  return user;
};

export const createDiscussion = async (discussionProperties?: any) => {
  const discussion = generateDiscussion(discussionProperties);
  return db.discussion.create(discussion);
};

export const createComment = async (commentProperties?: any) => {
  const comment = generateComment(commentProperties) as any;
  return db.comment.create(comment);
};

export const loginAsUser = async (user: any) => {
  const authUser = await authenticate(user);
  Cookies.set(AUTH_COOKIE, authUser.jwt);
  return authUser;
};
