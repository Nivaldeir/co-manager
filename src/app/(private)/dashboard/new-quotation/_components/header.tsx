import { Link } from "@radix-ui/react-navigation-menu";
import { ArrowLeft } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

export function NewQuotationHeader() {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur px-4 lg:px-8 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">Nova Cotação</span>
        </div>
        <div className="flex items-center gap-2">
          {[{ num: 1, label: 'Informações Básicas' }, { num: 2, label: 'Fluxo AS-IS' }].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all
              ${true ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
                {true ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              {index < [1, 2].length - 1 && (
                <div className={`h-px w-8 mx-1 transition-all ${true ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}