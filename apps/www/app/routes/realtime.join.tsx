import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { supabase } from '@zzz-picker/provider'

/**
 * userId(token)로 접속하면 해당 유저의 room 정보를 조회하여 리다이렉트
 * URL: /realtime/join?u={userId}
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const userId = url.searchParams.get('u')

  if (!userId) {
    throw new Response('유저 ID가 필요합니다.', { status: 400 })
  }

  // userId로 유저 정보 조회 (room_id 포함)
  const { data: user, error } = await supabase
    .from('realtime_user')
    .select('id, room_id')
    .eq('id', userId)
    .single()

  if (error || !user) {
    throw new Response('유효하지 않은 유저 ID입니다.', { status: 404 })
  }

  // 해당 유저의 room으로 리다이렉트 (userToken을 쿼리 파라미터로 전달)
  return redirect(`/realtime/${user.room_id}?a=${user.id}`)
}

export const JoinRoom = () => {
  // loader에서 항상 redirect하므로 이 컴포넌트는 렌더링되지 않음
  return null
}

export default JoinRoom
