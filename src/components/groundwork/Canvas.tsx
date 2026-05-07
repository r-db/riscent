'use client'

import { useEffect, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// ─────────────────────────────────────────────────────────────────────────────
// Node type color tokens
// ─────────────────────────────────────────────────────────────────────────────

const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  actor:       { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8' },
  trigger:     { bg: '#F5F3FF', border: '#8B5CF6', text: '#6D28D9' },
  precondition:{ bg: '#FFFBEB', border: '#F59E0B', text: '#B45309' },
  decision:    { bg: '#FDF2F8', border: '#EC4899', text: '#9D174D' },
  output:      { bg: '#ECFDF5', border: '#10B981', text: '#065F46' },
  error:       { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
  integration: { bg: '#F0FDFA', border: '#14B8A6', text: '#0F766E' },
  monitoring:  { bg: '#EEF2FF', border: '#6366F1', text: '#3730A3' },
  data:        { bg: '#F9FAFB', border: '#6B7280', text: '#374151' },
}

const NODE_ICONS: Record<string, string> = {
  actor:       '👤',
  trigger:     '⚡',
  precondition:'🔒',
  decision:    '◆',
  output:      '✓',
  error:       '✕',
  integration: '⇄',
  monitoring:  '◎',
  data:        '⬡',
}

const NODE_LABELS: Record<string, string> = {
  actor:       'ACTOR',
  trigger:     'TRIGGER',
  precondition:'PRECONDITION',
  decision:    'DECISION',
  output:      'OUTPUT',
  error:       'ERROR STATE',
  integration: 'INTEGRATION',
  monitoring:  'MONITORING',
  data:        'DATA',
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom node renderer
// ─────────────────────────────────────────────────────────────────────────────

function GroundworkNode({ data }: { data: Record<string, string> }) {
  const type = data.nodeType || 'output'
  const colors = NODE_COLORS[type] || NODE_COLORS.output
  const icon = NODE_ICONS[type] || '●'
  const typeLabel = NODE_LABELS[type] || type.toUpperCase()

  return (
    <div
      style={{
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        borderRadius: 8,
        padding: '8px 12px',
        minWidth: 160,
        maxWidth: 200,
        fontSize: 11,
        fontFamily: 'var(--font-geist-sans)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 10 }}>{icon}</span>
        <span style={{ color: colors.border, fontWeight: 700, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {typeLabel}
        </span>
      </div>
      <div style={{ color: colors.text, fontWeight: 500, lineHeight: 1.35, fontSize: 11 }}>
        {data.label}
      </div>
    </div>
  )
}

const nodeTypes = { groundworkNode: GroundworkNode }

// ─────────────────────────────────────────────────────────────────────────────
// Canvas component — receives nodes/edges as props, renders React Flow
// ─────────────────────────────────────────────────────────────────────────────

interface CanvasProps {
  incomingNodes: Node[]
  incomingEdges: Edge[]
  isEmpty: boolean
}

export default function Canvas({ incomingNodes, incomingEdges, isEmpty }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Sync incoming nodes/edges from parent
  useEffect(() => {
    setNodes(incomingNodes)
    setEdges(incomingEdges)
  }, [incomingNodes, incomingEdges, setNodes, setEdges])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setTimeout(() => instance.fitView(), 50)
  }, [])

  if (isEmpty) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: '#9CA3AF',
          fontFamily: 'var(--font-geist-sans)',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.3 }}>◈</div>
        <p style={{ fontSize: 13, margin: 0 }}>Your system diagram appears here as you answer</p>
        <p style={{ fontSize: 11, margin: 0, opacity: 0.7 }}>Each answer maps to a node in real time</p>
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onInit={onInit}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={16}
        size={1}
        color="#E5E7EB"
      />
      <Controls
        style={{ bottom: 16, right: 16, top: 'unset', left: 'unset' }}
        showInteractive={false}
      />
      <MiniMap
        style={{ bottom: 80, right: 16, top: 'unset', left: 'unset' }}
        nodeColor={(n) => {
          const type = (n.data?.nodeType as string) || 'output'
          return NODE_COLORS[type]?.border ?? '#9CA3AF'
        }}
        maskColor="rgba(249,250,251,0.8)"
      />
    </ReactFlow>
  )
}
