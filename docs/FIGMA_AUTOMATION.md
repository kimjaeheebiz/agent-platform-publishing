# Figma 자동화 개요


## 1. 범위

- 디자인 시스템(토큰) 변환
- 페이지 콘텐츠 생성


## 2. 흐름 요약

- 디자인 시스템: Figma Variables → Tokens Studio → `npm run build:theme`
- 페이지 생성: Figma(MainContent) → `npm run figma:page -- <PageName>` 또는 `npm run figma:pages`


## 3. 피그마 디자인 구조

- 계층: 파일(File) → 페이지(Page) → 프레임(Frame)
- 페이지(Page): 화면 단위, 각 페이지에 메인 콘텐츠 프레임 존재
- 프레임(Frame: MainContent): 콘텐츠 추출 기준, 이름을 정확히 `MainContent`로 유지
- 컴포넌트(Component): MUI 매핑 대상, Properties/Variants로 상태·크기 정의
- 변수/스타일(Variables/Styles): Tokens Studio로 동기화되어 디자인 토큰으로 활용
- 네이밍 규칙: 페이지명은 메뉴명과 일치, 추출/생성 시 케밥(kebab-case) 디렉토리 + PascalCase 파일명 적용


## 4. MainContent 프레임 자동 추출

- 자동 추출 대상: 페이지 내 `MainContent` 프레임
- 지원 네이밍(매핑): `MainContent`, `Main`, `MainArea`
- 레이아웃 템플릿/인스턴스 인식: `defaultLayoutTemplate`(템플릿), `DefaultLayout`(인스턴스)
- 컴포넌트 인스턴스 인식: `<Header>`, `<Sidebar>`, `<PageHeader>`, `<Drawer>`, `<Submenu>`, `<Typography>` 등

### 예시 구조(기본 레이아웃)

```
defaultLayoutTemplate (Root Frame)
└── DefaultLayout (Layout Instance)
    ├── <Header>
    └── MainArea
        ├── <Sidebar>
        │   └── <Drawer>
        └── Main
            ├── <PageHeader>
            └── MainContent  ← 추출 대상(Outlet)
                ├── <Submenu>
                ├── Content
                └── <Typography>
```

### 자동 탐지 로직(요약)
- 페이지 트리 재귀 순회 → 지원 네이밍 매핑과 일치하는 프레임 선택
- 선택된 `MainContent` 하위의 컴포넌트만 추출하여 페이지 콘텐츠로 변환


## 5. 명령

- 디자인 시스템: `npm run build:theme`
- 환경 설정: `npm run figma:setup`
- 로컬 상태 확인: `npm run figma:status`
- 원격 상태 확인 : `npm run figma:status -- --remote`
- 특정 페이지 생성: `npm run figma:page -- <PageName>`
- 전체 페이지 생성: `npm run figma:pages`


## 6. 컴포넌트 매핑(요약)

- 위치: `src/api/figma/component-mappings/*`
- 목적: Figma 컴포넌트/프로퍼티/스타일 → MUI 컴포넌트/props/sx 스타일 매핑
- 아이콘: 공통 추출/매핑 유틸 사용, 실제 아이콘명 기준으로 `@mui/icons-material` 임포트 최소화
- 예시 범주: `Typography.ts`, `Button.ts`, `Card.ts`, `Stack.ts` 등
- 유의 사항
  - MUI Figma 디자인 키트 일부 컴포넌트 미포함, 커스터마이징 요소 다수
  - MUI 컴포넌트의 Figma 디자인과 React 소스 구조가 상이하여 모든 컴포넌트 매핑 파일 선개발 필요
  - MUI 버전 업그레이드 시 컴포넌트 매핑 구조 변경 필요


## 7. 변수 매핑 (Variables → MUI 토큰)

