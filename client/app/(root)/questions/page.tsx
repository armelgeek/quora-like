"use client"

import Link from 'next/link'
import { useQuestions } from '@/features/question/hooks/use-question'
import { useVote } from '@/features/vote/hooks/use-vote'
import { useState } from 'react'
import { Badge } from '@/shared/components/atoms/ui/badge'
import { AnswerForm, AnswersList } from '@/features/answer/components/answer-form'
import { useSession } from '@/shared/hooks/use-session-info'
import PollVoteWidget from '@/features/poll/components/poll-vote-widget'

export default function QuestionsFeedPage() {
    const [page, setPage] = useState(1)
    const { session } = useSession()
    const limit = 10
    const { data: questionsRaw, isLoading, error } = useQuestions({ skip: (page - 1) * limit, limit })
    const questions = Array.isArray(questionsRaw) ? questionsRaw : []
    const { upvoteQuestion, downvoteQuestion } = useVote()
    return (
        <div className="max-w-2xl mx-auto py-10 px-2">
            <h1 className="text-2xl font-bold mb-6">Questions récentes</h1>
            {isLoading && <div>Chargement...</div>}
            {error && <div className="text-red-500">Erreur lors du chargement des questions</div>}
            <div className="space-y-4">
                {questions.length > 0 ? (
                    questions.map((q) => (
                        <div key={q.id}>
                            <div className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <Badge variant="outline">{q.topic?.name || 'Topic inconnu'}</Badge>
                                    <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                                    {q.user && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            {q.user.name || q.user.firstname || q.user.email || 'Utilisateur inconnu'}
                                        </span>
                                    )}
                                    <span className="text-xs text-blue-600 ml-2">
                                        {typeof q.answersCount === 'number' ? `${q.answersCount} réponse${q.answersCount > 1 ? 's' : ''}` : ''}
                                    </span>
                                    <span className="text-xs text-green-600 ml-2">
                                        {typeof q.votesCount === 'number' ? `${q.votesCount} vote${q.votesCount > 1 ? 's' : ''}` : ''}
                                    </span>
                                    <button
                                        aria-label="Upvote"
                                        className="ml-2 px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                                        onClick={() => upvoteQuestion.mutate(q.id)}
                                        disabled={upvoteQuestion.isPending}
                                    >
                                        ▲
                                    </button>
                                    <button
                                        aria-label="Downvote"
                                        className="ml-1 px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                                        onClick={() => downvoteQuestion.mutate(q.id)}
                                        disabled={downvoteQuestion.isPending}
                                    >
                                        ▼
                                    </button>
                                </div>
                                    <div className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">{q.title}</div>
                                    <div className="text-sm text-gray-600 line-clamp-2">{q.body}</div>

                                    {q.type === 'poll' && session?.userId && (
                                        <div className="mb-6">
                                            <PollVoteWidget questionId={q.id} userId={session.userId} />
                                        </div>
                                    )}
                                <div className="mt-2">
                                    <AnswersList questionId={q.id} />
                                    <AnswerForm questionId={q.id} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !isLoading && <div className="text-gray-500">Aucune question pour le moment.</div>
                )}
            </div>
            <div className="flex justify-between items-center mt-8">
                <button
                    className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Précédent
                </button>
                <span className="text-sm">Page {page}</span>
                <button
                    className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={questions.length < limit}
                >
                    Suivant
                </button>
            </div>
        </div>
    )
}
