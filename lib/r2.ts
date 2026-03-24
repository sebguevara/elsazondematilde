import { randomUUID } from 'crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const endpoint = process.env.CLOUDFARE_ENDPOINT
const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const bucket = process.env.BUCKET_NAME
const publicUrl = process.env.R2_PUBLIC_URL

function getClient() {
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    throw new Error('Cloudflare R2 is not configured')
  }

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function uploadImageToR2(file: File, folder = 'gallery') {
  const client = getClient()
  const publicBaseUrl = publicUrl as string
  const extension = file.name.split('.').pop() || 'webp'
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${sanitizeFilename(
    file.name.replace(/\.[^.]+$/, ''),
  )}.${extension}`

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )

  return {
    key,
    url: `${publicBaseUrl.replace(/\/$/, '')}/${key}`,
  }
}
