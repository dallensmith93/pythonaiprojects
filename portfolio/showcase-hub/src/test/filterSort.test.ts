import { describe, expect, it } from 'vitest'

import { PROJECTS } from '../data/projects'
import { filterAndSortProjects } from '../lib/filterSort'

describe('filterAndSortProjects', () => {
  it('filters by query across name/slug/description', () => {
    const results = filterAndSortProjects(PROJECTS, {
      query: 'incident',
      tag: 'all',
      sort: 'id-asc'
    })

    expect(results.some((project) => project.slug === 'incident-commander-sim')).toBe(true)
  })

  it('filters by tag and sorts by name descending', () => {
    const results = filterAndSortProjects(PROJECTS, {
      query: '',
      tag: 'education',
      sort: 'name-desc'
    })

    expect(results.length).toBeGreaterThan(0)
    const names = results.map((project) => project.name)
    const sorted = [...names].sort((a, b) => b.localeCompare(a))
    expect(names).toEqual(sorted)
  })
})
