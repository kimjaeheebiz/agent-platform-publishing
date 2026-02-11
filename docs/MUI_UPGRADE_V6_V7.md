# MUI 단계적 업그레이드 (v5 → v6 → v7.3.7)

- **현재:** v7.3.7 적용 완료. Grid v7 API(`size`, `spacing`) 적용 완료. 빌드·테스트 통과.
- **참고:** [공식 v7 가이드](https://mui.com/material-ui/migration/upgrade-to-v7/)

---

## v5 → v6 완료 사항 (이력)

- `@mui/material`, `@mui/icons-material`: `^6.0.0`
- `react-is`: `^18.3.1` 추가 (React 18 호환)
- **react-is overrides:** `package.json`에 `"overrides": { "react-is": "18.3.1" }` 적용

---

## v6 → v7 완료 사항

- **패키지:** `@mui/material`, `@mui/icons-material` → `^7.3.7`
- **Grid:** v7 API로 전환 완료
  - 기존 `item`/`xs`/`sm`/`md`/`lg`/`xl` 제거, `size`, `spacing`, `rowSpacing`, `columnSpacing` 사용
  - Figma 매핑: `src/api/figma/component-mappings/Grid.ts` — v7 형태로 출력
  - 페이지 소스: `<Grid container spacing={2}>`, `<Grid size={6}>` 등 사용
- **@mui/lab:** 미사용. 의존성 없음. 이전 작업 불필요.
- **Breaking change 점검:**  
  - import는 모두 `@mui/material` 최상위 사용(deep import 없음)  
  - React 18 + react-is overrides 유지  
  - TypeScript 5.x 사용(최소 4.9 요구 충족)

---

## v7 적용 후 참고

- [MUI Versions](https://mui.com/versions/) — 최신 안정 버전 확인
- MUI X(`@mui/x-data-grid`, `@mui/x-date-pickers` 등)는 Material 버전과 별도. 사용 시 해당 패키지 마이그레이션 가이드 참고.
