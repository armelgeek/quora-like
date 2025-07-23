"use client";
import { useQuestionStats } from '../hooks/use-question-stats';

export default function QuestionStatsBanner() {
  const { data, isLoading, error } = useQuestionStats();

  if (isLoading) return <div className="p-4 bg-gray-100 rounded animate-pulse">Chargement des statistiques...</div>;
  if (error) return <div className="p-4 bg-red-100 rounded text-red-700">Erreur lors du chargement des statistiques</div>;
  if (!data) return null;

  const stats = data.data;

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white border rounded shadow mb-6">
      <Stat label="Questions" value={stats.totalQuestions} />
      <Stat label="Réponses" value={stats.totalAnswers} />
      <Stat label="Votes" value={stats.totalVotes} />
      <Stat label="Sans réponse" value={stats.noAnswer} />
      <Stat label="Classiques" value={stats.classic} />
      <Stat label="Sondages" value={stats.poll} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center min-w-[90px]">
      <span className="text-lg font-bold text-primary-700">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
