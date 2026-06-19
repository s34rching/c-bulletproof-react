import { z } from 'zod';

export const postDiscussionSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
  teamId: z.string(),
  createdAt: z.number(),
  public: z.boolean(),
});
