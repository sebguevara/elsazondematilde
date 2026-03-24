import { promises as fs } from 'fs'
import path from 'path'
import type { SiteContent } from '@/types/content'

const CONTENT_PATH = path.join(process.cwd(), 'content', 'site-content.json')

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const fileContent = await fs.readFile(CONTENT_PATH, 'utf-8')
    return JSON.parse(fileContent) as SiteContent
  } catch (error) {
    console.error('Error reading site content:', error)
    throw new Error('Failed to load site content')
  }
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  try {
    await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error updating site content:', error)
    throw new Error('Failed to update site content')
  }
}

export async function updatePartialContent<K extends keyof SiteContent>(
  key: K,
  value: SiteContent[K]
): Promise<SiteContent> {
  const content = await getSiteContent()
  content[key] = value
  await updateSiteContent(content)
  return content
}
