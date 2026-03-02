interface HeaderProps {
  total: number
  visible: number
}

export function Header({ total, visible }: HeaderProps) {
  return (
    <header className="panel" style={{ marginBottom: '1rem' }}>
      <h1 style={{ margin: 0 }}>Showcase Hub</h1>
      <p className="muted" style={{ marginBottom: 0 }}>
        Browse every app under `/apps` with search and tag filters. Showing {visible} of {total}.
      </p>
    </header>
  )
}
