"use client"

import { AnswersFeed } from '@/features/answer/components/answers-feed'
import { useState } from 'react'

export default function AnswersPage() {
  const [page, setPage] = useState(1)
  const limit = 20
  return (
    <div className="max-w-2xl mx-auto py-10 px-2">
      <h1 className="text-2xl font-bold mb-6">Toutes les réponses</h1>
      <AnswersFeed page={page} limit={limit} />
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
        >
          Suivant
        </button>
      </div>
    </div>
  )
}
