"use client"



import { useAnswers } from '../hooks/use-answers';
import { Badge } from '@/shared/components/atoms/ui/badge';
import type { Answer } from '../answer.schema';
import { useState } from 'react';
import { AnswerHistory } from '@/features/answer/components/answer-history';
import QuestionStatsBanner from '@/features/question/components/question-stats-banner';

export function AnswersFeed({ page = 1, limit = 20 }: { page?: number; limit?: number }) {
  const [tab, setTab] = useState<'recent' | 'most-voted' | 'most-commented'>('recent');
  const sortMap = {
    recent: undefined,
    'most-voted': 'most-voted',
    'most-commented': 'most-answered',
  } as const;
  const { data, isLoading, error } = useAnswers({ skip: (page - 1) * limit, limit, sort: sortMap[tab] });
  const answers: Answer[] = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="flex">
      {/* Side nav gauche */}
      <nav className="w-40 flex-shrink-0 mr-6">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded transition-colors ${tab === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setTab('recent')}
            >
              Récentes
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded transition-colors ${tab === 'most-voted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setTab('most-voted')}
            >
              Plus votées
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded transition-colors ${tab === 'most-commented' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setTab('most-commented')}
            >
              Plus commentées
            </button>
          </li>
        </ul>
      </nav>
      {/* Liste réponses */}
      <div className="flex-1">
        {isLoading && <div>Chargement des réponses...</div>}
        {error && <div className="text-red-500">Erreur lors du chargement des réponses</div>}
        <div className="space-y-4">
          {answers.length > 0 ? (
            answers.map((a) => (
              <div key={a.id} className="p-4 bg-white rounded shadow border border-gray-100">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {a.user && (
                    <span className="text-xs text-gray-500">
                      {a.user.name || a.user.firstname || a.user.email || 'Utilisateur inconnu'}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</span>
                  {a.question && (
                    <Badge variant="outline">{a.question.title}</Badge>
                  )}
                  <span className="text-xs text-green-600 ml-2">
                    {typeof a.votesCount === 'number' ? `${a.votesCount} vote${a.votesCount > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
                <div className="text-sm text-gray-800 mb-1 line-clamp-3">{a.body}</div>
              </div>
            ))
          ) : (
            !isLoading && <div className="text-gray-500">Aucune réponse pour le moment.</div>
          )}
        </div>
      </div>
      {/* Colonne droite : stats et historique */}
      <aside className="w-72 flex-shrink-0 ml-6 space-y-6">
        <QuestionStatsBanner />
        <div className="bg-white rounded shadow border border-gray-100 p-4">
          <h3 className="font-semibold mb-2 text-sm text-gray-700">Historique des réponses</h3>
          {answers[0]?.question?.id ? (
            <AnswerHistory questionId={answers[0].question.id} />
          ) : (
            <div className="text-xs text-gray-400">Aucune question sélectionnée</div>
          )}
        </div>
      </aside>
    </div>
  );
}
