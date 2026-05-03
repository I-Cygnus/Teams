# 디자인 복원 안내

`v1-original/`은 Daangn/Toss 풍 개편 직전(2026-05-04 기준) 시점의 src 스냅샷입니다.
사용자가 "되돌려"라고 하면 아래 명령으로 즉시 복원합니다.

## 복원 명령

```bash
SRC="/Users/choehyeonsu/Desktop/시골쥐X서울쥐/Web/src"
BAK="$SRC/_backup/v1-original"

cp "$BAK/App.tsx"   "$SRC/App.tsx"
cp "$BAK/data.ts"   "$SRC/data.ts"
cp "$BAK/index.css" "$SRC/index.css"
cp "$BAK/main.tsx"  "$SRC/main.tsx"
cp "$BAK/components/"*.tsx "$SRC/components/"
cp "$BAK/pages/"*.tsx      "$SRC/pages/"
```

복원 후 `npm run build`로 검증.

## 백업에 포함된 항목

- `App.tsx`, `data.ts`, `index.css`, `main.tsx`
- `components/IntroAnimation.tsx`, `Layout.tsx`, `Memoji.tsx`
- `pages/Home.tsx`, `Team.tsx`, `MemberDetail.tsx`, `Resume.tsx`, `Troubleshooting.tsx`, `TroubleshootingDetail.tsx`, `Blog.tsx`, `BlogDetail.tsx`
