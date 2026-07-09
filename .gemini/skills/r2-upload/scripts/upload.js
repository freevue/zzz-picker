#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const EXTENSION_CONTENT_TYPE_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const DEFAULT_FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

const normalizePublicUrl = (url) => url.replace(/\/+$/, '');
const normalizeObjectKey = (key) => key.replace(/^\/+/, '');

const getContentTypeFromPath = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  return EXTENSION_CONTENT_TYPE_MAP[extension] || 'application/octet-stream';
};

const parseCliOptions = (args) => {
  const options = {
    dryRun: false,
    continueOnError: true,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      continue;
    }

    const [rawKey, valueFromEqual] = arg.slice(2).split('=');
    const nextValue = valueFromEqual ?? args[i + 1];
    const consumeNextValue = valueFromEqual === undefined && nextValue && !nextValue.startsWith('--');

    const assignValue = (target) => {
      if (!nextValue || nextValue.startsWith('--')) return;
      options[target] = nextValue;
      if (consumeNextValue) i += 1;
    };

    switch (rawKey) {
      case 'manifest':
        assignValue('manifestPath');
        break;
      case 'report':
        assignValue('reportPath');
        break;
      case 'account-id':
        assignValue('accountId');
        break;
      case 'access-key-id':
        assignValue('accessKeyId');
        break;
      case 'secret-access-key':
        assignValue('secretAccessKey');
        break;
      case 'bucket':
        assignValue('bucketName');
        break;
      case 'public-url':
        assignValue('publicUrlBase');
        break;
      case 'dry-run':
        options.dryRun = true;
        break;
      case 'fail-fast':
        options.continueOnError = false;
        break;
      default:
        break;
    }
  }

  return options;
};

const loadR2Sdk = async () => {
  try {
    const sdk = await import('@aws-sdk/client-s3');
    return {
      createClient: (config) =>
        new sdk.S3Client({
          endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
          region: 'auto',
        }),
      PutObjectCommand: sdk.PutObjectCommand,
    };
  } catch (error) {
    throw new Error(
      `Failed to load @aws-sdk/client-s3. Run from packages/r2-storage after pnpm install. (${error?.message ?? String(error)})`
    );
  }
};

const readManifest = (manifestPath) => {
  const absolutePath = path.resolve(manifestPath);
  const raw = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed) ? parsed : parsed.items;

  if (!Array.isArray(items)) {
    throw new Error('Manifest must be a JSON array or an object with an "items" array.');
  }

  return items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Manifest item at index ${index} must be an object.`);
    }

    const key = normalizeObjectKey(String(item.key || '').trim());
    const sourceUrl = item.sourceUrl ? String(item.sourceUrl).trim() : '';
    const sourcePath = item.sourcePath ? String(item.sourcePath).trim() : '';

    if (!key) {
      throw new Error(`Manifest item at index ${index} is missing "key".`);
    }

    if (!sourceUrl && !sourcePath) {
      throw new Error(`Manifest item at index ${index} must include "sourceUrl" or "sourcePath".`);
    }

    if (sourceUrl && sourcePath) {
      throw new Error(`Manifest item at index ${index} cannot include both "sourceUrl" and "sourcePath".`);
    }

    return {
      key,
      sourceUrl: sourceUrl || undefined,
      sourcePath: sourcePath || undefined,
      contentType: item.contentType ? String(item.contentType) : undefined,
    };
  });
};

const loadSource = async (item, manifestDir) => {
  if (item.sourcePath) {
    const absoluteSourcePath = path.resolve(manifestDir, item.sourcePath);
    const buffer = fs.readFileSync(absoluteSourcePath);
    const contentType = item.contentType || getContentTypeFromPath(absoluteSourcePath);

    return {
      buffer,
      contentType,
      source: absoluteSourcePath,
    };
  }

  const response = await fetch(item.sourceUrl, { headers: DEFAULT_FETCH_HEADERS });
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }

  const contentType =
    item.contentType || response.headers.get('content-type')?.split(';')[0]?.trim() || getContentTypeFromPath(item.key);
  const arrayBuffer = await response.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    contentType,
    source: item.sourceUrl,
  };
};

const printUsage = () => {
  console.error(`Usage:
  node upload.js --manifest <path> [--report <path>] [--account-id <id>] [--access-key-id <id>] [--secret-access-key <key>] [--bucket <name>] [--public-url <url>] [--dry-run] [--fail-fast]

