import type { HoyolabAuthState } from '../types/hoyolab';
import { sendMessage } from '../lib/messaging';

const HOYOLAB_COOKIE_NAMES = ['ltuid_v2', 'ltoken_v2', 'cookie_token_v2', 'account_id_v2'] as const;

async function readHoyolabCookies(): Promise<Record<string, string>> {
  const cookies = await Promise.all(
    HOYOLAB_COOKIE_NAMES.map((name) =>
      chrome.cookies.get({ url: 'https://www.hoyolab.com', name }),
    ),
  );

  return Object.fromEntries(
    cookies
      .filter((cookie): cookie is chrome.cookies.Cookie => cookie !== null && cookie.value.length > 0)
      .map((cookie) => [cookie.name, cookie.value]),
  );
}

function buildAuthState(cookieMap: Record<string, string>): HoyolabAuthState {
  const hasSession = Boolean(cookieMap.ltoken_v2 || cookieMap.cookie_token_v2);
  return {
    isLoggedIn: hasSession,
    uid: cookieMap.ltuid_v2 ?? cookieMap.account_id_v2,
    cookieToken: cookieMap.cookie_token_v2,
    lastSyncedAt: new Date().toISOString(),
  };
}

export default defineContentScript({
  matches: ['https://www.hoyolab.com/*', 'https://act.hoyolab.com/*'],
  runAt: 'document_idle',
  main() {
    void syncAuthFromCookies();

    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type === 'REQUEST_AUTH_SYNC') {
        void syncAuthFromCookies();
      }
    });
  },
});

async function syncAuthFromCookies() {
  const cookieMap = await readHoyolabCookies();
  const auth = buildAuthState(cookieMap);

  if (!auth.isLoggedIn) return;

  await sendMessage({ type: 'AUTH_UPDATED', payload: auth });
}
