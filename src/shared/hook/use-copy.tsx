import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import { copyText } from "../utils/copy";
import { Button } from "../components/global/ui/button";
import { Copy, Check } from "lucide-react";

type CopyButtonProps = { text: string } & React.ComponentProps<typeof Button>;

type CopyButtonComponent = (props: CopyButtonProps) => JSX.Element;

export function useCopy(timeoutDuration: number = 2000): {
  copied: boolean;
  handleCopy: (text: string) => Promise<boolean>;
  CopyButton: CopyButtonComponent;
} {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(
    async (text: string) => {
      const success = await copyText(text);
      if (success) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setCopied(true);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, timeoutDuration);
      }
      return success;
    },
    [timeoutDuration]
  );

  const CopyButton = useCallback(
    ({ text, ...buttonProps }: CopyButtonProps) => {
      return (
        <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-zinc-500/20 hover:text-zinc-500 p-4" onClick={() => handleCopy(text)} {...buttonProps}>
          <div className="relative h-4 w-4 flex items-center justify-center hover:bg-transparent	">
            <Check 
              className={`h-4 w-4 absolute transition-all duration-200 ease-in-out hover:bg-transparent ${
                copied ? "scale-100 opacity-100 text-green-500" : "scale-0 opacity-0" 
              }`} 
            />
            <Copy 
              className={`h-4 w-4 absolute transition-all duration-200 ease-in-out ${
                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`} 
            />
          </div>
        </Button>
      );
    },
    [copied, handleCopy]
  );

  return { copied, handleCopy, CopyButton };
}

