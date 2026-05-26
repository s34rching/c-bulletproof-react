import { expect, test, describe } from 'vitest';

import { createComment } from '@/features/comments/api/create-comment';
import { deleteComment } from '@/features/comments/api/delete-comment';
import { getComments } from '@/features/comments/api/get-comments';
import {
  loginAsUser,
  createUser,
  createDiscussion,
  createTeam,
  createComment as createCommentRecord,
} from '@/testing/test-utils';

describe('Comments API', () => {
  describe('createComment', () => {
    test('authorized user should be able to create comment', async () => {
      const team = await createTeam();
      const user = await createUser({ teamId: team.id });
      const discussion = await createDiscussion({
        authorId: user.id,
        teamId: team.id,
      });

      await loginAsUser(user);
      const commentBody = `${user.id} user comment`;

      const commentData = await createComment({
        data: {
          body: commentBody,
          discussionId: discussion.id,
        },
      });

      expect(commentData).toHaveProperty('discussionId', discussion.id);
      expect(commentData).toHaveProperty('authorId', user.id);
      expect(commentData).toHaveProperty('body', commentBody);
    });
  });

  describe('getComments', () => {
    test('authorized user should be able to get comments', async () => {
      const team = await createTeam();
      const user = await createUser({ teamId: team.id });
      const discussion = await createDiscussion({
        authorId: user.id,
        teamId: team.id,
      });

      await createCommentRecord({
        discussionId: discussion.id,
        authorId: user.id,
        body: `${user.id} user comment`,
      });

      await loginAsUser(user);

      const { data, meta } = await getComments({
        discussionId: discussion.id,
        page: 1,
      });

      expect(data).toHaveProperty('length', 1);
      expect(meta).toHaveProperty('page', 1);
      expect(meta).toHaveProperty('total', 1);
      expect(meta).toHaveProperty('totalPages', 1);
    });
  });

  describe('deleteComment', () => {
    test('authorized user should be able to delete comment', async () => {
      const team = await createTeam();
      const user = await createUser({ teamId: team.id });
      const discussion = await createDiscussion({
        authorId: user.id,
        teamId: team.id,
      });

      await createCommentRecord({
        discussionId: discussion.id,
        authorId: user.id,
        body: `${user.id} user comment`,
      });

      await loginAsUser(user);

      const targetComment = (
        await getComments({
          discussionId: discussion.id,
          page: 1,
        })
      ).data[0];

      const response = await deleteComment({
        commentId: targetComment.id,
      });

      const { data, meta } = await getComments({
        discussionId: discussion.id,
        page: 1,
      });

      expect(response).toHaveProperty('id', targetComment.id);
      expect(data).toHaveProperty('length', 0);
      expect(meta).toHaveProperty('page', 1);
      expect(meta).toHaveProperty('total', 0);
      expect(meta).toHaveProperty('totalPages', 0);
    });
  });
});
