import type { HoyolabAuthState, HoyolabSyncPayload } from '../types/hoyolab';

export type ExtensionMessage =
  | { type: 'GET_AUTH_STATE' }
  | { type: 'GET_SYNC_PAYLOAD' }
  | { type: 'CLEAR_SESSION' }
  | { type: 'AUTH_UPDATED'; payload: HoyolabAuthState }
  | { type: 'SYNC_UPDATED'; payload: HoyolabSyncPayload };

export type ExtensionResponse =
  | { ok: true; auth?: HoyolabAuthState; sync?: HoyolabSyncPayload | null }
  | { ok: false; error: string };

export function sendMessage<T extends ExtensionMessage>(
  message: T,
): Promise<ExtensionResponse> {
  return chrome.runtime.sendMessage(message);
}
