# おうちで しゅっぱつしんこう！ v13

3歳児向け 電車プログラミング教育ゲーム（React JSX 単一ファイル）

## プロジェクト概要

子供が電車のパーツを1つずつ組み立て（ミニゲーム）→ 出発シーケンス → 走行シーン（2.5Dパララックス）→ 到着 → ごほうび選択、というフローの知育アプリ。

## ファイル構成

- `v13.jsx` — メインソースコード（約1370行、単一ファイルReactコンポーネント）

## 技術スタック

- React（Hooks: useState, useEffect, useCallback, useMemo, useRef）
- SVG描画（電車・駅ホーム・パーツすべてインラインSVG）
- Web Audio API（SFXシステム: 13種類の効果音）
- CSS アニメーション + requestAnimationFrame
- localStorage（スタンプカード永続化）
- **ES5準拠**（アロー関数・テンプレートリテラル・スプレッド構文 禁止）

## 主要コンポーネント構成

```
App（メインステートマシン）
├── DepotSelector（車両基地・電車選択画面）
├── CouplingDialog（連結アニメーション付きダイアログ）
├── CollectScreen（パーツ組み立て画面）
│   ├── TrainSVG（組み立て中の電車SVG）
│   ├── RapidTapGame / SwipeGame / HoldGame（ミニゲーム）
│   └── BigButton / ProgressDots / PartGetBanner
├── DepartureScreen（出発シーケンス）
│   └── PlatformSVG（駅ホームSVG）
├── RunningScreen（走行シーン）
│   ├── ParallaxBg（2.5Dパララックス背景）
│   ├── RunTrainSVG（走行用電車SVG）
│   ├── RunSpeedLines / RunOnomatopoeia / RunSeasonalParticles
│   ├── RunCrossing / RunStationSign / RunFuji
│   ├── PassingTrainEvent / RunDecoupleSign / RunTunnel
│   └── RainEffect / RainbowArc
├── ArrivalSequence（到着シーケンス）
├── RewardScreen（ごほうび選択）
├── StampCard（スタンプカレンダー）
└── SettingsModal（保護者設定）
```

## 画面フロー（phase）

```
select → askCouple(連結可能車種のみ) → collect → depart → run → arrive → reward
                                                                          ↓
select ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← reset
       → stamps（スタンプカード画面）
```

## 電車データ（TRAINS配列）

9車種: はやぶさ(E5), こまち(E6), かがやき(E7), のぞみ(N700), リニア, やまのて(通勤), よこすか(通勤), SL(蒸気), ドクターイエロー
- 各車種にbody/nose/stripe/roof等のカラー設定
- noseType: e5, e6, e7, n700, linear, flat, steam（ノーズ形状）
- coupleWith: 連結可能なパートナー車種ID

## パーツ組み立てシステム（ALL_STEPS）

7ステップ（設定で2〜7調整可能）:
1. しゃりん（連打ゲーム）
2. せんろ（スワイプゲーム）
3. ボディ（長押しゲーム）
4. まど（タップ）
5. ドア（スワイプゲーム）
6. やね（長押しゲーム）
7. パンタグラフ（連打ゲーム）※蒸気機関車は自動スキップ

## 走行シーンのイベントタイムライン

```
0.00-0.08  加速
0.18       踏切（カンカン音）
0.30       駅通過サイン
0.40-0.55  富士山出現（ランダム）
0.50       すれ違い電車（ランダム）
0.62       連結切り離し
0.68-0.78  トンネル
0.88-1.00  減速→到着
```

## 2.5D演出（B1改善）

- ParallaxBgの各レイヤーにperspective + rotateXで奥行き感
- 電車にperspective(800px) rotateY(-8deg)で斜めアングル
- 地面のグラウンドプレーン追加（草/雪、走行ストライプ）
- 線路は遠近法で収束するレール配置

## 注意事項・コーディング規約

1. **ES5厳守**: `function(){}` のみ、`=>` 禁止、`\`` 禁止、`{...spread}` → `Object.assign`
2. **単一ファイル**: import は React hooks のみ
3. **SVG ID衝突**: PlatformSVGはuseMemoで一意IDプレフィックス生成（`pid`変数）
4. **RunTrainSVGのflip**: HTML文脈→`flip`(CSS scaleX), SVG文脈→`svgFlip`(SVG transform)
5. **buttonLocked**: useRef(`buttonLockedRef`)で管理、クロージャ問題回避
6. **decoupled**: useRef(`decoupledRef`)で管理、useEffect再実行回避
7. **onDepart**: useRef(`onDepartRef`)パターンでstale closure回避

## 既知の改善候補

- A1: 走行中の進捗バー
- A3: お出迎えキャラのバリエーション
- A4: 走行ルートのバリエーション（海/山/都市）
- A5: ミュート/音量設定
- B2: ホームに乗客シルエット追加
- B3: トンネル入口アーチ演出強化
- B4: 駅ホームの時刻対応（夜間ホーム）
- C1: 走行距離の累計記録
- C2: レアイベント・実績バッジ
- D2: サウンドのAudioBufferキャッシュ
- D3: rAF内のsetDist最適化（ref + DOM直接操作）
