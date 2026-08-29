import { sendMessage, type ContentResponse } from '../../lib/messaging';
import { isSupabaseConfigured } from '../../lib/supabase';

const nicknameEl = document.querySelector<HTMLParagraphElement>('#nickname')!;
const dbStatusEl = document.querySelector<HTMLParagraphElement>('#db-status')!;
const syncStatusEl = document.querySelector<HTMLParagraphElement>('#sync-status')!;
const syncInfoEl = document.querySelector<HTMLParagraphElement>('#sync-info')!;
const openHoyolabBtn = document.querySelector<HTMLButtonElement>('#open-hoyolab')!;
const syncBtn = document.querySelector<HTMLButtonElement>('#sync')!;
const clearBtn = document.querySelector<HTMLButtonElement>('#clear')!;

const HOYOLAB_URL_PATTERN = /^https:\/\/(www\.hoyolab\.com|act\.hoyolab\.com)\//;

async function render() {
  const syncRes = await sendMessage({ type: 'GET_SYNC_PAYLOAD' });

  if (!syncRes.ok) {
    syncStatusEl.textContent = `오류: ${syncRes.error}`;
    return;
  }

  const sync = syncRes.sync;
  nicknameEl.textContent = sync?.nickname ?? '—';
  syncInfoEl.textContent = sync
    ? `마지막 동기화: ${new Date(sync.syncedAt).toLocaleString('ko-KR')} · 에이전트 ${sync.agents.length}명`
    : '아직 동기화된 데이터가 없습니다';

  dbStatusEl.textContent = isSupabaseConfigured()
    ? 'Supabase 설정됨'
    : '미설정 — .env에 WXT_SUPABASE_* 입력';

  syncStatusEl.textContent = '';
  syncBtn.disabled = false;
}

function setSyncing(syncing: boolean) {
  syncBtn.disabled = syncing;
  syncStatusEl.textContent = syncing ? '수집 중…' : '';
}

openHoyolabBtn.addEventListener('click', () => {
  void chrome.tabs.create({ url: 'https://act.hoyolab.com/' });
});

syncBtn.addEventListener('click', async () => {
  setSyncing(true);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id || !tab.url || !HOYOLAB_URL_PATTERN.test(tab.url)) {
      syncStatusEl.textContent = '호요랩 페이지에서 이 버튼을 눌러주세요.';
      return;
    }

    const result = (await chrome.tabs.sendMessage(tab.id, {
      type: 'REQUEST_PAGE_SYNC',
    })) as ContentResponse;

    if (!result.ok) {
      syncStatusEl.textContent = result.error;
      return;
    }

    syncStatusEl.textContent = '동기화 완료';
    await render();
  } catch {
    syncStatusEl.textContent =
      '동기화 실패 — 호요랩 육성가이드 페이지를 연 뒤 다시 시도하세요.';
  } finally {
    setSyncing(false);
  }
});

clearBtn.addEventListener('click', async () => {
  await sendMessage({ type: 'CLEAR_SESSION' });
  await render();
});

void render();
