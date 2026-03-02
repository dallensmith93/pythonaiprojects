'use client'

import React, { type CSSProperties } from 'react'

import { simulationActions, useSimulationStore } from '../state/simulationStore'

function formatPercent(value: number): string {
  return `${value}%`
}

const panelStyle: CSSProperties = {
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: 12,
  background: '#ffffff'
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 12
}

export function IncidentSimulatorPage() {
  const scenarios = useSimulationStore((state) => state.scenarios)
  const selectedScenarioId = useSimulationStore((state) => state.selectedScenarioId)
  const simulation = useSimulationStore((state) => state.simulation)
  const timeline = useSimulationStore((state) => state.timeline)
  const alerts = useSimulationStore((state) => state.alerts)
  const logs = useSimulationStore((state) => state.logs)
  const availableActions = useSimulationStore((state) => state.availableActions)
  const latestScore = useSimulationStore((state) => state.latestScore)
  const runHistory = useSimulationStore((state) => state.runHistory)

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: '1rem auto', padding: '0 1rem', maxWidth: 1200 }}>
      <h1>Incident Commander Simulator</h1>
      <p>Run realistic response drills with alerts, logs, timeline progression, mitigation actions, and scoring.</p>

      <section style={{ ...panelStyle, marginBottom: 12 }}>
        <label htmlFor='scenario-selector'>Scenario: </label>
        <select
          id='scenario-selector'
          value={selectedScenarioId}
          onChange={(event) => simulationActions.chooseScenario(event.target.value)}
          style={{ marginLeft: 8 }}
        >
          {scenarios.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
          ))}
        </select>
        <button type='button' onClick={() => simulationActions.advanceTick()} style={{ marginLeft: 12 }}>
          Advance Tick
        </button>
        <button type='button' onClick={() => simulationActions.resetRun()} style={{ marginLeft: 8 }}>
          Reset Run
        </button>
      </section>

      <section style={{ ...panelStyle, marginBottom: 12 }}>
        <h2>Incident Status</h2>
        <div style={gridStyle}>
          <div><strong>Phase:</strong> {simulation.phase}</div>
          <div><strong>Status:</strong> {simulation.status}</div>
          <div><strong>Tick:</strong> {simulation.tick}</div>
          <div><strong>Severity:</strong> {simulation.severity}/5</div>
          <div><strong>Containment:</strong> {formatPercent(simulation.containment)}</div>
          <div><strong>Recovery:</strong> {formatPercent(simulation.recovery)}</div>
          <div><strong>Customer Impact:</strong> {formatPercent(simulation.customerImpact)}</div>
          <div><strong>Alert Noise:</strong> {formatPercent(simulation.alertNoise)}</div>
        </div>
      </section>

      <section style={gridStyle}>
        <section style={panelStyle}>
          <h2>Action Panel</h2>
          <p>Choose mitigation steps that match the current incident phase.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {availableActions.map((action) => (
              <button
                key={action.id}
                type='button'
                onClick={() => simulationActions.applyAction(action.id)}
                disabled={simulation.status !== 'active'}
                title={action.description}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>

        <section style={panelStyle}>
          <h2>Alerts</h2>
          <ul>
            {alerts.map((alert) => (
              <li key={alert.id}>
                <strong>[{alert.level.toUpperCase()}]</strong> {alert.title} - {alert.message}
              </li>
            ))}
          </ul>
        </section>

        <section style={panelStyle}>
          <h2>Timeline</h2>
          <ol>
            {timeline.slice(-12).map((entry) => (
              <li key={entry.id}>
                t{entry.tick} {entry.phase} [{entry.kind}] - {entry.message}
              </li>
            ))}
          </ol>
        </section>

        <section style={panelStyle}>
          <h2>Logs</h2>
          <ul>
            {logs.map((log) => (
              <li key={log.id}>
                t{log.tick} [{log.level}] {log.component}: {log.message}
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section style={{ ...panelStyle, marginTop: 12 }}>
        <h2>Scoring</h2>
        {latestScore ? (
          <>
            <p>
              Score: <strong>{latestScore.total}</strong> ({latestScore.grade})
            </p>
            <ul>
              <li>Timeliness: {latestScore.timeliness}</li>
              <li>Decision quality: {latestScore.decisionQuality}</li>
              <li>Stability: {latestScore.stability}</li>
            </ul>
            <p>Recommendations:</p>
            <ul>
              {latestScore.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Finish or fail a run to generate score output.</p>
        )}
      </section>

      <section style={{ ...panelStyle, marginTop: 12 }}>
        <h2>Run History</h2>
        {runHistory.length === 0 ? (
          <p>No completed runs yet.</p>
        ) : (
          <ul>
            {runHistory.slice(0, 5).map((run) => (
              <li key={run.id}>
                {run.completedAtIso} - {run.scenarioId} - {run.finalState.status} - score {run.score.total}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

