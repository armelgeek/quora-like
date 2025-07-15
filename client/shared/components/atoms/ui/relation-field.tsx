'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/ui/select';
import { Badge } from '@/shared/components/atoms/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/atoms/ui/button';
import { cn } from '@/shared/lib/utils';
import type { FieldConfig } from '@/shared/lib/admin/admin-generator';
import { API_URL } from '@/shared/lib/config/api';

// Type pour les éléments de relation
interface RelationItem {
  id: string;
  name?: string;
  title?: string;
  label?: string;
  [key: string]: unknown;
}

interface RelationFieldProps {
  field: FieldConfig;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  className?: string;
}

// Service générique pour charger les données de relation
async function fetchRelationData(entity: string) {
  try {
    const response = await fetch(`${API_URL}/api/${entity}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${entity}`);
    }
    const data = await response.json();
    return data.data || data; 
  } catch (error) {
    console.error(`Error fetching ${entity}:`, error);
    return [];
  }
}

export function RelationField({ field, value, onChange, className }: RelationFieldProps) {
  const { relation, display } = field;
  const widget = display?.widget || 'select';
  
  const { data: relationData = [], isLoading } = useQuery({
    queryKey: ['relations', relation?.entity || 'none'],
    queryFn: () => relation ? fetchRelationData(relation.entity) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!relation, // Désactiver la query si pas de relation
  });
  
  if (!relation) {
    return null;
  }

  const handleSingleSelect = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleMultipleSelect = (selectedValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (!currentValues.includes(selectedValue)) {
      onChange([...currentValues, selectedValue]);
    }
  };

  const handleRemoveFromMultiple = (valueToRemove: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    onChange(currentValues.filter(v => v !== valueToRemove));
  };

  const getDisplayName = (item: RelationItem): string => {
    return String(item[relation.displayField] || item.name || item.title || item.id || 'Unknown');
  };

  // Affichage tag uniquement si multiple ET widget === 'tag'
  if (widget === 'tag' && relation.multiple) {
    const selectedValues = Array.isArray(value) ? value.slice() : [];
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {relationData.length === 0 ? (
          <span className="text-muted-foreground">Aucun {relation.entity} disponible</span>
        ) : (
          relationData.map((item: RelationItem) => {
            const isSelected = selectedValues.includes(item.id);
            return (
              <Badge
                key={item.id}
                variant={isSelected ? 'secondary' : 'outline'}
                className={cn(
                  'cursor-pointer select-none transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted hover:bg-accent hover:text-accent-foreground',
                )}
                onClick={() => {
                  let newValues;
                  if (isSelected) {
                    newValues = selectedValues.filter(v => v !== item.id);
                  } else {
                    newValues = [...selectedValues, item.id];
                  }
                  onChange([...newValues]);
                }}
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    let newValues;
                    if (isSelected) {
                      newValues = selectedValues.filter(v => v !== item.id);
                    } else {
                      newValues = [...selectedValues, item.id];
                    }
                    onChange([...newValues]);
                  }
                }}
                role="button"
              >
                {getDisplayName(item)}
              </Badge>
            );
          })
        )}
      </div>
    );
  }

  // Sinon, fallback :
  if (relation.multiple) {
    // fallback multi-select (sans tag)
    const selectedValues = Array.isArray(value) ? value : [];
    const selectedItems = relationData.filter((item: RelationItem) => 
      selectedValues.includes(item.id)
    );

    return (
      <div className={cn('space-y-2', className)}>
        {/* Selected items */}
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item: RelationItem) => (
              <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                {getDisplayName(item)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveFromMultiple(item.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Selector */}
        <Select onValueChange={handleMultipleSelect}>
          <SelectTrigger>
            <SelectValue 
              placeholder={
                isLoading 
                  ? `Chargement des ${relation.entity}...`
                  : `Ajouter ${relation.entity}`
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Chargement...
              </SelectItem>
            ) : relationData.length === 0 ? (
              <SelectItem value="empty" disabled>
                Aucun {relation.entity} disponible
              </SelectItem>
            ) : (
              relationData
                .filter((item: RelationItem) => !selectedValues.includes(item.id))
                .map((item: RelationItem) => (
                  <SelectItem key={item.id} value={item.id}>
                    {getDisplayName(item)}
                  </SelectItem>
                ))
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Affichage badge selectable (single value, widget === 'tag')
  if (widget === 'tag' && !relation.multiple) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {relationData.length === 0 ? (
          <span className="text-muted-foreground">Aucun {relation.entity} disponible</span>
        ) : (
          relationData.map((item: RelationItem) => (
            <Badge
              key={item.id}
              variant={value === item.id ? 'secondary' : 'outline'}
              className={cn(
                'cursor-pointer select-none transition-colors',
                value === item.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-muted hover:bg-accent hover:text-accent-foreground',
              )}
              onClick={() => onChange(item.id)}
              aria-pressed={value === item.id}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onChange(item.id);
              }}
              role="button"
            >
              {getDisplayName(item)}
            </Badge>
          ))
        )}
      </div>
    );
  }

  // Widget radio group (single ou multiple)
  if (widget === 'radio') {
    if (relation.multiple) {
      // Checkbox group pour multi
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className={cn('flex flex-col gap-2', className)} role="group" aria-label={`Sélectionner ${relation.entity}`}>
          {relationData.length === 0 ? (
            <span className="text-muted-foreground">Aucun {relation.entity} disponible</span>
          ) : (
            relationData.map((item: RelationItem) => {
              const isChecked = selectedValues.includes(item.id);
              return (
                <label key={item.id} className={cn('flex items-center gap-2 cursor-pointer', isChecked && 'font-semibold')}
                  tabIndex={0}
                  aria-checked={isChecked}
                  role="checkbox"
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      const newValues = isChecked
                        ? selectedValues.filter(v => v !== item.id)
                        : [...selectedValues, item.id];
                      onChange([...newValues]);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const newValues = isChecked
                        ? selectedValues.filter(v => v !== item.id)
                        : [...selectedValues, item.id];
                      onChange([...newValues]);
                    }}
                    className="accent-primary"
                  />
                  {getDisplayName(item)}
                </label>
              );
            })
          )}
        </div>
      );
    } else {
      // Radio group pour single
      return (
        <div className={cn('flex flex-col gap-2', className)} role="radiogroup" aria-label={`Sélectionner ${relation.entity}`}>
          {relationData.length === 0 ? (
            <span className="text-muted-foreground">Aucun {relation.entity} disponible</span>
          ) : (
            relationData.map((item: RelationItem) => (
              <label key={item.id} className={cn('flex items-center gap-2 cursor-pointer', value === item.id && 'font-semibold')}
                tabIndex={0}
                aria-checked={value === item.id}
                role="radio"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') onChange(item.id);
                }}
              >
                <input
                  type="radio"
                  checked={value === item.id}
                  onChange={() => onChange(item.id)}
                  className="accent-primary"
                />
                {getDisplayName(item)}
              </label>
            ))
          )}
        </div>
      );
    }
  }

  // Single relation (select classique stylisé)
  return (
     <div className={cn('relative', className)}>
      <Select
        value={value || ''}
        onValueChange={handleSingleSelect}
        disabled={isLoading}
      >
        <SelectTrigger aria-label={`Sélectionner ${relation.entity}`}>
          <SelectValue
            placeholder={
              isLoading
                ? `Chargement des ${relation.entity}...`
                : `Sélectionner ${relation.entity}`
            }
          />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Chargement...
            </SelectItem>
          ) : relationData.length === 0 ? (
            <SelectItem value="empty" disabled>
              Aucun {relation.entity} disponible
            </SelectItem>
          ) : (
            relationData.map((item: RelationItem) => (
              <SelectItem key={item.id} value={item.id}>
                {getDisplayName(item)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// Hook pour utiliser les relations
export function useRelationData(entity: string) {
  return useQuery({
    queryKey: ['relations', entity],
    queryFn: () => fetchRelationData(entity),
    staleTime: 5 * 60 * 1000,
  });
}

// Composant d'affichage pour les relations dans les tableaux
interface RelationDisplayProps {
  relationData: RelationItem[];
  displayField: string;
  className?: string;
}

export function RelationDisplay({ relationData, displayField, className }: RelationDisplayProps) {
  if (!relationData || relationData.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {relationData.map((item: RelationItem) => (
        <Badge key={item.id} variant="secondary">
          {String(item[displayField] || item.name || item.title || item.id || 'Unknown')}
        </Badge>
      ))}
    </div>
  );
}
