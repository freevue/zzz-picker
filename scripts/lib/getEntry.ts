import { pipe } from '@fxts/core'
import { APIS } from '~/constant'

function getEntry(entryId: string | number) {
  return pipe(
    `${APIS.ENTRY}?entry_page_id=${entryId}`,
    (url) => fetch(url, { headers: { 'x-rpc-language': 'ko-kr', 'x-rpc-wiki_app': 'zzz' } }),
    (response) => response.json(),
    ({ data: { page } }) => ({
      name: page.name,
      modules: page.modules,
      header: page.header_img_url,
    })
  )
}

export default getEntry
