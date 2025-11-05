import { pipe, zipWithIndex, map, toArray } from '@fxts/core'
import { Link } from '@remix-run/react'
import { Typo } from '@zzz-picker/components/v2'
import { motion } from 'motion/react'
import { Rule, DevLog } from '~/components'
import { LINKS } from '~/constant'

const Main: React.FC = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center gap-10">
      <img src="/images/main/logo.png" alt="logo" className="w-32 block hover:animate-turbo" />
      <div className="flex items-center justify-center gap-10">
        {pipe(
          LINKS,
          zipWithIndex,
          map(([index, link]) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <Link to={link.href} className="text-center block group">
                <div className="flex size-48 items-center justify-center bg-content rounded-bl-4xl rounded-tr-4xl overflow-hidden p-2">
                  <img
                    src={link.url}
                    alt={link.title}
                    className="block w-full group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <Typo.Heading className="heading-xl text-primary mt-2">{link.title}</Typo.Heading>
              </Link>
            </motion.div>
          )),
          toArray
        )}
      </div>
      <div className="flex gap-6">
        <Rule />
        <DevLog />
      </div>
    </div>
  )
}

export default Main
