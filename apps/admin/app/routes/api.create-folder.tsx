import { json, type ActionFunctionArgs } from '@remix-run/node'
import { createR2Client, createFolder } from '@zzz-picker/r2-storage'

const getR2Config = () => ({
  accountId: process.env.R2_ACCOUNT_ID ?? '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
})

const getBucketName = () => process.env.R2_BUCKET_NAME ?? ''

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const formData = await request.formData()
    const path = formData.get('path') as string
    const folderName = formData.get('folderName') as string

    if (!folderName) {
      return json({ error: 'Folder name is required' }, { status: 400 })
    }

    const config = getR2Config()
    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey) {
      return json({ error: 'R2 configuration missing' }, { status: 500 })
    }

    const bucketName = getBucketName()
    if (!bucketName) {
      return json({ error: 'R2 bucket configuration missing' }, { status: 500 })
    }

    const client = createR2Client(config)
    const fullPath = path ? `${path}/${folderName}` : folderName
    const result = await createFolder(client, bucketName, fullPath)

    return json({ success: true, folderKey: result })
  } catch (error) {
    console.error('Create folder error:', error)
    return json({ error: 'Failed to create folder' }, { status: 500 })
  }
}
