import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { canViewAllQuotations, canReplyQuotations } from '@/src/server/lib/roles'

const flowNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  customTypeId: z.string().optional(),
  positionX: z.number(),
  positionY: z.number(),
  estimatedTime: z.string().optional(),
  peopleInvolved: z.string().optional(),
  frequency: z.string().optional(),
  complexity: z.string().optional(),
  systems: z.string().optional(),
  errors: z.string().optional(),
  cost: z.string().optional(),
  metadata: z.any().optional(),
})

const connectionSchema = z.object({
  fromNodeId: z.string(),
  toNodeId: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
  condition: z.string().optional(),
})

const quotationSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  department: z.string(),
  priority: z.string(),
  estimatedVolume: z.string().optional(),
  currentProcess: z.string().optional(),
  expectedBenefits: z.string().optional(),
  asIsFlow: z.array(flowNodeSchema).default([]),
  toBeFlow: z.array(flowNodeSchema).default([]),
  connections: z.array(connectionSchema).default([]),
})

export const quotationsRouter = router({
  // Criar nova cotação (requer autenticação)
  create: protectedProcedure
    .input(quotationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error('Usuário não autenticado')
      }

      // Criar ou buscar usuário no banco
      let user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email || '' }
      })

      if (!user) {
        // Criar usuário se não existir
        user = await ctx.prisma.user.create({
          data: {
            email: ctx.session?.user?.email || '',
            name: ctx.session?.user?.name || null,
            role: ctx.session?.user?.role || 'user',
          }
        })
      }

      // Criar cotação
      const quotation = await ctx.prisma.quotation.create({
        data: {
          title: input.title,
          description: input.description || null,
          department: input.department,
          priority: input.priority,
          estimatedVolume: input.estimatedVolume || null,
          currentProcess: input.currentProcess || null,
          expectedBenefits: input.expectedBenefits || null,
          userId: user.id,
          status: 'draft',
        }
      })

      // Criar nós do fluxo AS-IS e mapear IDs
      const createdNodes: { [key: string]: string } = {} // Mapeia reactFlowId -> id do banco
      
      if (input.asIsFlow && input.asIsFlow.length > 0) {
        // Criar nós individualmente para obter os IDs do banco
        for (const node of input.asIsFlow) {
          const nodeData = node.data || {}
          const createdNode = await ctx.prisma.flowNode.create({
            data: {
              title: nodeData.label || node.title || 'Etapa',
              description: nodeData.description || node.description || null,
              type: node.type || 'agent',
              positionX: node.position?.x || node.positionX || 0,
              positionY: node.position?.y || node.positionY || 0,
              reactFlowId: node.id || null,
              metadata: nodeData.options ? { options: nodeData.options } : null,
              asIsQuotationId: quotation.id,
              userId: user.id,
            }
          })
          // Mapear reactFlowId para id do banco
          if (node.id) {
            createdNodes[node.id] = createdNode.id
          }
        }
      }

      // Criar nós do fluxo TO-BE
      if (input.toBeFlow && input.toBeFlow.length > 0) {
        await ctx.prisma.flowNode.createMany({
          data: input.toBeFlow.map((node: any) => {
            const nodeData = node.data || {}
            return {
              title: nodeData.label || node.title || 'Etapa',
              description: nodeData.description || node.description || null,
              type: node.type || 'agent',
              positionX: node.position?.x || node.positionX || 0,
              positionY: node.position?.y || node.positionY || 0,
              reactFlowId: node.id || null,
              metadata: nodeData.options ? { options: nodeData.options } : null,
              toBeQuotationId: quotation.id,
              userId: user.id,
            }
          })
        })
      }

      // Criar conexões entre nós do fluxo AS-IS
      if (input.connections && input.connections.length > 0) {
        await ctx.prisma.flowNodeConnection.createMany({
          data: input.connections
            .filter((conn: any) => createdNodes[conn.fromNodeId] && createdNodes[conn.toNodeId])
            .map((conn: any) => ({
              fromNodeId: createdNodes[conn.fromNodeId],
              toNodeId: createdNodes[conn.toNodeId],
              sourceHandle: conn.sourceHandle || null,
              targetHandle: conn.targetHandle || null,
              label: conn.label || null,
              condition: conn.condition || null,
            }))
        })
      }

      return quotation
    }),

  // Listar cotações (usuário vê só as suas, analista/admin vê todas)
  getAll: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.userId) {
        return []
      }

      // Buscar ou criar usuário
      let user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email || '' }
      })

      if (!user) {
        return []
      }

      // Se for analista ou admin, pode ver todas as cotações
      const canViewAll = canViewAllQuotations(user.role)

      const quotations = await ctx.prisma.quotation.findMany({
        where: canViewAll ? {} : { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          asIsFlow: true,
          toBeFlow: true,
        },
        orderBy: { createdAt: 'desc' }
      })

      return quotations.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        department: q.department,
        priority: q.priority,
        status: q.status,
        estimatedVolume: q.estimatedVolume,
        currentProcess: q.currentProcess,
        expectedBenefits: q.expectedBenefits,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        userName: q.user.name || q.user.email,
        userRole: q.user.role,
      }))
    }),

  // Buscar cotação por ID (requer autenticação)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        return null
      }

      // Buscar usuário no banco para comparar IDs corretamente
      const currentUser = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email || '' }
      })

      if (!currentUser) {
        throw new Error('Usuário não encontrado no banco de dados')
      }

      const quotation = await ctx.prisma.quotation.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          asIsFlow: {
            include: {
              connections: true,
              connectedFrom: true,
            }
          },
          toBeFlow: {
            include: {
              connections: true,
              connectedFrom: true,
            }
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
        }
      })

      if (!quotation) {
        return null
      }

      // Verificar se o usuário tem permissão (é o dono, analista ou admin)
      const isOwner = quotation.userId === currentUser.id
      const canView = isOwner || canViewAllQuotations(currentUser.role)

      if (!canView) {
        throw new Error('Não autorizado')
      }

      return {
        ...quotation,
        userName: quotation.user.name || quotation.user.email,
        userRole: quotation.user.role,
      }
    }),

  // Atualizar cotação
  update: publicProcedure
    .input(quotationSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implementar com Prisma
      // return await ctx.prisma.quotation.update({
      //   where: { id: input.id },
      //   data: {
      //     title: input.title,
      //     description: input.description,
      //     // ... outros campos
      //   }
      // })
      
      return {
        id: input.id,
        ...input,
        updatedAt: new Date(),
      }
    }),

  // Calcular análise
  calculateAnalysis: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const quotation = await ctx.prisma.quotation.findUnique({
        where: { id: input.id },
        include: {
          asIsFlow: true,
          toBeFlow: true,
        }
      })

      if (!quotation) {
        throw new Error('Cotação não encontrada')
      }

      // Calcular métricas básicas
      const analysis = {
        totalSteps: quotation.asIsFlow.length + quotation.toBeFlow.length,
        totalConnections: 0, // Será calculado quando implementar conexões
        averageComplexity: null,
        estimatedSavings: null,
        estimatedCost: null,
        timeReduction: null,
      }

      return await ctx.prisma.quotationAnalysis.upsert({
        where: { quotationId: input.id },
        create: {
          quotationId: input.id,
          ...analysis,
        },
        update: analysis,
      })
    }),

  // Responder cotação (apenas analista e admin)
  reply: protectedProcedure
    .input(z.object({ 
      quotationId: z.string(),
      message: z.string().min(1),
      isInternal: z.boolean().optional().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar usuário no banco
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session?.user?.email || '' }
      })

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      // Verificar se o usuário tem permissão para responder
      if (!canReplyQuotations(user.role)) {
        throw new Error('Você não tem permissão para responder cotações')
      }

      // Verificar se a cotação existe
      const quotation = await ctx.prisma.quotation.findUnique({
        where: { id: input.quotationId }
      })

      if (!quotation) {
        throw new Error('Cotação não encontrada')
      }

      // Criar a resposta
      const reply = await ctx.prisma.quotationReply.create({
        data: {
          quotationId: input.quotationId,
          userId: user.id,
          message: input.message,
          isInternal: input.isInternal || false,
          status: 'sent',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          }
        }
      })

      // Atualizar o status da cotação para "in_review" se ainda estiver em "draft"
      if (quotation.status === 'draft') {
        await ctx.prisma.quotation.update({
          where: { id: input.quotationId },
          data: { status: 'in_review' }
        })
      }

      return reply
    }),
})

