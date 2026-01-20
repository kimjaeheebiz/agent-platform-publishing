# 페이지 생성


## 1. 개념

- 메인 컨텐츠 자동 생성: Figma 페이지 → React 컴포넌트 변환
- 레이아웃 통합: 기본 레이아웃/네비게이션과 자동 결합
- 파일 구조: `pages.ts`의 `id` 기반 경로 생성 (예: `project.agent` → `project/agent/Agent.tsx`)


## 2. 신규 페이지 생성 절차

1. `src/config/pages.ts`에 페이지 설정 추가 (예: `'project.agent': { id: 'project.agent', ... }`)
2. `src/api/figma/config.ts`에 Figma 노드 ID 매핑 추가 (예: `'project.agent': '80:10329'`)
3. 생성: `npm run figma:page -- project.agent` 실행
4. 생성된 파일: `src/pages/project/agent/Agent.tsx` (자동 생성)
5. 메뉴 연동: `src/config/mainmenu.ts`에서 `pageId: 'project.agent'` 참조


## 3. 명령

- 특정 페이지: `npm run figma:page -- <pageId>` (예: `npm run figma:page -- project.agent`)
- 전체 페이지: `npm run figma:pages`


## 4. 경로 생성 규칙

페이지 ID (`pages.ts`의 `id`)를 기반으로 경로가 자동 생성됩니다:

- `project.agent` → `src/pages/project/agent/Agent.tsx`
- `admin.users` → `src/pages/admin/users/Users.tsx`
- `account` → `src/pages/account/Account.tsx`

이 규칙은 `route-generator.ts`와 동일하여 자동 라우팅이 정상 동작합니다.


## 5. 연동

- 경로/브레드크럼: `src/config/pages.ts`, `src/config/mainmenu.ts`와 연동
- 디자인 시스템: 토큰 기반 테마가 생성물에 일괄 적용
- 라우팅: `route-generator.ts`가 자동으로 컴포넌트를 찾아 라우트 생성


## 6. 유의 사항

- `pages.ts`의 `id`와 `config.ts`의 `pages` 키는 정확히 일치해야 함
- 생성된 파일 경로는 `route-generator.ts`의 경로 규칙과 일치해야 함
- 사용되지 않는 아이콘/컴포넌트 불필요 임포트 방지
- 하드 코딩된 계산식 제거, 토큰/설정 값 직접 반영
