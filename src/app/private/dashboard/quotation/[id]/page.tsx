import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Workflow, ArrowLeft, Calendar, TrendingUp, Building2, Flag, ArrowDown } from 'lucide-react'

export default function QuotationDetailPage({ params }: { params: { id: string } }) {
  // Mock data - in a real app, fetch based on params.id
  const quotation = {
    id: params.id,
    title: 'Automação de Faturamento',
    description: 'Automatizar o processo de geração e envio de faturas mensais para clientes',
    status: 'Em Análise',
    priority: 'Alta',
    department: 'Financeiro',
    requestDate: '2024-01-15',
    estimatedROI: '85%',
    estimatedVolume: '1500',
    currentProcess: 'Processo manual com planilhas Excel e envio individual de emails',
    expectedBenefits: 'Redução de 80% no tempo de processamento, eliminação de erros humanos, maior satisfação do cliente',
    asIsFlow: [
      { id: '1', title: 'Recebimento de Solicitação', description: 'Cliente envia email com pedido' },
      { id: '2', title: 'Validação Manual', description: 'Analista verifica dados em planilha' },
      { id: '3', title: 'Geração de Fatura', description: 'Criação manual do documento em Word' },
      { id: '4', title: 'Envio por Email', description: 'Envio individual para cada cliente' }
    ],
    toBeFlow: [
      { id: '1', title: 'Captura Automática', description: 'Bot lê email e extrai informações' },
      { id: '2', title: 'Validação Automática', description: 'Sistema valida dados contra base' },
      { id: '3', title: 'Geração Automatizada', description: 'Bot cria fatura usando template' },
      { id: '4', title: 'Envio em Lote', description: 'Disparo automático com confirmação' }
    ]
  }

  const statusColors: Record<string, string> = {
    'Em Análise': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    'Aprovado': 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    'Em Desenvolvimento': 'bg-primary/10 text-primary border-primary/20'
  }

  const priorityColors: Record<string, string> = {
    'Alta': 'bg-destructive/10 text-destructive border-destructive/20',
    'Média': 'bg-chart-5/10 text-chart-5 border-chart-5/20',
    'Baixa': 'bg-muted text-muted-foreground border-border'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Workflow className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">CoE Manager</span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <span className="text-sm text-muted-foreground hidden sm:inline">Detalhes da Cotação</span>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priorityColors[quotation.priority]}>
                <Flag className="h-3 w-3 mr-1" />
                {quotation.priority}
              </Badge>
              <Badge variant="outline" className={statusColors[quotation.status]}>
                {quotation.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{quotation.title}</h1>
            <p className="text-muted-foreground">{quotation.description}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Data de Solicitação</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(quotation.requestDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">ROI Estimado</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.estimatedROI}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Building2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Departamento</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                  <Workflow className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Volume Mensal</p>
                  <p className="text-sm font-semibold text-foreground">{quotation.estimatedVolume}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Processo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{quotation.currentProcess}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefícios Esperados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{quotation.expectedBenefits}</p>
            </CardContent>
          </Card>
        </div>

        {/* Flow Comparison */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* AS-IS Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Fluxo AS-IS</span>
                <Badge variant="outline" className="bg-chart-5/10 text-chart-5 border-chart-5/20">
                  Atual
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quotation.asIsFlow.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-5/10 border border-chart-5/30">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-chart-5 text-white text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    {index < quotation.asIsFlow.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TO-BE Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Fluxo TO-BE</span>
                <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                  Automatizado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quotation.toBeFlow.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    {index < quotation.toBeFlow.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
