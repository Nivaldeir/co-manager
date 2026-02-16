'use client'

import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { api } from '@/src/shared/providers/trpc-provider'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/shared/components/ui/card'
import { Textarea } from '@/src/shared/components/ui/textarea'
import { useState, useEffect } from 'react'
import { canReplyQuotations, canViewAllQuotations, getRoleLabel } from '@/src/shared/lib/roles'
import { FlowBuilder } from '@/src/shared/components/global/flow-builder'
import { Node, Edge } from '@xyflow/react'
import { Workflow, Plus, BarChart3, ArrowLeft, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function QuotationDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const [reply, setReply] = useState('')
  const [asIsNodes, setAsIsNodes] = useState<Node[]>([])
  const [asIsEdges, setAsIsEdges] = useState<Edge[]>([])

  const quotationQuery = api.quotations.getById.useQuery({ id: params.id })
  const replyMutation = api.quotations.reply.useMutation({
    onSuccess: () => {
      setReply('')
      quotationQuery.refetch()
      // TODO: Mostrar toast de sucesso
    },
    onError: (error) => {
      console.error('Erro ao enviar resposta:', error)
      // TODO: Mostrar toast de erro
    }
  })

  const canReply = canReplyQuotations(session?.user?.role)
  const canViewAll = canViewAllQuotations(session?.user?.role)

  const handleReply = () => {
    if (!reply.trim()) return
    replyMutation.mutate({
      quotationId: params.id,
      message: reply.trim(),
      isInternal: false,
    })
  }

  // Converter fluxo AS-IS do banco para formato ReactFlow
  useEffect(() => {
    if (quotationQuery.data?.asIsFlow) {
      // Criar mapa de id do banco -> reactFlowId para mapear conexões
      const nodeIdMap: { [key: string]: string } = {}
      
      const nodes = quotationQuery.data.asIsFlow.map((node: any) => {
        const reactFlowId = node.reactFlowId || node.id
        nodeIdMap[node.id] = reactFlowId
        
        return {
          id: reactFlowId,
          type: node.type || 'agent',
          position: { x: node.positionX || 0, y: node.positionY || 0 },
          data: {
            label: node.title || 'Etapa',
            description: node.description || '',
            options: node.metadata?.options || [],
          },
        }
      })
      setAsIsNodes(nodes)

      // Converter conexões do banco para formato ReactFlow
      const edges: Edge[] = []
      quotationQuery.data.asIsFlow.forEach((node: any) => {
        // connections são as conexões que saem deste nó (fromNodeId = node.id)
        if (node.connections && node.connections.length > 0) {
          node.connections.forEach((conn: any) => {
            // O nó atual é o source (fromNodeId)
            const sourceId = nodeIdMap[node.id] || node.reactFlowId || node.id
            
            // Buscar o nó de destino pelo toNodeId
            const targetNode = quotationQuery.data.asIsFlow.find((n: any) => n.id === conn.toNodeId)
            const targetId = targetNode ? (nodeIdMap[targetNode.id] || targetNode.reactFlowId || targetNode.id) : null
            
            // Verificar se ambos os nós existem
            if (targetId && nodes.find(n => n.id === sourceId) && nodes.find(n => n.id === targetId)) {
              edges.push({
                id: conn.id || `edge-${sourceId}-${targetId}`,
                source: sourceId,
                target: targetId,
                sourceHandle: conn.sourceHandle || undefined,
                targetHandle: conn.targetHandle || undefined,
                label: conn.label || undefined,
                data: conn.condition ? { condition: conn.condition } : undefined,
              })
            }
          })
        }
      })
      setAsIsEdges(edges)
    }
  }, [quotationQuery.data])

  if (quotationQuery.isLoading) {
    return <p className="px-4 py-6 text-sm text-muted-foreground">Carregando...</p>
  }

  const quotation = quotationQuery.data

  if (!quotation) {
    return <p className="px-4 py-6 text-sm text-muted-foreground">Cotação não encontrada.</p>
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

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/quotations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <Card>
        <CardHeader>
          <CardTitle>{quotation.title}</CardTitle>
          <CardDescription>
            {quotation.department} • {quotation.priority.toUpperCase()} • {quotation.status ?? 'draft'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quotation.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Descrição</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {quotation.description}
              </p>
            </div>
          )}
          {canViewAll && quotation.userName && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Solicitante</h3>
              <p className="text-sm text-muted-foreground">
                {quotation.userName}
                {quotation.userRole && ` (${getRoleLabel(quotation.userRole)})`}
              </p>
            </div>
          )}
          {asIsNodes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Processo Atual (AS-IS)</h3>
              <div className="h-[500px] border rounded-md overflow-hidden bg-muted/30">
                <FlowBuilder 
                  nodes={asIsNodes}
                  edges={asIsEdges}
                  onNodesChange={() => {}} // Não permite edição
                  onEdgesChange={() => {}} // Não permite edição
                  readOnly={true}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Respostas existentes */}
      {quotation.replies && quotation.replies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Respostas</CardTitle>
            <CardDescription>
              Histórico de respostas e análises desta cotação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quotation.replies.map((replyItem: any) => (
              <div key={replyItem.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {replyItem.user?.name || replyItem.user?.email || 'Usuário'}
                    </span>
                    {replyItem.user?.role && (
                      <span className="text-xs text-muted-foreground">
                        ({getRoleLabel(replyItem.user.role)})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(replyItem.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-line">
                  {replyItem.message}
                </p>
                {replyItem.isInternal && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-500">
                    Nota interna
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {canReply && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Responder cotação</CardTitle>
            <CardDescription>
              Escreva sua análise, condições e próximos passos para esta cotação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escreva aqui sua análise, condições e próximos passos..."
            />
            <Button 
              type="button" 
              disabled={!reply.trim() || replyMutation.isPending}
              onClick={handleReply}
            >
              {replyMutation.isPending ? 'Enviando...' : 'Enviar resposta'}
            </Button>
          </CardContent>
        </Card>
      )}
      </main>
    </div>
  )
}



