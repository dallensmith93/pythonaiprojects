import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const APPS_DIR = join(process.cwd(), '..', '..', 'apps')
const OUT_FILE = join(process.cwd(), 'src', 'data', 'discovered-projects.json')

function discoverAppDirs() {
  const entries = readdirSync(APPS_DIR)
  const dirs = entries
    .filter((name) => statSync(join(APPS_DIR, name)).isDirectory())
    .sort((a, b) => a.localeCompare(b))

  return dirs.map((slug, index) => ({
    id: String(index + 1).padStart(2, '0'),
    slug,
    repoPath: relative(process.cwd(), join(APPS_DIR, slug)).replace(/\\/g, '/')
  }))
}

const discovered = discoverAppDirs()
writeFileSync(OUT_FILE, JSON.stringify(discovered, null, 2), 'utf8')
console.log(`Discovered ${discovered.length} apps -> ${OUT_FILE}`)
