import { useAnswerHistory } from '../hooks/use-answer'

export function AnswerHistory({ questionId }: { questionId: string }) {
  const { data, isLoading } = useAnswerHistory(questionId)
  if (isLoading) return <div className="text-xs text-gray-400">Chargement de l'historique...</div>
  if (!data || data.length === 0) return null
  return (
    <div className="mb-4">
      <div className="font-semibold text-sm mb-1">Historique des réponses</div>
      <ul className="space-y-1">
        {data.map((item, idx) => (
          <li key={idx} className="text-xs text-gray-700">
            <span className="font-medium text-blue-700">{item.user?.firstname || item.user?.name || item.user?.email || 'Utilisateur'}</span>
            {' '}a ajouté une réponse :
            <span className="italic text-gray-600 mx-1">{item.body.length > 40 ? item.body.slice(0, 40) + '…' : item.body}</span>
            <span className="text-gray-400 ml-2">{new Date(item.createdAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
