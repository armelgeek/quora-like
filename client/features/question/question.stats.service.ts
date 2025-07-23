import { API_ENDPOINTS } from '@/shared/config/api';
import { BaseService } from '@/shared/lib/services/base-service';

export type QuestionStats = {
  totalQuestions: number;
  totalAnswers: number;
  totalVotes: number;
  noAnswer: number;
  popular: number;
  classic: number;
  poll: number;
};


export class QuestionStatsService extends BaseService {
  async getStats() {
    return this.get<QuestionStats>(API_ENDPOINTS.question.stats);
  }
}

export const questionStatsService = new QuestionStatsService();
