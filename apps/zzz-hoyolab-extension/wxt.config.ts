import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: '.output',
  manifest: {
    name: 'ZZZ Picker - 호요랩 연동',
    description: '젠레스 존 제로 호요랩 육성가이드 로그인 및 데이터 연동',
    permissions: ['storage', 'cookies'],
    host_permissions: [
      'https://www.hoyolab.com/*',
      'https://act.hoyolab.com/*',
      'https://api-takumi.mihoyo.com/*',
      'https://sg-public-api.hoyoverse.com/*',
    ],
  },
});
