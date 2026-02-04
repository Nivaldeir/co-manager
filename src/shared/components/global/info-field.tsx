import { cn } from "../../lib/utils"; 
import { useCopy } from "../../hook/use-copy";

export const InfoField = ({
  label,
  value,
  copyable = false,
  fieldKey,
  fontFamily = "Montserrat",
  valueSize = "normal",
  className,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  fieldKey?: string;
  fontFamily?: "Montserrat" | "Cousine";
  valueSize?: "normal" | "large" | "small";
  className?: string;
}) => {
  const { CopyButton } = useCopy();
  
  const sizeClasses = {
    normal: "text-[14px]",
    large: "text-[18px]",
    small: "text-[12px]",
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-[10px] font-normal text-[#6a7282] uppercase tracking-[0.5px] font-['Montserrat',sans-serif]">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p
          className={cn(
            sizeClasses[valueSize],
            fontFamily === "Cousine" && "font-['Cousine',monospace]",
            fontFamily === "Cousine" && valueSize === "small" && "text-[#4a5565]",
            fontFamily === "Cousine" && valueSize !== "small" && "text-[#364153]",
            fontFamily === "Montserrat" && "font-['Montserrat',sans-serif] text-[#101828]"
          )}
        >
          {value}
        </p>
        {copyable && fieldKey && (
          <CopyButton text={value} />
        )}
      </div>
    </div>
  );
};