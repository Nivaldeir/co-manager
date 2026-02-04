'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Workflow, Search, Filter, Calendar, TrendingUp, Building2, Flag, Eye } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ConsultorPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Mock data - in a real app, fetch from database
  const quotations = [
    {
      id: '1',
      title: 'Automação de Faturamento',
      description: 'Automatizar o processo de geração e envio de faturas mensais para clientes',
      status: 'Em Análise',
      priority: 'Alta',
      department: 'Financeiro',
      requestDate: '2024-01-15',
      estimatedROI: '85%',
      estimatedVolume: '1500'
    },
    {
      id: '2',
      title: 'Processamento de Pedidos',
      description: 'Automação do fluxo de aprovação de pedidos de compra',
      status: 'Aprovado',
      priority: 'Média',
      department: 'Compras',
      requestDate: '2024-01-12',
      estimatedROI: '65%',
      estimatedVolume: '800'
    },
    {
      id: '3',
      title: 'Onboarding de Funcionários',
      description: 'Automatizar cadastro e envio de documentos para novos colaboradores',
      status: 'Em Desenvolvimento',
      priority: 'Alta',
      department: 'RH',
      requestDate: '2024-01-10',
      estimatedROI: '75%',
      estimatedVolume: '120'
    },
    {
      id: '4',
      title: 'Reconciliação Bancária',
      description: 'Automação da conciliação de extratos bancários com lançamentos contábeis',
      status: 'Em Análise',
      priority: 'Alta',
      department: 'Contabilidade',
      requestDate: '2024-01-18',
      estimatedROI: '90%',
      estimatedVolume: '2000'
    },
    {
      id: '5',
      title: 'Gestão de Contratos',
      description: 'Automatizar renovação e alertas de vencimento de contratos',
      status: 'Pendente',
      priority: 'Baixa',
      department: 'Jurídico',
      requestDate: '2024-01-08',
      estimatedROI: '45%',
      estimatedVolume: '300'
    }
  ]

  const statusColors: Record<string, string> = {
    'Em Análise': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    'Aprovado': 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    'Em Desenvolvimento': 'bg-primary/10 text-primary border-primary/20',
    'Pendente': 'bg-muted text-muted-foreground border-border'
  }

  const priorityColors: Record<string, string> = {
    'Alta': 'bg-destructive/10 text-destructive border-destructive/20',
    'Média': 'bg-chart-5/10 text-chart-5 border-chart-5/20',
    'Baixa': 'bg-muted text-muted-foreground border-border'
  }

  // Filter quotations
  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || q.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Stats
  const stats = {
    total: quotations.length,
    emAnalise: quotations.filter(q => q.status === 'Em Análise').length,
    aprovado: quotations.filter(q => q.status === 'Aprovado').length,
    emDesenvolvimento: quotations.filter(q => q.status === 'Em Desenvolvimento').length
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
              <span className="text-sm text-muted-foreground hidden sm:inline">Painel do Consultor</span>
            </div>
            <Button asChild>
              <Link href="/dashboard">Área do Cliente</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">Painel do Consultor</h1>
          <p className="text-muted-foreground text-pretty">Gerencie e analise todas as solicitações de automação</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total de Cotações</p>
                <Workflow className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Em Análise</p>
                <div className="h-2 w-2 rounded-full bg-chart-3" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.emAnalise}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                <div className="h-2 w-2 rounded-full bg-secondary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.aprovado}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Em Desenvolvimento</p>
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.emDesenvolvimento}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, descrição ou departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Em Desenvolvimento">Em Desenvolvimento</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Flag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotations List */}
        <div className="space-y-4">
          {filteredQuotations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma cotação encontrada</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros de busca</p>
              </CardContent>
            </Card>
          ) : (
            filteredQuotations.map((quotation) => (
              <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={priorityColors[quotation.priority]}>
                          <Flag className="h-3 w-3 mr-1" />
                          {quotation.priority}
                        </Badge>
                        <Badge variant="outline" className={statusColors[quotation.status]}>
                          {quotation.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{quotation.title}</h3>
                      <p className="text-muted-foreground mb-3 text-pretty">{quotation.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{quotation.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(quotation.requestDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>ROI: {quotation.estimatedROI}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Workflow className="h-4 w-4" />
                          <span>{quotation.estimatedVolume} processos/mês</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:flex-col gap-2">
                      <Button asChild className="w-full lg:w-auto">
                        <Link href={`/consultor/cotacao/${quotation.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
