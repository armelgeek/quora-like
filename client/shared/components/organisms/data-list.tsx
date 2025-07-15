"use client";

import React from 'react';
import { useList } from '@/shared/hooks/useList';
import { Button } from '@/shared/components/atoms/ui/button';
import { Input } from '@/shared/components/atoms/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { Badge } from '@/shared/components/atoms/ui/badge';
import { Checkbox } from '@/shared/components/atoms/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/atoms/ui/table';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  X,
  Loader2
} from 'lucide-react';

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  width?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  type: 'select' | 'text' | 'number' | 'date';
  options?: { label: string; value: string }[];
}

interface DataListProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnConfig<T>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: Record<string, FilterOption>;
  selectable?: boolean;
  actions?: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pageSize?: number;
  onSelectionChange?: (items: T[]) => void;
}

function SearchBar({ searchQuery, onSearchChange, placeholder }: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder || "Rechercher..."}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}

function FilterBar({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onRemoveFilter, 
  onClearFilters 
}: {
  filters: Record<string, unknown>;
  filterOptions: Record<string, FilterOption>;
  onFilterChange: (key: string, value: unknown) => void;
  onRemoveFilter: (key: string) => void;
  onClearFilters: () => void;
}) {
  const activeFilters = Object.entries(filters).filter(([, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.entries(filterOptions).map(([key, option]) => (
          <div key={key} className="min-w-[200px]">
            {option.type === 'select' ? (
              <Select
                value={String(filters[key] || '')}
                onValueChange={(value) => onFilterChange(key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Filtrer par ${option.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  {option.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={option.type}
                placeholder={`Filtrer par ${option.label}`}
                value={String(filters[key] || '')}
                onChange={(e) => onFilterChange(key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Filtres actifs:</span>
          {activeFilters.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="gap-1">
              {filterOptions[key]?.label}: {String(value)}
              <Button
                variant="ghost"
                size="sm"
                className="p-0 w-4 h-4"
                onClick={() => onRemoveFilter(key)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
          >
            Effacer tous
          </Button>
        </div>
      )}
    </div>
  );
}

function SortIcon({ sortConfig, columnKey }: {
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  columnKey: string;
}) {
  if (!sortConfig || sortConfig.key !== columnKey) {
    return <ArrowUpDown className="w-4 h-4" />;
  }
  
  return sortConfig.direction === 'asc' 
    ? <ArrowUp className="w-4 h-4" />
    : <ArrowDown className="w-4 h-4" />;
}

function Pagination({ pagination, onPageChange }: {
  pagination: { page: number; pageSize: number; total: number };
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Affichage de {startItem} à {endItem} sur {pagination.total} éléments
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            
            if (totalPages > 5) {
              if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
            }
            
            return (
              <Button
                key={pageNum}
                variant={pagination.page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages}
        >
          Suivant
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function DataList<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  searchable = true,
  searchPlaceholder,
  filterable = false,
  filterOptions = {},
  selectable = false,
  actions,
  loading = false,
  emptyMessage = "Aucun élément trouvé",
  className = "",
  pageSize = 10,
  onSelectionChange,
}: DataListProps<T>) {
  const list = useList({
    data,
    initialPageSize: pageSize,
    searchFields: searchable ? columns.map(col => col.key) : undefined,
    sortableFields: columns.filter(col => col.sortable).map(col => col.key),
    filterableFields: filterable ? Object.keys(filterOptions) as (keyof T)[] : undefined,
  });

  React.useEffect(() => {
    onSelectionChange?.(list.selectedItems);
  }, [list.selectedItems, onSelectionChange]);

  const allSelected = list.paginatedItems.length > 0 && 
    list.paginatedItems.every(item => list.isSelected(item));
  const someSelected = list.paginatedItems.some(item => list.isSelected(item));

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-4">
          {searchable && (
            <SearchBar
              searchQuery={list.searchQuery}
              onSearchChange={list.setSearchQuery}
              placeholder={searchPlaceholder}
            />
          )}
          
          {filterable && Object.keys(filterOptions).length > 0 && (
            <FilterBar
              filters={list.filters}
              filterOptions={filterOptions}
              onFilterChange={list.setFilter}
              onRemoveFilter={list.removeFilter}
              onClearFilters={list.clearFilters}
            />
          )}
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          list.selectAll();
                        } else {
                          list.deselectAll();
                        }
                      }}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected && !allSelected;
                      }}
                    />
                  </TableHead>
                )}
                
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className={column.sortable ? "cursor-pointer select-none" : ""}
                    onClick={() => column.sortable && list.sortBy(String(column.key))}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <SortIcon 
                          sortConfig={list.sortConfig} 
                          columnKey={String(column.key)} 
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
                
                {actions && <TableHead className="w-24">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                    className="text-center py-8"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : list.paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                    className="text-center py-8 text-gray-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                list.paginatedItems.map((item, index) => (
                  <TableRow key={index}>
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={list.isSelected(item)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              list.selectItem(item);
                            } else {
                              list.deselectItem(item);
                            }
                          }}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render 
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')
                        }
                      </TableCell>
                    ))}
                    
                    {actions && (
                      <TableCell>
                        {actions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {list.pagination.total > list.pagination.pageSize && (
          <Pagination
            pagination={list.pagination}
            onPageChange={list.goToPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
