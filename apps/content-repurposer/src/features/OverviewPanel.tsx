import { CORE_MODULES } from './coreModules'

export function OverviewPanel() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 840, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Content Repurposer (Long → Shorts)</h1>
      <p>Convert long scripts into shorts with consistent tone and timing estimates.</p>
      <h2>Core Modules</h2>
      <ul>
        {CORE_MODULES.map((moduleName) => (
          <li key={moduleName}>{moduleName}</li>
        ))}
      </ul>
    </main>
  )
}
