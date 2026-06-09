/**
 * CSS 변수명을 인자로 받아 해당하는 computed 테마 색상을 반환합니다.
 * 브라우저 환경(window가 존재하는 경우)에서만 동작하며, 서버 사이드 렌더링 시에는 기본값을 반환합니다.
 */
export function getThemeColor(variableName: string): string {
  if (typeof window === 'undefined') {
    return '#000000'
  }
  return window.getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim()
}
