import Cookies from 'js-cookie';
import { expect, test, describe, beforeEach, afterEach } from 'vitest';

import { createComment } from '@/features/comments/api/create-comment';
import { deleteComment } from '@/features/comments/api/delete-comment';
import { getComments } from '@/features/comments/api/get-comments';
import { generateUser } from '@/testing/data-generators';
import { AUTH_COOKIE } from '@/testing/mocks/utils';
import {
  createComment as seedComment,
  createDiscussion,
  createUser,
  loginAsUser,
} from '@/testing/test-utils';

import {
  createAuthoredTeamDiscussion,
  createTeamMemberComment,
} from '../../shared/compose-data';

describe('Comments API', () => {
  let user: ReturnType<typeof generateUser>;

  beforeEach(() => {
    user = generateUser();
  });

  afterEach(() => {
    Cookies.remove(AUTH_COOKIE);
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

    test('unauthenticated user should receive 401 when creating a comment', async () => {
      const { discussionId } = await createAuthoredTeamDiscussion(user);

      await expect(
        createComment({ data: { body: 'hello', discussionId } }),
      ).rejects.toThrow('Unauthorized');
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

    test('should return empty data and zero totals for a discussion with no comments', async () => {
      const { discussionId } = await createAuthoredTeamDiscussion(user);
      await loginAsUser(user);

      const { data, meta } = await getComments({ discussionId, page: 1 });

      expect(data).toHaveProperty('length', 0);
      expect(meta).toHaveProperty('page', 1);
      expect(meta).toHaveProperty('total', 0);
      expect(meta).toHaveProperty('totalPages', 0);
    });

    test('unauthenticated user should receive 401 when requesting comments for a private discussion', async () => {
      const discussion = await createDiscussion({ public: false });

      await expect(
        getComments({ discussionId: discussion.id, page: 1 }),
      ).rejects.toThrow('Unauthorized');
    });

    test('unauthenticated user should receive comments for a public discussion', async () => {
      const { discussionId } = await createTeamMemberComment(
        user,
        'Public comment',
      );

      const { data, meta } = await getComments({ discussionId, page: 1 });

      expect(data).toHaveProperty('length', 1);
      expect(meta).toHaveProperty('total', 1);
    });

    test('should return correct page 2 results when a discussion has more than 10 comments', async () => {
      const { discussionId } = await createAuthoredTeamDiscussion(user);
      await loginAsUser(user);

      for (let i = 0; i < 11; i++) {
        await seedComment({ discussionId, body: `Comment ${i}` });
      }

      const { data, meta } = await getComments({ discussionId, page: 2 });

      expect(data).toHaveProperty('length', 1);
      expect(meta).toHaveProperty('page', 2);
      expect(meta).toHaveProperty('total', 11);
      expect(meta).toHaveProperty('totalPages', 2);
    });

    test('each comment should include a nested author object instead of a plain authorId', async () => {
      const { discussionId } = await createAuthoredTeamDiscussion(user);
      await loginAsUser(user);
      await createComment({ data: { body: 'Test comment', discussionId } });

      const { data } = await getComments({ discussionId, page: 1 });

      expect(data[0]).toHaveProperty('author');
      expect(data[0].author).toHaveProperty('id');
      expect(data[0]).not.toHaveProperty('authorId');
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

    test('unauthenticated user should receive 401 when deleting a comment', async () => {
      const { commentId } = await createTeamMemberComment(user, 'My comment');

      await expect(deleteComment({ commentId })).rejects.toThrow(
        'Unauthorized',
      );
    });

    test('USER role user should not be able to delete a comment authored by another user', async () => {
      const { commentId, discussionId } = await createTeamMemberComment(
        user,
        'My comment',
      );

      const regularUser = await createUser({ role: 'USER' });
      await loginAsUser(regularUser);

      const response = await deleteComment({ commentId });
      const { data } = await getComments({ discussionId, page: 1 });

      expect(response).toBeNull();
      expect(data).toHaveProperty('length', 1);
    });

    test('ADMIN role user should be able to delete a comment authored by another user', async () => {
      const { commentId, discussionId } = await createTeamMemberComment(
        user,
        'My comment',
      );

      const adminUser = await createUser();
      await loginAsUser(adminUser);

      const response = await deleteComment({ commentId });
      const { data } = await getComments({ discussionId, page: 1 });

      expect(response).toHaveProperty('id', commentId);
      expect(data).toHaveProperty('length', 0);
    });
  });
});
