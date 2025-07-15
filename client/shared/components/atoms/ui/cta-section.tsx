"use client";
import { Section } from './section';
import { Button } from './button';
import * as React from 'react';

export interface CtaAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface CtaSectionProps {
  title: string;
  subtitle?: string;
  actions: CtaAction[];
  layout?: 'vertical' | 'horizontal' | 'stacked';
  backgroundVariant?: 'white' | 'gray' | 'gradient';
  titleAlign?: 'left' | 'center' | 'right';
}

export function CtaSection({
  title,
  subtitle,
  actions,
  layout = 'horizontal',
  backgroundVariant = 'white',
  titleAlign = 'center',
}: CtaSectionProps) {
  let actionClass = '';
  if (layout === 'vertical') actionClass = 'flex flex-col gap-4 items-center';
  else if (layout === 'horizontal') actionClass = 'flex flex-col sm:flex-row gap-4 justify-center';
  else if (layout === 'stacked') actionClass = 'grid grid-cols-1 gap-2';

  // Button size: only 'sm', 'lg', 'default', 'icon' allowed
  function getButtonSize(size?: string) {
    if (size === 'sm' || size === 'lg' || size === 'icon') return size;
    return 'default';
  }

  return (
    <Section
      title={title}
      subtitle={subtitle}
      backgroundVariant={backgroundVariant}
      titleAlign={titleAlign}
    >
      <div className={actionClass}>
        {actions.map((action, i) =>
          action.href ? (
            <Button
              asChild
              key={i}
              variant={action.variant || 'primary'}
              size={getButtonSize(action.size)}
              className={action.className || 'font-bold py-3 px-8'}
            >
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button
              key={i}
              variant={action.variant || 'primary'}
              size={getButtonSize(action.size)}
              className={action.className || 'font-bold py-3 px-8'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        )}
      </div>
    </Section>
  );
}
