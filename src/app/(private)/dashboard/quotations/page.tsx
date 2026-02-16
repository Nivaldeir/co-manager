'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { api } from '@/src/shared/providers/trpc-provider'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/shared/components/ui/card'
import { canViewAllQuotations, getRoleLabel } from '@/src/shared/lib/roles'
import { Workflow, Plus, BarChart3, ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, LogOut } from 'lucide-react'

export default function QuotationsListPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const quotationsQuery = api.quotations.getAll.useQuery(undefined, {
    enabled: status === 'authenticated',
  })

  const canViewAll = canViewAllQuotations(session?.user?.role)
  const quotations = quotationsQuery.data || []

  // Calcular estatísticas
  const totalQuotations = quotations.length
  const inReviewQuotations = quotations.filter(q => q.status === 'in_review' || q.status === 'draft').length
  const completedQuotations = quotations.filter(q => q.status === 'approved').length

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
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
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
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Cotações</h1>
          <p className="text-muted-foreground">
            {canViewAll ? 'Visualize e gerencie todas as cotações registradas.' : 'Visualize e gerencie suas cotações registradas.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Cotações</p>
                  <p className="text-2xl font-bold text-foreground">{totalQuotations}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Em Análise</p>
                  <p className="text-2xl font-bold text-foreground">{inReviewQuotations}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-amber-500">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Concluídas</p>
                  <p className="text-2xl font-bold text-foreground">{completedQuotations}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-emerald-500">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cotações</CardTitle>
              <CardDescription>
                {canViewAll ? 'Todas as cotações do sistema' : 'Suas cotações'}
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-quotation">
                <Plus className="h-4 w-4 mr-2" />
                Nova Cotação
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {quotationsQuery.isLoading && (
              <p className="text-sm text-muted-foreground py-8 text-center">Carregando cotações...</p>
            )}
            {!quotationsQuery.isLoading && quotations.length === 0 && (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma cotação encontrada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {canViewAll ? 'Ainda não há cotações registradas no sistema.' : 'Você ainda não criou nenhuma cotação.'}
                </p>
                <Button asChild>
                  <Link href="/dashboard/new-quotation">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Cotação
                  </Link>
                </Button>
              </div>
            )}
            {quotations.length > 0 && (
              <div className="space-y-3">
                {quotations.map((q) => (
                  <Card key={q.id} className="border-2 hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{q.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${q.priority === 'critica' ? 'bg-red-500/10 text-red-500' :
                                q.priority === 'alta' ? 'bg-orange-500/10 text-orange-500' :
                                q.priority === 'media' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-blue-500/10 text-blue-500'}
                            `}>
                              {q.priority.charAt(0).toUpperCase() + q.priority.slice(1)}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${q.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                q.status === 'in_review' ? 'bg-amber-500/10 text-amber-500' :
                                q.status === 'submitted' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-gray-500/10 text-gray-500'}
                            `}>
                              {q.status === 'draft' ? 'Rascunho' :
                               q.status === 'in_review' ? 'Em Análise' :
                               q.status === 'approved' ? 'Aprovado' :
                               q.status === 'submitted' ? 'Enviado' :
                               q.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {q.department.charAt(0).toUpperCase() + q.department.slice(1)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                            {canViewAll && q.userName && (
                              <>
                                <span>•</span>
                                <span>Criada por: {q.userName} {q.userRole && `(${getRoleLabel(q.userRole)})`}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/quotations/${q.id}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



