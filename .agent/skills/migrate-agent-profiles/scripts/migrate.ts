import fs from 'fs';
import path from 'path';

// Content-Type에 따른 확장자 매핑
const CONTENT_TYPE_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
};

const getExtensionFromContentType = (contentType: string): string => {
  return CONTENT_TYPE_EXTENSION_MAP[contentType] ?? '';
};

type PutObjectCommandInput = {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
};

type PutObjectCommandCtor = new (input: PutObjectCommandInput) => unknown;
type R2Client = { send: (command: unknown) => Promise<unknown> };

// R2 클라이언트 생성 함수 (필요 시점에만 모듈 로드)
const loadR2Sdk = async (): Promise<{ createClient: (config: { accountId: string; accessKeyId: string; secretAccessKey: string }) => R2Client; PutObjectCommand: PutObjectCommandCtor }> => {
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
        }) as R2Client,
      PutObjectCommand: sdk.PutObjectCommand as PutObjectCommandCtor,
    };
  } catch (error: any) {
    throw new Error(
      `Failed to load @aws-sdk/client-s3. Install dependencies or run within workspace context. (${error?.message ?? String(error)})`
    );
  }
};

interface AgentData {
  id: number;
  name_ko: string;
  profile_url: string;
  source_id?: number;
}

interface CliOptions {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  publicUrlBase?: string;
  pathPrefix?: string;
  defaultSourceId?: number;
  dryRun: boolean;
}

const parseCliOptions = (args: string[]): CliOptions => {
  const options: CliOptions = { dryRun: false };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      continue;
    }

    const [rawKey, valueFromEqual] = arg.slice(2).split('=');
    const nextValue = valueFromEqual ?? args[i + 1];
    const consumeNextValue = valueFromEqual === undefined && nextValue && !nextValue.startsWith('--');

    const assignValue = (target: keyof CliOptions) => {
      if (!nextValue || nextValue.startsWith('--')) return;
      options[target] = nextValue as never;
      if (consumeNextValue) i += 1;
    };

    switch (rawKey) {
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
      case 'path-prefix':
        assignValue('pathPrefix');
        break;
      case 'default-source-id':
        if (nextValue && !nextValue.startsWith('--')) {
          const parsed = Number(nextValue);
          if (!Number.isNaN(parsed)) {
            options.defaultSourceId = parsed;
          }
          if (consumeNextValue) i += 1;
        }
        break;
      case 'dry-run':
        options.dryRun = true;
        break;
      default:
        break;
    }
  }

  return options;
};

