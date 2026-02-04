import { useEffect } from "react";
import { useQueryStates } from "nuqs";

interface UseSearchProps<Filters extends Record<string, any>> {
  filtersParser: { [K in keyof Filters]: any };
  onFiltersChange?: (filters: Filters) => void;
  defaultValues?: Partial<Filters>;
}

export function useSearch<Filters extends Record<string, any>>({
  filtersParser,
  onFiltersChange,
  defaultValues,
}: UseSearchProps<Filters>) {
  const [filters, setFilters] = useQueryStates(filtersParser, {
    history: "replace",
    ...(defaultValues && { defaultValues }),
  });

  const setFilter = <K extends keyof Filters>(
    field: K,
    value: Filters[K] | undefined
  ) => {
    setFilters((prev) => {
      // Para parâmetros opcionais sem .withDefault(), o nuqs remove da URL quando recebe null
      const shouldRemove = value === undefined || value === "" || value === null;
      
      // Sempre cria um novo objeto para garantir que o nuqs detecte a mudança
      if (shouldRemove) {
        // Passa null explicitamente - o nuqs remove parâmetros opcionais quando recebe null
        return { ...prev, [field]: null };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const resetFilters = () => {
    setFilters(() => {
      const defaults = Object.entries(filtersParser).reduce((acc, [key, parser]) => {
        const defaultValue = parser.options?.defaultValue;
        
        // Se não houver defaultValue definido, usa null para remover da URL (parsers opcionais)
        // Se houver defaultValue, usa ele (pode ser string, number, array, etc.)
        if (defaultValue !== undefined) {
          return { ...acc, [key]: defaultValue };
        }
        
        // Para parsers sem defaultValue, remove da URL passando null
        return { ...acc, [key]: null };
      }, {} as Partial<Filters>);

      return defaults;
    });
  };

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters as Filters);
    }
  }, [filters, onFiltersChange]);

  return {
    filters,
    setFilters,
    setFilter,
    resetFilters, // <-- novo método
  };
}