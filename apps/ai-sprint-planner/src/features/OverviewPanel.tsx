import { CORE_MODULES } from './coreModules'

export function OverviewPanel() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 840, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>AI Sprint Planner</h1>
      <p>Turn feature ideas into tickets, dependencies, estimates, and a sprint plan.</p>
      <h2>Core Modules</h2>
      <ul>
        {CORE_MODULES.map((moduleName) => (
          <li key={moduleName}>{moduleName}</li>
        ))}
      </ul>
    </main>
  )
}
