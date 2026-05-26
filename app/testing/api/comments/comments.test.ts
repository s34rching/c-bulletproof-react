import { expect, test, describe, beforeEach } from 'vitest';

import { createComment } from '@/features/comments/api/create-comment';
import { deleteComment } from '@/features/comments/api/delete-comment';
import { getComments } from '@/features/comments/api/get-comments';
import { generateUser } from '@/testing/data-generators';
import { loginAsUser } from '@/testing/test-utils';

import {
  createAuthoredTeamDiscussion,
  createTeamMemberComment,
} from '../../shared/compose-data';

describe('Comments API', () => {
  let user: ReturnType<typeof generateUser>;

  beforeEach(() => {
    user = generateUser();
  });

  describe('createComment', () => {
    test('authorized user should be able to create comment', async () => {
      const { discussionId } = await createAuthoredTeamDiscussion(user);
      await loginAsUser(user);

      const commentBody = `${user.id} user comment`;

      const commentData = await createComment({
        data: {
          body: commentBody,
          discussionId,
        },
      });

      expect(commentData).toHaveProperty('discussionId', discussionId);
      expect(commentData).toHaveProperty('authorId', user.id);
      expect(commentData).toHaveProperty('body', commentBody);
    });
  });

  describe('getComments', () => {
    test('authorized user should be able to get comments', async () => {
      const comment = await createTeamMemberComment(user, 'My comment');
      await loginAsUser(user);

      const { data, meta } = await getComments({
        discussionId: comment.discussionId,
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
      const { commentId, discussionId } = await createTeamMemberComment(
        user,
        'My comment',
      );
      await loginAsUser(user);

      const { data: initialData, meta: initialMeta } = await getComments({
        discussionId,
        page: 1,
      });

      const response = await deleteComment({
        commentId,
      });

      const { data, meta } = await getComments({
        discussionId,
        page: 1,
      });

      expect(response).toHaveProperty('id', commentId);
      expect(initialData).toHaveProperty('length', 1);
      expect(data).toHaveProperty('length', 0);

      expect(initialMeta).toHaveProperty('page', 1);
      expect(meta).toHaveProperty('page', 1);

      expect(initialMeta).toHaveProperty('total', 1);
      expect(meta).toHaveProperty('total', 0);

      expect(initialMeta).toHaveProperty('totalPages', 1);
      expect(meta).toHaveProperty('totalPages', 0);
    });
  });
});
