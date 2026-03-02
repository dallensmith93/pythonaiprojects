import type { ProjectTag, ShowcaseProject } from '../data/projects'

export type SortMode = 'name-asc' | 'name-desc' | 'id-asc' | 'id-desc'

export interface FilterInput {
  query: string
  tag: ProjectTag | 'all'
  sort: SortMode
}

function compareByName(a: ShowcaseProject, b: ShowcaseProject): number {
  return a.name.localeCompare(b.name)
}

function compareById(a: ShowcaseProject, b: ShowcaseProject): number {
  return a.id.localeCompare(b.id)
}

export function filterAndSortProjects(projects: ShowcaseProject[], input: FilterInput): ShowcaseProject[] {
  const query = input.query.trim().toLowerCase()

  const filtered = projects.filter((project) => {
    const queryMatch =
      query.length === 0 ||
      project.name.toLowerCase().includes(query) ||
      project.oneLiner.toLowerCase().includes(query) ||
      project.slug.toLowerCase().includes(query)

    const tagMatch = input.tag === 'all' || project.tags.includes(input.tag)
    return queryMatch && tagMatch
  })

  const sorted = [...filtered]
  if (input.sort === 'name-asc') sorted.sort(compareByName)
  if (input.sort === 'name-desc') sorted.sort((a, b) => compareByName(b, a))
  if (input.sort === 'id-asc') sorted.sort(compareById)
  if (input.sort === 'id-desc') sorted.sort((a, b) => compareById(b, a))

  return sorted
}
