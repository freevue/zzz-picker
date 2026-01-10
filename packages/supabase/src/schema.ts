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
    ban_log: {
      description: '밴 기록',
      columns: {
        id: '일련번호',
        match_id: '매치 ID',
        agent_id: '밴 된 에이전트 ID',
      },
    },
    play_log: {
      description: '플레이 로그 (매치와 라운드 연결)',
      columns: {
        id: '일련번호',
        match_id: '매치 ID',
        round_id: '라운드 ID',
      },
    },
    round_log: {
      description: '라운드 기록 (각 팀의 파티 정보)',
      columns: {
        id: '일련번호',
        round_type: '라운드 타입',
        a_party_id: 'A팀 파티 ID',
        b_party_id: 'B팀 파티 ID',
      },
    },
    party_log: {
      description: '파티 구성 및 성과',
      columns: {
        id: '일련번호',
        select_1: '선택 에이전트 1',
        select_2: '선택 에이전트 2',
        select_3: '선택 에이전트 3',
        boss_id: '상대 보스 ID',
        score: '점수',
        elapsed_time: '소요 시간',
      },
    },
    deadly_assault: {
      description: '엔강대 시즌 정보 (버전별 보스 정보)',
      columns: {
        id: '일련번호',
        version: '버전 (예: 1.0)',
        open_at: '시작 일시',
        boss_1: '보스 1 ID',
        boss_2: '보스 2 ID',
        boss_3: '보스 3 ID',
      },
    },
    attributes: {
      description: '속성 메타데이터 (불, 얼음 등)',
      columns: {
        id: 'ID',
        name_ko: '속성명 (한글)',
      },
    },
    specialty: {
      description: '특성 메타데이터 (강공, 격파 등)',
      columns: {
        id: 'ID',
        name_ko: '특성명 (한글)',
      },
    },
    faction: {
      description: '진영 메타데이터',
      columns: {
        id: 'ID',
        name_ko: '진영명 (한글)',
      },
    },
    boss_weakness_attribute: {
      description: '보스 약점 속성 매핑',
      columns: {
        boss_id: '보스 ID',
        attribute_id: '속성 ID',
      },
    },
    boss_resistance_attribute: {
      description: '보스 내성 속성 매핑',
      columns: {
        boss_id: '보스 ID',
        attribute_id: '속성 ID',
      },
    },
  },
  relationships: [
    {
      from: 'agents',
      to: 'engines',
      type: 'one-to-many',
      description: '에이전트는 전용 엔진을 가질 수 있음',
    },
    { from: 'match_log', to: 'play_log', type: 'one-to-many' },
    { from: 'match_log', to: 'ban_log', type: 'one-to-many' },
    {
      from: 'play_log',
      to: 'round_log',
      type: 'one-to-one',
      description: '플레이 로그는 하나의 라운드 정보를 가짐',
    },
    {
      from: 'round_log',
      to: 'party_log',
      type: 'many-to-one',
      description: '라운드는 A/B 두 개의 파티 정보를 참조',
    },
    {
      from: 'deadly_assault',
      to: 'boss',
      type: 'many-to-one',
      description: '시즌 정보는 3개의 보스 ID를 참조',
    },
  ],
}
