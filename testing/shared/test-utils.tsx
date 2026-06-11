import Cookies from 'js-cookie';

import { db } from '@/fake-api/db';
import { AUTH_COOKIE, authenticate, hash } from '@/fake-api/utils';
import {
  createDiscussionData,
  createUserData,
  createTeamData,
  createCommentData,
} from '@testing/shared/data-generators';

export const seedTeam = async (teamProperties?: any): Promise<ReturnType<typeof createTeamData>> => {
  const team = createTeamData(teamProperties) as any;
  return db.team.create(team);
};

export const seedUser = async (userProperties?: any) => {
  const user = createUserData(userProperties) as any;
  await db.user.create({ ...user, password: hash(user.password) });
  return user;
};

export const seedDiscussion = async (discussionProperties?: any) => {
  const discussion = createDiscussionData(discussionProperties);
  return db.discussion.create(discussion);
};

export const seedComment = async (commentProperties?: any) => {
  const comment = createCommentData(commentProperties) as any;
  return db.comment.create(comment);
};

export const loginAsUser = async (user: any) => {
  const authUser = await authenticate(user);
  Cookies.set(AUTH_COOKIE, authUser.jwt);
  return authUser;
};
