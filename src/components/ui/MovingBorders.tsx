"use client";
import React, { forwardRef, useRef } from "react";
import {
    motion,
    useAnimationFrame,
    useMotionTemplate,
    useMotionValue,
    useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

type PropsOf<C extends React.ElementType> = React.ComponentPropsWithoutRef<C>;
type RefOf<C extends React.ElementType> = React.ComponentPropsWithRef<C>["ref"];

type ButtonOwnProps = {
    borderRadius?: string;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    className?: string;
    children?: React.ReactNode;
};

type PolymorphicProps<C extends React.ElementType> = ButtonOwnProps & {
    as?: C;
} & Omit<PropsOf<C>, keyof ButtonOwnProps | "as">;

type ButtonComponent = {
    <C extends React.ElementType = "button">(
        props: PolymorphicProps<C> & { ref?: RefOf<C> }
    ): React.ReactElement | null;
    displayName?: string;
};

type MovingBorderProps = React.PropsWithChildren<{
    duration?: number;
    rx?: string;
    ry?: string;
}> &
    React.SVGProps<SVGSVGElement>;

export const MovingBorder: React.FC<MovingBorderProps> = ({
    children,
    duration = 3000,
    rx,
    ry,
    ...otherProps
}) => {
    const rectRef = useRef<SVGRectElement | null>(null);
    const progress = useMotionValue<number>(0);
    let lastFrameTime = 0;

    useAnimationFrame((time: number) => {
        const length = rectRef.current?.getTotalLength();
        if (!length || duration <= 0) return;
        if (time - lastFrameTime < 1 / 60) return;
        lastFrameTime = time;
        const pxPerMs = length / duration;
        progress.set((time * pxPerMs) % length);
    });

    const x = useTransform(progress, (val) => rectRef.current?.getPointAtLength(val).x ?? 0);
    const y = useTransform(progress, (val) => rectRef.current?.getPointAtLength(val).y ?? 0);

    const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="absolute h-full w-full"
                width="100%"
                height="100%"
                {...otherProps}
            >
                <rect ref={rectRef} fill="none" width="100%" height="100%" rx={rx} ry={ry} />
            </svg>
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                }}
            >
                {children}
            </motion.div>
        </>
    );
};

function _ButtonImpl<C extends React.ElementType = "button">(
    {
        as,
        borderRadius = "1.75rem",
        children,
        containerClassName,
        borderClassName,
        duration = 3000,
        className,
        ...otherProps
    }: PolymorphicProps<C>,
    ref: RefOf<C>
) {
    const Component = (as || "button") as React.ElementType;
    const content = (
        <>
            <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
                <MovingBorder duration={duration} rx="30%" ry="30%">
                    <div
                        className={cn(
                            "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
                            borderClassName
                        )}
                    />
                </MovingBorder>
            </div>
            <div
                className={cn(
                    "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
                    className
                )}
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                {children}
            </div>
        </>
    );
    return React.createElement(
        Component,
        {
            ref,
            className: cn(
                "relative overflow-hidden bg-transparent p-[1px] text-xl md:col-span-2",
                containerClassName
            ),
            style: { borderRadius },
            ...otherProps,
        } as PropsOf<typeof Component>,
        content
    );
}

export const Button = forwardRef(
    _ButtonImpl as unknown as (
        props: PolymorphicProps<"button"> & { ref?: RefOf<"button"> }
    ) => React.ReactElement | null
) as ButtonComponent;

Button.displayName = "Button";
