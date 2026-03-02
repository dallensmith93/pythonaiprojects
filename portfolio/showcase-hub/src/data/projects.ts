export type ProjectTag =
  | 'agent'
  | 'ops'
  | 'education'
  | 'productivity'
  | 'content'
  | 'security'
  | 'developer-tool'

export interface ShowcaseProject {
  id: string
  slug: string
  name: string
  oneLiner: string
  tags: ProjectTag[]
  liveUrl: string
  repoPath: string
  repoUrl: string
}

export const PROJECTS: ShowcaseProject[] = [
  { id: '01', slug: 'incident-commander-sim', name: 'Incident Commander Simulator', oneLiner: 'Realistic incident response simulation with alerts/logs/timeline and agent-driven triage.', tags: ['ops', 'agent'], liveUrl: '', repoPath: 'apps/incident-commander-sim', repoUrl: '/apps/incident-commander-sim' },
  { id: '02', slug: 'mastery-gradebook', name: 'Mastery-Based Gradebook + Skill Graph', oneLiner: 'Standards mastery tracking with prerequisite graph and personalized practice recommendations.', tags: ['education'], liveUrl: '', repoPath: 'apps/mastery-gradebook', repoUrl: '/apps/mastery-gradebook' },
  { id: '03', slug: 'budget-subscription-detective', name: 'Budget + Subscription Detective', oneLiner: 'Import bank CSVs, auto-categorize, detect duplicates, and forecast cash flow.', tags: ['productivity'], liveUrl: '', repoPath: 'apps/budget-subscription-detective', repoUrl: '/apps/budget-subscription-detective' },
  { id: '04', slug: 'smart-meal-planner', name: 'Smart Meal Planner', oneLiner: 'Constraint-based meal plans with substitutions and shopping list generation.', tags: ['productivity'], liveUrl: '', repoPath: 'apps/smart-meal-planner', repoUrl: '/apps/smart-meal-planner' },
  { id: '05', slug: 'ai-sprint-planner', name: 'AI Sprint Planner', oneLiner: 'Turn feature ideas into tickets, dependencies, estimates, and sprint plans.', tags: ['developer-tool', 'productivity'], liveUrl: '', repoPath: 'apps/ai-sprint-planner', repoUrl: '/apps/ai-sprint-planner' },
  { id: '06', slug: 'ats-resume-tailor', name: 'Resume + JD Tailor', oneLiner: 'Tailor resume content to a job description with safe rewrites and diff view.', tags: ['productivity'], liveUrl: '', repoPath: 'apps/ats-resume-tailor', repoUrl: '/apps/ats-resume-tailor' },
  { id: '07', slug: 'codebase-navigator', name: 'Codebase Navigator Agent', oneLiner: 'Map repositories and answer where to change X with references.', tags: ['agent', 'developer-tool'], liveUrl: '', repoPath: 'apps/codebase-navigator', repoUrl: '/apps/codebase-navigator' },
  { id: '08', slug: 'test-suite-generator', name: 'Test Suite Generator + Flake Detector', oneLiner: 'Generate tests from flows and detect flakiness trends.', tags: ['developer-tool'], liveUrl: '', repoPath: 'apps/test-suite-generator', repoUrl: '/apps/test-suite-generator' },
  { id: '09', slug: 'ops-dashboard', name: 'Personal Ops Dashboard', oneLiner: 'Monitor uptime, grouped incidents, and alert routing.', tags: ['ops'], liveUrl: '', repoPath: 'apps/ops-dashboard', repoUrl: '/apps/ops-dashboard' },
  { id: '10', slug: 'learning-path-builder', name: 'Learning Path Builder', oneLiner: 'Create adaptive weekly plans with spaced repetition and progress tracking.', tags: ['education'], liveUrl: '', repoPath: 'apps/learning-path-builder', repoUrl: '/apps/learning-path-builder' },
  { id: '11', slug: 'podcast-episode-factory', name: 'Podcast Episode Factory', oneLiner: 'Generate episode outlines, hooks, and consistency checks.', tags: ['content'], liveUrl: '', repoPath: 'apps/podcast-episode-factory', repoUrl: '/apps/podcast-episode-factory' },
  { id: '12', slug: 'content-repurposer', name: 'Content Repurposer', oneLiner: 'Convert long scripts into short variants with timing and hashtags.', tags: ['content'], liveUrl: '', repoPath: 'apps/content-repurposer', repoUrl: '/apps/content-repurposer' },
  { id: '13', slug: 'walkthrough-episode-planner', name: 'Walkthrough Episode Planner', oneLiner: 'Convert checklists into paced episode plans with exports.', tags: ['content', 'productivity'], liveUrl: '', repoPath: 'apps/walkthrough-episode-planner', repoUrl: '/apps/walkthrough-episode-planner' },
  { id: '14', slug: 'scaled-copies-generator', name: 'Scaled Copies Activity Generator', oneLiner: 'Generate practice problems and answer keys with difficulty scaling.', tags: ['education'], liveUrl: '', repoPath: 'apps/scaled-copies-generator', repoUrl: '/apps/scaled-copies-generator' },
  { id: '15', slug: 'security-practice-tracker', name: 'Security Practice Lab Tracker', oneLiner: 'Track authorized practice tasks, notes, and scoring.', tags: ['security'], liveUrl: '', repoPath: 'apps/security-practice-tracker', repoUrl: '/apps/security-practice-tracker' },
  { id: '16', slug: 'config-doctor', name: 'Config Doctor', oneLiner: 'Diagnose dev environment issues and generate safe fix plans.', tags: ['developer-tool'], liveUrl: '', repoPath: 'apps/config-doctor', repoUrl: '/apps/config-doctor' },
  { id: '17', slug: 'knowledge-base-builder', name: 'Knowledge Base Builder', oneLiner: 'Ingest docs, dedupe chunks, search with citations.', tags: ['agent', 'developer-tool'], liveUrl: '', repoPath: 'apps/knowledge-base-builder', repoUrl: '/apps/knowledge-base-builder' },
  { id: '18', slug: 'personal-crm-followups', name: 'Personal CRM + Follow-up Agent', oneLiner: 'Track contacts, pipeline, and follow-up reminders.', tags: ['productivity', 'agent'], liveUrl: '', repoPath: 'apps/personal-crm-followups', repoUrl: '/apps/personal-crm-followups' },
  { id: '19', slug: 'compliance-linter', name: 'Policy & Constraints Compliance Checker', oneLiner: 'Lint drafts against tone/length/rules and suggest rewrites.', tags: ['developer-tool'], liveUrl: '', repoPath: 'apps/compliance-linter', repoUrl: '/apps/compliance-linter' },
  { id: '20', slug: 'spec-to-prototype', name: 'Spec to Prototype Builder', oneLiner: 'Generate PRD, API schema, and UI skeleton from feature ideas.', tags: ['developer-tool', 'productivity'], liveUrl: '', repoPath: 'apps/spec-to-prototype', repoUrl: '/apps/spec-to-prototype' }
]
