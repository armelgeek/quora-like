import { useQuery } from '@tanstack/react-query';
import { answerService } from '../answer.service';

export function useAnswers(params?: { skip?: number; limit?: number; sort?: string }) {
  return useQuery({
    queryKey: ['answers', params],
    queryFn: () => answerService.list(params),
  });
}
