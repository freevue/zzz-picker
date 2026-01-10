/**
 * 엔강대(Deadly Assault) 관련 DB 스키마 정의
 * AI 에이전트가 테이블 구조를 이해하고 정확한 쿼리를 생성하기 위한 메타데이터
 */
export const DB_SCHEMA = {
  tables: {
    // ========================================================================
    // 기본 엔티티 테이블
    // ========================================================================
    agents: {
      description: '에이전트(캐릭터) 정보',
      columns: {
        id: '일련번호 (PK)',
        created_at: '생성 일시',
        name_ko: '이름 (한글)',
        name_en: '이름 (영문)',
        full_name_ko: '전체 이름 (한글)',
        full_name_en: '전체 이름 (영문)',
        rarity: '등급 (S, A, B)',
        is_pickup: '픽업 여부',
        is_teaser: '티저 여부 (미출시)',
        is_allow: '엔강대 사용 가능 여부',
        color: '브랜드 컬러',
        hoyolab_id: 'Hoyolab ID',
        hoyowiki_id: 'Hoyowiki ID',
        chzzk_id: 'Chzzk ID',
        profile_image_id: '프로필 이미지 ID',
        banner_image_id: '배너 이미지 ID',
      },
    },
    boss: {
      description: '보스 몬스터 정보',
      columns: {
        id: '일련번호 (PK)',
        created_at: '생성 일시',
        name_ko: '이름 (한글)',
        name_en: '이름 (영문)',
        hp: '체력 정보 (배열)',
      },
    },
    engines: {
      description: 'W-엔진(장비) 정보',
      columns: {
        id: '일련번호 (PK)',
        created_at: '생성 일시',
        name_ko: '이름 (한글)',
        name_en: '이름 (영문)',
        rank: '등급 (S, A, B)',
        exclusive_agent_id: '전용 에이전트 ID (agents FK)',
        is_pickup: '픽업 여부',
        is_teaser: '티저 여부',
        image_url: '이미지 URL',
        icon_url: '아이콘 URL',
      },
    },

    // ========================================================================
    // 시즌 정보
    // ========================================================================
    deadly_assault: {
      description: '엔강대 시즌 정보 (버전별 보스 구성)',
      columns: {
        id: '일련번호 (PK)',
        version: '버전 (예: 1.0, 1.1)',
        open_at: '시즌 시작 일시',
        boss_1: '1번 보스 ID (boss FK)',
        boss_2: '2번 보스 ID (boss FK)',
        boss_3: '3번 보스 ID (boss FK)',
      },
    },

    // ========================================================================
    // 매치 및 경기 로그 테이블
    // ========================================================================
    match_log: {
      description: '엔강대 매치 기록 (대전 정보)',
      columns: {
        id: '일련번호 (PK)',
        a_name: 'A 플레이어 닉네임',
        b_name: 'B 플레이어 닉네임',
        mach_at: '매치 일시',
        match_type: '매치 타입 (USER-DEFINED enum)',
        auth_key: '인증 키 (UUID)',
      },
    },
    ban_log: {
      description: '밴 기록 (매치에서 금지된 에이전트)',
      columns: {
        id: '일련번호 (PK)',
        match_id: '매치 ID (match_log FK)',
        agent_id: '밴 된 에이전트 ID (agents FK)',
      },
    },
    play_log: {
      description: '플레이 로그 (매치와 라운드 연결)',
      columns: {
        id: '일련번호 (PK)',
        match_id: '매치 ID (match_log FK)',
        round_id: '라운드 ID (round_log FK)',
      },
    },
    round_log: {
      description: '라운드 기록 (각 라운드별 양팀 파티 정보)',
      columns: {
        id: '일련번호 (PK)',
        round_type: '라운드 타입 (USER-DEFINED enum)',
        a_party_id: 'A팀 파티 ID (party_log FK)',
        b_party_id: 'B팀 파티 ID (party_log FK)',
      },
    },
    party_log: {
      description: '파티 구성 및 성과 (3인 파티 정보)',
      columns: {
        id: '일련번호 (PK)',
        select_1: '1번 슬롯 에이전트 선택 ID (agent_select_log FK)',
        select_2: '2번 슬롯 에이전트 선택 ID (agent_select_log FK)',
        select_3: '3번 슬롯 에이전트 선택 ID (agent_select_log FK)',
        boss_id: '상대 보스 ID (boss FK)',
        score: '획득 점수',
        elapsed_time: '소요 시간 (초)',
      },
    },
    agent_select_log: {
      description: '에이전트 선택 상세 정보 (캐릭터+엔진 조합)',
      columns: {
        id: '일련번호 (PK)',
        agent_id: '선택된 에이전트 ID (agents FK)',
        agent_rate: '에이전트 돌파 단계',
        engine_id: '장착된 W-엔진 ID (engines FK)',
        engine_rate: '엔진 돌파 단계',
      },
    },

    // ========================================================================
    // 메타데이터 테이블
    // ========================================================================
    attributes: {
      description: '속성 메타데이터 (불, 얼음, 전기 등)',
      columns: {
        id: 'ID (PK)',
        name_ko: '속성명 (한글)',
      },
    },
    specialty: {
      description: '특성 메타데이터 (강공, 격파, 지원 등)',
      columns: {
        id: 'ID (PK)',
        name_ko: '특성명 (한글)',
      },
    },
    faction: {
      description: '진영 메타데이터',
      columns: {
        id: 'ID (PK)',
        name_ko: '진영명 (한글)',
      },
    },
    boss_weakness_attribute: {
      description: '보스 약점 속성 매핑',
      columns: {
        boss_id: '보스 ID (boss FK)',
        attribute_id: '약점 속성 ID (attributes FK)',
      },
    },
    boss_resistance_attribute: {
      description: '보스 내성 속성 매핑',
      columns: {
        boss_id: '보스 ID (boss FK)',
        attribute_id: '내성 속성 ID (attributes FK)',
      },
    },
  },

  // ==========================================================================
  // 테이블 간 관계 정의
  // ==========================================================================
  relationships: [
    // 시즌 → 보스
    {
      from: 'deadly_assault',
      to: 'boss',
      type: 'many-to-one',
      description: '시즌은 3개의 보스(boss_1, boss_2, boss_3)를 참조',
    },
    // 매치 → 밴/플레이
    {
      from: 'match_log',
      to: 'ban_log',
      type: 'one-to-many',
      description: '매치당 여러 밴 기록 존재',
    },
    {
      from: 'match_log',
      to: 'play_log',
      type: 'one-to-many',
      description: '매치당 여러 플레이(라운드) 기록 존재',
    },
    // 밴 → 에이전트
    {
      from: 'ban_log',
      to: 'agents',
      type: 'many-to-one',
      description: '밴 기록은 에이전트를 참조',
    },
    // 플레이 → 라운드
    {
      from: 'play_log',
      to: 'round_log',
      type: 'one-to-one',
      description: '플레이 로그는 하나의 라운드를 참조',
    },
    // 라운드 → 파티
    {
      from: 'round_log',
      to: 'party_log',
      type: 'many-to-one',
      description: '라운드는 A/B 두 파티(a_party_id, b_party_id)를 참조',
    },
    // 파티 → 보스
    {
      from: 'party_log',
      to: 'boss',
      type: 'many-to-one',
      description: '파티는 상대 보스를 참조',
    },
    // 파티 → 에이전트 선택
    {
      from: 'party_log',
      to: 'agent_select_log',
      type: 'many-to-one',
      description: '파티의 select_1/2/3은 agent_select_log를 참조',
    },
    // 에이전트 선택 → 에이전트
    {
      from: 'agent_select_log',
      to: 'agents',
      type: 'many-to-one',
      description: '선택 로그는 에이전트를 참조',
    },
    // 에이전트 선택 → 엔진
    {
      from: 'agent_select_log',
      to: 'engines',
      type: 'many-to-one',
      description: '선택 로그는 W-엔진을 참조',
    },
    // 엔진 → 에이전트 (전용)
    {
      from: 'engines',
      to: 'agents',
      type: 'many-to-one',
      description: '엔진은 전용 에이전트(exclusive_agent_id)를 가질 수 있음',
    },
    // 보스 약점/내성
    {
      from: 'boss_weakness_attribute',
      to: 'boss',
      type: 'many-to-one',
      description: '보스 약점 매핑',
    },
    {
      from: 'boss_weakness_attribute',
      to: 'attributes',
      type: 'many-to-one',
      description: '약점 속성 매핑',
    },
    {
      from: 'boss_resistance_attribute',
      to: 'boss',
      type: 'many-to-one',
      description: '보스 내성 매핑',
    },
    {
      from: 'boss_resistance_attribute',
      to: 'attributes',
      type: 'many-to-one',
      description: '내성 속성 매핑',
    },
  ],
}
