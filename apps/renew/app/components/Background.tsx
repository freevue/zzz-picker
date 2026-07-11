import { join, map, pipe, range, toArray } from '@fxts/core'
import React, { useState } from 'react'

const Background: React.FC = () => {
  const [isRendering, setIsRendering] = useState(false)

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden flex flex-col gap-15">
      {pipe(
        15,
        range,
        map((index) => (
          <div
            key={index}
            className={pipe(
              [
                'min-w-fit',
                'flex',
                index % 2 === 0 ? 'animate-rollingBg-reverse' : 'animate-rollingBg',
                'gap-10',
                '-rotate-40',
                'first:-mt-400',
              ],
              join(' ')
            )}
          >
            {pipe(
              10,
              range,
              map((index) => (
                <React.Fragment key={index}>
                  <p className="ft-ria text-9xl text-primary/5 min-w-fit">엔코르</p>
                  <p className="ft-ria text-9xl text-primary/5 min-w-fit">엔강대</p>
                </React.Fragment>
              )),
              toArray
            )}
          </div>
        )),
        toArray
      )}
    </div>
  )
}

export default Background
