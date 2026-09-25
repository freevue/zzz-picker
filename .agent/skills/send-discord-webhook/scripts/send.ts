#!/usr/bin/env npx tsx
/**
 * 디스코드 웹훅 규격 검증 및 전송 스크립트
 * 
 * 지원 블록 타입 (3종):
 * - match-integrity: 경기 데이터 무결성 동기화 브리핑
 * - simple-text: 단순 텍스트 메시지
 * - system-failure: 시스템 작업 실패 알림 (어떤 작업을 실패했는지 명시)
 * 
 * 사용법:
 * node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts --type <block-type> --data '<json>'
 */

const DEFAULT_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  'https://discord.com/api/webhooks/1546091379917324349/wrIbtqEh1UapcimcL3SKeNYYFV_DV2wZvvTMFW-zcwQMYxXLEgO88bPlMuyu8XTvNo-x';

// 사용자가 디스코드 채널 설정에서 등록한 웹훅 아바타/이름을 기본 우선으로 사용
// 환경변수가 지정된 경우에만 명시적으로 덮어씁니다.
const BOT_USERNAME = process.env.DISCORD_BOT_USERNAME || '페어리';
const BOT_AVATAR_URL = process.env.DISCORD_BOT_AVATAR_URL;

const ALLOWED_BLOCK_TYPES = ['match-integrity', 'simple-text', 'system-failure'] as const;
type BlockType = (typeof ALLOWED_BLOCK_TYPES)[number];

interface DiscordPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    footer?: { text: string; icon_url?: string };
    timestamp?: string;
  }>;
}

// 1. 파라미터 파싱
function parseArgs(): { type: string; dataStr: string; webhookUrl: string } {
  const args = process.argv.slice(2);
  let type = '';
  let dataStr = '';
  let webhookUrl = DEFAULT_WEBHOOK_URL;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type' && args[i + 1]) {
      type = args[i + 1];
      i++;
    } else if (args[i] === '--data' && args[i + 1]) {
      dataStr = args[i + 1];
      i++;
    } else if (args[i] === '--webhook' && args[i + 1]) {
      webhookUrl = args[i + 1];
      i++;
    }
  }

  if (!type || !dataStr) {
    console.error(
      JSON.stringify({
        ok: false,
        error: '필수 인자가 누락되었습니다. (--type <block-type> --data <json>)',
        usage: 'node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts --type <block-type> --data \'<json>\'',
        allowedBlockTypes: ALLOWED_BLOCK_TYPES,
      })
    );
    process.exit(1);
  }

  return { type, dataStr, webhookUrl };
}

