'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { BarChart3, Plus, Workflow, TrendingUp, Clock, CheckCircle, LogOut } from 'lucide-react'
import { api } from '@/src/shared/providers/trpc-provider'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const quotationsQuery = api.quotations.getAll.useQuery(undefined, {
    enabled: status === 'authenticated',
  })

  // Redirecionar se não autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
    }
  }, [status, router])

  const quotations = quotationsQuery.data || []

  // Calcular estatísticas
  const totalQuotations = quotations.length
  const inReview = quotations.filter(q => q.status === 'in_review' || q.status === 'draft').length
  const completed = quotations.filter(q => q.status === 'approved').length

  const stats = [
    { label: 'Total de Cotações', value: totalQuotations.toString(), icon: Workflow, color: 'text-primary' },
    { label: 'Em Análise', value: inReview.toString(), icon: Clock, color: 'text-chart-3' },
    { label: 'Concluídas', value: completed.toString(), icon: CheckCircle, color: 'text-chart-4' },
    { label: 'Rascunhos', value: quotations.filter(q => q.status === 'draft').length.toString(), icon: TrendingUp, color: 'text-secondary' }
  ]

  if (status === 'loading' || quotationsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Workflow className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">CoE Manager</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Button asChild>
                <Link href="/dashboard/new-quotation">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cotação
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Automações</h1>
          <p className="text-muted-foreground">Gerencie suas cotações e acompanhe o progresso das automações</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quotations List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cotações Recentes</CardTitle>
              <CardDescription>Acompanhe o status das suas solicitações de automação</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-quotation">
                <Plus className="h-4 w-4 mr-2" />
                Nova Cotação
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotations.map((quotation) => (
                <Card key={quotation.id} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{quotation.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${quotation.priority === 'Alta' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary-foreground'}
                          `}>
                            {quotation.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>Status: {quotation.status === 'draft' ? 'Rascunho' : quotation.status === 'in_review' ? 'Em Análise' : quotation.status === 'approved' ? 'Aprovado' : quotation.status}</span>
                          <span>•</span>
                          <span>Data: {new Date(quotation.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>Prioridade: {quotation.priority}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/quotations/${quotation.id}`}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <div  className='mt-4'/>
        {/* Empty State (shown when no quotations) */}
        {quotations.length === 0 && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Workflow className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma cotação ainda</h3>
                  <p className="text-muted-foreground mb-4">Comece criando sua primeira cotação de automação</p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/new-quotation">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Cotação
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
