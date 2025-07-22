import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnswerSchema, AnswerPayload } from '@/features/answer/answer.schema'
import { useCreateAnswer, useAnswers } from '@/features/answer/hooks/use-answer'
import { useAnswerVote } from '@/features/vote/hooks/use-answer-vote'
import { useSession } from '@/shared/hooks/use-session-info'

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
  const { upvoteAnswer, downvoteAnswer } = useAnswerVote()
  if (isLoading) return <div className="text-xs text-gray-400">Chargement des réponses...</div>
  if (!data || data.length === 0) return <div className="text-xs text-gray-400">Aucune réponse</div>
  return (
    <ul className="mt-2 space-y-1">
      {data.map((a) => (
        <li key={a.id} className="bg-gray-50 rounded px-2 py-1 text-sm flex items-center gap-2">
          <div className="flex-1">
            <div className="font-medium text-gray-800">{a.body}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {a.user ? (
                <span>
                  {a.user.firstname || a.user.lastname
                    ? `${a.user.firstname ?? ''} ${a.user.lastname ?? ''}`.trim()
                    : a.user.name || a.user.email || 'Utilisateur'}
                </span>
              ) : (
                <span>Utilisateur</span>
              )}
              <span>•</span>
              <span>{typeof a.votesCount === 'number' ? `${a.votesCount} vote${a.votesCount > 1 ? 's' : ''}` : '0 vote'}</span>
            </div>
          </div>
          <button
            aria-label="Upvote answer"
            className="px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
            onClick={() => upvoteAnswer.mutate({ answerId: a.id, questionId })}
            disabled={upvoteAnswer.isPending}
          >▲</button>
          <button
            aria-label="Downvote answer"
            className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
            onClick={() => downvoteAnswer.mutate({ answerId: a.id, questionId })}
            disabled={downvoteAnswer.isPending}
          >▼</button>
        </li>
      ))}
    </ul>
  )
}
