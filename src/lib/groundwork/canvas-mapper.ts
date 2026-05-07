import { Node, Edge } from '@xyflow/react'

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Mapper
//
// Translates interview answers into React Flow nodes and edges.
// Each question maps to a layer in the canvas:
//
//  x=0     x=200    x=440    x=680    x=920    x=1160
//  Actor   Trigger  Gates    Outputs  External Monitoring
//
// ─────────────────────────────────────────────────────────────────────────────

// Layer x-positions
const LAYERS = {
  actor:       0,
  trigger:     220,
  precondition: 440,
  decision:    660,
  output:      880,
  error:       880,
  integration: 1100,
  monitoring:  1100,
  data:        440,
} as const

const NODE_HEIGHT = 90
const LAYER_PADDING_TOP = 60

// Count nodes currently positioned at a given x layer
function countAtLayer(nodes: Node[], x: number): number {
  return nodes.filter(n => Math.abs((n.position?.x ?? 0) - x) < 10).length
}

// Get y for the next node in a layer
function nextY(nodes: Node[], x: number): number {
  const count = countAtLayer(nodes, x)
  return LAYER_PADDING_TOP + count * NODE_HEIGHT
}

// Find the first node of a given type in the canvas
function firstOfType(nodes: Node[], type: string): Node | undefined {
  return nodes.find(n => n.data?.nodeType === type)
}

// Split a multi-item answer into individual items
function splitItems(answer: string): string[] {
  return answer
    .split(/[;\n]|(?:,\s)/)
    .map(s => s.trim())
    .filter(s => s.length > 3)
    .slice(0, 5) // max 5 nodes per answer
}

// Truncate label for canvas display
function label(text: string, max = 38): string {
  const clean = text.replace(/^e\.g\.\s*/i, '')
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean
}

interface MapResult {
  newNodes: Node[]
  newEdges: Edge[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Main mapping function — called after each question is answered
// ─────────────────────────────────────────────────────────────────────────────

export function mapAnswer(
  questionId: string,
  answer: string,
  currentNodes: Node[],
  currentEdges: Edge[]
): MapResult {
  const newNodes: Node[] = []
  const newEdges: Edge[] = []

  const add = (
    id: string,
    nodeType: string,
    lbl: string,
    x: number,
    yOverride?: number
  ): Node => {
    const allNodes = [...currentNodes, ...newNodes]
    const y = yOverride !== undefined ? yOverride : nextY(allNodes, x)
    const node: Node = {
      id,
      type: 'groundworkNode',
      position: { x, y },
      data: { label: lbl, nodeType },
    }
    newNodes.push(node)
    return node
  }

  const connect = (
    source: string,
    target: string,
    lbl?: string,
    style: 'success' | 'error' | 'data' | 'default' = 'default'
  ): void => {
    newEdges.push({
      id: `e-${source}-${target}`,
      source,
      target,
      label: lbl,
      data: { edgeStyle: style },
      animated: style === 'success',
      style: {
        stroke:
          style === 'success' ? '#10B981' :
          style === 'error' ? '#EF4444' :
          style === 'data' ? '#3B82F6' :
          '#9CA3AF',
        strokeWidth: 2,
        strokeDasharray: style === 'error' || style === 'default' ? '4 3' : undefined,
      },
      labelStyle: { fontSize: 10, fill: '#6B7280' },
      labelBgStyle: { fill: '#F9FAFB', opacity: 0.9 },
    })
  }

  switch (questionId) {

    case 'trigger': {
      add('trigger-0', 'trigger', label(answer), LAYERS.trigger)
      break
    }

    case 'primary_actor': {
      const node = add('actor-0', 'actor', label(answer), LAYERS.actor)
      const trigger = firstOfType([...currentNodes, ...newNodes], 'trigger')
      if (trigger) connect(node.id, trigger.id, undefined, 'default')
      break
    }

    case 'success_output': {
      const node = add('output-success', 'output', label(answer), LAYERS.output)
      const trigger = firstOfType(currentNodes, 'trigger')
      if (trigger) connect(trigger.id, node.id, 'success', 'success')
      break
    }

    case 'preconditions': {
      const items = splitItems(answer)
      const trigger = firstOfType(currentNodes, 'trigger')
      items.forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + (countAtLayer(allNodes, LAYERS.precondition)) * NODE_HEIGHT
        const node: Node = {
          id: `precondition-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.precondition, y },
          data: { label: label(item), nodeType: 'precondition' },
        }
        newNodes.push(node)
        if (trigger) connect(trigger.id, node.id, undefined, 'default')
      })
      break
    }

    case 'precondition_failure': {
      const items = splitItems(answer)
      const firstPre = firstOfType(currentNodes, 'precondition')
      items.slice(0, 3).forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.error) * NODE_HEIGHT
        const node: Node = {
          id: `error-pre-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.decision, y },
          data: { label: label(item), nodeType: 'error' },
        }
        newNodes.push(node)
        if (firstPre) connect(firstPre.id, node.id, 'fail', 'error')
      })
      break
    }

