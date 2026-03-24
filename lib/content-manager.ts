import BetterSqlite from 'better-sqlite3'
import type { Database as BetterSqliteType } from 'better-sqlite3'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'
import type { SiteContent } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const DB_PATH = path.join(CONTENT_DIR, 'site-content.db')
const JSON_PATH = path.join(CONTENT_DIR, 'site-content.json')
const CONTENT_ID = 'site'
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL
  );
`
const INSERT_SQL = 'INSERT OR REPLACE INTO site_content (id, payload) VALUES (?, ?)'

let database: BetterSqliteType | null = null

function ensureContentDir() {
  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true })
  }
}

function getDatabase(): BetterSqliteType {
  if (database) {
    return database
  }

  ensureContentDir()
  const existed = existsSync(DB_PATH)
  database = new BetterSqlite(DB_PATH)
  database.prepare(CREATE_TABLE_SQL).run()

  if (!existed) {
    const initial = loadInitialContent()
    database.prepare(INSERT_SQL).run(CONTENT_ID, JSON.stringify(initial))
  }

  return database
}

function loadInitialContent(): SiteContent {
  if (!existsSync(JSON_PATH)) {
    throw new Error('Missing site-content.json template for initialization')
  }

  const raw = readFileSync(JSON_PATH, 'utf-8')
  return JSON.parse(raw) as SiteContent
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const db = getDatabase()
    const row = db
      .prepare('SELECT payload FROM site_content WHERE id = ?')
      .get(CONTENT_ID) as { payload: string } | undefined

    if (row?.payload) {
      return JSON.parse(row.payload) as SiteContent
    }

    const fallback = loadInitialContent()
    await updateSiteContent(fallback)
    return fallback
  } catch (error) {
    console.error('Error reading site content:', error)
    throw new Error('Failed to load site content')
  }
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  try {
    const db = getDatabase()
    db.prepare(INSERT_SQL).run(CONTENT_ID, JSON.stringify(content))
  } catch (error) {
    console.error('Error updating site content:', error)
    throw new Error('Failed to update site content')
  }
}

export async function updatePartialContent<K extends keyof SiteContent>(
  key: K,
  value: SiteContent[K],
): Promise<SiteContent> {
  const content = await getSiteContent()
  content[key] = value
  await updateSiteContent(content)
  return content
}
