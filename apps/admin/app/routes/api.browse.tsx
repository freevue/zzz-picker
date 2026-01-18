import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { createR2Client, browseBucket } from '@zzz-picker/r2-storage'

const getR2Config = () => ({
  accountId: process.env.R2_ACCOUNT_ID ?? '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
})

const getBucketName = () => process.env.R2_BUCKET_NAME ?? ''

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url)
    const prefix = url.searchParams.get('prefix') ?? ''

    const config = getR2Config()
    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey) {
      console.error('R2 configuration missing:', {
        hasAccountId: !!config.accountId,
        hasAccessKeyId: !!config.accessKeyId,
        hasSecretAccessKey: !!config.secretAccessKey,
      })
      return json({ error: 'R2 configuration missing. Check server logs.' }, { status: 500 })
    }

    const bucketName = getBucketName()
    if (!bucketName) {
      return json({ error: 'R2 bucket configuration missing' }, { status: 500 })
    }

    const client = createR2Client(config)

    const result = await browseBucket(client, {
      bucket: bucketName,
      prefix,
    })

    console.log(
      `Brouse bucket success: ${prefix}, folders: ${result.folders.length}, files: ${result.files.length}`
    )

    return json({
      folders: result.folders,
      files: result.files.map((file) => ({
        key: file.key,
        size: file.size,
      })),
    })
  } catch (error: any) {
    console.error('Browse bucket error:', error)
    return json({ error: `Failed to browse bucket: ${error.message}` }, { status: 500 })
  }
}
