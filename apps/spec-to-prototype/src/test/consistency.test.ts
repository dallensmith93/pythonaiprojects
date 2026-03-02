import { describe, expect, it } from 'vitest'

import { checkConsistency } from '../domain/consistency'
import { generateApiSchema } from '../domain/schemas'
import { generatePrd } from '../domain/prd'
import { generateUiSkeleton } from '../domain/ui_skeleton'

describe('consistency checks', () => {
  it('marks generated outputs as aligned', () => {
    const prd = generatePrd('Customer portal')
    const api = generateApiSchema('Customer portal')
    const ui = generateUiSkeleton('Customer portal')

    const result = checkConsistency(prd, api, ui)
    expect(result.aligned).toBe(true)
  })

  it('flags missing API GET endpoint as inconsistency', () => {
    const prd = generatePrd('X')
    const ui = generateUiSkeleton('X')
    const result = checkConsistency(prd, { service: 'x', endpoints: [] }, ui)
    expect(result.aligned).toBe(false)
    expect(result.issues.length).toBeGreaterThan(0)
  })
})