const normalizePublicUrl = (url: string): string => url.replace(/\/+$/, '');
const normalizePathPrefix = (prefix: string): string => prefix.replace(/^\/+|\/+$/g, '');
const escapeSqlString = (value: string): string => value.replace(/'/g, "''");

async function main() {
  // 명령줄 인자로 에이전트 목록 JSON 파일 경로 받기
  const args = process.argv.slice(2);
  const positionalArgs = args.filter((arg) => !arg.startsWith('--'));
  const inputFilePath = positionalArgs[0];
  const outputSqlPath = positionalArgs[1] || './update-profiles.sql';
  const options = parseCliOptions(args);

  if (!inputFilePath) {
    console.error(
      'Usage: tsx migrate.ts <input-agents-json-path> [output-sql-path] [--account-id <id>] [--access-key-id <id>] [--secret-access-key <key>] [--bucket <name>] [--public-url <url>] [--path-prefix <prefix>] [--default-source-id <number>] [--dry-run]'
    );
    process.exit(1);
  }

  // 환경변수 또는 CLI 옵션으로 설정
  const accountId = options.accountId ?? process.env.R2_ACCOUNT_ID;
  const accessKeyId = options.accessKeyId ?? process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = options.secretAccessKey ?? process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = options.bucketName ?? process.env.R2_BUCKET_NAME ?? 'zzz-picker';
  const publicUrlBase = normalizePublicUrl(options.publicUrlBase ?? process.env.R2_PUBLIC_URL ?? 'https://images.zzz.freevue.dev');
  const pathPrefix = normalizePathPrefix(options.pathPrefix ?? process.env.R2_PATH_PREFIX ?? 'images/agents');
  const defaultSourceId = options.defaultSourceId ?? Number(process.env.R2_DEFAULT_SOURCE_ID ?? '5');

  if (!options.dryRun && (!accountId || !accessKeyId || !secretAccessKey)) {
    console.error('Error: Missing R2 environment configurations (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).');
    process.exit(1);
  }

  const sdk = options.dryRun ? null : await loadR2Sdk();
  const r2Client = options.dryRun ? null : sdk!.createClient({ accountId: accountId!, accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! });

  // 입력 데이터 파싱
  let agents: AgentData[] = [];
  try {
    const rawData = fs.readFileSync(path.resolve(inputFilePath), 'utf-8');
    agents = JSON.parse(rawData);
  } catch (error: any) {
    console.error(`Error: Failed to read or parse input JSON file at ${inputFilePath}:`, error.message);
    process.exit(1);
  }

  console.log(`Loaded ${agents.length} agents for migration.`);

  const results: Array<{ agentId: number; nameKo: string; publicUrl: string; sourceId: number }> = [];
  const failures: Array<{ agentId: number; nameKo: string; error: string }> = [];

  for (const agent of agents) {
    try {
      console.log(`[Fetch] ${agent.name_ko} (${agent.id}) -> Fetching from: ${agent.profile_url}`);
      
      const response = await fetch(agent.profile_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || 'image/png';
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const extension = getExtensionFromContentType(contentType) || '.png';
      const uuid = crypto.randomUUID();
      const fileKey = `${pathPrefix}/${agent.id}/${uuid}${extension}`;

      if (options.dryRun) {
        console.log(`[Dry-Run] Skip upload: ${agent.name_ko} -> ${fileKey}`);
      } else {
        console.log(`[Upload] ${agent.name_ko} -> R2 Key: ${fileKey}`);
        await r2Client!.send(new sdk!.PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: contentType
        }));
      }

      const finalPublicUrl = `${publicUrlBase}/${fileKey}`;
      const sourceId = agent.source_id ?? defaultSourceId;

      results.push({
        agentId: agent.id,
        nameKo: agent.name_ko,
        publicUrl: finalPublicUrl,
        sourceId
      });

      console.log(`[Done] ${agent.name_ko} -> R2 URL: ${finalPublicUrl}`);
    } catch (error: any) {
      console.error(`[Fail] ${agent.name_ko} (${agent.id}):`, error.message || String(error));
      failures.push({
        agentId: agent.id,
        nameKo: agent.name_ko,
        error: error.message || String(error)
      });
    }
  }

  console.log('\n=== MIGRATION SUMMARY ===');
  console.log(`Success: ${results.length}`);
  console.log(`Failures: ${failures.length}`);

  if (failures.length > 0) {
    console.error('Failure details:', failures);
  }

  // SQL 생성
  let sqlContent = `-- 에이전트 프로필 이미지 R2 마이그레이션 SQL 스크립트\n`;
  sqlContent += `-- 생성 일시: ${new Date().toISOString()}\n\n`;
  sqlContent += `-- dryRun: ${options.dryRun}\n`;
  sqlContent += `-- bucket: ${bucketName}\n`;
  sqlContent += `-- pathPrefix: ${pathPrefix}\n\n`;

  results.forEach(item => {
    sqlContent += `-- ${escapeSqlString(item.nameKo)} (ID: ${item.agentId}) 업데이트\n`;
    sqlContent += `WITH inserted_img AS (\n`;
    sqlContent += `  INSERT INTO agent_images (agent_id, url, description, source_id)\n`;
    sqlContent += `  VALUES (${item.agentId}, '${escapeSqlString(item.publicUrl)}', 'profile_image', ${item.sourceId})\n`;
    sqlContent += `  RETURNING id\n`;
    sqlContent += `)\n`;
    sqlContent += `UPDATE agents\n`;
    sqlContent += `SET profile_image_id = (SELECT id FROM inserted_img)\n`;
    sqlContent += `WHERE id = ${item.agentId};\n\n`;
  });

  const finalSqlPath = path.resolve(outputSqlPath);
  fs.writeFileSync(finalSqlPath, sqlContent, 'utf-8');
  console.log(`[SQL Generated] Output path: ${finalSqlPath}`);
}

main();