Examples:
  node upload.js --manifest ./upload-manifest.json --report ./upload-report.json
  node upload.js --manifest ./upload-manifest.json --dry-run`);
};

const main = async () => {
  const options = parseCliOptions(process.argv.slice(2));

  if (!options.manifestPath) {
    printUsage();
    process.exit(1);
  }

  const accountId = options.accountId ?? process.env.R2_ACCOUNT_ID;
  const accessKeyId = options.accessKeyId ?? process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = options.secretAccessKey ?? process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = options.bucketName ?? process.env.R2_BUCKET_NAME ?? 'zzz-picker';
  const publicUrlBase = normalizePublicUrl(
    options.publicUrlBase ?? process.env.R2_PUBLIC_URL ?? 'https://images.zzz.freevue.dev'
  );
  const reportPath = path.resolve(options.reportPath ?? './upload-report.json');
  const manifestDir = path.dirname(path.resolve(options.manifestPath));

  if (!options.dryRun && (!accountId || !accessKeyId || !secretAccessKey)) {
    console.error('Error: Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY or pass CLI options.');
    process.exit(1);
  }

  const items = readManifest(options.manifestPath);
  const sdk = options.dryRun ? null : await loadR2Sdk();
  const r2Client = options.dryRun
    ? null
    : sdk.createClient({
        accountId,
        accessKeyId,
        secretAccessKey,
      });

  console.log(`Loaded ${items.length} item(s) from manifest.`);
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'upload'}`);
  console.log(`Bucket: ${bucketName}`);
  console.log(`Public URL base: ${publicUrlBase}`);

  const results = [];
  const failures = [];

  for (const item of items) {
    try {
      console.log(`[Load] ${item.key} <- ${item.sourceUrl ?? item.sourcePath}`);
      const source = await loadSource(item, manifestDir);

      if (options.dryRun) {
        console.log(`[Dry-Run] Skip upload: ${item.key} (${source.contentType}, ${source.buffer.length} bytes)`);
      } else {
        console.log(`[Upload] ${item.key} (${source.contentType}, ${source.buffer.length} bytes)`);
        await r2Client.send(
          new sdk.PutObjectCommand({
            Bucket: bucketName,
            Key: item.key,
            Body: source.buffer,
            ContentType: source.contentType,
          })
        );
      }

      const publicUrl = `${publicUrlBase}/${item.key}`;
      results.push({
        key: item.key,
        publicUrl,
        contentType: source.contentType,
        bytes: source.buffer.length,
        source: source.source,
        status: 'success',
      });

      console.log(`[Done] ${publicUrl}`);
    } catch (error) {
      const message = error?.message ?? String(error);
      console.error(`[Fail] ${item.key}: ${message}`);
      failures.push({
        key: item.key,
        source: item.sourceUrl ?? item.sourcePath,
        status: 'failed',
        error: message,
      });

      if (!options.continueOnError) {
        break;
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    bucket: bucketName,
    publicUrlBase,
    manifestPath: path.resolve(options.manifestPath),
    summary: {
      total: items.length,
      success: results.length,
      failed: failures.length,
    },
    results,
    failures,
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');

  console.log('\n=== UPLOAD SUMMARY ===');
  console.log(`Success: ${results.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Report: ${reportPath}`);

  if (failures.length > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error?.message ?? String(error));
  process.exit(1);
});
