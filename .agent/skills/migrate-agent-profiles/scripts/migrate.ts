import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

// R2 클라이언트 생성 함수
const createR2Client = (config: { accountId: string; accessKeyId: string; secretAccessKey: string }) => {
  return new S3Client({
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: 'auto',
  });
};

interface AgentData {
  id: number;
  name_ko: string;
  profile_url: string;
  source_id?: number;
}

async function main() {
  // 명령줄 인자로 에이전트 목록 JSON 파일 경로 받기
  const args = process.argv.slice(2);
  const inputFilePath = args[0];
  const outputSqlPath = args[1] || './update-profiles.sql';

  if (!inputFilePath) {
    console.error('Usage: tsx migrate.ts <input-agents-json-path> [output-sql-path]');
    process.exit(1);
  }

  // 환경변수 체크
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'zzz-picker';
  const publicUrlBase = process.env.R2_PUBLIC_URL || 'https://images.zzz.freevue.dev';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Error: Missing R2 environment configurations (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).');
    process.exit(1);
  }

  const r2Client = createR2Client({ accountId, accessKeyId, secretAccessKey });

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
      const uuid = uuidv4();
      const fileKey = `images/agents/${agent.id}/${uuid}${extension}`;

      console.log(`[Upload] ${agent.name_ko} -> R2 Key: ${fileKey}`);
      await r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType
      }));

      const finalPublicUrl = `${publicUrlBase}/${fileKey}`;
      const sourceId = agent.source_id || 5; // 기본값 5 (치지직 프로필)

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

  results.forEach(item => {
    sqlContent += `-- ${item.nameKo} (ID: ${item.agentId}) 업데이트\n`;
    sqlContent += `WITH inserted_img AS (\n`;
    sqlContent += `  INSERT INTO agent_images (agent_id, url, description, source_id)\n`;
    sqlContent += `  VALUES (${item.agentId}, '${item.publicUrl}', 'profile_image', ${item.sourceId})\n`;
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
