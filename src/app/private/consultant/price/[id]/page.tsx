'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Workflow, ArrowLeft, Calendar, TrendingUp, Building2, Flag, ArrowDown, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/src/shared/hook/use-toast"

export default function ConsultorQuotationDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [status, setStatus] = useState('Em Análise')
  const [analysis, setAnalysis] = useState('')
  const [recommendation, setRecommendation] = useState('')

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
    'Em Desenvolvimento': 'bg-primary/10 text-primary border-primary/20',
    'Pendente': 'bg-muted text-muted-foreground border-border',
    'Rejeitado': 'bg-destructive/10 text-destructive border-destructive/20'
  }

  const priorityColors: Record<string, string> = {
    'Alta': 'bg-destructive/10 text-destructive border-destructive/20',
    'Média': 'bg-chart-5/10 text-chart-5 border-chart-5/20',
    'Baixa': 'bg-muted text-muted-foreground border-border'
  }

  const handleSaveAnalysis = () => {
    // In a real app, save to database
    toast({
      title: "Análise salva!",
      description: "Sua análise foi salva com sucesso.",
    })
  }

  const handleUpdateStatus = () => {
    // In a real app, update in database
    toast({
      title: "Status atualizado!",
      description: `Status alterado para: ${status}`,
    })
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
              <span className="text-sm text-muted-foreground hidden sm:inline">Análise de Cotação</span>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/consultor">
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
            <h1 className="text-3xl font-bold text-foreground text-balance">{quotation.title}</h1>
            <p className="text-muted-foreground text-pretty">{quotation.description}</p>
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

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Details */}
            <div className="grid gap-6">
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
            <div className="grid md:grid-cols-2 gap-6">
              {/* AS-IS Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
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
                            <h4 className="font-semibold text-foreground mb-1 text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
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
                  <CardTitle className="flex items-center gap-2 text-base">
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
                            <h4 className="font-semibold text-foreground mb-1 text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
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
          </div>

          {/* Sidebar - Consultant Actions */}
          <div className="space-y-6">
            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5" />
                  Atualizar Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status da Cotação</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Em Análise">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-chart-3" />
                          Em Análise
                        </div>
                      </SelectItem>
                      <SelectItem value="Aprovado">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          Aprovado
                        </div>
                      </SelectItem>
                      <SelectItem value="Rejeitado">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          Rejeitado
                        </div>
                      </SelectItem>
                      <SelectItem value="Pendente">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          Pendente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleUpdateStatus} className="w-full">
                  Atualizar Status
                </Button>
              </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-5 w-5" />
                  Análise Técnica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis">Análise do Processo</Label>
                  <Textarea
                    id="analysis"
                    placeholder="Descreva sua análise técnica do processo atual e proposto..."
                    value={analysis}
                    onChange={(e) => setAnalysis(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendation">Recomendações</Label>
                  <Textarea
                    id="recommendation"
                    placeholder="Adicione suas recomendações e observações..."
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    rows={5}
                  />
                </div>
                <Button onClick={handleSaveAnalysis} className="w-full" variant="secondary">
                  Salvar Análise
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-secondary" />
                  Aprovar Cotação
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <XCircle className="h-4 w-4 mr-2 text-destructive" />
                  Rejeitar Cotação
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Solicitar Mais Informações
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
