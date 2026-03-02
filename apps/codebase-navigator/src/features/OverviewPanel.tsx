import { CORE_MODULES } from './coreModules'

export function OverviewPanel() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 840, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Codebase Navigator Agent</h1>
      <p>Index a repo, map architecture, answer "where do I change X?" with citations.</p>
      <h2>Core Modules</h2>
      <ul>
        {CORE_MODULES.map((moduleName) => (
          <li key={moduleName}>{moduleName}</li>
        ))}
      </ul>
    </main>
  )
}
