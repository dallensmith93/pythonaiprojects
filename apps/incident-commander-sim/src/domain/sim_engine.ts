export type IncidentPhase = 'detection' | 'triage' | 'containment' | 'eradication' | 'recovery' | 'resolved'
export type SimulationStatus = 'active' | 'resolved' | 'failed'

export interface IncidentScenario {
  id: string
  name: string
  description: string
  attackVector: string
  initialSeverity: number
}

export interface UserAction {
  actionId: string
  tick: number
  accepted: boolean
  reason: string
}

export interface SimulationState {
  scenarioId: string
  tick: number
  phase: IncidentPhase
  severity: number
  containment: number
  recovery: number
  customerImpact: number
  alertNoise: number
  status: SimulationStatus
  actionsTaken: UserAction[]
}

export interface MitigationAction {
  id: string
  label: string
  description: string
  allowedPhases: IncidentPhase[]
  containmentBoost: number
  recoveryBoost: number
  severityDelta: number
  impactDelta: number
  noiseDelta: number
}

export interface ActionOutcome {
  actionId: string
  accepted: boolean
  reason: string
}

export interface SimulationUpdate {
  state: SimulationState
  message: string
  outcome?: ActionOutcome
}

export const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'ransomware-east',
    name: 'Ransomware in East Region',
    description: 'Endpoint encryption began in east-region finance devices with lateral movement indicators.',
    attackVector: 'Compromised admin credentials',
    initialSeverity: 5
  },
  {
    id: 'api-key-leak',
    name: 'Leaked API Key Abuse',
    description: 'Publicly exposed API key is being used to exfiltrate customer metadata.',
    attackVector: 'Credential exposure in CI logs',
    initialSeverity: 4
  },
  {
    id: 'db-latency-outage',
    name: 'Database Latency Outage',
    description: 'Read replicas are saturated and request latency is cascading into timeouts.',
    attackVector: 'Runaway analytical workload',
    initialSeverity: 3
  }
]

export const MITIGATION_ACTIONS: MitigationAction[] = [
  {
    id: 'acknowledge-alerts',
    label: 'Acknowledge and Triage',
    description: 'Open incident bridge, assign commander, and start triage.',
    allowedPhases: ['detection', 'triage'],
    containmentBoost: 8,
    recoveryBoost: 0,
    severityDelta: -1,
    impactDelta: -2,
    noiseDelta: -12
  },
  {
    id: 'isolate-host',
    label: 'Isolate Affected Hosts',
    description: 'Segment suspicious endpoints from production network.',
    allowedPhases: ['triage', 'containment'],
    containmentBoost: 28,
    recoveryBoost: 0,
    severityDelta: -1,
    impactDelta: -6,
    noiseDelta: -4
  },
  {
    id: 'block-indicators',
    label: 'Block Indicators of Compromise',
    description: 'Push IOC blocks across edge, DNS, and endpoint controls.',
    allowedPhases: ['containment', 'eradication'],
    containmentBoost: 20,
    recoveryBoost: 8,
    severityDelta: -1,
    impactDelta: -7,
    noiseDelta: -3
  },
  {
    id: 'rotate-keys',
    label: 'Rotate Secrets and Keys',
    description: 'Invalidate compromised credentials and rotate access paths.',
    allowedPhases: ['containment', 'eradication'],
    containmentBoost: 14,
    recoveryBoost: 14,
    severityDelta: -1,
    impactDelta: -8,
    noiseDelta: -1
  },
  {
    id: 'restore-service',
    label: 'Restore Service Safely',
    description: 'Restore from known-good state and verify controls before reopening traffic.',
    allowedPhases: ['eradication', 'recovery'],
    containmentBoost: 0,
    recoveryBoost: 30,
    severityDelta: -1,
    impactDelta: -12,
    noiseDelta: -5
  },
  {
    id: 'publish-comms',
    label: 'Publish Stakeholder Comms',
    description: 'Send customer/internal updates to reduce uncertainty and escalations.',
    allowedPhases: ['triage', 'containment', 'recovery'],
    containmentBoost: 0,
    recoveryBoost: 8,
    severityDelta: 0,
    impactDelta: -4,
    noiseDelta: -10
  }
]

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function transitionPhase(state: SimulationState): SimulationState {
  if (state.status !== 'active') {
    return state
  }

  if (state.customerImpact >= 100 || state.tick >= 24) {
    return { ...state, status: 'failed' }
  }

  if (state.phase === 'detection' && state.actionsTaken.some((action) => action.actionId === 'acknowledge-alerts' && action.accepted)) {
    return { ...state, phase: 'triage' }
  }

  if (state.phase === 'triage' && state.containment >= 30) {
    return { ...state, phase: 'containment' }
  }

  if (state.phase === 'containment' && state.containment >= 65) {
    return { ...state, phase: 'eradication' }
  }

  if (state.phase === 'eradication' && state.recovery >= 45) {
    return { ...state, phase: 'recovery' }
  }

  if (state.phase === 'recovery' && state.recovery >= 85 && state.severity <= 2 && state.customerImpact <= 35) {
    return { ...state, phase: 'resolved', status: 'resolved' }
  }

  return state
}

