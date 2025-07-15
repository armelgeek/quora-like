import type { Filter } from '../types/filter';

export interface QueryKeyConfig {
  entity: string;
  subEntity?: string;
}

export function createQueryKeys(config: QueryKeyConfig) {
  const { entity } = config;

  return {
    all: [entity] as const,
    lists: () => [...[entity], 'list'] as const,
    list: (filter: Filter) => [...[entity, 'list'], filter] as const,
    detail: (slug: string) => [...[entity], 'detail', slug] as const,
  };
}
