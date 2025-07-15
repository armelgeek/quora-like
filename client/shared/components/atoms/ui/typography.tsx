import { cva, VariantProps } from "class-variance-authority";

import clsx from "clsx";
import { ComponentProps, ReactNode } from "react";
import { useMemo } from "react";

export type TypoVariantProps = VariantProps<typeof typographyVariant>;

export const typographyVariant = cva("", {
    variants: {
        variant: {
            h1: "text-6xl",
            h2: "text-4xl",
            h3: "text-2xl",
            p4: "text-xl",
            p: "text-lg",
            span: "text-lg",
            small: "text-base",
        },
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        },
        color: {
            default: "text-dark",
            error: "text-destructive",
        },
        shadow: {
            none: "text-shadow-none",
            sm: "text-shadow-[2px_3px_rgba(0_0_0_/_0.25)]",
        },
        weight: {
            default: "font-normal",
            bold: "font-black",
        },
        styleCase: {
            default: "normal-case",
            uppercase: "uppercase",
        },
    },
    defaultVariants: {
        variant: "p",
        align: "left",
        color: "default",
        shadow: "none",
        weight: "default",
        styleCase: "default",
    },
});

interface Props extends Omit<ComponentProps<"p">, "color">, TypoVariantProps {
    children: ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function Typography({
    as = "span",
    variant,
    children,
    className,
    align,
    color,
    shadow,
    styleCase,
    weight,
}: Props) {
    const Component = as;
    const _styleCase = useMemo(() => {
        if (["h2", "h3"].find((a) => a === as)) {
            return "uppercase";
        }
        return styleCase;
    }, [as, styleCase]);
    const _weight = useMemo(() => {
        if (["h1", "h2", "h3"].find((a) => a === as)) {
            return "bold";
        }
        return weight;
    }, [as, weight]);
    const _shadow = useMemo(() => {
        if (["h1", "h2", "h3"].find((a) => a === as)) {
            return "sm";
        }
        return shadow;
    }, [as, shadow]);
    const _variant = useMemo(() => {
        if (["small", "p4"].find((v) => v === variant)) {
            return variant;
        }
        return as;
    }, [as, variant]);

    return (
        <Component
            className={clsx(
                className,
                typographyVariant({
                    variant: _variant,
                    align,
                    color,
                    shadow: _shadow,
                    weight: _weight,
                    styleCase: _styleCase,
                })
            )}
        >
            {children}
        </Component>
    );
}
