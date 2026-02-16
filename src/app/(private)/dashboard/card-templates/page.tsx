'use client'

import { useState } from 'react'
import { CardTemplateManager } from '@/src/shared/components/global/card-template-manager'
import { api } from '@/src/shared/providers/trpc-provider'

export default function CardTemplatesPage() {
  const { data: templates = [], refetch } = api.cardTemplates.getAll.useQuery()
  const createMutation = api.cardTemplates.create.useMutation()
  const updateMutation = api.cardTemplates.update.useMutation()
  const deleteMutation = api.cardTemplates.delete.useMutation()

  const handleSave = async (template: any) => {
    try {
      if (template.id) {
        await updateMutation.mutateAsync(template)
      } else {
        await createMutation.mutateAsync(template)
      }
      refetch()
    } catch (error) {
      console.error('Erro ao salvar template:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id })
      refetch()
    } catch (error) {
      console.error('Erro ao deletar template:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Templates de Cards</h1>
        <p className="text-muted-foreground">
          Crie e gerencie templates customizados para usar nos seus fluxos de automação
        </p>
      </div>

      <CardTemplateManager
        templates={templates}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

