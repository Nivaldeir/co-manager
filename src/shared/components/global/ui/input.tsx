import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "password" | "icon";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    leftIcon, 
    rightIcon, 
    variant = "default",
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Determina se é um input de senha
    const isPassword = variant === "password" || type === "password";
    
    // Determina se tem ícones
    const hasIcon = variant === "icon" || leftIcon || rightIcon;
    
    // Se for password, controla o type internamente
    const inputType = isPassword 
      ? (showPassword ? "text" : "password")
      : type;

    // Calcula padding baseado nos ícones
    let paddingClasses = "px-4"; // Padrão
    
    if (hasIcon || isPassword) {
      if (leftIcon && isPassword) {
        paddingClasses = "pl-10 pr-10"; // Ícone à esquerda + botão de senha à direita
      } else if (leftIcon && rightIcon) {
        paddingClasses = "pl-10 pr-10"; // Ícone à esquerda + ícone à direita
      } else if (leftIcon) {
        paddingClasses = "pl-10 pr-3"; // Apenas ícone à esquerda
      } else if (isPassword) {
        paddingClasses = "pl-4 pr-10"; // Apenas botão de senha à direita
      } else if (rightIcon) {
        paddingClasses = "pl-4 pr-10"; // Apenas ícone à direita
      }
    }

    const inputElement = (
      <input
        type={inputType}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-background py-3 text-sm",
          "text-foreground placeholder:text-muted-foreground",
          "transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          paddingClasses,
          error
            ? "border-destructive focus-visible:ring-destructive"
            : "border-input",
          className
        )}
        ref={ref}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
    );

    // Se não tem ícones nem é password, retorna apenas o input normal
    if (!hasIcon && !isPassword) {
      return inputElement;
    }

    // Wrapper com ícones e/ou botão de senha
    return (
      <div className="relative">
        {/* Ícone à esquerda */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}

        {inputElement}

        {/* Botão de mostrar/ocultar senha */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 z-10",
              "text-muted-foreground hover:text-foreground",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
              "disabled:opacity-50"
            )}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={-1}
            disabled={props.disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Ícone à direita (apenas se não for password) */}
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
