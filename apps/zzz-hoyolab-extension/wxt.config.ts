import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: '.output',
  manifest: {
    name: 'ZZZ 호요랩 동기화',
    description: '젠레스 존 제로 호요랩 육성가이드 데이터를 DB에 동기화',
    permissions: ['storage', 'cookies'],
    host_permissions: [
      'https://www.hoyolab.com/*',
      'https://act.hoyolab.com/*',
      'https://api-takumi.mihoyo.com/*',
      'https://sg-public-api.hoyoverse.com/*',
      'https://*.supabase.co/*',
    ],
  },
});