export function createInitialSimulationState(scenario: IncidentScenario): SimulationState {
  return {
    scenarioId: scenario.id,
    tick: 0,
    phase: 'detection',
    severity: scenario.initialSeverity,
    containment: 0,
    recovery: 0,
    customerImpact: 10,
    alertNoise: 70,
    status: 'active',
    actionsTaken: []
  }
}

export function getScenarioById(scenarioId: string): IncidentScenario {
  return INCIDENT_SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? INCIDENT_SCENARIOS[0]
}

export function getMitigationAction(actionId: string): MitigationAction | undefined {
  return MITIGATION_ACTIONS.find((action) => action.id === actionId)
}

export function applyMitigationAction(state: SimulationState, actionId: string): SimulationUpdate {
  const action = getMitigationAction(actionId)

  if (!action) {
    return {
      state,
      message: 'Unknown mitigation action ignored.',
      outcome: { actionId, accepted: false, reason: 'unknown-action' }
    }
  }

  if (state.status !== 'active') {
    return {
      state,
      message: 'Simulation already ended. Reset to continue.',
      outcome: { actionId, accepted: false, reason: 'simulation-ended' }
    }
  }

  if (!action.allowedPhases.includes(state.phase)) {
    const rejectedAction: UserAction = {
      actionId,
      tick: state.tick,
      accepted: false,
      reason: `Action not allowed during ${state.phase}.`
    }

    return {
      state: {
        ...state,
        actionsTaken: [...state.actionsTaken, rejectedAction],
        alertNoise: clamp(state.alertNoise + 3, 0, 100)
      },
      message: rejectedAction.reason,
      outcome: { actionId, accepted: false, reason: 'invalid-phase' }
    }
  }

  const acceptedAction: UserAction = {
    actionId,
    tick: state.tick,
    accepted: true,
    reason: 'accepted'
  }

  const updatedState = transitionPhase({
    ...state,
    severity: clamp(state.severity + action.severityDelta, 1, 5),
    containment: clamp(state.containment + action.containmentBoost, 0, 100),
    recovery: clamp(state.recovery + action.recoveryBoost, 0, 100),
    customerImpact: clamp(state.customerImpact + action.impactDelta, 0, 100),
    alertNoise: clamp(state.alertNoise + action.noiseDelta, 0, 100),
    actionsTaken: [...state.actionsTaken, acceptedAction]
  })

  return {
    state: updatedState,
    message: `${action.label} applied successfully.`,
    outcome: { actionId, accepted: true, reason: 'accepted' }
  }
}

export function advanceSimulationTick(state: SimulationState): SimulationUpdate {
  if (state.status !== 'active') {
    return { state, message: 'Simulation ended. No further progression.' }
  }

  const containmentPenalty = state.containment < 40 ? 6 : 2
  const recoveryBenefit = state.recovery > 55 ? 5 : 1
  const severityBump = state.containment < 25 ? 1 : 0

  const tickedState = transitionPhase({
    ...state,
    tick: state.tick + 1,
    severity: clamp(state.severity + severityBump, 1, 5),
    customerImpact: clamp(state.customerImpact + containmentPenalty - recoveryBenefit, 0, 100),
    alertNoise: clamp(state.alertNoise + 4 - Math.floor(state.containment / 30), 0, 100)
  })

  return {
    state: tickedState,
    message: `Advanced to minute ${tickedState.tick}.`
  }
}