    case 'secondary_actors': {
      const items = splitItems(answer)
      items.slice(0, 3).forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.output) * NODE_HEIGHT
        newNodes.push({
          id: `notify-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.output, y },
          data: { label: label(item), nodeType: 'output' },
        })
      })
      break
    }

    case 'main_decision': {
      const node = add('decision-0', 'decision', label(answer), LAYERS.decision)
      const trigger = firstOfType(currentNodes, 'trigger')
      if (trigger) connect(trigger.id, node.id, undefined, 'default')
      break
    }

    case 'yes_path': {
      const items = splitItems(answer)
      const decision = firstOfType(currentNodes, 'decision')
      items.slice(0, 3).forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.output) * NODE_HEIGHT
        const node: Node = {
          id: `output-yes-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.output, y },
          data: { label: label(item), nodeType: 'output' },
        }
        newNodes.push(node)
        if (i === 0 && decision) connect(decision.id, node.id, 'YES', 'success')
      })
      break
    }

    case 'no_path': {
      const items = splitItems(answer)
      const decision = firstOfType(currentNodes, 'decision')
      items.slice(0, 3).forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.error) * NODE_HEIGHT
        const node: Node = {
          id: `error-no-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.output, y },
          data: { label: label(item), nodeType: 'error' },
        }
        newNodes.push(node)
        if (i === 0 && decision) connect(decision.id, node.id, 'NO', 'error')
      })
      break
    }

    case 'integrations': {
      const items = splitItems(answer)
      items.forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.integration) * NODE_HEIGHT
        newNodes.push({
          id: `integration-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.integration, y },
          data: { label: label(item), nodeType: 'integration' },
        })
      })
      break
    }

    case 'data_collection': {
      const items = splitItems(answer)
      items.slice(0, 3).forEach((item, i) => {
        const allNodes = [...currentNodes, ...newNodes]
        const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.data) * NODE_HEIGHT
        newNodes.push({
          id: `data-${i}`,
          type: 'groundworkNode',
          position: { x: LAYERS.data, y },
          data: { label: label(item), nodeType: 'data' },
        })
      })
      break
    }

    case 'health_metric': {
      const node = add('monitoring-health', 'monitoring', label(answer, 42), LAYERS.monitoring)
      const successOutput = currentNodes.find(n => n.id === 'output-success')
      if (successOutput) connect(successOutput.id, node.id, 'measures', 'data')
      break
    }

    case 'silent_failure': {
      const allNodes = [...currentNodes, ...newNodes]
      const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.error) * NODE_HEIGHT
      newNodes.push({
        id: 'error-silent',
        type: 'groundworkNode',
        position: { x: LAYERS.output, y },
        data: { label: '⚠ ' + label(answer, 35), nodeType: 'error' },
      })
      break
    }

    case 'time_gate': {
      const node = add('decision-time', 'decision', '⏱ ' + label(answer, 35), LAYERS.precondition)
      const trigger = firstOfType(currentNodes, 'trigger')
      if (trigger) connect(trigger.id, node.id, 'time gate', 'default')
      break
    }

    case 'abandonment': {
      const allNodes = [...currentNodes, ...newNodes]
      const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.error) * NODE_HEIGHT
      newNodes.push({
        id: 'error-abandon',
        type: 'groundworkNode',
        position: { x: LAYERS.output, y },
        data: { label: '↩ ' + label(answer, 35), nodeType: 'error' },
      })
      break
    }

    case 'monitoring_gap': {
      const allNodes = [...currentNodes, ...newNodes]
      const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.monitoring) * NODE_HEIGHT
      newNodes.push({
        id: 'monitoring-gap',
        type: 'groundworkNode',
        position: { x: LAYERS.monitoring, y },
        data: { label: '🕐 Gap: ' + label(answer, 32), nodeType: 'monitoring' },
      })
      break
    }

    case 'constraints': {
      const allNodes = [...currentNodes, ...newNodes]
      const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.precondition) * NODE_HEIGHT
      newNodes.push({
        id: 'constraint-0',
        type: 'groundworkNode',
        position: { x: LAYERS.precondition, y },
        data: { label: '✕ ' + label(answer, 35), nodeType: 'error' },
      })
      break
    }

    case 'escalation': {
      const allNodes = [...currentNodes, ...newNodes]
      const y = LAYER_PADDING_TOP + countAtLayer(allNodes, LAYERS.output) * NODE_HEIGHT
      const node: Node = {
        id: 'output-escalation',
        type: 'groundworkNode',
        position: { x: LAYERS.output, y },
        data: { label: '↑ ' + label(answer, 35), nodeType: 'output' },
      }
      newNodes.push(node)
      const decision = firstOfType(currentNodes, 'decision')
      if (decision) connect(decision.id, node.id, 'escalate', 'default')
      break
    }

    // Q19 (system_name) and Q20 (system_summary) update metadata, no nodes
    default:
      break
  }

  return { newNodes, newEdges }
}
