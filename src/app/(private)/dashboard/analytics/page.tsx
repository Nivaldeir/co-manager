'use client'

import Link from 'next/link'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/src/shared/components/ui/chart'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Clock, 
  Zap,
  BarChart3,
  Activity,
  Target,
  Users
} from 'lucide-react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  // Mock data - seria substituído por dados reais da API
  const kpis = [
    { 
      label: 'ROI Total Gerado', 
      value: 'R$ 2.4M', 
      change: '+18%',
      trend: 'up',
      icon: DollarSign, 
      color: 'text-chart-1' 
    },
    { 
      label: 'Horas Economizadas/Mês', 
      value: '1,240h', 
      change: '+24%',
      trend: 'up',
      icon: Clock, 
      color: 'text-chart-2' 
    },
    { 
      label: 'Processos Automatizados', 
      value: '47', 
      change: '+12',
      trend: 'up',
      icon: Zap, 
      color: 'text-chart-3' 
    },
    { 
      label: 'Taxa de Aprovação', 
      value: '89%', 
      change: '+5%',
      trend: 'up',
      icon: Target, 
      color: 'text-chart-4' 
    }
  ]

  const monthlyROI = [
    { month: 'Jan', roi: 180000, savings: 85000 },
    { month: 'Fev', roi: 220000, savings: 110000 },
    { month: 'Mar', roi: 280000, savings: 145000 },
    { month: 'Abr', roi: 310000, savings: 165000 },
    { month: 'Mai', roi: 380000, savings: 195000 },
    { month: 'Jun', roi: 450000, savings: 225000 }
  ]

  const processByArea = [
    { area: 'Financeiro', count: 15, roi: 850000 },
    { area: 'RH', count: 12, roi: 420000 },
    { area: 'Vendas', count: 8, roi: 680000 },
    { area: 'Operações', count: 7, roi: 290000 },
    { area: 'TI', count: 5, roi: 180000 }
  ]

  const statusDistribution = [
    { status: 'Concluído', count: 28, color: '#10b981' },
    { status: 'Em Desenvolvimento', count: 12, color: '#3b82f6' },
    { status: 'Em Análise', count: 7, color: '#f59e0b' },
    { status: 'Aguardando', count: 5, color: '#8b5cf6' }
  ]

  const topProcesses = [
    { 
      name: 'Processamento de Faturas', 
      roi: 'R$ 420K', 
      timeSaved: '380h/mês',
      efficiency: 95,
      area: 'Financeiro'
    },
    { 
      name: 'Onboarding de Funcionários', 
      roi: 'R$ 280K', 
      timeSaved: '220h/mês',
      efficiency: 92,
      area: 'RH'
    },
    { 
      name: 'Cadastro de Clientes', 
      roi: 'R$ 380K', 
      timeSaved: '290h/mês',
      efficiency: 88,
      area: 'Vendas'
    },
    { 
      name: 'Reconciliação Bancária', 
      roi: 'R$ 310K', 
      timeSaved: '180h/mês',
      efficiency: 90,
      area: 'Financeiro'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Dashboard Executivo</h1>
                <p className="text-sm text-muted-foreground">Análise consolidada de resultados</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Exportar PDF
              </Button>
              <Button size="sm">
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* KPIs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-chart-3' : 'text-destructive'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* ROI Evolution Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Evolução de ROI e Economia</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  roi: {
                    label: 'ROI',
                    color: 'hsl(var(--chart-1))'
                  },
                  savings: {
                    label: 'Economia',
                    color: 'hsl(var(--chart-2))'
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyROI}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="roi" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="ROI (R$)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Economia (R$)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Total de {statusDistribution.reduce((acc, s) => acc + s.count, 0)} processos</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: 'Processos',
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Processes by Area */}
          <Card>
            <CardHeader>
              <CardTitle>Processos por Área</CardTitle>
              <CardDescription>ROI gerado por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: 'Quantidade',
                    color: 'hsl(var(--chart-1))'
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processByArea}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="area" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Processos" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Processes */}
          <Card>
            <CardHeader>
              <CardTitle>Top Processos por Performance</CardTitle>
              <CardDescription>Maiores resultados alcançados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProcesses.map((process, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{process.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {process.roi}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {process.timeSaved}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-chart-3">{process.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Eficiência</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-xl font-bold text-foreground">96%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Equipes Atendidas</p>
                  <p className="text-xl font-bold text-foreground">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">ROI Médio</p>
                  <p className="text-xl font-bold text-foreground">187%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Produtividade</p>
                  <p className="text-xl font-bold text-foreground">+340%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
