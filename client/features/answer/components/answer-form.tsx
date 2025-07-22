import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnswerSchema, AnswerPayload } from '@/features/answer/answer.schema'
import { useCreateAnswer, useAnswers } from '@/features/answer/hooks/use-answer'
import { useSession } from '@/shared/hooks/use-session-info'
import { AnswerThread } from './answer-thread'


export function AnswerForm({ questionId }: { questionId: string }) {
  const { session } = useSession()
  const { mutate, isPending, error } = useCreateAnswer(questionId)
  const form = useForm<AnswerPayload>({
    resolver: zodResolver(AnswerSchema.pick({ body: true })),
    defaultValues: { body: '' }
  })
  const onSubmit = (data: AnswerPayload) => {
    if (!session) return
    mutate({ ...data, userId: session.userId })
    form.reset()
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mt-2">
      <input
        {...form.register('body')}
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Votre réponse..."
        disabled={isPending}
      />
      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={isPending}>
        Répondre
      </button>
      {error && <span className="text-xs text-red-500 ml-2">Erreur</span>}
    </form>
  )
}
export function AnswersList({ questionId }: { questionId: string }) {
  const { data, isLoading } = useAnswers(questionId)
  if (isLoading) return <div className="text-xs text-gray-400">Chargement des réponses...</div>
  if (!data || data.length === 0) return <div className="text-xs text-gray-400">Aucune réponse</div>
  return (
    <div className="mt-2 space-y-1">
      {data.filter(a => !a.parentAnswerId).map(a => (
        <AnswerThread key={a.id} answer={a} questionId={questionId} />
      ))}
    </div>
  )
}
