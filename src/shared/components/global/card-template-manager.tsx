'use client'

import { useState } from 'react'
import { Button } from '@/src/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/components/ui/card'
import { Input } from '@/src/shared/components/ui/input'
import { Label } from '@/src/shared/components/ui/label'
import { Textarea } from '@/src/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/ui/dialog'
import { Plus, Edit2, Trash2, Palette, Type, Image as ImageIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

interface CardTemplate {
  id?: string
  name: string
  label: string
  description?: string
  icon: string
  color: string
  category?: string
  customFields?: any[]
}

interface CardTemplateManagerProps {
  templates: CardTemplate[]
  onSave: (template: CardTemplate) => void
  onDelete: (id: string) => void
}

const iconOptions = [
  'Play', 'Zap', 'GitBranch', 'Database', 'Cloud', 'Code',
  'Mail', 'FileText', 'Settings', 'Users', 'Clock', 'DollarSign',
  'AlertCircle', 'CheckCircle', 'XCircle', 'Info', 'HelpCircle',
  'Lightbulb', 'BookOpen', 'Shield', 'Lock', 'Unlock', 'Key',
  'Search', 'Filter', 'Download', 'Upload', 'Share', 'Copy'
]

const colorOptions = [
  { label: 'Verde/Teal', value: 'from-emerald-500 to-teal-500' },
  { label: 'Azul/Cyan', value: 'from-blue-500 to-cyan-500' },
  { label: 'Amarelo/Laranja', value: 'from-amber-500 to-orange-500' },
  { label: 'Roxo/Rosa', value: 'from-purple-500 to-pink-500' },
  { label: 'Violeta/Índigo', value: 'from-violet-500 to-indigo-500' },
  { label: 'Vermelho/Rosa', value: 'from-red-500 to-pink-500' },
  { label: 'Verde/Lima', value: 'from-green-500 to-lime-500' },
  { label: 'Azul/Escuro', value: 'from-blue-600 to-blue-800' },
]

export function CardTemplateManager({ templates, onSave, onDelete }: CardTemplateManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(null)
  const [formData, setFormData] = useState<CardTemplate>({
    name: '',
    label: '',
    description: '',
    icon: 'Zap',
    color: 'from-blue-500 to-cyan-500',
    category: 'custom',
    customFields: []
  })

  const handleOpen = (template?: CardTemplate) => {
    if (template) {
      setEditingTemplate(template)
      setFormData(template)
    } else {
      setEditingTemplate(null)
      setFormData({
        name: '',
        label: '',
        description: '',
        icon: 'Zap',
        color: 'from-blue-500 to-cyan-500',
        category: 'custom',
        customFields: []
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.label) return
    
    onSave({
      ...formData,
      id: editingTemplate?.id
    })
    setIsOpen(false)
    setEditingTemplate(null)
  }

  const IconComponent = LucideIcons[formData.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> || LucideIcons.Zap

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Templates de Cards</h3>
          <p className="text-sm text-muted-foreground">
            Crie e gerencie templates customizados para seus fluxos
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Editar Template' : 'Novo Template de Card'}
              </DialogTitle>
              <DialogDescription>
                Configure um novo tipo de card para usar nos seus fluxos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Técnico *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: custom_trigger"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificador único (sem espaços)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Nome Exibido *</Label>
                  <Input
                    id="label"
                    placeholder="Ex: Gatilho Customizado"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nome que aparecerá no card
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva quando usar este tipo de card..."
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Ícone
                  </Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {iconOptions.map((icon) => {
                        const Icon = LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
                        return (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              {Icon && <Icon className="h-4 w-4" />}
                              <span>{icon}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                    <div className={`bg-gradient-to-r ${formData.color} p-2 rounded`}>
                      {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
                    </div>
                    <span className="text-sm text-muted-foreground">Preview</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Cor
                  </Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger id="color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${color.value}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false)
                    setEditingTemplate(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.label}
                >
                  {editingTemplate ? 'Salvar Alterações' : 'Criar Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const TemplateIcon = LucideIcons[template.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> || LucideIcons.Zap
          return (
            <Card key={template.id || template.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`bg-gradient-to-r ${template.color} p-2 rounded-lg`}>
                      {TemplateIcon && <TemplateIcon className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.label}</CardTitle>
                      <CardDescription className="text-xs">{template.name}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleOpen(template)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    {template.category === 'custom' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => template.id && onDelete(template.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {template.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

