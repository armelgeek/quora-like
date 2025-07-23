import { useQuery } from '@tanstack/react-query';
import { questionStatsService, QuestionStats } from '../question.stats.service';

export function useQuestionStats() {
  return useQuery<{ data: QuestionStats }>({
    queryKey: ['question-stats'],
    queryFn: () => questionStatsService.getStats().then(res => ({ data: res.data })),
  });
}
