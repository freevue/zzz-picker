import { sendMessage } from '../../lib/messaging';
import { isSupabaseConfigured } from '../../lib/supabase';

const authStatusEl = document.querySelector<HTMLParagraphElement>('#auth-status')!;
const dbStatusEl = document.querySelector<HTMLParagraphElement>('#db-status')!;
const syncInfoEl = document.querySelector<HTMLParagraphElement>('#sync-info')!;
const openHoyolabBtn = document.querySelector<HTMLButtonElement>('#open-hoyolab')!;
const refreshBtn = document.querySelector<HTMLButtonElement>('#refresh')!;
const clearBtn = document.querySelector<HTMLButtonElement>('#clear')!;

async function render() {
  const [authRes, syncRes] = await Promise.all([
    sendMessage({ type: 'GET_AUTH_STATE' }),
    sendMessage({ type: 'GET_SYNC_PAYLOAD' }),
  ]);

  if (!authRes.ok) {
    authStatusEl.textContent = `오류: ${authRes.error}`;
    return;
  }

  const auth = authRes.auth;
  authStatusEl.textContent = auth?.isLoggedIn
    ? `로그인됨${auth.uid ? ` (UID: ${auth.uid})` : ''}`
    : '미로그인 — 호요랩에서 로그인 후 새로고침하세요';

  const agentCount = syncRes.ok && syncRes.sync ? syncRes.sync.agents.length : 0;
  syncInfoEl.textContent = `동기화된 에이전트: ${agentCount}`;

  dbStatusEl.textContent = isSupabaseConfigured()
    ? 'Supabase 설정됨'
    : '미설정 — .env에 WXT_SUPABASE_* 입력';
}

openHoyolabBtn.addEventListener('click', () => {
  void chrome.tabs.create({ url: 'https://www.hoyolab.com/' });
});

refreshBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await chrome.tabs.sendMessage(tab.id, { type: 'REQUEST_AUTH_SYNC' }).catch(() => undefined);
  }
  await render();
});

clearBtn.addEventListener('click', async () => {
  await sendMessage({ type: 'CLEAR_SESSION' });
  await render();
});

void render();
