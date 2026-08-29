import type { ExtensionMessage, ExtensionResponse } from '../lib/messaging';
import { clearAll, getSyncPayload, setSyncPayload } from '../lib/storage';

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
    void (async () => {
      try {
        switch (message.type) {
          case 'GET_SYNC_PAYLOAD':
            sendResponse({ ok: true, sync: await getSyncPayload() } satisfies ExtensionResponse);
            return;
          case 'CLEAR_SESSION':
            await clearAll();
            sendResponse({ ok: true } satisfies ExtensionResponse);
            return;
          case 'SYNC_UPDATED':
            await setSyncPayload(message.payload);
            sendResponse({ ok: true, sync: message.payload } satisfies ExtensionResponse);
            return;
          default:
            sendResponse({ ok: false, error: 'Unknown message type' } satisfies ExtensionResponse);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        sendResponse({ ok: false, error: msg } satisfies ExtensionResponse);
      }
    })();

    return true;
  });
});
