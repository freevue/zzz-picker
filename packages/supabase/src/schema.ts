export const DB_SCHEMA = {
  tables: {
    agents: {
      description: '에이전트(캐릭터) 정보',
      columns: {
        id: '일련번호',
        name_ko: '이름 (한글)',
        full_name_ko: '전체 이름 (한글)',
        rarity: '등급 (S, A, B)',
        is_teaser: '티저 여부',
        is_pickup: '픽업 여부',
        is_allow: '사용 가능 여부',
        color: '브랜드 컬러',
        fk_banner_image: '배너 이미지 ID (fk)',
        fk_profile_image: '프로필 이미지 ID (fk)',
      },
    },
    boss: {
      description: '보스 몬스터 정보',
      columns: {
        id: '일련번호',
        name_ko: '이름 (한글)',
        hp: '체력 정보 (배열)',
      },
    },
    engines: {
      description: 'W-엔진(장비) 정보',
      columns: {
        id: '일련번호',
        name_ko: '이름 (한글)',
        is_pickup: '픽업 여부',
        exclusive_agent_id: '전용 에이전트 ID',
        rank: '등급',
        image_url: '이미지 URL',
        icon_url: '아이콘 URL',
      },
    },
    match_log: {
      description: '경기 매치 기록',
      columns: {
        id: '일련번호',
        a_name: 'A 플레이어 닉네임',
        b_name: 'B 플레이어 닉네임',
        mach_at: '매치 일시',
        match_type: '매치 타입',
        auth_key: '인증 키',
      },
    },
    // 추가 테이블 정의 가능...
  },
  relationships: [
    {
      from: 'agents',
      to: 'engines',
      type: 'one-to-many',
      description: '에이전트는 전용 엔진을 가질 수 있음',
    },
    { from: 'match_log', to: 'play_log', type: 'one-to-many' },
  ],
}
