import type { ProjectTag } from '../data/projects'
import type { SortMode } from '../lib/filterSort'

interface FiltersProps {
  query: string
  tag: ProjectTag | 'all'
  sort: SortMode
  tags: Array<ProjectTag>
  onQueryChange: (value: string) => void
  onTagChange: (value: ProjectTag | 'all') => void
  onSortChange: (value: SortMode) => void
}

export function Filters(props: FiltersProps) {
  return (
    <section className="panel" style={{ marginBottom: '1rem' }}>
      <div className="row">
        <label>
          Search{' '}
          <input
            aria-label="search"
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder="Search name, slug, or one-liner"
          />
        </label>

        <label>
          Tag{' '}
          <select
            aria-label="tag"
            value={props.tag}
            onChange={(event) => props.onTagChange(event.target.value as ProjectTag | 'all')}
          >
            <option value="all">all</option>
            {props.tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort{' '}
          <select
            aria-label="sort"
            value={props.sort}
            onChange={(event) => props.onSortChange(event.target.value as SortMode)}
          >
            <option value="id-asc">id asc</option>
            <option value="id-desc">id desc</option>
            <option value="name-asc">name asc</option>
            <option value="name-desc">name desc</option>
          </select>
        </label>
      </div>
    </section>
  )
}
