import { generateTeamData } from '@testing/shared/data-generators.ts';
import { seedComment, seedDiscussion, seedTeam, seedUser } from '@testing/shared/test-utils';
import { TeamMemberProperties, UserData } from '@testing/shared/types.ts';

export type DiscussionType = 'private' | 'public';

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

export const createTeamMember = async (userData: UserData): Promise<TeamMemberProperties> => {
  const team = await seedTeam(generateTeamData());
  const user = await seedUser({ ...userData, teamId: team.id });

  return {
    userId: user.id,
    teamId: team.id,
  };
};

export const createAuthoredTeamDiscussion = async (
  userData: UserData,
  type: DiscussionType,
): Promise<TeamDiscussion> => {
  const teamMember = await createTeamMember(userData);

  const discussion = await seedDiscussion({
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
  userData: UserData,
  discussionType: DiscussionType,
  commentBody?: string,
): Promise<TeamMemberComment> => {
  const { discussionId, teamId, authorId } = await createAuthoredTeamDiscussion(userData, discussionType);

  const comment = await seedComment({
    authorId,
    discussionId,
    ...(commentBody !== undefined ? { body: commentBody } : {}),
  });

  return {
    commentId: comment.id,
    body: comment.body,
    discussionId,
    authorId,
    teamId,
  };
};
