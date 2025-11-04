import { pipe, map, toArray, zipWithIndex, filter } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'

const LINK_LIST = [
  {
    name: '호요랩',
    url: 'https://www.hoyolab.com/home',
    disabled: false,
  },
  {
    name: '시청자 참여',
    url: 'https://playsquad.gg/p/nzoetv/home',
    disabled: false,
  },
  {
    name: '쉘터',
    url: 'https://shelter.id/MChIkVLcTWWBohXm0',
    disabled: false,
  },
  {
    name: '버그 제보',
    url: 'https://github.com/freevue/zzz-picker/issues',
    disabled: true,
  },
]

const Information: React.FC = () => {
  return (
    <div className="w-xl">
      <Typo.Heading className="heading-4xl text-primary" heading={2}>
        Information
      </Typo.Heading>
      <ul className="flex flex-col gap-4 mt-8">
        {pipe(
          LINK_LIST,
          filter((link) => !link.disabled),
          zipWithIndex,
          map(([index, link]) => (
            <li key={index} className="flex gap-4 w-full text-lg">
              <Typo.Heading className="heading-lg w-1/5 text-right" heading={3}>
                {link.name}
              </Typo.Heading>
              <a className="body-lg text-ink hover:underline" href={link.url} target="_blank">
                {link.url}
              </a>
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default Information
