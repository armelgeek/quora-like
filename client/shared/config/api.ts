
export const API_ENDPOINTS = {
  endpoint: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    version: "v1",
  },
  question: {
    base: '/v1/questions',
    create: '/v1/questions',
    list: '/v1/questions',
    detail: (id: string) => `/v1/questions/${id}`,
    update: (id: string) => `/v1/questions/${id}`,
    delete: (id: string) => `/v1/questions/${id}`,
    stats: '/v1/questions/stats'
  },
  topic: {
    base: '/v1/topics',
    create: '/v1/topics',
    list: '/v1/topics',
    detail: (id: string) => `/v1/topics/${id}`,
    update: (id: string) => `/v1/topics/${id}`,
    delete: (id: string) => `/v1/topics/${id}`
  },
  vote: {
    base: '/v1/votes',
    upAnswer: (answerId: string) => `/v1/votes/upa/${answerId}`,
    downAnswer: (answerId: string) => `/v1/votes/downa/${answerId}`,
    upQuestion: (questionId: string) => `/v1/votes/up/${questionId}`,
    downQuestion: (questionId: string) => `/v1/votes/down/${questionId}`,
    delete: (voteId: string) => `/v1/votes/${voteId}`,
    listByAnswer: (answerId: string) => `/v1/votes?answerId=${answerId}`,
    listByQuestion: (questionId: string) => `/v1/votes?questionId=${questionId}`
  },
  answer: {
    base: '/v1/answers',
    create: '/v1/answers',
    list: '/v1/answers',
    byQuestion: (questionId: string) => `/v1/answers?questionId=${questionId}`,
    detail: (id: string) => `/v1/answers/${id}`,
    update: (id: string) => `/v1/answers/${id}`,
    delete: (id: string) => `/v1/answers/${id}`
  },
  poll: {
    base: '/v1/polls',
    vote: '/v1/polls/vote',
    byQuestion: (questionId: string) => `/v1/polls?questionId=${questionId}`
  }
};
