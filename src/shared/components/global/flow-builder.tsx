'use client'

import { useCallback, useState, useEffect, type MouseEvent } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Play, Shield, Bot, GitBranch, Square, Plus, Focus, RotateCcw, Pencil } from 'lucide-react'

// Custom Node Components - Minimalista
function StartNode({ data, id }: NodeProps<any>) {
  const { setNodes } = useReactFlow()
  const onEdit = (data as any).onEdit

  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation()
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }

  const handleEdit = (event: MouseEvent) => {
    event.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <div className="relative min-w-[120px] px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center gap-2 group">
      <button
        type="button"
        onClick={handleDelete}
        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={handleEdit}
          className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600 hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-2.5 w-2.5" />
        </button>
      )}
      <Handle type="source" position={Position.Right} id="start-out" className="!bg-gray-400 !border-gray-400" />
      <Play className="h-3.5 w-3.5 text-gray-500 shrink-0" />
      <span className="text-sm text-gray-700">{data.label}</span>
    </div>
  )
}

function GuardrailNode({ data, id }: NodeProps<any>) {
  const { setNodes } = useReactFlow()
  const onEdit = (data as any).onEdit
  const readOnly = (data as any).readOnly || false

  const handleDelete = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }

  const handleEdit = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <div className="relative min-w-[140px] px-3 py-2 bg-white border border-gray-200 rounded-md group">
      {!readOnly && (
        <>
          <button
            type="button"
            onClick={handleDelete}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600 hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
          )}
        </>
      )}
      <Handle type="target" position={Position.Left} id="guard-in" className="!bg-gray-400 !border-gray-400" />
      <Handle type="source" position={Position.Right} id="pass" style={{ top: '40%' }} className="!bg-gray-400 !border-gray-400" />
      <Handle type="source" position={Position.Bottom} id="fail" className="!bg-gray-400 !border-gray-400" />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-gray-500 shrink-0" />
          <span className="text-sm text-gray-700">{data.label}</span>
        </div>
        <div className="flex gap-2 text-xs text-gray-500">
          <span>Pass</span>
          <span>•</span>
          <span>Fail</span>
        </div>
      </div>
    </div>
  )
}

function AgentNode({ data, id }: NodeProps<any>) {
  const { setNodes } = useReactFlow()
  const onEdit = (data as any).onEdit
  const readOnly = (data as any).readOnly || false

  const handleDelete = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }

  const handleEdit = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <div className="relative min-w-[140px] px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center gap-2 group">
      {!readOnly && (
        <>
          <button
            type="button"
            onClick={handleDelete}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600 hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
          )}
        </>
      )}
      <Handle type="target" position={Position.Left} id="agent-in" className="!bg-gray-400 !border-gray-400" />
      <Handle type="source" position={Position.Right} id="agent-out" className="!bg-gray-400 !border-gray-400" />
      <Bot className="h-3.5 w-3.5 text-gray-500 shrink-0" />
      <span className="text-sm text-gray-700">{data.label}</span>
    </div>
  )
}

function DecisionNode({ data, id }: NodeProps<any>) {
  const { setNodes } = useReactFlow()
  const onEdit = (data as any).onEdit
  const readOnly = (data as any).readOnly || false

  const handleDelete = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }

  const handleEdit = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <div className="relative min-w-[160px] px-3 py-2 bg-white border border-gray-200 rounded-md group">
      {!readOnly && (
        <>
          <button
            type="button"
            onClick={handleDelete}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600 hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
          )}
        </>
      )}
      <Handle type="target" position={Position.Left} id="decision-in" className="!bg-gray-400 !border-gray-400" />
      <Handle type="source" position={Position.Right} id="option1" style={{ top: '30%' }} className="!bg-gray-400 !border-gray-400" />
      <Handle type="source" position={Position.Right} id="option2" style={{ top: '50%' }} className="!bg-gray-400 !border-gray-400" />
      <Handle type="source" position={Position.Right} id="option3" style={{ top: '70%' }} className="!bg-gray-400 !border-gray-400" />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-gray-500 shrink-0" />
          <span className="text-sm text-gray-700">{data.label}</span>
        </div>
        <div className="text-xs text-gray-500">
          {data.options?.length || 0} opções
        </div>
      </div>
    </div>
  )
}

