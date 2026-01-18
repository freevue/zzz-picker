import { json, type ActionFunctionArgs } from '@remix-run/node'
import { createR2Client, generatePresignedUrl } from '@zzz-picker/r2-storage'

const getR2Config = () => ({
  accountId: process.env.R2_ACCOUNT_ID ?? '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
})

const getBucketName = () => process.env.R2_BUCKET_NAME ?? ''
const getPublicUrl = () => process.env.R2_PUBLIC_URL ?? ''

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const formData = await request.formData()
    const path = (formData.get('path') as string) ?? ''
    const contentType = formData.get('contentType') as string

    if (!contentType) {
      return json({ error: 'Content type is required' }, { status: 400 })
    }

    const config = getR2Config()
    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey) {
      return json({ error: 'R2 configuration missing' }, { status: 500 })
    }

    const bucketName = getBucketName()
    const publicUrl = getPublicUrl()

    if (!bucketName || !publicUrl) {
      return json({ error: 'R2 bucket configuration missing' }, { status: 500 })
    }

    const client = createR2Client(config)

    const result = await generatePresignedUrl(
      client,
      {
        bucket: bucketName,
        path,
        contentType,
        expiresIn: 3600,
      },
      publicUrl
    )

    console.log(`Generated presigned URL for path: ${path}, contentType: ${contentType}`)

    return json(result)
  } catch (error: any) {
    console.error('Presigned URL generation error:', error)
    return json({ error: `Failed to generate presigned URL: ${error.message}` }, { status: 500 })
  }
}
