import { Filter } from "../types/filter";

export function createQueryKeys(resource: string) {
    const keys = {
      all: [resource] as const,
      lists: () => [...keys.all, 'list'] as const,
      list: (filters: Filter) => [...keys.lists(), { filters }] as const,
      details: () => [...keys.all, 'detail'] as const,
      detail: (slug: string) => [...keys.details(), slug] as const,
    };
    return keys;
  }
  