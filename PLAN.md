# 電車コレクションゲーム化 計画

## コンセプト

現在のフロー: `電車を選ぶ → 組み立て → 出発 → 走行 → 到着 → ごほうび`

新フロー: `ホーム画面(コレクション) → ミステリー組み立て → 電車お披露目 → 出発 → 走行 → 到着 → コレクション登録 → ごほうび`

**核心の変更**: 最初に電車を選ぶのではなく、何の電車かわからない状態でパーツを組み立て、完成時にどの電車かが判明する「サプライズ」体験にする。完成した電車はコレクションに追加される。

---

## 画面フロー（新phase）

```
home → collect(ミステリー) → reveal → depart → run → arrive → reward
                                                                  ↓
home ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← reset
     → collection（コレクション画面）
```

---

## 変更ファイル一覧

### 1. `src/systems/stamps.js` → コレクション機能の追加
- 既存のスタンプ機能はそのまま残す
- 新しいコレクション用ストレージキー `ouchi-collection` を追加
- `loadCollection(callback)`: コレクション読み込み（`[{trainId, firstGetDate, count}]`）
- `saveCollection(trainId, callback)`: 電車をコレクションに追加（重複時はcount++）
- コレクションは永続的（60日制限なし）

### 2. `src/App.jsx` — メインフロー変更
- `phase`に `"home"`, `"reveal"` を追加、`"select"`, `"askCouple"` を廃止
- 初期phaseを `"home"` に変更
- ゲーム開始時にランダムで電車を選択する関数を追加
  - 未コレクション電車を優先（重み付けランダム）
  - 全部集めた場合は完全ランダム
- `"reveal"` phase: 組み立て完了後、電車のお披露目演出
- 連結(coupling)機能: お披露目時に連結可能なら自動的に連結演出を表示
- `"arrive"` → `"reward"` 遷移時にコレクション保存

### 3. `src/components/screens/DepotSelector.jsx` → `HomeScreen.jsx` に改名・改修
- 電車選択リストを廃止
- 大きな「あそぶ」ボタンをメインに配置
- コレクション進捗のミニプレビュー（例: 「3/9 しゃしゅ」）
- コレクション画面への遷移ボタン
- 設定ボタン（長押し）はそのまま維持

### 4. `src/components/screens/CollectScreen.jsx` — ミステリーモード
- 電車名の表示を隠す（`??? でんしゃ` や `ナゾの でんしゃ` に変更）
- ヘッダーのemoji表示を `❓` に変更
- TrainSVGに `mystery={true}` propを渡す
- 完成時の「しゅっぱつ しんこう！」ボタンの代わりに「でんしゃの しょうたい は…？」ボタンに変更
- 完成時のonRunの代わりに新しい `onReveal` コールバック

### 5. `src/components/svg/TrainSVG.jsx` — ミステリー表示モード
- `mystery` propを追加
- mystery=trueの場合:
  - 全パーツをグレー/シルエットカラーで表示（形は見えるが色は不明）
  - パーツが追加される度にシルエットが組み上がっていく
  - ストライプ・窓枠などの特徴的な色は隠す
- mystery=falseの場合: 従来通りのカラー表示

### 6. 新規: `src/components/screens/RevealScreen.jsx` — 電車お披露目画面
- 3段階の演出:
  1. シルエット電車が中央に表示「この でんしゃは だれだ…？」
  2. ドラムロール的な演出（画面がフラッシュ）
  3. カラーが一気に登場！電車名がドーン！パーティクル演出
- 連結可能電車の場合、連結パートナーも一緒に表示
- 「しゅっぱつ しんこう！」ボタンで出発フェーズへ
- SFX: 既存のcelebrate音を活用

### 7. `src/components/screens/StampCard.jsx` → コレクション表示の強化
- 上部にコレクション図鑑セクションを追加
  - 9車種をグリッド表示
  - コレクション済み: カラーでDepotTrainSVG表示 + 電車名
  - 未コレクション: グレーシルエット + 「???」
  - コレクション回数バッジ
- 下部に既存のスタンプカレンダー（14日間）を維持

### 8. `src/components/screens/RewardScreen.jsx` — コレクション登録演出の追加
- ごほうび選択前に「コレクションに ついかされたよ！」メッセージ
- 新規コレクション vs 既出の分岐表示
  - 新規: 「あたらしい でんしゃ ゲット！」+ 大きめ演出
  - 既出: 「○かいめの △△！」

---

## 実装順序

1. **Step 1**: `stamps.js` にコレクション保存/読込関数を追加
2. **Step 2**: `TrainSVG.jsx` にmysteryモードを追加
3. **Step 3**: `HomeScreen.jsx` を新規作成（DepotSelectorベース）
4. **Step 4**: `CollectScreen.jsx` をミステリーモードに対応
5. **Step 5**: `RevealScreen.jsx` を新規作成
6. **Step 6**: `RewardScreen.jsx` にコレクション登録演出を追加
7. **Step 7**: `StampCard.jsx` にコレクション図鑑を追加
8. **Step 8**: `App.jsx` を新フローに全面改修
9. **Step 9**: `CLAUDE.md` を更新

---

## 影響を受けないファイル（変更不要）

- `data/trains.js` — 電車データはそのまま
- `data/gameSteps.js` — ステップ構成はそのまま
- `data/colors.js` — 色データはそのまま
- `systems/sound.js` — 効果音はそのまま（新SFX追加不要、既存活用）
- `systems/environment.js` — 環境判定はそのまま
- `utils/easing.js` — そのまま
- `components/svg/RunTrainSVG.jsx` — 走行用SVGはそのまま
- `components/svg/PlatformSVG.jsx` — 駅ホームはそのまま
- `components/svg/DepotTrainSVG.jsx` — コレクション画面で再利用
- `components/ui/*` — UIコンポーネントはそのまま
- `components/games/*` — ミニゲームはそのまま
- `components/running/*` — 走行演出はそのまま
- `components/screens/DepartureScreen.jsx` — そのまま
- `components/screens/RunningScreen.jsx` — そのまま
- `components/screens/ArrivalSequence.jsx` — そのまま
- `components/screens/CouplingDialog.jsx` — RevealScreenで再利用の可能性あり
- `components/screens/SettingsModal.jsx` — そのまま
