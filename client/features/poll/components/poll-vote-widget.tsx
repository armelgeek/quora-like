"use client"
import { useState } from 'react'

import type { PollOption } from '../poll.schema'
import { usePollByQuestion, useVotePollOption } from '../hooks/use-poll'

export default function PollVoteWidget({ questionId, userId }: { questionId: string; userId: string }) {
  const { data: poll, isLoading } = usePollByQuestion(questionId)
  const voteMutation = useVotePollOption()
  const [selected, setSelected] = useState<string | null>(null)

  if (isLoading) return <div>Chargement du sondage...</div>

  function isPollType(p: unknown): p is { options: PollOption[] } {
    return (
      typeof p === 'object' &&
      p !== null &&
      Array.isArray((p as { options?: unknown }).options)
    )
  }
  if (!isPollType(poll)) return <div>Aucun sondage pour cette question.</div>


  const handleVote = (optionId: string) => {
    console.log('Vote pour l’option:', optionId)
    setSelected(optionId)
    voteMutation.mutate({ optionId, userId, questionId })
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Sondage</div>
      <ul className="space-y-2">
        {poll.options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              aria-pressed={selected === opt.id}
              className={`w-full text-left px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${selected === opt.id ? 'bg-blue-100 border-blue-500' : 'border-gray-200'}`}
              onClick={() => handleVote(opt.id)}
              disabled={!!selected || voteMutation.isPending}
            >
              {opt.text} <span className="ml-2 text-xs text-gray-500">({opt.votesCount} votes)</span>
            </button>
          </li>
        ))}
      </ul>
      {voteMutation.isError && <div className="text-red-600 mt-2">{voteMutation.error?.message || 'Erreur lors du vote'}</div>}
      {selected && <div className="text-green-600 mt-2">Merci pour votre vote !</div>}
    </div>
  )
}
