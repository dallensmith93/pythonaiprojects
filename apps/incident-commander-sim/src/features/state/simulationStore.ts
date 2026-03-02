import { useSyncExternalStore } from 'react'

import {
  INCIDENT_SCENARIOS,
  MITIGATION_ACTIONS,
  advanceSimulationTick,
  applyMitigationAction,
  buildAlerts,
  buildLogStream,
  createInitialSimulationState,
  createTimelineEntry,
  getScenarioById,
  scoreRun,
  type AlertEvent,
  type IncidentScenario,
  type LogEntry,
  type SimulationScore,
  type SimulationState,
  type TimelineEntry
} from '../../domain'
import {
  loadPersistedData,
  persistRunRecord,
  persistScenarioSelection,
  type RunRecord
} from '../persistence/storage'

export interface SimulationStoreState {
  scenarios: IncidentScenario[]
  selectedScenarioId: string
  simulation: SimulationState
  timeline: TimelineEntry[]
  alerts: AlertEvent[]
  logs: LogEntry[]
  runHistory: RunRecord[]
  latestScore: SimulationScore | null
  availableActions: typeof MITIGATION_ACTIONS
}

const defaultScenario = INCIDENT_SCENARIOS[0]
const initialSimulation = createInitialSimulationState(defaultScenario)
const initialEntry = createTimelineEntry(initialSimulation, 'system', 'Simulation initialized.')

let storeState: SimulationStoreState = {
  scenarios: INCIDENT_SCENARIOS,
  selectedScenarioId: defaultScenario.id,
  simulation: initialSimulation,
  timeline: [initialEntry],
  alerts: buildAlerts(initialSimulation),
  logs: buildLogStream(initialSimulation, [initialEntry]),
  runHistory: [],
  latestScore: null,
  availableActions: MITIGATION_ACTIONS
}

const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

function setState(next: SimulationStoreState): void {
  storeState = next
  notify()
}

function rebuildDerived(next: SimulationStoreState): SimulationStoreState {
  return {
    ...next,
    alerts: buildAlerts(next.simulation),
    logs: buildLogStream(next.simulation, next.timeline)
  }
}

function maybeFinalizeRun(next: SimulationStoreState): SimulationStoreState {
  if (next.simulation.status === 'active') {
    return next
  }

  const score = scoreRun({
    finalState: next.simulation,
    timeline: next.timeline,
    actions: next.simulation.actionsTaken
  })

  const record: RunRecord = {
    id: `${next.simulation.scenarioId}-${Date.now()}`,
    scenarioId: next.simulation.scenarioId,
    completedAtIso: new Date().toISOString(),
    finalState: next.simulation,
    timeline: next.timeline,
    actions: next.simulation.actionsTaken,
    score
  }

  const updatedHistory = persistRunRecord(next.selectedScenarioId, next.runHistory, record)

  return {
    ...next,
    runHistory: updatedHistory,
    latestScore: score
  }
}

function hydrate(): void {
  const persisted = loadPersistedData(defaultScenario.id)
  const selectedScenario = getScenarioById(persisted.selectedScenarioId)
  const simulation = createInitialSimulationState(selectedScenario)
  const timeline = [createTimelineEntry(simulation, 'system', `Loaded scenario: ${selectedScenario.name}.`)]

  setState(
    rebuildDerived({
      ...storeState,
      selectedScenarioId: selectedScenario.id,
      simulation,
      timeline,
      runHistory: persisted.runHistory,
      latestScore: null
    })
  )
}

export const simulationActions = {
  hydrate,
  chooseScenario(scenarioId: string) {
    const scenario = getScenarioById(scenarioId)
    const simulation = createInitialSimulationState(scenario)
    const timeline = [createTimelineEntry(simulation, 'system', `Scenario selected: ${scenario.name}.`)]

    const next = rebuildDerived({
      ...storeState,
      selectedScenarioId: scenario.id,
      simulation,
      timeline,
      latestScore: null
    })

    persistScenarioSelection(next.selectedScenarioId, next.runHistory)
    setState(next)
  },
  applyAction(actionId: string) {
    const update = applyMitigationAction(storeState.simulation, actionId)
    const nextTimeline = [
      ...storeState.timeline,
      createTimelineEntry(update.state, 'action', update.message)
    ]

    let next = rebuildDerived({
      ...storeState,
      simulation: update.state,
      timeline: nextTimeline
    })

    next = maybeFinalizeRun(next)
    persistScenarioSelection(next.selectedScenarioId, next.runHistory)
    setState(next)
  },
  advanceTick() {
    const previousPhase = storeState.simulation.phase
    const update = advanceSimulationTick(storeState.simulation)
    const kind = update.state.phase !== previousPhase ? 'phase' : 'system'
    const nextTimeline = [
      ...storeState.timeline,
      createTimelineEntry(update.state, kind, update.message)
    ]

    let next = rebuildDerived({
      ...storeState,
      simulation: update.state,
      timeline: nextTimeline
    })

    next = maybeFinalizeRun(next)
    persistScenarioSelection(next.selectedScenarioId, next.runHistory)
    setState(next)
  },
  resetRun() {
    const scenario = getScenarioById(storeState.selectedScenarioId)
    const simulation = createInitialSimulationState(scenario)
    const timeline = [createTimelineEntry(simulation, 'system', 'Simulation reset.')]

    const next = rebuildDerived({
      ...storeState,
      simulation,
      timeline,
      latestScore: null
    })

    persistScenarioSelection(next.selectedScenarioId, next.runHistory)
    setState(next)
  }
}

let hydrated = false

export function useSimulationStore<T>(selector: (state: SimulationStoreState) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      if (!hydrated && typeof window !== 'undefined') {
        hydrated = true
        simulationActions.hydrate()
      }
      return () => listeners.delete(listener)
    },
    () => selector(storeState),
    () => selector(storeState)
  )
}
