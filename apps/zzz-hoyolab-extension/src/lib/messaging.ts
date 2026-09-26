import type { HoyolabSyncPayload } from '../types/hoyolab';

export type ExtensionMessage =
  | { type: 'GET_SYNC_PAYLOAD' }
  | { type: 'CLEAR_SESSION' }
  | { type: 'SYNC_UPDATED'; payload: HoyolabSyncPayload };

export type ExtensionResponse =
  | { ok: true; sync?: HoyolabSyncPayload | null }
  | { ok: false; error: string };

export type ContentMessage =
  | { type: 'REQUEST_PAGE_SYNC' };

export type ContentResponse =
  | { ok: true; payload: HoyolabSyncPayload }
  | { ok: false; error: string };

export function sendMessage<T extends ExtensionMessage>(
  message: T,
): Promise<ExtensionResponse> {
  return chrome.runtime.sendMessage(message);
}
