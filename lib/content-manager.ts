import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { Readable } from 'stream'
import type { SiteContent } from '@/types/content'

const BUCKET = process.env.BUCKET_NAME
const ENDPOINT = process.env.CLOUDFARE_ENDPOINT
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY
const PUBLIC_URL = process.env.R2_PUBLIC_URL
const KEY = 'site-content.json'
const CONTENT_DIR = path.join(process.cwd(), 'content')
const JSON_PATH = path.join(CONTENT_DIR, 'site-content.json')

if (!BUCKET || !ENDPOINT || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !PUBLIC_URL) {
  console.warn('Cloudflare R2 is not fully configured; content API will use local template only.')
}

function getClient() {
  if (!BUCKET || !ENDPOINT || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    throw new Error('Cloudflare R2 is not configured')
  }

  return new S3Client({
    region: 'auto',
    endpoint: ENDPOINT,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  })
}

async function readBody(body?: Readable | undefined) {
  if (!body) return ''

  const chunks: Buffer[] = []
  for await (const chunk of body) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks).toString('utf-8')
}

function loadLocalTemplate(): SiteContent {
  if (!existsSync(JSON_PATH)) {
    throw new Error('site-content.json template missing')
  }

  const raw = readFileSync(JSON_PATH, 'utf-8')
  return JSON.parse(raw) as SiteContent
}

async function uploadToR2(content: string) {
  const client = getClient()
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      Body: content,
      ContentType: 'application/json',
      CacheControl: 'no-cache',
    }),
  )
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!BUCKET) {
    return loadLocalTemplate()
  }

  try {
    const client = getClient()
    const response = await client.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: KEY,
      }),
    )

    const payload = await readBody(response.Body as Readable)
    if (payload) {
      return JSON.parse(payload) as SiteContent
    }
  } catch (error) {
    const message = (error as Error).message || ''
    if (!message.includes('NoSuchKey')) {
      console.error('Error fetching site content from R2:', error)
    }
  }

  const fallback = loadLocalTemplate()
  await uploadToR2(JSON.stringify(fallback))
  return fallback
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  if (!BUCKET) {
    throw new Error('Cloudflare R2 bucket not configured')
  }

  try {
    await uploadToR2(JSON.stringify(content))
  } catch (error) {
    console.error('Error updating site content on R2:', error)
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
