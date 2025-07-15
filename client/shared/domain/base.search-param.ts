
import {
    createLoader,
    createSerializer,
    parseAsInteger,
    parseAsString,
    type ParserMap,
  } from 'nuqs/server';
  
  export const baseSearchParams = {
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    sortBy: parseAsString.withDefault(''),
    sortDir: parseAsString.withDefault('')
  };

  export function createSearchParams(additionalParams = {}) {
    const mergedParams = { ...baseSearchParams, ...additionalParams };
    const parserMap = mergedParams as unknown as ParserMap;
    
    return {
      params: mergedParams,
      load: createLoader(parserMap),
      serialize: createSerializer(parserMap),
    };
  }
