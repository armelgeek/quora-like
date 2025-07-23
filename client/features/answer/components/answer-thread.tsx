import { useState } from 'react'
import { useAnswerVote } from '@/features/vote/hooks/use-answer-vote'
import { useChildAnswers } from '../hooks/use-child-answers'
import { useCreateAnswer, useUpdateAnswer, useDeleteAnswer } from '../hooks/use-answer'
import type { Answer } from '../answer.schema'
import { useSession } from '@/shared/hooks/use-session-info'
import { Edit2, Eye, EyeOff, Reply, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/shared/components/atoms/ui/button'
import { Input } from '@/shared/components/atoms/ui/input'

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

  // Ensure avatarUrl is always set for UI compatibility
  const user = answer.user ? { ...answer.user, avatarUrl: answer.user.avatarUrl ?? answer.user.image ?? null } : undefined;
  const userName = user ? (
    user.firstname || user.lastname
      ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim()
      : user.name || user.email || 'Utilisateur'
  ) : 'Utilisateur'

  return (
    <div className={`${depth > 0 ? 'ml-6 mt-2' : 'mt-3'}`}>
      {editMode ? (
        <div className="bg-white border border-gray-200 rounded-lg p-2">
          <form onSubmit={handleEdit} className="space-y-2">
            <textarea
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-vertical min-h-[60px]"
              disabled={updateAnswer.isPending}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                disabled={updateAnswer.isPending}
              >
                Valider
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                onClick={() => setEditMode(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-2 bg-[#fafbfc] rounded-md border border-gray-100 hover:shadow-sm group transition">

          <div className="w-7 h-7 rounded-full bg-blue-500 border flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="avatar"
                width={28}
                height={28}
                className="w-7 h-7 object-cover"
                unoptimized
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className='flex flex-row gap-2 justify-between'>

              <div className="flex items-center gap-2 text-xs mb-0.5">
                <span className="font-medium text-gray-900">{userName}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{new Date(answer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className='flex flex-row items-center '>
                {children && children.length > 0 && (
                  <button
                    className="text-xs flex flex-row items-center  text-gray-600 hover:underline"
                    onClick={() => setShowChildren(!showChildren)}
                  >
                    {showChildren ? <EyeOff size={16} /> : <Eye size={16} />} ({children.length})
                  </button>
                )}
                {session?.userId === answer.userId && (
                  <div className='flex flex-row ml-2 gap-1'>
                    <button
                      className="p-1 hover:bg-blue-50 rounded transition"
                      onClick={() => setShowReply(!showReply)}
                      aria-label="Répondre"
                      title="Répondre"
                      type="button"
                    >
                      <Reply size={16} />
                    </button>
                    <button
                      className="p-1 hover:bg-yellow-50 rounded transition"
                      onClick={() => setEditMode(true)}
                      aria-label="Modifier"
                      title="Modifier"
                      type="button"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      className="p-1 hover:bg-red-50 rounded transition"
                      onClick={handleDelete}
                      aria-label="Supprimer"
                      title="Supprimer"
                      type="button"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-800 break-words mb-1">{answer.body}</div>
            <div className="flex items-center gap-1 mt-1">
              {/* Votes */}
              <button
                className="p-1 hover:bg-green-50 text-green-600 rounded transition"
                onClick={() => upvoteAnswer.mutate({ answerId: answer.id, questionId })}
                disabled={upvoteAnswer.isPending}
                aria-label="Upvote"
                title="Upvote"
                type="button"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V6M5 12l7-7 7 7" /></svg>
              </button>
              <span className="text-xs text-gray-600 min-w-[1.5rem] text-center">
                {typeof answer.votesCount === 'number' ? answer.votesCount : 0}
              </span>
              <button
                className="p-1 hover:bg-red-50 text-red-600 rounded transition"
                onClick={() => downvoteAnswer.mutate({ answerId: answer.id, questionId })}
                disabled={downvoteAnswer.isPending}
                aria-label="Downvote"
                title="Downvote"
                type="button"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v13M19 12l-7 7-7-7" /></svg>
              </button>

            </div>
          </div>
        </div>
      )}

      {showReply && (
        <div className="mt-2 ml-11">
          <form onSubmit={handleReply} className="flex gap-2 items-center bg-[#f5f6fa] border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <Input
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Votre réponse..."
              disabled={isPending}
              maxLength={500}
              autoFocus
            />
            <Button
              type="submit"
              disabled={isPending || !body.trim()}
            >
              Envoyer
            </Button>
          </form>
        </div>
      )}

      {depth < 2 && children && children.length > 0 && showChildren && (
        <div className="mt-2">
          {children.map(child => (
            <AnswerThread key={child.id} answer={child} questionId={questionId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}