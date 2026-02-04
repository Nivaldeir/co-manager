'use client'

import React from "react"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Plus, 
  Trash2, 
  Play, 
  Database, 
  Zap,
  GitBranch,
  Settings,
  Mail,
  FileText,
  Cloud,
  Code
} from 'lucide-react'

interface FlowNode {
  id: string
  title: string
  description: string
  type: 'trigger' | 'action' | 'condition' | 'data' | 'integration'
  position: { x: number; y: number }
  connections: string[] // IDs of connected nodes
}

interface FlowBuilderProps {
  steps: FlowNode[]
  onChange: (steps: FlowNode[]) => void
  type: 'as-is' | 'to-be'
}

const nodeTypes = [
  { type: 'trigger' as const, icon: Play, label: 'Gatilho', color: 'from-emerald-500 to-teal-500' },
  { type: 'action' as const, icon: Zap, label: 'Ação', color: 'from-blue-500 to-cyan-500' },
  { type: 'condition' as const, icon: GitBranch, label: 'Condição', color: 'from-amber-500 to-orange-500' },
  { type: 'data' as const, icon: Database, label: 'Dados', color: 'from-purple-500 to-pink-500' },
  { type: 'integration' as const, icon: Cloud, label: 'Integração', color: 'from-violet-500 to-indigo-500' },
]

