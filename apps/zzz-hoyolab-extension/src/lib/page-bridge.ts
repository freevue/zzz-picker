import type { HoyolabPageCollectResult } from '../types/hoyolab';

const MESSAGE_SOURCE = 'zzz-hoyolab-extension';
const PAGE_SOURCE = 'zzz-hoyolab-page';
const COLLECT_TIMEOUT_MS = 15_000;

/**
 * 페이지 MAIN world에서 same-origin fetch를 실행합니다.
 * 브라우저가 로그인 쿠키를 자동 첨부하므로 확장 프로그램 `cookies` 권한이 불필요합니다.
 */
export function collectFromPageContext(): Promise<HoyolabPageCollectResult> {
  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window || event.data?.source !== PAGE_SOURCE) return;
      if (event.data.requestId !== requestId) return;

      window.removeEventListener('message', onMessage);
      clearTimeout(timer);

      if (event.data.error) {
        reject(new Error(String(event.data.error)));
        return;
      }

      resolve(event.data.payload as HoyolabPageCollectResult);
    };

    const timer = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('페이지 데이터 수집 시간이 초과되었습니다.'));
    }, COLLECT_TIMEOUT_MS);

    window.addEventListener('message', onMessage);
    injectCollector(requestId);
  });
}

function injectCollector(requestId: string) {
  const script = document.createElement('script');
  script.textContent = `(${collectorMain.toString()})(${JSON.stringify(requestId)});`;
  script.dataset.source = MESSAGE_SOURCE;
  document.documentElement.appendChild(script);
  script.remove();
}

/** 페이지 컨텍스트에서 실행 — 인라인 주입 전용 */
function collectorMain(requestId: string) {
  const PAGE_SOURCE = 'zzz-hoyolab-page';

  function reply(payload: unknown, error?: string) {
    window.postMessage({ source: PAGE_SOURCE, requestId, payload, error }, '*');
  }

  void (async () => {
    try {
      // TODO: 실제 ZZZ 육성가이드 API 엔드포인트로 교체
      // same-origin fetch이므로 유저 세션 쿠키는 브라우저가 자동 첨부합니다.
      const nickname =
        document.querySelector('[class*="user"] [class*="name"]')?.textContent?.trim() ||
        document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() ||
        '';

      if (!nickname) {
        reply(null, '닉네임을 찾을 수 없습니다. 호요랩에 로그인한 뒤 육성가이드 페이지에서 다시 시도하세요.');
        return;
      }

      // TODO: API 응답 파싱으로 agents 채우기
      const agents: Array<{
        id: string;
        name: string;
        level: number;
        rank: number;
        promotion: number;
      }> = [];

      reply({ nickname, agents });
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      reply(null, message);
    }
  })();
}
