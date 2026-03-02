import type { ShowcaseProject } from '../data/projects'

interface ProjectCardProps {
  project: ShowcaseProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="panel" data-testid={`project-${project.slug}`}>
      <h3 className="card-title">{project.name}</h3>
      <p className="muted" style={{ marginTop: 0 }}>{project.oneLiner}</p>

      <div>
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <p style={{ marginTop: '0.7rem', marginBottom: '0.65rem' }}>
        <span className="repo-path">{project.repoPath}</span>
      </p>

      <div className="row">
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            <button type="button">Live Demo</button>
          </a>
        ) : (
          <button type="button" disabled title="Set liveUrl in src/data/projects.ts">No Demo</button>
        )}

        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          <button type="button" className="secondary">Open Repo</button>
        </a>

        <button
          type="button"
          className="secondary"
          onClick={() => {
            if (typeof window !== 'undefined' && navigator.clipboard) {
              void navigator.clipboard.writeText(project.repoPath)
            }
          }}
        >
          Repo Path
        </button>
      </div>
    </article>
  )
}
