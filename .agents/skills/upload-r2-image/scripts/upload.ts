import {
  getAccountId,
  getApiToken,
  parseArgs,
  uploadOne,
  type UploadResult,
} from './lib'

const main = async (): Promise<void> => {
  const items = parseArgs(process.argv.slice(2))

  if (items.length === 0) {
    console.error(
      'Usage: tsx upload.ts --file|--url|--source <local-or-url> --path <r2-prefix> [...]',
    )
    process.exit(1)
  }

  if (!getAccountId() || !getApiToken()) {
    console.error(
      'Error: CLOUDFLARE_API_TOKEN 과 R2_ACCOUNT_ID(또는 CLOUDFLARE_ACCOUNT_ID)가 필요합니다. Cursor Cloud Secrets에 등록하세요.',
    )
    process.exit(1)
  }

  const results: UploadResult[] = []
  for (const item of items) {
    results.push(await uploadOne(item))
  }

  console.log(JSON.stringify(results, null, 2))

  if (results.some((result) => !result.ok)) process.exit(1)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
})
