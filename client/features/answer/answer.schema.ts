import { z } from 'zod'

export const AnswerSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1, 'Le contenu est requis'),
  questionId: z.string().uuid(),
  userId: z.string().uuid(),
  parentAnswerId: z.string().uuid().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type UserType = {
  id: string
  name?: string | null
  firstname?: string | null
  lastname?: string | null
  email?: string | null
  emailVerified?: string | null
  image?: string | null
  avatarUrl?: string | null // alias for image, for UI compatibility
  isAdmin?: boolean
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

import type { Question } from '@/features/question/question.schema';
export type Answer = z.infer<typeof AnswerSchema> & {
  user?: UserType | null
  votesCount?: number
  question?: Question | null
}
export type AnswerPayload = Pick<Answer, 'body' | 'questionId' | 'userId' | 'parentAnswerId'>
