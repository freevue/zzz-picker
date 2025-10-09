import { BROWSER_CONTEXT, DATA_OUTPUT_PATH, WIKI_PAGES } from './constant'
import { getEntry, getAgents } from './lib'
import { concurrent, fromEntries, map, pipe, toArray, toAsync } from '@fxts/core'
import { writeFile } from 'fs/promises'
import { chromium } from 'playwright'

type Entry = {
  entry_page_id: string
}

try {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext(BROWSER_CONTEXT)
  const page = await context.newPage()

  page.on('response', async (response) => {
    if (!response.url().includes('get_entry_page_list')) return

    try {
      const entryList = await pipe(
        response.json() as Promise<{ data: { list: Entry[] } }>,
        ({ data: { list } }) => list,
        map((item) => item.entry_page_id),
        toAsync,
        map(getEntry),
        concurrent(5),
        map(({ name, header }) => [name, { header }] as const),
        fromEntries
      )

      pipe(
        getAgents(),
        map((agent) => ({
          ...agent,
          images: { ...agent.images, ...entryList[agent.fullName] },
        })),
        toArray,
        (list) => JSON.stringify(list, null, 2),
        (data) => writeFile(DATA_OUTPUT_PATH, data)
      )
    } catch (error) {
      console.log((error as Error).message)
    }
  })

  await page.goto(`${WIKI_PAGES.AGGREGATE}?lang=ko-kr`, { waitUntil: 'networkidle' })
  await browser.close()
} catch (error) {
  console.error(error)
}
