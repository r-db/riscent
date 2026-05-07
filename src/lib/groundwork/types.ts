// ─────────────────────────────────────────────────────────────────────────────
// Groundwork — Core Types
// ─────────────────────────────────────────────────────────────────────────────

export type SystemType = 'voice_phone'

export type CanvasNodeType =
  | 'actor'
  | 'trigger'
  | 'precondition'
  | 'decision'
  | 'output'
  | 'error'
  | 'integration'
  | 'monitoring'
  | 'data'

export interface GroundworkNode {
  id: string
  type: CanvasNodeType
  label: string
  sublabel?: string
  x: number
  y: number
}

export type EdgeStyle = 'success' | 'error' | 'data' | 'default'

export interface GroundworkEdge {
  id: string
  source: string
  target: string
  label?: string
  style: EdgeStyle
}

export interface Question {
  id: string
  number: number          // 1-20
  text: string            // The question
  why: string             // Why this matters (teaching)
  failure?: string        // Real production failure example
  placeholder: string
  isMultiline?: boolean   // textarea vs input
  mapsTo?: CanvasNodeType // node type added on answer
}

export interface Answer {
  questionId: string
  value: string
}

export interface CanvasState {
  nodes: GroundworkNode[]
  edges: GroundworkEdge[]
}

export interface GenerateRequest {
  systemType: SystemType
  answers: Answer[]
}

export interface GenerateResponse {
  spec: string
  sections: {
    system: string
    actors: string[]
    triggers: string[]
    preconditions: string[]
    decisionGates: string[]
    outputs: string[]
    errorStates: string[]
    integrations: string[]
    monitoringSpec: string[]
    testCases: string[]
  }
}
