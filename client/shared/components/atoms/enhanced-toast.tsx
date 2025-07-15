"use client";

import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
}

export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
      icon: <CheckCircle2 className="h-4 w-4" />,
      className: "toast-success",
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
      icon: <XCircle className="h-4 w-4" />,
      className: "toast-error",
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
      icon: <AlertTriangle className="h-4 w-4" />,
      className: "toast-warning",
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
      icon: <Info className="h-4 w-4" />,
      className: "toast-info",
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
      ...options
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    } & ToastOptions
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success: (data) => (typeof success === "function" ? success(data) : success),
      error: (err) => (typeof error === "function" ? error(err) : error),
      ...options,
    });
  },
};
