import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { uploadImageToR2 } from '@/lib/r2'

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
])

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folder = (formData.get('folder') as string | null) || 'gallery'
    const width = Number(formData.get('width') || 0)
    const height = Number(formData.get('height') || 0)

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const uploaded = await uploadImageToR2(file, folder)

    return NextResponse.json({
      ...uploaded,
      width,
      height,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'No se pudo subir la imagen al almacenamiento' },
      { status: 500 },
    )
  }
}
