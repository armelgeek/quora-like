"use client";

import React from "react";
import { FieldConfig } from "@/shared/lib/admin/admin-generator";
import { Input } from "@/shared/components/atoms/ui/input";
import { Select } from "@/shared/components/atoms/ui/select";

export type AdminTableFiltersProps = {
  fields: FieldConfig[];
  filters: Record<string, string | number | undefined>;
  onChange: (filters: Record<string, string | number | undefined>) => void;
};

export function AdminTableFilters({ fields, filters, onChange }: AdminTableFiltersProps) {
  function handleChange(key: string, value: string | number | undefined) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {fields.filter(f => f.display?.showInTable !== false && f.type !== 'relation' && f.type !== 'image' && f.type !== 'file').map(field => {
        switch (field.type) {
          case 'select':
            return (
              <Select
                key={field.key}
                value={filters[field.key]?.toString() || ''}
                onValueChange={v => handleChange(field.key, v)}
              >
                <option value="">Tous</option>
                {Array.isArray(field.options) && field.options.map(opt => (
                  typeof opt === 'string' ? (
                    <option key={opt} value={opt}>{opt}</option>
                  ) : (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  )
                ))}
              </Select>
            );
          case 'date':
            return (
              <Input
                key={field.key}
                type="date"
                value={filters[field.key]?.toString() || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className="min-w-[120px]"
              />
            );
          case 'number':
            return (
              <Input
                key={field.key}
                type="number"
                value={filters[field.key]?.toString() || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.label}
                className="min-w-[100px]"
              />
            );
          default:
            return (
              <Input
                key={field.key}
                value={filters[field.key]?.toString() || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.label}
                className="min-w-[120px]"
              />
            );
        }
      })}
    </div>
  );
}
