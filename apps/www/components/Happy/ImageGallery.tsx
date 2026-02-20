import ImageModal from './ImageModal'
import { map, pipe, sort, toArray, zipWithIndex, concat } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { supabase } from '@zzz-picker/provider'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

type AgentImage = {
  id: number
  url: string
  description: string
  agent_id: number
  agents: {
    name_ko: string
    name_en: string
  }
}

const BELLE = {
  id: 1,
  url: 'https://images.zzz.freevue.dev/images/playable/23abb0a2-570b-4785-a1da-cbbe34f6e2e6.jpg',
  description: '벨 한복 배너',
  agent_id: 1,
  agents: { name_ko: '벨', name_en: 'belle' }
}
const WISE = {
  id: 2,
  url: 'https://images.zzz.freevue.dev/images/playable/86f9a294-0937-45af-bf40-5594b073aba7.png',
  description: '와이즈 한복 배너',
  agent_id: 2,
  agents: { name_ko: '와이즈', name_en: 'wise' }
}
const PLAYER_LIST = [BELLE, WISE]

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<AgentImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<AgentImage | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('agent_images')
        .select(
          'id, url, description, agent_id, agents: new_agent_images_agent_id_fkey(name_ko, name_en)'
        )
        .eq('source_id', 8)
        .order('agent_id', { ascending: true })

      if (!error && data) {
        setImages(data as unknown as AgentImage[])
      }
      setLoading(false)
    }

    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <Typo.Body className="body-sm text-ink/50">이미지 로딩 중...</Typo.Body>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="grid gap-4 p-4 sm:p-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
      >
        {pipe(
          images,
          sort((prev, cur) => prev.agents.name_ko.localeCompare(cur.agents.name_ko)),
          concat(PLAYER_LIST),
          zipWithIndex,
          map(([index, image]) => (
            <motion.div
              key={image.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="">
                <div className="card aspect-portrait">
                  <img
                    src={image.url}
                    alt={image.agents.name_ko}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <Typo.Body className="body-md text-center font-bold mt-1 text-ink">
                  {image.agents.name_ko}
                </Typo.Body>
              </div>
            </motion.div>
          )),
          toArray
        )}
      </div>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
}

export default ImageGallery
