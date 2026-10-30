"use client";

import React, { useRef, useCallback } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "card" | "pill" | "2xl";
  className?: string;
}

export function MagneticBentoContainer({
  children,
  className = "",
  variant = "card",
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback((target: HTMLElement) => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const x = targetRect.left - containerRect.left + container.scrollLeft;
    const y = targetRect.top - containerRect.top + container.scrollTop;
    const w = targetRect.width;
    const h = targetRect.height;

    container.style.setProperty("--bento-x", `${Math.round(x)}px`);
    container.style.setProperty("--bento-y", `${Math.round(y)}px`);
    container.style.setProperty("--bento-w", `${Math.round(w)}px`);
    container.style.setProperty("--bento-h", `${Math.round(h)}px`);
    container.style.setProperty("--bento-opacity", "1");
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Ignore simulated touch mouse events to prevent sticky mobile states
      if (e.pointerType === "touch") return;

      const container = containerRef.current;
      if (!container) return;

      const target = (e.target as HTMLElement).closest(".bento-card") as HTMLElement | null;
      if (target && container.contains(target)) {
        updateIndicator(target);
      }
    },
    [updateIndicator]
  );

  const handlePointerLeave = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.style.setProperty("--bento-opacity", "0");
  }, []);

  const handleFocusCapture = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const target = (e.target as HTMLElement).closest(".bento-card") as HTMLElement | null;
      if (target && container.contains(target)) {
        updateIndicator(target);
      }
    },
    [updateIndicator]
  );

  const handleBlurCapture = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      // If focus left the container entirely, hide indicator
      if (!container.contains(e.relatedTarget as Node | null)) {
        container.style.setProperty("--bento-opacity", "0");
      }
    },
    []
  );

  const variantClass =
    variant === "pill"
      ? "bento-pill"
      : variant === "2xl"
      ? "bento-2xl"
      : "";

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      className={`bento-container relative ${className}`}
      {...props}
    >
      <div
        ref={indicatorRef}
        className={`bento-indicator ${variantClass}`}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export default MagneticBentoContainer;
