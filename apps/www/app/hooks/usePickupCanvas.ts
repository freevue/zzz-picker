import { getThemeColor } from '../utils/theme'

type Agent = {
  id: number
  nameKo: string
  profile: {
    url: string
  }
  rarity: string
  isPickup: boolean
  isTeaser: boolean
  engine?: Array<{
    iconUrl?: string
    imageUrl: string
    nameKo: string
  }>
}

type UsePickupCanvasProps = {
  activeAgents: Agent[]
  clickStates: Record<number, number>
  onStartCapture: () => void
  onEndCapture: () => void
  onSuccess: (dataUrl: string) => void
}

export function usePickupCanvas(props: UsePickupCanvasProps) {
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`))
    })
  }

  const generateImage = async () => {
    if (props.activeAgents.length === 0) {
      alert('활성화된 에이전트가 없습니다. 에이전트를 클릭하여 활성화해 주세요.')
      return
    }

    props.onStartCapture()

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas 2D context를 생성할 수 없습니다.')
      }

      const scale = 2
      const cardWidth = 560
      const padding = 24
      const cols = 4
      const avatarSize = 80
      const weaponSize = 28
      const gapX = 24
      const gapY = 24
      const nameOffset = 14
      const rowHeight = avatarSize + nameOffset + 16

      const rows = Math.ceil(props.activeAgents.length / cols)
      const cardHeight = padding * 2 + rows * rowHeight + (rows - 1) * gapY

      canvas.width = cardWidth * scale
      canvas.height = cardHeight * scale

      ctx.scale(scale, scale)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 배경 채우기
      ctx.fillStyle = getThemeColor('--color-base')
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      for (let index = 0; index < props.activeAgents.length; index++) {
        const agent = props.activeAgents[index]
        const state = props.clickStates[agent.id] || 0
        const hasWeapon = state === 2
        const exclusiveEngine = agent.engine && agent.engine.length > 0 ? agent.engine[0] : null

        const row = Math.floor(index / cols)
        const col = index % cols

        const totalGridWidth = cols * avatarSize + (cols - 1) * gapX
        const startX = (cardWidth - totalGridWidth) / 2
        const posX = startX + col * (avatarSize + gapX)
        const posY = padding + row * (rowHeight + gapY)

        try {
          const agentImg = await loadImage(agent.profile.url)

          ctx.save()
          ctx.beginPath()
          ctx.arc(posX + avatarSize / 2, posY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
          ctx.clip()
          ctx.drawImage(agentImg, posX, posY, avatarSize, avatarSize)
          ctx.restore()

          // 테두리 하이라이트선 그리기
          ctx.strokeStyle = state === 1 ? getThemeColor('--color-primary') : getThemeColor('--color-secondary')
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(posX + avatarSize / 2, posY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
          ctx.stroke()

          // 티저 캐릭터의 경우 상단 '예정' 뱃지 그리기
          if (agent.isTeaser) {
            ctx.fillStyle = getThemeColor('--color-tertiary')
            ctx.beginPath()
            const rx = posX + avatarSize / 2 - 16
            const ry = posY - 6
            const rw = 32
            const rh = 14
            const radius = 3
            ctx.moveTo(rx + radius, ry)
            ctx.lineTo(rx + rw - radius, ry)
            ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
            ctx.lineTo(rx + rw, ry + rh - radius)
            ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
            ctx.lineTo(rx + radius, ry + rh)
            ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
            ctx.lineTo(rx, ry + radius)
            ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
            ctx.closePath()
            ctx.fill()

            // 뱃지 내 텍스트
            ctx.fillStyle = getThemeColor('--color-ink')
            ctx.font = '900 9px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('예정', posX + avatarSize / 2, posY + 1)
          }

          // 전용 무기 장착 오버랩 그리기
          if (hasWeapon && exclusiveEngine) {
            const wx = posX + avatarSize - weaponSize + 2
            const wy = posY + avatarSize - weaponSize + 2

            const engineImg = await loadImage(exclusiveEngine.iconUrl || exclusiveEngine.imageUrl)

            ctx.save()
            ctx.beginPath()
            ctx.arc(wx + weaponSize / 2, wy + weaponSize / 2, weaponSize / 2, 0, Math.PI * 2)
            ctx.clip()
            ctx.fillStyle = getThemeColor('--color-content')
            ctx.fillRect(wx, wy, weaponSize, weaponSize)
            ctx.drawImage(engineImg, wx, wy, weaponSize, weaponSize)
            ctx.restore()

            // 무기 테두리 하이라이트
            ctx.strokeStyle = getThemeColor('--color-secondary')
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.arc(wx + weaponSize / 2, wy + weaponSize / 2, weaponSize / 2, 0, Math.PI * 2)
            ctx.stroke()
          }

          // 에이전트 이름 텍스트 그리기
          ctx.fillStyle = getThemeColor('--color-ink')
          ctx.font = '900 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillText(agent.nameKo, posX + avatarSize / 2, posY + avatarSize + nameOffset)

        } catch (imageErr) {
          console.error(`${agent.nameKo} 이미지 렌더링 실패:`, imageErr)
          ctx.fillStyle = getThemeColor('--color-netural')
          ctx.beginPath()
          ctx.arc(posX + avatarSize / 2, posY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = getThemeColor('--color-ink')
          ctx.font = '900 12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(agent.nameKo, posX + avatarSize / 2, posY + avatarSize / 2)
        }
      }

      const dataUrl = canvas.toDataURL('image/png')
      props.onSuccess(dataUrl)

    } catch (err) {
      console.error('캔버스 이미지 빌드 중 오류:', err)
      alert('이미지 파일 변환에 실패했습니다. 브라우저 보안 설정을 확인해 주시기 바랍니다.')
    } finally {
      props.onEndCapture()
    }
  }

  const downloadImage = (previewImageUrl: string | null) => {
    if (!previewImageUrl) {
      return
    }
    const link = document.createElement('a')
    link.download = `zzz-pickup-plan-${new Date().toISOString().slice(0, 10)}.png`
    link.href = previewImageUrl
    link.click()
  }

  return { generateImage, downloadImage }
}
