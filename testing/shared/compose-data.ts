import { createComment, createDiscussion, createTeam, createUser } from '@testing/shared/test-utils';

export type DiscussionType = 'private' | 'public';

export type TeamMember = {
  userId: string;
  teamId: string;
};

export type TeamDiscussion = {
  discussionId: string;
  authorId: string;
  teamId: string;
  title: string;
  body: string;
};

export type TeamMemberComment = {
  commentId: string;
  body: string;
  discussionId: string;
  authorId: string;
  teamId: string;
};

export const createTeamMember = async (userData: any): Promise<TeamMember> => {
  const team = await createTeam();
  const user = await createUser(userData);

  return {
    userId: user.id,
    teamId: team.id,
  };
};

export const createAuthoredTeamDiscussion = async (userData: any, type: DiscussionType): Promise<TeamDiscussion> => {
  const teamMember = await createTeamMember(userData);

  const discussion = await createDiscussion({
    authorId: teamMember.userId,
    teamId: teamMember.teamId,
    public: type === 'public',
  });

  return {
    discussionId: discussion.id,
    authorId: teamMember.userId,
    teamId: teamMember.teamId,
    title: discussion.title,
    body: discussion.body,
  };
};

export const createTeamMemberComment = async (
  userData: any,
  discussionType: DiscussionType,
  commentBody?: string,
): Promise<TeamMemberComment> => {
  const discussion = await createAuthoredTeamDiscussion(userData, discussionType);

  const comment = await createComment({
    discussionId: discussion.discussionId,
    ...(commentBody !== undefined ? { body: commentBody } : {}),
  });

  return {
    commentId: comment.id,
    body: comment.body,
    discussionId: discussion.discussionId,
    authorId: comment.authorId,
    teamId: discussion.teamId,
  };
};