function EndNode({ data, id }: NodeProps<any>) {
  const { setNodes } = useReactFlow()
  const onEdit = (data as any).onEdit
  const readOnly = (data as any).readOnly || false

  const handleDelete = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }

  const handleEdit = (event: MouseEvent) => {
    if (readOnly) return
    event.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <div className="relative min-w-[100px] px-3 py-2 bg-white border border-gray-200 rounded-md flex items-center gap-2 group">
      {!readOnly && (
        <>
          <button
            type="button"
            onClick={handleDelete}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600 hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
          )}
        </>
      )}
      <Handle type="target" position={Position.Left} id="end-in" className="!bg-gray-400 !border-gray-400" />
      <Square className="h-3.5 w-3.5 text-gray-500 shrink-0" />
      <span className="text-sm text-gray-700">{data.label}</span>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  start: StartNode as any,
  guardrail: GuardrailNode as any,
  agent: AgentNode as any,
  decision: DecisionNode as any,
  end: EndNode as any,
}

const initialNodes: Node[] = []

const initialEdges: Edge[] = []

interface FlowBuilderInnerProps {
  nodes?: Node[]
  edges?: Edge[]
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  readOnly?: boolean
}

export function FlowBuilderInner({ nodes: externalNodes, edges: externalEdges, onNodesChange: externalOnNodesChange, onEdgesChange: externalOnEdgesChange, readOnly = false }: FlowBuilderInnerProps = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(externalNodes || initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(externalEdges || initialEdges)
  const reactFlow = useReactFlow()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newNodeTitle, setNewNodeTitle] = useState('')
  const [newNodeDescription, setNewNodeDescription] = useState('')
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editNodeTitle, setEditNodeTitle] = useState('')
  const [editNodeDescription, setEditNodeDescription] = useState('')

  // Sincronizar mudanças com componente pai
  useEffect(() => {
    if (externalOnNodesChange) {
      externalOnNodesChange(nodes)
    }
  }, [nodes, externalOnNodesChange])

  useEffect(() => {
    if (externalOnEdgesChange) {
      externalOnEdgesChange(edges)
    }
  }, [edges, externalOnEdgesChange])

  // Sincronizar nós externos quando mudarem
  useEffect(() => {
    if (externalNodes && externalNodes.length !== nodes.length) {
      setNodes(externalNodes)
    }
  }, [externalNodes])

  // Adicionar função onEdit e readOnly aos nós
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          readOnly,
          onEdit: readOnly ? undefined : (nodeId: string) => {
            const nodeToEdit = nds.find((n) => n.id === nodeId)
            if (nodeToEdit) {
              setEditingNodeId(nodeId)
              setEditNodeTitle(String(nodeToEdit.data?.label || ''))
              setEditNodeDescription(String(nodeToEdit.data?.description || ''))
            }
          },
        },
      }))
    )
  }, [setNodes, readOnly])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleCenterView = () => {
    reactFlow.fitView({ padding: 0.2, includeHiddenNodes: true })
  }

  const handleCreateNode = (type: 'start' | 'agent' | 'decision' | 'end') => {
    const id = (nodes.length + 1).toString()
    const positionBaseX = 300 + nodes.length * 40
    const positionBaseY = 200 + nodes.length * 20

    const common = {
      id,
      type,
      position: { x: positionBaseX, y: positionBaseY },
    } as const

    let data: Node['data']

    const baseLabel =
      type === 'start'
        ? 'Início'
        : type === 'agent'
        ? `Etapa automática ${id}`
        : type === 'decision'
        ? `Decisão ${id}`
        : 'Fim'

    if (type === 'decision') {
      data = {
        label: newNodeTitle.trim() || baseLabel,
        description: newNodeDescription.trim() || undefined,
        options: ['Sim', 'Não'],
      }
    } else {
      data = {
        label: newNodeTitle.trim() || baseLabel,
        description: newNodeDescription.trim() || undefined,
      }
    }

    const newNode: Node = {
      ...common,
      data: {
        ...data,
        readOnly,
        onEdit: readOnly ? undefined : (nodeId: string) => {
          const nodeToEdit = [...nodes, newNode].find((n) => n.id === nodeId)
          if (nodeToEdit) {
            setEditingNodeId(nodeId)
            setEditNodeTitle(String(nodeToEdit.data?.label || ''))
            setEditNodeDescription(String(nodeToEdit.data?.description || ''))
          }
        },
      },
    }

    setNodes((prev) => [...prev, newNode])
    setIsAddModalOpen(false)
    setNewNodeTitle('')
    setNewNodeDescription('')
  }

  const handleReset = () => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    reactFlow.fitView({ padding: 0.2, includeHiddenNodes: true })
  }

  const handleEditNode = () => {
    if (!editingNodeId) return

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editingNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: editNodeTitle.trim() || node.data.label,
              description: editNodeDescription.trim() || node.data.description,
              onEdit: node.data.onEdit, // Manter a função onEdit
            },
          }
        }
        return node
      })
    )

    setEditingNodeId(null)
    setEditNodeTitle('')
    setEditNodeDescription('')
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        defaultEdgeOptions={{
          style: { stroke: '#9ca3af', strokeWidth: 1.5 },
          animated: false,
        }}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        panOnDrag={!readOnly}
        zoomOnScroll={!readOnly}
      >
        <Background />
        {!readOnly && <Controls className="rounded-lg bg-white shadow-lg" />}
      </ReactFlow>
      {!readOnly && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-white/95 px-4 py-1.5 shadow-lg border border-gray-200">
            <button
              type="button"
              onClick={handleCenterView}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Focus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl border border-gray-200">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Adicionar etapa</span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Nome da etapa</label>
                <input
                  type="text"
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  placeholder="Ex: Validação de dados"
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Descrição (opcional)</label>
                <textarea
                  rows={2}
                  value={newNodeDescription}
                  onChange={(e) => setNewNodeDescription(e.target.value)}
                  placeholder="Explique rapidamente o que acontece nesta etapa..."
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-gray-400 focus:ring-0 resize-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCreateNode('start')}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800">Início</span>
                <Play className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => handleCreateNode('agent')}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800">Ação automática</span>
                <Bot className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => handleCreateNode('decision')}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800">Decisão</span>
                <GitBranch className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => handleCreateNode('end')}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-800">Fim</span>
                <Square className="h-3.5 w-3.5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
      {editingNodeId && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl border border-gray-200">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Editar etapa</span>
              <button
                type="button"
                onClick={() => {
                  setEditingNodeId(null)
                  setEditNodeTitle('')
                  setEditNodeDescription('')
                }}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Nome da etapa</label>
                <input
                  type="text"
                  value={editNodeTitle}
                  onChange={(e) => setEditNodeTitle(e.target.value)}
                  placeholder="Ex: Validação de dados"
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Descrição (opcional)</label>
                <textarea
                  rows={2}
                  value={editNodeDescription}
                  onChange={(e) => setEditNodeDescription(e.target.value)}
                  placeholder="Explique rapidamente o que acontece nesta etapa..."
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-gray-400 focus:ring-0 resize-none"
                />
              </div>
              <button
                type="button"
                onClick={handleEditNode}
                className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 transition-colors text-xs font-medium"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface FlowBuilderProps {
  nodes?: Node[]
  edges?: Edge[]
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
  readOnly?: boolean
}

export function FlowBuilder({ nodes, edges, onNodesChange, onEdgesChange, readOnly = false }: FlowBuilderProps = {}) {
  return (
    <ReactFlowProvider>
      <FlowBuilderInner nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} readOnly={readOnly} />
    </ReactFlowProvider>
  )
}
