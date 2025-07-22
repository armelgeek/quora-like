import { useState } from 'react'
import { useAnswerVote } from '@/features/vote/hooks/use-answer-vote'
import { useChildAnswers } from '../hooks/use-child-answers'
import { useCreateAnswer, useUpdateAnswer, useDeleteAnswer } from '../hooks/use-answer'
import type { Answer } from '../answer.schema'
import { useSession } from '@/shared/hooks/use-session-info'

export function AnswerThread({ answer, questionId, depth = 0 }: { answer: Answer; questionId: string; depth?: number }) {
  const { upvoteAnswer, downvoteAnswer } = useAnswerVote()
  const { data: children } = useChildAnswers(answer.id)
  const [showReply, setShowReply] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  const { session } = useSession()

  const { mutate, isPending } = useCreateAnswer(questionId)
  const updateAnswer = useUpdateAnswer(questionId)
  const deleteAnswer = useDeleteAnswer(questionId)
  const [body, setBody] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editBody, setEditBody] = useState(answer.body)

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !body.trim()) return
    mutate({ body, questionId, userId: session.userId, parentAnswerId: answer.id })
    setBody('')
    setShowReply(false)
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !editBody.trim()) return
    updateAnswer.mutate({ id: answer.id, data: { body: editBody } }, {
      onSuccess: () => setEditMode(false)
    })
  }

  const handleDelete = () => {
    if (window.confirm('Supprimer cette réponse ?')) {
      deleteAnswer.mutate({ id: answer.id, parentAnswerId: answer.parentAnswerId ?? undefined })
    }
  }

  return (
  <div style={{ marginLeft: depth < 2 ? depth * 24 : 0 }} className="mt-2">
      <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1 text-sm">
        <div className="flex-1">
          {editMode ? (
            <form onSubmit={handleEdit} className="flex gap-2 items-center">
              <input
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
                disabled={updateAnswer.isPending}
              />
              <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded" disabled={updateAnswer.isPending}>Valider</button>
              <button type="button" className="px-2 py-1 bg-gray-200 rounded" onClick={() => setEditMode(false)}>Annuler</button>
            </form>
          ) : (
            <>
              <div className="font-medium text-gray-800">{answer.body}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                {answer.user ? (
                  <span>
                    {answer.user.firstname || answer.user.lastname
                      ? `${answer.user.firstname ?? ''} ${answer.user.lastname ?? ''}`.trim()
                      : answer.user.name || answer.user.email || 'Utilisateur'}
                  </span>
                ) : (
                  <span>Utilisateur</span>
                )}
                <span>•</span>
                <span>{typeof answer.votesCount === 'number' ? `${answer.votesCount} vote${answer.votesCount > 1 ? 's' : ''}` : '0 vote'}</span>
                <span>•</span>
                <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
              </div>
            </>
          )}
        </div>
        <button
          aria-label="Upvote answer"
          className="px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
          onClick={() => upvoteAnswer.mutate({ answerId: answer.id, questionId })}
          disabled={upvoteAnswer.isPending}
        >▲</button>
        <button
          aria-label="Downvote answer"
          className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
          onClick={() => downvoteAnswer.mutate({ answerId: answer.id, questionId })}
          disabled={downvoteAnswer.isPending}
        >▼</button>
        <button
          className="ml-2 text-xs text-blue-600 hover:underline"
          onClick={() => setShowReply((v) => !v)}
        >Répondre</button>
        {session?.userId === answer.userId && !editMode && (
          <>
            <button
              className="ml-2 text-xs text-yellow-600 hover:underline"
              onClick={() => setEditMode(true)}
              disabled={updateAnswer.isPending}
            >Modifier</button>
            <button
              className="ml-2 text-xs text-red-600 hover:underline"
              onClick={handleDelete}
              disabled={deleteAnswer.isPending}
            >Supprimer</button>
          </>
        )}
        {children && children.length > 0 && (
          <button
            className="ml-2 text-xs text-gray-600 hover:underline"
            onClick={() => setShowChildren(v => !v)}
          >
            {showChildren ? 'Masquer' : 'Afficher'} {children.length} réponse{children.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
      {showReply && (
        <form onSubmit={handleReply} className="flex gap-2 mt-1 ml-6">
          <input
            value={body}
            onChange={e => setBody(e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-sm"
            placeholder="Votre réponse..."
            disabled={isPending}
          />
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={isPending}>
            Envoyer
          </button>
        </form>
      )}
      {depth < 2 && children && children.length > 0 && showChildren && (
        <div className={depth === 0 ? "ml-6" : undefined}>
          {children.map(child => (
            <AnswerThread key={child.id} answer={child} questionId={questionId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