// 2. 블록별 검증 및 페이로드 빌더
function buildPayload(type: BlockType, data: any): DiscordPayload {
  const nowIso = new Date().toISOString();
  const payload: DiscordPayload = {
    username: BOT_USERNAME,
  };

  // 환경변수로 명시적 아바타 URL이 있을 때만 덮어쓰기 (없으면 디스코드 채널 설정 아바타 자동 유지)
  if (BOT_AVATAR_URL) {
    payload.avatar_url = BOT_AVATAR_URL;
  }

  switch (type) {
    case 'match-integrity': {
      const requiredFields = ['promotedCount', 'hiddenCount', 'officialCount', 'activeCount', 'totalCount'];
      for (const field of requiredFields) {
        if (typeof data[field] !== 'number') {
          throw new Error(`'${type}' 블록 규격 오류: 필수 숫자 필드 '${field}'가 누락되었거나 숫자가 아닙니다.`);
        }
      }

      const executionMode = data.executionMode === 'auto' ? '정기 자동 점검' : '수동 점검';
      const hasChanges = data.promotedCount > 0 || data.hiddenCount > 0;
      const summaryText = hasChanges
        ? `> ✨ 기록 완결 **+${data.promotedCount}건**이 공식 확정되었으며, 방치된 **+${data.hiddenCount}건**이 정리되었습니다.`
        : `> 💡 변동 사항 없이 모든 경기 데이터가 안전하게 유지되고 있습니다.`;

      const promotedValue =
        data.promotedCount > 0
          ? `**\`+${data.promotedCount}건\`** *(공식 확정)*`
          : `\`0건\` *(변동 없음)*`;

      const hiddenValue =
        data.hiddenCount > 0
          ? `**\`+${data.hiddenCount}건\`** *(목록 숨김)*`
          : `\`0건\` *(변동 없음)*`;

      payload.embeds = [
        {
          title: '🛡️ 경기 기록 자동 점검 및 정리 완료',
          description: `선수 참여, 보스 선택, 픽 완료, 점수 입력을 꼼꼼히 점검하여 경기 기록을 최신 상태로 안전하게 맞췄습니다. (${executionMode})`,
          color: 3066993, // 에메랄드 그린 (#2ECC71)
          fields: [
            {
              name: '🟢 정상 확정된 경기',
              value: promotedValue,
              inline: true,
            },
            {
              name: '🧹 미완료 방치방 정리',
              value: hiddenValue,
              inline: true,
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: false,
            },
            {
              name: '🏆 공식 완료 경기',
              value: `**\`${data.officialCount}개\`**`,
              inline: true,
            },
            {
              name: '⚔️ 현재 진행 중',
              value: `**\`${data.activeCount}개\`**`,
              inline: true,
            },
            {
              name: '📊 총 누적 경기',
              value: `**\`${data.totalCount}개\`**`,
              inline: true,
            },
            {
              name: '📋 점검 결과 요약',
              value: summaryText,
              inline: false,
            },
          ],
          footer: {
            text: 'zzz-picker • 경기 기록 지킴이 페어리',
          },
          timestamp: nowIso,
        },
      ];
      return payload;
    }

    case 'simple-text': {
      if (!data.content || typeof data.content !== 'string') {
        throw new Error(`'${type}' 블록 규격 오류: 필수 문자열 필드 'content'가 누락되었습니다.`);
      }
      const prefix = data.prefix ? `${data.prefix} ` : '';
      payload.content = `${prefix}${data.content}`;
      return payload;
    }

    case 'system-failure': {
      if (!data.taskName || typeof data.taskName !== 'string') {
        throw new Error(`'${type}' 블록 규격 오류: 실패한 작업명을 나타내는 필수 문자열 필드 'taskName'이 누락되었습니다.`);
      }
      if (!data.errorMessage || typeof data.errorMessage !== 'string') {
        throw new Error(`'${type}' 블록 규격 오류: 필수 오류 설명 필드 'errorMessage'가 누락되었습니다.`);
      }

      const fields: Array<{ name: string; value: string; inline?: boolean }> = [];
      if (data.stage) {
        fields.push({ name: '📌 실패 단계', value: `\`${data.stage}\``, inline: true });
      }
      if (data.retryCount !== undefined) {
        fields.push({ name: '🔄 시도 횟수', value: `${data.retryCount}회`, inline: true });
      }
      if (data.errorDetail) {
        fields.push({
          name: '📋 상세 오류 로그',
          value: `\`\`\`\n${String(data.errorDetail).slice(0, 1000)}\n\`\`\``,
          inline: false,
        });
      }

      payload.embeds = [
        {
          title: `🚨 [작업 실패] ${data.taskName}`,
          description: data.errorMessage,
          color: 15158332, // 레드 (#E74C3C)
          fields: fields.length > 0 ? fields : undefined,
          footer: {
            text: 'zzz-picker System Operations',
          },
          timestamp: nowIso,
        },
      ];
      return payload;
    }

    default:
      throw new Error(`지원하지 않는 블록 타입입니다: '${type}'`);
  }
}

// 3. 실행 엔트리포인트
async function main() {
  const { type, dataStr, webhookUrl } = parseArgs();

  if (!ALLOWED_BLOCK_TYPES.includes(type as BlockType)) {
    console.error(
      JSON.stringify({
        ok: false,
        error: `허용되지 않은 블록 타입: '${type}'`,
        allowedBlockTypes: ALLOWED_BLOCK_TYPES,
      })
    );
    process.exit(1);
  }

  let data: any;
  try {
    data = JSON.parse(dataStr);
  } catch (err: any) {
    console.error(
      JSON.stringify({
        ok: false,
        error: `JSON 파싱 실패: ${err.message}`,
        received: dataStr,
      })
    );
    process.exit(1);
  }

  let payload: DiscordPayload;
  try {
    payload = buildPayload(type as BlockType, data);
  } catch (err: any) {
    console.error(
      JSON.stringify({
        ok: false,
        error: err.message,
        type,
      })
    );
    process.exit(1);
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        JSON.stringify({
          ok: false,
          status: res.status,
          statusText: res.statusText,
          response: text,
        })
      );
      process.exit(1);
    }

    console.log(
      JSON.stringify({
        ok: true,
        blockType: type,
        status: res.status,
        message: '디스코드 웹훅 전송 성공',
      })
    );
  } catch (err: any) {
    console.error(
      JSON.stringify({
        ok: false,
        error: `네트워크 전송 실패: ${err.message}`,
      })
    );
    process.exit(1);
  }
}

main();
