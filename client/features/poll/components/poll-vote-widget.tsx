"use client"
import { useState } from 'react'

import type { PollOption } from '../poll.schema'
import { usePollByQuestion, useVotePollOption } from '../hooks/use-poll'

export default function PollVoteWidget({ questionId, userId }: { questionId: string; userId: string }) {
  const { data: poll, isLoading } = usePollByQuestion(questionId)
  const voteMutation = useVotePollOption()
  const [selected, setSelected] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  function isPollType(p: unknown): p is { options: PollOption[] } {
    return (
      typeof p === 'object' &&
      p !== null &&
      Array.isArray((p as { options?: unknown }).options)
    )
  }

  if (!isPollType(poll)) return null

  // Calculer le total des votes
  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votesCount || 0), 0)

  const handleVote = (optionId: string) => {
    if (hasVoted || selected) return
    
    console.log('Vote pour l\'option:', optionId)
    setSelected(optionId)
    setHasVoted(true)
    voteMutation.mutate({ optionId, userId, questionId })
  }

  // Calculer le pourcentage pour chaque option
  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <div className="bg-gradient-to-br mx-4 from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      {/* Header du sondage */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" 
             className="text-blue-600" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
        </svg>
        <span className="font-semibold text-gray-900">Sondage</span>
        {totalVotes > 0 && (
          <span className="text-sm text-gray-500">
            • {totalVotes} vote{totalVotes > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Options du sondage */}
      <div className="space-y-3">
        {poll.options.map((opt) => {
          const percentage = getPercentage(opt.votesCount || 0)
          const isSelected = selected === opt.id
          const showResults = hasVoted || selected

          return (
            <div key={opt.id} className="relative">
              <button
                type="button"
                aria-pressed={isSelected}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                  showResults
                    ? isSelected
                      ? 'border-blue-500 bg-blue-100 cursor-default'
                      : 'border-gray-200 bg-white cursor-default'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                } ${voteMutation.isPending ? 'opacity-60' : ''}`}
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted || Boolean(selected) || voteMutation.isPending}
              >
                {/* Barre de progression (visible après vote) */}
                {showResults && (
                  <div 
                    className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                      isSelected ? 'bg-blue-200' : 'bg-gray-100'
                    }`}
                    style={{ 
                      width: `${percentage}%`,
                      opacity: 0.3
                    }}
                  />
                )}

                {/* Contenu de l'option */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Radio button visual */}
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : showResults 
                          ? 'border-gray-300' 
                          : 'border-gray-400 group-hover:border-blue-400'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    
                    {/* Texte de l'option */}
                    <span className={`font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {opt.text}
                    </span>
                  </div>

                  {/* Résultats (visible après vote) */}
                  {showResults && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`font-semibold ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {percentage}%
                      </span>
                      <span className="text-gray-500">
                        ({opt.votesCount || 0})
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Messages de statut */}
      <div className="mt-4">
        {voteMutation.isPending && (
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Enregistrement de votre vote...
          </div>
        )}
        
        {voteMutation.isError && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {voteMutation.error?.message || 'Erreur lors du vote'}
          </div>
        )}
        
        {hasVoted && !voteMutation.isPending && !voteMutation.isError && (
          <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
            Merci pour votre vote !
          </div>
        )}
      </div>

      {/* Instructions pour l'utilisateur */}
      {!hasVoted && !selected && (
        <p className="text-xs text-gray-500 mt-3 italic">
          Sélectionnez une option pour voir les résultats
        </p>
      )}
    </div>
  )
}