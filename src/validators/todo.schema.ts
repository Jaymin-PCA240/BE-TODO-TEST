import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'title is required').max(255),
  description: z.string().max(5000).optional(),
  isCompleted: z.boolean().optional()
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).nullable().optional(),
  isCompleted: z.boolean().optional()
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
