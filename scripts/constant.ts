export const STATIC_WIKI_BASE_URL = process.env.STATIC_WIKI_BASE_URL!
export const WIKI_PAGE_BASE_URL = process.env.WIKI_PAGE_BASE_URL!
export const DATA_OUTPUT_PATH = './public/agents.json'

export const BROWSER_CONTEXT = {
  userAgent: process.env.USER_AGENT!,
  locale: 'ko-KR',
}

export const APIS = {
  ENTRY: `${STATIC_WIKI_BASE_URL}/${process.env.APIS_ENTRY!}`,
}

export const WIKI_PAGES = {
  AGGREGATE: `${WIKI_PAGE_BASE_URL}/${process.env.WIKI_AGGREGATE!}`,
}
