"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface SparklesProps {
  trigger: boolean;
  count?: number;
  className?: string;
}

export function Sparkles({ trigger, count = 8, className = "" }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles: Sparkle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 20 - 10,
        delay: Math.random() * 200,
        duration: 800 + Math.random() * 400,
      }));
      setSparkles(newSparkles);

      const timeout = setTimeout(() => {
        setSparkles([]);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [trigger, count]);

  if (sparkles.length === 0) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute left-1/2 top-1/2 animate-sparkle-up"
          style={{
            left: `calc(50% + ${sparkle.x}px)`,
            top: `calc(50% + ${sparkle.y}px)`,
            animationDelay: `${sparkle.delay}ms`,
            animationDuration: `${sparkle.duration}ms`,
          }}
        >
          <Star
            className="h-2 w-2 fill-yellow-400 text-yellow-400"
            style={{
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}




