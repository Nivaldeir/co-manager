'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import { Label } from '@/src/shared/components/ui/label'
import { Textarea } from '@/src/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import { Workflow, ArrowLeft, Plus, Trash2, ArrowRight } from 'lucide-react'
import { FlowBuilder } from '@/src/shared/components/global/flow-builder'

export default function NewQuotationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    priority: '',
    estimatedVolume: '',
    currentProcess: '',
    expectedBenefits: ''
  })

  const [asIsFlow, setAsIsFlow] = useState<Array<any>>([])

  const [toBeFlow, setToBeFlow] = useState<Array<any>>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log('[v0] Submitting quotation:', { formData, asIsFlow, toBeFlow })
    // Here you would normally save to database
    router.push('/dashboard')
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
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">Nova Cotação</span>
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            {[
              { num: 1, label: 'Informações Básicas' },
              { num: 2, label: 'Fluxo AS-IS' },
              { num: 3, label: 'Fluxo TO-BE (Opcional)' }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors
                    ${step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    {s.num}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 text-center max-w-[100px]">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className={`h-0.5 w-16 mx-2 transition-colors ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Informações Básicas da Automação</CardTitle>
              <CardDescription>Preencha os detalhes sobre a automação desejada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Automação *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Automação de Processamento de Faturas"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o processo que deseja automatizar..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecione..." />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume Estimado (mensal)</Label>
                <Input
                  id="volume"
                  type="number"
                  placeholder="Ex: 1000"
                  value={formData.estimatedVolume}
                  onChange={(e) => handleInputChange('estimatedVolume', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentProcess">Processo Atual</Label>
                <Textarea
                  id="currentProcess"
                  placeholder="Descreva como o processo é realizado hoje..."
                  rows={3}
                  value={formData.currentProcess}
                  onChange={(e) => handleInputChange('currentProcess', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefícios Esperados</Label>
                <Textarea
                  id="benefits"
                  placeholder="Quais melhorias você espera com a automação?"
                  rows={3}
                  value={formData.expectedBenefits}
                  onChange={(e) => handleInputChange('expectedBenefits', e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!formData.title || !formData.department || !formData.priority}>
                  Próximo: Fluxo AS-IS
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: AS-IS Flow */}
        {step === 2 && (
          <div className="fixed inset-0 z-40 bg-background pt-16">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Fluxo AS-IS (Processo Atual)</h2>
                  <p className="text-sm text-muted-foreground">Mapeie as etapas do processo atual antes da automação</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button variant="outline" onClick={handleSubmit}>
                    Pular TO-BE e Finalizar
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Próximo: Fluxo TO-BE
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <FlowBuilder
                  steps={asIsFlow}
                  onChange={setAsIsFlow}
                  type="as-is"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: TO-BE Flow */}
        {step === 3 && (
          <div className="fixed inset-0 z-40 bg-background pt-16">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Fluxo TO-BE (Processo Automatizado) - Opcional</h2>
                  <p className="text-sm text-muted-foreground">Desenhe como o processo funcionará após a automação ou pule esta etapa e defina depois</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <Button onClick={handleSubmit}>
                    Finalizar Cotação
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <FlowBuilder
                  steps={toBeFlow}
                  onChange={setToBeFlow}
                  type="to-be"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
