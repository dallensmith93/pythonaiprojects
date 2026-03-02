import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProjectCard } from '../components/ProjectCard'
import type { ShowcaseProject } from '../data/projects'

const PROJECT: ShowcaseProject = {
  id: 'x1',
  slug: 'sample',
  name: 'Sample Project',
  oneLiner: 'Test project card rendering.',
  tags: ['developer-tool'],
  liveUrl: '',
  repoPath: 'apps/sample',
  repoUrl: 'https://github.com/dallensmith93/pythonaiprojects/tree/main/apps/sample'
}

describe('ProjectCard', () => {
  it('renders project metadata', () => {
    render(<ProjectCard project={PROJECT} />)
    expect(screen.getByText('Sample Project')).toBeInTheDocument()
    expect(screen.getByText('Test project card rendering.')).toBeInTheDocument()
    expect(screen.getByText('apps/sample')).toBeInTheDocument()
    const repoLink = screen.getByRole('link', { name: /open repo/i })
    expect(repoLink).toHaveAttribute('href', PROJECT.repoUrl)
  })
})