export function FlowBuilder({ steps, onChange, type }: FlowBuilderProps) {
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNode = (nodeType: FlowNode['type']) => {
    const newNode: FlowNode = {
      id: Date.now().toString(),
      title: '',
      description: '',
      type: nodeType,
      position: { 
        x: 200 + steps.length * 50, 
        y: 100 + Math.floor(steps.length / 3) * 150 
      },
      connections: []
    }
    setEditingNode(newNode)
    setIsDialogOpen(true)
  }

  const editNode = (node: FlowNode) => {
    setEditingNode({ ...node })
    setIsDialogOpen(true)
  }

  const saveNode = () => {
    if (!editingNode || !editingNode.title) return

    const existingIndex = steps.findIndex(s => s.id === editingNode.id)
    
    if (existingIndex >= 0) {
      const newSteps = [...steps]
      newSteps[existingIndex] = editingNode
      onChange(newSteps)
    } else {
      onChange([...steps, editingNode])
    }

    setIsDialogOpen(false)
    setEditingNode(null)
  }

  const removeNode = (id: string) => {
    // Remove node and all connections to it
    const newSteps = steps
      .filter(step => step.id !== id)
      .map(step => ({
        ...step,
        connections: step.connections.filter(connId => connId !== id)
      }))
    onChange(newSteps)
  }

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    setDraggedNode(nodeId)
  }

  const handleNodeDrag = useCallback((e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSteps = steps.map(step => 
      step.id === draggedNode 
        ? { ...step, position: { x: x - 75, y: y - 40 } }
        : step
    )
    onChange(newSteps)
  }, [draggedNode, steps, onChange])

  const handleNodeDragEnd = () => {
    setDraggedNode(null)
  }

  const handleConnect = (fromId: string, toId: string) => {
    const newSteps = steps.map(step => {
      if (step.id === fromId && !step.connections.includes(toId)) {
        return { ...step, connections: [...step.connections, toId] }
      }
      return step
    })
    onChange(newSteps)
    setConnectingFrom(null)
  }

  const getNodeTypeConfig = (nodeType: FlowNode['type']) => {
    return nodeTypes.find(nt => nt.type === nodeType) || nodeTypes[1]
  }

  const bgColor = type === 'as-is' ? 'bg-zinc-900' : 'bg-zinc-900'

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
        <span className="text-xs font-medium text-zinc-400 mr-2">Adicionar:</span>
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon
          return (
            <Button
              key={nodeType.type}
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 hover:bg-zinc-700 text-zinc-300"
              onClick={() => addNode(nodeType.type)}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{nodeType.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className={`relative min-h-[600px] rounded-xl border-2 border-zinc-700 ${bgColor} overflow-hidden`}
        onMouseMove={draggedNode ? handleNodeDrag : undefined}
        onMouseUp={handleNodeDragEnd}
        onMouseLeave={handleNodeDragEnd}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #27272a 1px, transparent 1px),
              linear-gradient(to bottom, #27272a 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {steps.map(node => 
            node.connections.map(targetId => {
              const targetNode = steps.find(s => s.id === targetId)
              if (!targetNode) return null

              const startX = node.position.x + 75
              const startY = node.position.y + 40
              const endX = targetNode.position.x + 75
              const endY = targetNode.position.y + 40

              const midY = (startY + endY) / 2

              return (
                <g key={`${node.id}-${targetId}`}>
                  <path
                    d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                    stroke="#52525b"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  <circle cx={endX} cy={endY} r="4" fill="#52525b" />
                </g>
              )
            })
          )}
        </svg>

        {/* Nodes */}
        {steps.map((node) => {
          const config = getNodeTypeConfig(node.type)
          const Icon = config.icon
          
          return (
            <div
              key={node.id}
              className="absolute cursor-move group"
              style={{ 
                left: `${node.position.x}px`, 
                top: `${node.position.y}px`,
                zIndex: draggedNode === node.id ? 10 : 2
              }}
              onMouseDown={(e) => handleNodeDragStart(e, node.id)}
            >
              <Card className="w-[150px] bg-zinc-800 border-zinc-700 shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-0">
                  {/* Node Header */}
                  <div className={`bg-gradient-to-r ${config.color} p-2.5 rounded-t-lg`}>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white truncate">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Node Content */}
                  <div className="p-2.5">
                    <h4 className="font-medium text-xs text-zinc-100 mb-1 line-clamp-2 leading-tight">
                      {node.title || 'Sem título'}
                    </h4>
                    {node.description && (
                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                        {node.description}
                      </p>
                    )}
                  </div>

                  {/* Connection Points */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-zinc-900 hover:bg-emerald-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (connectingFrom === node.id) {
                          setConnectingFrom(null)
                        } else if (connectingFrom) {
                          handleConnect(connectingFrom, node.id)
                        } else {
                          setConnectingFrom(node.id)
                        }
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className={`h-4 w-4 rounded-full border-2 border-zinc-900 ${
                        connectingFrom === node.id ? 'bg-amber-500' : 'bg-blue-500 hover:bg-blue-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (connectingFrom === node.id) {
                          setConnectingFrom(null)
                        } else if (connectingFrom) {
                          handleConnect(node.id, connectingFrom)
                        } else {
                          setConnectingFrom(node.id)
                        }
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="h-6 w-6 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-zinc-200 border border-zinc-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        editNode(node)
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </button>
                    <button
                      className="h-6 w-6 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white border border-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNode(node.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}

        {/* Empty State */}
        {steps.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700">
              <Zap className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">Canvas vazio</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm">
              Use a barra de ferramentas acima para adicionar nós e criar seu fluxo
            </p>
          </div>
        )}

        {/* Connection Mode Indicator */}
        {connectingFrom && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-500 text-white text-xs font-medium rounded-full shadow-lg z-50">
            Clique em outro nó para conectar
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-zinc-400">
              {steps.length} {steps.length === 1 ? 'nó' : 'nós'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-sm text-zinc-400">
              {steps.reduce((acc, node) => acc + node.connections.length, 0)} conexões
            </span>
          </div>
        </div>
        <span className="text-xs text-zinc-500">
          Arraste para mover • Clique nos pontos para conectar
        </span>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingNode && steps.find(s => s.id === editingNode.id) ? 'Editar Nó' : 'Novo Nó'}
            </DialogTitle>
            <DialogDescription>
              Configure os detalhes do nó no fluxo
            </DialogDescription>
          </DialogHeader>
          
          {editingNode && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="node-type">Tipo de Nó</Label>
                <div className="grid grid-cols-2 gap-2">
                  {nodeTypes.map((nodeType) => {
                    const Icon = nodeType.icon
                    const isSelected = editingNode.type === nodeType.type
                    return (
                      <Button
                        key={nodeType.type}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setEditingNode({ ...editingNode, type: nodeType.type })}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {nodeType.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="node-title">Título *</Label>
                <Input
                  id="node-title"
                  placeholder="Ex: Validar dados"
                  value={editingNode.title}
                  onChange={(e) => setEditingNode({ ...editingNode, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="node-description">Descrição</Label>
                <Textarea
                  id="node-description"
                  placeholder="Descreva o que este nó faz..."
                  rows={3}
                  value={editingNode.description}
                  onChange={(e) => setEditingNode({ ...editingNode, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingNode(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveNode}
                  disabled={!editingNode.title}
                >
                  {steps.find(s => s.id === editingNode.id) ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
