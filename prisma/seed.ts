import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'João Silva',
      role: 'user',
    },
  })

  const analista1 = await prisma.user.upsert({
    where: { email: 'analista@example.com' },
    update: {},
    create: {
      email: 'analista@example.com',
      name: 'Maria Santos',
      role: 'analista',
    },
  })

  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Carlos Admin',
      role: 'admin',
    },
  })

  console.log('✅ Usuários criados:', { user1: user1.email, analista1: analista1.email, admin1: admin1.email })

  // Criar cotações de exemplo
  const quotation1 = await prisma.quotation.create({
    data: {
      title: 'Automação de Processamento de Faturas',
      description: 'Automatizar o processo de recebimento, validação e processamento de faturas de fornecedores.',
      department: 'financeiro',
      priority: 'alta',
      estimatedVolume: '500',
      currentProcess: 'Processo manual onde funcionários recebem faturas por email, validam manualmente em planilha Excel e processam no sistema ERP.',
      expectedBenefits: 'Redução de 80% do tempo de processamento, eliminação de erros manuais e melhoria na rastreabilidade.',
      status: 'draft',
      userId: user1.id,
    },
  })

  const quotation2 = await prisma.quotation.create({
    data: {
      title: 'Automação de Cadastro de Clientes',
      description: 'Automatizar o cadastro de novos clientes a partir de formulários online.',
      department: 'vendas',
      priority: 'media',
      estimatedVolume: '200',
      currentProcess: 'Vendedores preenchem formulário manual, enviam para RH que valida e cadastra no CRM.',
      expectedBenefits: 'Redução de tempo de cadastro de 2 horas para 10 minutos, integração automática com CRM.',
      status: 'in_review',
      userId: user1.id,
    },
  })

  const quotation3 = await prisma.quotation.create({
    data: {
      title: 'Automação de Relatórios Mensais',
      description: 'Gerar automaticamente relatórios mensais de vendas e performance.',
      department: 'vendas',
      priority: 'baixa',
      estimatedVolume: '12',
      currentProcess: 'Analista coleta dados de múltiplas fontes, consolida em Excel e gera apresentação em PowerPoint.',
      expectedBenefits: 'Economia de 8 horas mensais, relatórios sempre atualizados e padronizados.',
      status: 'approved',
      userId: user1.id,
    },
  })

  console.log('✅ Cotações criadas:', quotation1.title, quotation2.title, quotation3.title)

  // Criar nós de fluxo AS-IS para a primeira cotação
  const asIsNode1 = await prisma.flowNode.create({
    data: {
      title: 'Recebimento de Email',
      description: 'Funcionário recebe email com fatura anexada',
      type: 'start',
      positionX: 100,
      positionY: 100,
      reactFlowId: '1',
      asIsQuotationId: quotation1.id,
      userId: user1.id,
    },
  })

  const asIsNode2 = await prisma.flowNode.create({
    data: {
      title: 'Validação Manual',
      description: 'Analista valida dados da fatura em planilha Excel',
      type: 'agent',
      positionX: 300,
      positionY: 100,
      reactFlowId: '2',
      asIsQuotationId: quotation1.id,
      userId: user1.id,
    },
  })

  const asIsNode3 = await prisma.flowNode.create({
    data: {
      title: 'Aprovação',
      description: 'Gerente aprova ou rejeita a fatura',
      type: 'decision',
      positionX: 500,
      positionY: 100,
      reactFlowId: '3',
      metadata: { options: ['Aprovado', 'Rejeitado'] },
      asIsQuotationId: quotation1.id,
      userId: user1.id,
    },
  })

  const asIsNode4 = await prisma.flowNode.create({
    data: {
      title: 'Processamento no ERP',
      description: 'Fatura processada no sistema ERP',
      type: 'end',
      positionX: 700,
      positionY: 100,
      reactFlowId: '4',
      asIsQuotationId: quotation1.id,
      userId: user1.id,
    },
  })

  // Criar conexões entre nós
  await prisma.flowNodeConnection.create({
    data: {
      fromNodeId: asIsNode1.id,
      toNodeId: asIsNode2.id,
      sourceHandle: 'start-out',
      targetHandle: 'agent-in',
    },
  })

  await prisma.flowNodeConnection.create({
    data: {
      fromNodeId: asIsNode2.id,
      toNodeId: asIsNode3.id,
      sourceHandle: 'agent-out',
      targetHandle: 'decision-in',
    },
  })

  await prisma.flowNodeConnection.create({
    data: {
      fromNodeId: asIsNode3.id,
      toNodeId: asIsNode4.id,
      sourceHandle: 'option1',
      targetHandle: 'end-in',
      condition: 'Aprovado',
    },
  })

  console.log('✅ Fluxos AS-IS criados')

  // Criar resposta de exemplo (analista respondendo)
  await prisma.quotationReply.create({
    data: {
      quotationId: quotation2.id,
      userId: analista1.id,
      message: 'Cotação analisada. Estimamos um ROI de 85% e tempo de implementação de 4 semanas. Recomendamos aprovação.',
      isInternal: false,
      status: 'sent',
    },
  })

  console.log('✅ Respostas criadas')

  // Criar template de card customizado
  await prisma.cardTemplate.create({
    data: {
      name: 'gatilho-email',
      label: 'Gatilho de Email',
      description: 'Etapa que é iniciada quando um email é recebido',
      icon: 'Mail',
      color: 'from-blue-500 to-cyan-500',
      category: 'system',
      isActive: true,
      userId: admin1.id,
    },
  })

  console.log('✅ Templates criados')

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

