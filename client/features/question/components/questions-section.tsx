"use client"

import { useQuestions } from '../hooks/use-question';
import { Badge } from '@/shared/components/atoms/ui/badge';
import { useVote } from '@/features/vote/hooks/use-vote';
import { useSession } from '@/shared/hooks/use-session-info';
import PollVoteWidget from '@/features/poll/components/poll-vote-widget';

export function QuestionsSection({
  title,
  sort,
  limit = 5
}: {
  title: string;
  sort: 'recent' | 'most-answered' | 'bump' | 'most-voted' | 'no-answer' | 'populaire';
  limit?: number;
}) {
  const { session } = useSession();
  const { data: questionsRaw, isLoading, error } = useQuestions({ skip: 0, limit, sort });
  const questions = Array.isArray(questionsRaw) ? questionsRaw : [];
  const { upvoteQuestion, downvoteQuestion } = useVote();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {isLoading && <div>Chargement...</div>}
      {error && <div className="text-red-500">Erreur lors du chargement</div>}
      <div className="space-y-3">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.id} className="p-4 bg-white rounded shadow border border-gray-100">
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
                {Array.isArray(q.tags) && q.tags.length > 0 && (
                  <span className="flex flex-wrap gap-1 ml-2">
                    {q.tags.map((tag: { id: string; name: string }) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
                    ))}
                  </span>
                )}
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
                <div className="mb-4">
                  <PollVoteWidget questionId={q.id} userId={session.userId} />
                </div>
              )}
            </div>
          ))
        ) : (
          !isLoading && <div className="text-gray-500">Aucune question.</div>
        )}
      </div>
    </div>
  );
}
