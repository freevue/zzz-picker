import type { ContentMessage, ContentResponse } from '../lib/messaging';
import { sendMessage } from '../lib/messaging';
import { collectFromPageContext } from '../lib/page-bridge';
import type { HoyolabSyncPayload } from '../types/hoyolab';

export default defineContentScript({
  matches: ['https://www.hoyolab.com/*', 'https://act.hoyolab.com/*'],
  runAt: 'document_idle',
  main() {
    chrome.runtime.onMessage.addListener((message: ContentMessage, _sender, sendResponse) => {
      if (message?.type !== 'REQUEST_PAGE_SYNC') return;

      void (async () => {
        try {
          const collected = await collectFromPageContext();
          const syncedAt = new Date().toISOString();
          const payload: HoyolabSyncPayload = {
            nickname: collected.nickname,
            agents: collected.agents.map((agent) => ({ ...agent, syncedAt })),
            syncedAt,
          };

          await sendMessage({ type: 'SYNC_UPDATED', payload });
          sendResponse({ ok: true, payload } satisfies ContentResponse);
        } catch (error) {
          const msg = error instanceof Error ? error.message : '동기화 실패';
          sendResponse({ ok: false, error: msg } satisfies ContentResponse);
        }
      })();

      return true;
    });
  },
});