- **목적**: 페이지 변수명 조회 불가(Variables API 404) → 변수 ID 매핑으로 테마 경로(예: `primary.main`) 복원 → props/sx에 Figma에 적용된 토큰 그대로 반영 (헥스/유추 없음)
- **매핑 소스 (단일)**: `design-system/tokens/generated/$themes.json` 의 `$figmaVariableReferences` 만 참조. 별도 플랫폼용 매핑 파일은 사용하지 않음.
- **전제**: 플랫폼 디자인 파일에서 사용하는 변수는 **라이브러리와 동일한 변수 컬렉션**을 써야 함. 그래야 노드의 `boundVariables.color.id` 가 `$themes.json` 에 있는 ID와 일치하여 매칭됨.
- **동작**: 입력(Variable ID) → 캐시 조회($themes.json 기반) → 출력(MUI 테마 경로). **매핑 실패 시** 테마 경로 대신 **HEX fallback**으로 sx에 반영(배경/텍스트 색 누락 방지).
- **효과**: 변수 교체만으로 UI 일괄 반영

### 7.1 변수 ID가 TSX까지 가는 흐름

| 단계 | 소스/코드 | 설명 |
|------|-----------|------|
| **소스** | `$themes.json` | 각 테마 객체의 `$figmaVariableReferences`: `"토큰경로": "변수ID해시"` (예: `"primary.main": "93911b632d429ced90d52a481bf2b11fd50e54cb"`) |
| **로드** | `variable-mapping/library-loader.ts` | `loadLibraryVariableMappings()` 가 위 파일을 읽어 `Map<variableId, VariableMappingInfo>` 생성. `VariableMappingManager` 생성 시 호출하고, `normalizeVariableId(id)` 로 정규화 후 캐시에 저장 (예: API 형식 `VariableID:hash/nodeId` → `hash` 만 사용). |
| **추출** | `extractor.ts` | 노드의 `fills[0].boundVariables?.color?.id` 를 읽고, `extractThemeTokenFromVariableId(variableId)` → 내부적으로 `variableMappingManager.getMapping(variableId)` 호출. 매칭되면 `properties.colorStyle = muiThemePath`. **매칭 실패 또는 boundVariables 없음** 시 `properties.backgroundColor = colorInfo.color` (HEX) 로 fallback. |
| **생성** | `generator.ts` | `generateSXProps` 에서 `properties.colorStyle` 이 있으면 테마 경로로 `backgroundColor` 또는 `color` 출력. 없고 `properties.backgroundColor`(HEX)가 있으면 그 값으로 출력. |

### 7.2 일부 실패 vs 전체 실패

- 실패는 **노드 단위**입니다. 각 노드마다 `boundVariables.color.id` 가 있고, 그 ID(해시)가 `$themes.json` 에 있으면 매칭, 없으면 해당 노드만 실패(HEX fallback 적용).
- **일부만 실패**: 일부 Box/텍스트만 테마 대신 HEX로 나오면, 그 노드들이 쓰는 변수가 라이브러리와 다른 컬렉션/다른 파일에서 온 경우일 수 있음.
- **대부분/전체 실패**: 플랫폼 파일이 라이브러리와 **다른 변수 컬렉션**을 쓰면 ID가 달라서 매칭이 거의 안 됨. `$themes.json` 이 **다른 Figma 파일**에서 export된 것이라면 전체적으로 불일치할 수 있음.
- **확인 방법**: 추출 시 콘솔 로그 `✅ 변수 ID 매핑` vs `⚠️ 변수 ID 매핑 없음 ... → HEX fallback` 비율로 일부/전체 구분. Figma에서 플랫폼 디자인의 변수 레퍼런스를 **라이브러리와 동일한 컬렉션**으로 맞추면 해결됩니다.

### 7.3 테마 컬러가 HEX로 나오는 경우 (전면 점검)

다른 프로젝트(예: 시범 구축)에서는 테마 컬러가 잘 나오는데, 현재 프로젝트에서만 HEX로 나온다면 **변수 ID 불일치** 때문입니다.

