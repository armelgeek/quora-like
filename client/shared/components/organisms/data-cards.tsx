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
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  X,
  Loader2
} from 'lucide-react';

export interface CardField<T> {
  key: keyof T;
  label?: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  primary?: boolean; // Champ principal (titre de la card)
  secondary?: boolean; // Champ secondaire (sous-titre)
  badge?: boolean; // Afficher comme badge
  hidden?: boolean; // Caché sur mobile
}

export interface FilterOption {
  label: string;
  value: string;
  type: 'select' | 'text' | 'number' | 'date';
  options?: { label: string; value: string }[];
}

interface DataCardsProps<T extends Record<string, unknown>> {
  data: T[];
  fields: CardField<T>[];
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
  cardClassName?: string;
  gridCols?: 1 | 2 | 3 | 4;
  onSelectionChange?: (items: T[]) => void;
  onItemClick?: (item: T) => void;
}

function SearchAndFilters<T extends Record<string, unknown>>({ 
  list,
  searchable,
  searchPlaceholder,
  filterable,
  filterOptions,
}: {
  list: ReturnType<typeof useList<T>>;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: Record<string, FilterOption>;
}) {
  const [showFilters, setShowFilters] = React.useState(false);
  
  const activeFilters = Object.entries(list.filters).filter(([, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {searchable && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder || "Rechercher..."}
              value={list.searchQuery}
              onChange={(e) => list.setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        
        {filterable && filterOptions && Object.keys(filterOptions).length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Filtres dépliables */}
      {showFilters && filterable && filterOptions && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(filterOptions).map(([key, option]) => (
                <div key={key}>
                  <label className="text-sm font-medium mb-2 block">
                    {option.label}
                  </label>
                  {option.type === 'select' ? (
                    <Select
                      value={String(list.filters[key] || '')}
                      onValueChange={(value) => list.setFilter(key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Tous les ${option.label.toLowerCase()}`} />
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
                      placeholder={`Filtrer par ${option.label.toLowerCase()}`}
                      value={String(list.filters[key] || '')}
                      onChange={(e) => list.setFilter(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            
            {activeFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">Filtres actifs:</span>
                  {activeFilters.map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="gap-1">
                      {filterOptions[key]?.label}: {String(value)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 w-4 h-4"
                        onClick={() => list.removeFilter(key)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={list.clearFilters}
                  >
                    Effacer tous
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DataCard<T extends Record<string, unknown>>({ 
  item, 
  fields, 
  actions, 
  selectable, 
  isSelected, 
  onToggleSelect, 
  onClick,
  className 
}: {
  item: T;
  fields: CardField<T>[];
  actions?: (item: T) => React.ReactNode;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onClick?: () => void;
  className?: string;
}) {
  const primaryField = fields.find(f => f.primary);
  const secondaryField = fields.find(f => f.secondary);
  const badgeFields = fields.filter(f => f.badge);
  const contentFields = fields.filter(f => !f.primary && !f.secondary && !f.badge);

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      } ${isSelected ? 'ring-2 ring-primary' : ''} ${className || ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {primaryField && (
              <CardTitle className="text-lg font-semibold truncate">
                {primaryField.render 
                  ? primaryField.render(item[primaryField.key], item)
                  : String(item[primaryField.key] || '')
                }
              </CardTitle>
            )}
            {secondaryField && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {secondaryField.render 
                  ? secondaryField.render(item[secondaryField.key], item)
                  : String(item[secondaryField.key] || '')
                }
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {selectable && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggleSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {actions && (
              <div onClick={(e) => e.stopPropagation()}>
                {actions(item)}
              </div>
            )}
          </div>
        </div>
        
        {badgeFields.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badgeFields.map((field) => (
              <Badge key={String(field.key)} variant="outline" className="text-xs">
                {field.render 
                  ? field.render(item[field.key], item)
                  : String(item[field.key] || '')
                }
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      {contentFields.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {contentFields.map((field) => (
              <div 
                key={String(field.key)} 
                className={`flex justify-between text-sm ${
                  field.hidden ? 'hidden sm:flex' : ''
                }`}
              >
                {field.label && (
                  <span className="text-muted-foreground font-medium">
                    {field.label}:
                  </span>
                )}
                <span className="text-right">
                  {field.render 
                    ? field.render(item[field.key], item)
                    : String(item[field.key] || '')
                  }
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function Pagination({ pagination, onPageChange }: {
  pagination: { page: number; pageSize: number; total: number };
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
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
          <span className="hidden sm:inline">Précédent</span>
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
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function DataCards<T extends Record<string, unknown>>({
  data,
  fields,
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
  cardClassName = "",
  pageSize = 12,
  gridCols = 3,
  onSelectionChange,
  onItemClick,
}: DataCardsProps<T>) {
  const list = useList({
    data,
    initialPageSize: pageSize,
    searchFields: searchable ? fields.map(field => field.key) : undefined,
    filterableFields: filterable ? Object.keys(filterOptions) as (keyof T)[] : undefined,
  });

  React.useEffect(() => {
    onSelectionChange?.(list.selectedItems);
  }, [list.selectedItems, onSelectionChange]);

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[gridCols];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        </div>
      )}

      {/* Search and Filters */}
      <SearchAndFilters
        list={list}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        filterable={filterable}
        filterOptions={filterOptions}
      />

      {/* Selection Actions */}
      {selectable && list.selectedItems.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {list.selectedItems.length} élément(s) sélectionné(s)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={list.deselectAll}
          >
            Désélectionner tout
          </Button>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : list.paginatedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${gridColsClass}`}>
          {list.paginatedItems.map((item, index) => (
            <DataCard
              key={index}
              item={item}
              fields={fields}
              actions={actions}
              selectable={selectable}
              isSelected={list.isSelected(item)}
              onToggleSelect={() => {
                if (list.isSelected(item)) {
                  list.deselectItem(item);
                } else {
                  list.selectItem(item);
                }
              }}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              className={cardClassName}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        pagination={list.pagination}
        onPageChange={list.goToPage}
      />
    </div>
  );
}
