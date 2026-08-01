"use client";

import { useEffect, useRef, useState, type ElementType, type Ref } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={`transition-all duration-700 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
