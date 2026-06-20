import { z } from 'zod';

export const postCommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  authorId: z.string(),
  discussionId: z.string(),
  createdAt: z.number(),
});
