"use client";

import { Button } from "@/shared/components/atoms/ui/button";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterButtonsProps {
  title?: string;
  options: FilterOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "buttons" | "pills" | "tabs";
}

export function FilterButtons({ 
  title = "Filtrer par :", 
  options, 
  defaultValue, 
  onChange,
  variant = "buttons"
}: FilterButtonsProps) {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);

  const handleChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  const baseClasses = "transition-all duration-200";
  
  const variantClasses = {
    buttons: {
      container: "flex flex-wrap gap-3",
      button: "px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:border-primary hover:text-primary",
      active: "bg-primary text-white border-primary hover:bg-accent hover:border-accent"
    },
    pills: {
      container: "flex flex-wrap gap-2",
      button: "px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-full hover:border-primary hover:text-primary",
      active: "bg-primary text-white border-primary hover:bg-accent hover:border-accent"
    },
    tabs: {
      container: "flex border-b border-gray-200",
      button: "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary hover:text-primary",
      active: "border-primary text-primary"
    }
  };

  const classes = variantClasses[variant];

  return (
    <div className="space-y-4">
      {title && (
        <span className="text-gray-700 font-medium">{title}</span>
      )}
      <div className={classes.container}>
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => handleChange(option.value)}
            className={`${baseClasses} ${classes.button} ${
              selected === option.value ? classes.active : ""
            }`}
          >
            <span>{option.label}</span>
            {option.count && (
              <Badge 
                variant="secondary" 
                className={`ml-2 text-xs ${
                  selected === option.value 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
