export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  published?: boolean;
}

export interface BlogCreate {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
  published?: boolean;
}

export interface BlogUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  published?: boolean;
}

export interface BlogListResponse {
  items: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogResponse {
  success: boolean;
  data?: Blog | BlogListResponse;
  error?: string;
}
