"use client"
import { useRouter, useParams } from 'next/navigation'
import { useSession } from '@/shared/hooks/use-session-info'
import { useQuestionDetail } from '@/features/question/hooks/use-question-detail'
import PollVoteWidget from '@/features/poll/components/poll-vote-widget'
import { AnswersList, AnswerForm } from '@/features/answer/components/answer-form'

export default function QuestionDetailPage() {
  const { id: questionId } = useParams() as { id: string }
  const { session } = useSession()
  const { data: question, isLoading } = useQuestionDetail(questionId)

  if (isLoading) return <div>Chargement...</div>
  if (!question) return <div>Question introuvable</div>

  return (
    <div className="max-w-2xl mx-auto py-10 px-2">
      <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
      <div className="mb-4 text-gray-700">{question.body}</div>
      {question.type === 'poll' && session?.userId && (
        <div className="mb-6">
          <PollVoteWidget questionId={questionId} userId={session.userId} />
        </div>
      )}
      <AnswersList questionId={questionId} />
      <AnswerForm questionId={questionId} />
    </div>
  )
}
