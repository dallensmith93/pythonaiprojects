'use client'

import { useEffect, useMemo, useState } from 'react'

import { Filters } from '../components/Filters'
import { Header } from '../components/Header'
import { ProjectCard } from '../components/ProjectCard'
import { PROJECTS, type ProjectTag } from '../data/projects'
import { filterAndSortProjects, type SortMode } from '../lib/filterSort'
import { loadPreferences, savePreferences } from '../lib/preferences'

export default function Page() {
  const [query, setQuery] = useState(() => loadPreferences().query)
  const [tag, setTag] = useState<ProjectTag | 'all'>(() => loadPreferences().tag)
  const [sort, setSort] = useState<SortMode>(() => loadPreferences().sort)

  useEffect(() => {
    savePreferences({ query, tag, sort })
  }, [query, tag, sort])

  const tags = useMemo(
    () => [...new Set(PROJECTS.flatMap((project) => project.tags))].sort(),
    []
  )

  const visibleProjects = useMemo(
    () => filterAndSortProjects(PROJECTS, { query, tag, sort }),
    [query, tag, sort]
  )

  return (
    <main>
      <Header total={PROJECTS.length} visible={visibleProjects.length} />

      <Filters
        query={query}
        tag={tag}
        sort={sort}
        tags={tags}
        onQueryChange={setQuery}
        onTagChange={setTag}
        onSortChange={setSort}
      />

      <section className="grid cards">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  )
}
