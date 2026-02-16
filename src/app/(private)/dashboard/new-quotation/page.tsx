'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import { Label } from '@/src/shared/components/ui/label'
import { Textarea } from '@/src/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info, HelpCircle, BookOpen, Lightbulb, Clock, Users, DollarSign, FileText, X } from 'lucide-react'
import { FlowBuilder } from '@/src/shared/components/global/flow-builder'
import { api } from '@/src/shared/providers/trpc-provider'

interface FormErrors {
  title?: string
  department?: string
  priority?: string
}

export default function NewQuotationPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    priority: '',
    currentProcess: '',
    expectedBenefits: ''
  })

  const [asIsFlow, setAsIsFlow] = useState<Array<any>>([])
  const [asIsEdges, setAsIsEdges] = useState<Array<any>>([])
  const [isMounted, setIsMounted] = useState(false)

  // Mutation para criar cotação
  const createQuotation = api.quotations.create.useMutation({
    onSuccess: () => {
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Erro ao criar cotação:', error)
      alert('Erro ao salvar cotação. Tente novamente.')
    }
  })

  // Verificar autenticação
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/new-quotation')
    }
  }, [status, router])

  // Garantir que só executa no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Buscar templates customizados (apenas no cliente após montagem)
  const templatesQuery = api.cardTemplates.getAll.useQuery(undefined, {
    enabled: isMounted,
  })

  // Usar diretamente os dados da query, sem useEffect desnecessário
  const customTemplates = templatesQuery.data || []

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Título deve ter pelo menos 5 caracteres'
    }

    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório'
    }

    if (!formData.priority) {
      newErrors.priority = 'Prioridade é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      return
    }
    if (step === 2) {
      // No step 2, ao clicar em "Próximo", finaliza a cotação
      handleSubmit()
      return
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/dashboard/new-quotation')
      return
    }

    // Transformar nós do ReactFlow para o formato esperado pelo schema
    const transformedAsIsFlow = asIsFlow.map((node) => ({
      id: node.id,
      title: node.data?.label || 'Etapa',
      description: node.data?.description || undefined,
      type: node.type || 'agent',
      positionX: node.position?.x || 0,
      positionY: node.position?.y || 0,
      metadata: node.data?.options ? { options: node.data.options } : undefined,
    }))

    // Transformar conexões (edges) do ReactFlow para o formato esperado
    const transformedConnections = asIsEdges.map((edge) => ({
      fromNodeId: edge.source,
      toNodeId: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
      label: edge.label || undefined,
      condition: edge.data?.condition || undefined,
    }))

    createQuotation.mutate({
      title: formData.title,
      description: formData.description || undefined,
      department: formData.department,
      priority: formData.priority,
      currentProcess: formData.currentProcess || undefined,
      expectedBenefits: formData.expectedBenefits || undefined,
      asIsFlow: transformedAsIsFlow,
      toBeFlow: [], // Não há mais TO-BE, sempre vazio
      connections: transformedConnections,
    })
  }

  const steps = [
    { num: 1, label: 'Informações Básicas', description: 'Dados da automação' },
    { num: 2, label: 'Fluxo AS-IS', description: 'Processo atual' }
  ]

  const isStep1Valid = formData.title.trim().length >= 5 && formData.department && formData.priority

  // Mostrar loading enquanto verifica autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  // Redirecionar se não autenticado
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="h-screen flex flex-col">
        {/* Progress Steps - Minimalista */}
        {step === 1 && (
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
                {steps.map((s, index) => (
                  <div key={s.num} className="flex items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all
                      ${step === s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    `}>
                      {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-px w-8 mx-1 transition-all ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 lg:px-8 py-6 sm:py-8">
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="shadow-lg border-2">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl">Informações Básicas da Automação</CardTitle>
                <CardDescription className="text-base">
                  Preencha os detalhes sobre a automação desejada. Campos marcados com * são obrigatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-1">
                    Título da Automação <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Automação de Processamento de Faturas"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.title}
                    </p>
                  )}
                  {formData.title && !errors.title && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {formData.title.length} caracteres
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o processo que deseja automatizar, incluindo contexto e objetivos..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Forneça detalhes sobre o processo para facilitar a análise e cotação.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-semibold flex items-center gap-1">
                      Departamento <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger
                        id="department"
                        className={errors.department ? 'border-destructive focus-visible:ring-destructive w-full' : 'w-full'}
                      >
                        <SelectValue placeholder="Selecione um departamento..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="rh">Recursos Humanos</SelectItem>
                        <SelectItem value="ti">TI</SelectItem>
                        <SelectItem value="operacoes">Operações</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-semibold flex items-center gap-1">
                      Prioridade <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger
                        id="priority"
                        className={errors.priority ? 'border-destructive focus-visible:ring-destructive w-full' : 'w-full'}
                      >
                        <SelectValue placeholder="Selecione a prioridade..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.priority && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.priority}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentProcess" className="text-sm font-semibold">
                    Processo Atual
                  </Label>
                  <Textarea
                    id="currentProcess"
                    placeholder="Descreva como o processo é realizado hoje, passo a passo..."
                    rows={3}
                    value={formData.currentProcess}
                    onChange={(e) => handleInputChange('currentProcess', e.target.value)}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits" className="text-sm font-semibold">
                    Benefícios Esperados
                  </Label>
                  <Textarea
                    id="benefits"
                    placeholder="Quais melhorias você espera com a automação? (ex: redução de tempo, menos erros, economia de custos)..."
                    rows={3}
                    value={formData.expectedBenefits}
                    onChange={(e) => handleInputChange('expectedBenefits', e.target.value)}
                    className="resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    {isStep1Valid ? (
                      <span className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        Todos os campos obrigatórios preenchidos
                      </span>
                    ) : (
                      <span>Preencha os campos obrigatórios para continuar</span>
                    )}
                  </div>
                  <Button
                    onClick={handleNext}
                    disabled={!isStep1Valid}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Próximo: Fluxo AS-IS
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: AS-IS Flow */}
        {step === 2 && (
          <div className="fixed inset-0 z-40 bg-background animate-in fade-in duration-300">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-border bg-card overflow-hidden flex flex-col`}>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Instruções */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Tipos de Etapas
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-emerald-600">▷</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">Gatilho</p>
                              <p className="text-xs text-muted-foreground">O que inicia o processo? (ex: recebimento de email, upload de arquivo)</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="h-6 w-6 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-blue-600">⚡</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">Ação</p>
                              <p className="text-xs text-muted-foreground">O que é feito? (ex: validar dados, enviar email, processar arquivo)</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="h-6 w-6 rounded bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-amber-600">⎱</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">Condição</p>
                              <p className="text-xs text-muted-foreground">Decisões no processo (ex: se aprovado, se valor maior que 1000)</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="h-6 w-6 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-purple-600">▤</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">Dados</p>
                              <p className="text-xs text-muted-foreground">Onde os dados estão? (ex: planilha Excel, banco de dados, sistema ERP)</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="h-6 w-6 rounded bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-violet-600">⎱</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">Integração</p>
                              <p className="text-xs text-muted-foreground">Sistemas externos envolvidos (ex: API, sistema de terceiros)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informações para cálculo */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Informações Importantes
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Tempo por Etapa</p>
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                Quanto tempo cada etapa leva? Isso ajuda na análise da automação.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                          <div className="flex items-start gap-2">
                            <Users className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-green-900 dark:text-green-100 mb-1">Pessoas Envolvidas</p>
                              <p className="text-xs text-green-700 dark:text-green-300">
                                Quantas pessoas trabalham em cada etapa? Isso impacta o custo.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-purple-900 dark:text-purple-100 mb-1">Detalhes Importantes</p>
                              <p className="text-xs text-purple-700 dark:text-purple-300">
                                Adicione informações sobre complexidade, erros frequentes ou regras de negócio.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dicas */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Dicas
                      </h3>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Comece pelo início do processo e vá adicionando etapas sequenciais</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Conecte as etapas clicando nos pontos que aparecem ao passar o mouse</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Seja detalhado nas descrições - isso ajuda na cotação precisa</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Mencione sistemas, ferramentas e integrações necessárias</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer da Sidebar */}
                <div className="p-4 border-t border-border space-y-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="w-full"
                    size="sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="sm"
                    disabled={createQuotation.isPending}
                  >
                    {createQuotation.isPending ? 'Salvando...' : 'Finalizar Cotação'}
                  </Button>
                </div>
              </div>

              {/* Botão para abrir sidebar quando fechada */}
              {!sidebarOpen && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="absolute top-4 left-4 z-50 bg-card shadow-lg"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              )}

              {/* Canvas Area - Full Screen */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Fluxo AS-IS (Processo Atual)</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mapeie as etapas do processo atual antes da automação
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {asIsFlow.length} {asIsFlow.length === 1 ? 'etapa' : 'etapas'} adicionadas
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden bg-muted/30">
                  <FlowBuilder 
                    nodes={asIsFlow}
                    edges={asIsEdges}
                    onNodesChange={(nodes) => setAsIsFlow(nodes)}
                    onEdgesChange={(edges) => setAsIsEdges(edges)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