| 원인 | 설명 | 확인/조치 |
|------|------|-----------|
| **1. $themes.json 소스와 플랫폼 파일 불일치** | `$themes.json` 은 특정 Figma 파일의 변수 ID로 채워짐. 페이지는 **플랫폼 파일** 노드를 가져옴. 플랫폼 파일이 **그와 동일한 변수 컬렉션**을 쓰지 않으면 ID가 달라 매칭 실패. | 플랫폼 Figma 파일에서 색/스페이싱에 쓰는 변수가 **라이브러리(또는 $themes.json 을 export한 파일)와 같은 변수 컬렉션**인지 확인. 라이브러리 퍼블리시 후 플랫폼에서 해당 라이브러리 변수 사용. |
| **2. $themes.json 없음/경로 오류** | `design-system/tokens/generated/$themes.json` 이 없거나 실행 경로(cwd)가 달라서 로드 실패. | `npm run figma:page` 를 **프로젝트 루트**에서 실행. `npm run build:theme` 등으로 디자인 시스템 빌드 후 재시도. 콘솔에 `✅ 변수 매핑 로드: ... (N개)` 가 나오는지 확인. |
| **3. Variable ID 형식 차이** | Figma API가 반환하는 `boundVariables.color.id` 형식이 예상과 다를 수 있음 (예: `VariableID:hash/nodeId`, `hash` 만 등). | 코드에서 `normalizeVariableId` 로 `hash` 만 사용해 매칭. 로그에 `normalizedHash="..."` 가 찍히면, `$themes.json` 에서 해당 문자열 검색해 존재 여부 확인. |
| **4. 시범 구축 vs 현재 프로젝트 차이** | 시범 구축에서는 플랫폼 파일이 라이브러리 변수를 그대로 사용해 ID가 일치. 현재 프로젝트는 플랫폼 파일이 다른 파일/복사본 변수를 사용. | 현재 프로젝트 Figma **플랫폼 파일**에서 색 변수를 **라이브러리 파일**에서 가져온 변수로 통일. ($themes.json 은 라이브러리 또는 동일 변수 컬렉션에서 export.) |

**실행 시 진단**: 페이지 생성 시 콘솔에 다음을 확인하세요.

- `✅ 변수 매핑 로드: <절대경로> ($themes.json)` 및 `총 N개 (palette M개)` → 로드는 됨.
- `⚠️ 변수 ID 매핑 없음 ... normalizedHash="xxxx"` → 이 `xxxx` 를 `$themes.json` 에서 검색. 없으면 플랫폼 파일 변수 컬렉션이 다름.
- `⚠️ $themes.json 없음: <경로>` → 파일 없음 또는 cwd 오류. 프로젝트 루트에서 실행하고 design-system 빌드 여부 확인.


## 8. Figma 노드 ID 형식(변환 규칙 포함)

- URL 형식(피그마 웹/플러그인 복사): 하이픈(-) 사용
  - 페이지 노드: 0-1, 0-2
  - 프레임 노드: 166-6455, 598-3722
  - 컴포넌트 노드: 13761-1677
- API 형식(코드에서 사용): 콜론(:) 사용
  - 페이지 노드: 0:1, 0:2
  - 프레임 노드: 166:6455, 598:3722
  - 컴포넌트 노드: 13761:1677
- 변환 예시
  - URL: `?node-id=469-3583` → API: `469:3583`

### 설정 파일 반영 예시(`src/api/figma/config.ts`)

```
pageNodes: {
  // Layout Templates (원본)
  layoutTemplates: {
    default: '469:7679',
    auth: '0:3',
    error: '0:4',
  },

  // Layout Instances (페이지 실제 사용)
  layoutInstances: {
    default: '469:3583',
    auth: '0:5',
    error: '0:6',
  },

  // Pages (Frame)
  pages: {
    project: '166:6455',
    users: '598:3722',
    components: '286:6314',
  },

  // Library Components
  libraryComponents: '13761:1677'
}
```


## 9. 상세 문서

- [디자인 시스템](./DESIGN_SYSTEM.md)
- [페이지 생성](./PAGES.md)
- [명령어](./COMMANDS.md)
