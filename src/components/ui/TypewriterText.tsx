"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  cursorClassName?: string;
  minDelay?: number;
  maxDelay?: number;
}

export function TypewriterText({
  text,
  className,
  cursorClassName,
  minDelay = 30,
  maxDelay = 100,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("");
    currentIndexRef.current = 0;

    const typeNextChar = () => {
      if (currentIndexRef.current >= text.length) {
        return;
      }

      const char = text[currentIndexRef.current];
      // Safety check to prevent "undefined" from being appended
      if (char !== undefined) {
        setDisplayedText((prev) => prev + char);
        currentIndexRef.current++;
      }

      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      timeoutRef.current = setTimeout(typeNextChar, randomDelay);
    };

    // Initial start delay
    timeoutRef.current = setTimeout(typeNextChar, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, minDelay, maxDelay]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {displayedText}
      <span
        className={cn(
          "ml-1 inline-block h-[1em] w-[0.5em] bg-accent-green align-middle animate-cursor-blink",
          cursorClassName
        )}
      />
    </span>
  );
}
