"use client";

import { cn } from "@/shared/lib/utils";
import { ReactNode, useState } from "react";
import { Button } from "@/shared/components/atoms/ui/button";
import { ButtonProps } from "@/shared/components/atoms/ui/button";
import { Loader2 } from "lucide-react";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  loadingText?: string;
  successText?: string;
  isLoading?: boolean;
  onSuccess?: () => void;
  animationDuration?: number;
}

export function AnimatedButton({
  children,
  loadingText = "Chargement...",
  successText,
  isLoading = false,
  onSuccess,
  animationDuration = 2000,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    if (successText) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
      }, animationDuration);
    } else {
      onSuccess?.();
    }
  };

  if (showSuccess && successText) {
    return (
      <Button
        {...props}
        disabled={true}
        className={cn(
          "transition-all duration-300 bg-green-600 hover:bg-green-600 text-white",
          className
        )}
      >
        <span className="animate-pulse">{successText}</span>
      </Button>
    );
  }

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "transition-all duration-200 hover:scale-105 active:scale-95",
        isLoading && "cursor-not-allowed",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        if (!isLoading && successText) {
          handleSuccess();
        }
      }}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  className, 
  duration = 500 
}: FadeInProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
  duration?: number;
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className,
  duration = 300,
}: SlideInProps) {
  const slideClasses = {
    left: "slide-in-from-left-4",
    right: "slide-in-from-right-4",
    up: "slide-in-from-top-4",
    down: "slide-in-from-bottom-4",
  };

  return (
    <div
      className={cn(
        "animate-in fade-in",
        slideClasses[direction],
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  className, 
  duration = 300 
}: ScaleInProps) {
  return (
    <div
      className={cn(
        "animate-in zoom-in-95 fade-in",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredList({ 
  children, 
  staggerDelay = 100, 
  className 
}: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

interface PulseOnChangeProps {
  children: ReactNode;
  value: unknown;
  className?: string;
}

export function PulseOnChange({ 
  children, 
  className 
}: PulseOnChangeProps) {
  const [key, setKey] = useState(0);

  // Déclenche une nouvelle animation quand la valeur change
  useState(() => {
    setKey(prev => prev + 1);
  });

  return (
    <div
      key={key}
      className={cn(
        "animate-pulse",
        className
      )}
      style={{
        animationDuration: "1s",
        animationIterationCount: "1",
      }}
    >
      {children}
    </div>
  );
}
