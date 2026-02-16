import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

const cardTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
  category: z.string().default('custom'),
  customFields: z.any().optional(),
})

export const cardTemplatesRouter = router({
  // Listar todos os templates
  getAll: publicProcedure.query(async ({ ctx }) => {
    // TODO: Implementar com Prisma quando DB estiver configurado
    // return await ctx.prisma.cardTemplate.findMany({
    //   where: { isActive: true },
    //   orderBy: { createdAt: 'desc' }
    // })
    
    // Retornar templates padrão por enquanto
    return [
      {
        id: 'trigger',
        name: 'trigger',
        label: 'Gatilho',
        icon: 'Play',
        color: 'from-emerald-500 to-teal-500',
        category: 'system',
      },
      {
        id: 'action',
        name: 'action',
        label: 'Ação',
        icon: 'Zap',
        color: 'from-blue-500 to-cyan-500',
        category: 'system',
      },
      {
        id: 'condition',
        name: 'condition',
        label: 'Condição',
        icon: 'GitBranch',
        color: 'from-amber-500 to-orange-500',
        category: 'system',
      },
      {
        id: 'data',
        name: 'data',
        label: 'Dados',
        icon: 'Database',
        color: 'from-purple-500 to-pink-500',
        category: 'system',
      },
      {
        id: 'integration',
        name: 'integration',
        label: 'Integração',
        icon: 'Cloud',
        color: 'from-violet-500 to-indigo-500',
        category: 'system',
      },
    ]
  }),

  // Criar novo template
  create: publicProcedure
    .input(cardTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Implementar com Prisma
      // return await ctx.prisma.cardTemplate.create({
      //   data: {
      //     ...input,
      //     userId: ctx.session?.user?.id,
      //   }
      // })
      
      return {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }),

  // Atualizar template
  update: publicProcedure
    .input(cardTemplateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implementar com Prisma
      // return await ctx.prisma.cardTemplate.update({
      //   where: { id: input.id },
      //   data: input
      // })
      
      return {
        ...input,
        updatedAt: new Date(),
      }
    }),

  // Deletar template
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implementar com Prisma
      // return await ctx.prisma.cardTemplate.delete({
      //   where: { id: input.id }
      // })
      
      return { success: true }
    }),
})

