"use client";

import { useEffect, useState } from "react";
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
  // const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex >= text.length) {
        // setIsComplete(true);
        return;
      }

      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex++;

      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      timeoutId = setTimeout(typeNextChar, randomDelay);
    };

    // Initial start delay
    timeoutId = setTimeout(typeNextChar, 500);

    return () => clearTimeout(timeoutId);
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
