import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardPaginationProps<TData> {
  data: Table<TData>;
  className?: string;
}

export function FlexibleViewPagination<TData>({ data, className = "" }: CardPaginationProps<TData>) {
  const currentPage = data.getState().pagination.pageIndex + 1;
  const totalPages = data.getPageCount();
  
  if (totalPages <= 1) {
    return null;
  }
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [];
    
    pages.push(1);
    
    if (currentPage <= 3) {
      pages.push(2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push('...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    
    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-2 py-4 ${className}`}>
      <button
        onClick={() => data.previousPage()}
        disabled={!data.getCanPreviousPage()}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => data.setPageIndex(Number(page) - 1)}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              currentPage === page 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => data.nextPage()}
        disabled={!data.getCanNextPage()}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}