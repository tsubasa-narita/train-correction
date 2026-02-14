# おうちで しゅっぱつしんこう！ v13

3歳児向け 電車プログラミング教育ゲーム（React JSX マルチファイル構成）

## プロジェクト概要

子供が電車のパーツを1つずつ組み立て（ミニゲーム）→ 出発シーケンス → 走行シーン（2.5Dパララックス）→ 到着 → ごほうび選択、というフローの知育アプリ。

## ファイル構成

```
v13.jsx                              ← エントリポイント（src/App を re-export）
src/
  index.jsx                          エントリポイント
  App.jsx                            メインステートマシン + CSSキーフレーム

  data/
    trains.js                        TRAINS配列 + ノーズパス関数 + NOSE_FNS/NOSE_TIP_X
    gameSteps.js                     ALL_STEPS, STATION_NAMES, DEFAULT_SETTINGS, getSteps
    colors.js                        SKY_COLORS, MTN_COLORS, BLD_COLORS, winColor

  systems/
    sound.js                         Web Audio API: getAudioCtx, playTone, playNoise, SFX
    stamps.js                        window.storage: loadStamps, saveStamp, todayStr
    environment.js                   getTimeOfDay, getWeather

  utils/
    easing.js                        easeProgress

  components/
    svg/
      RunTrainSVG.jsx                走行用電車SVG（flip/svgFlip対応）
      TrainSVG.jsx                   組み立て画面電車SVG（パーツ表示制御）
      DepotTrainSVG.jsx              車両基地ミニ電車SVG
      PlatformSVG.jsx                駅ホームSVG（pid一意ID生成）

    ui/
      BigButton.jsx                  大きなボタン
      ProgressDots.jsx               ステップ進捗ドット
      PartGetBanner.jsx              パーツゲット演出バナー
      ParticleBurst.jsx              パーティクル演出

    games/
      RapidTapGame.jsx               連打ゲーム
      SwipeGame.jsx                  スワイプゲーム
      HoldGame.jsx                   長押しゲーム

    running/
      ParallaxBg.jsx                 2.5Dパララックス背景
      RunSpeedLines.jsx              スピードライン
      RunOnomatopoeia.jsx            オノマトペ
      RunSeasonalParticles.jsx       季節パーティクル
      RunCrossing.jsx                踏切
      RunStationSign.jsx             駅名通過表示
      RunFuji.jsx                    富士山
      RunDecoupleSign.jsx            切り離しサイン
      RunTunnel.jsx                  トンネル
      PassingTrainEvent.jsx          すれ違い電車
      RainEffect.jsx                 雨エフェクト
      RainbowArc.jsx                 虹

    screens/
      DepotSelector.jsx              車両基地選択画面
      CouplingDialog.jsx             連結ダイアログ
      CollectScreen.jsx              パーツ組み立て画面
      DepartureScreen.jsx            出発シーケンス
      RunningScreen.jsx              走行シーン
      ArrivalSequence.jsx            到着シーケンス
      RewardScreen.jsx               ごほうび選択
      StampCard.jsx                  スタンプカード
      SettingsModal.jsx              保護者設定
```

## 技術スタック

- React（Hooks: useState, useEffect, useCallback, useMemo, useRef）
- SVG描画（電車・駅ホーム・パーツすべてインラインSVG）
- Web Audio API（SFXシステム: 13種類の効果音）
- CSS アニメーション + requestAnimationFrame
- window.storage（スタンプカード永続化）
- **モダンJS**（アロー関数・テンプレートリテラル・スプレッド構文・const/let）

## 主要コンポーネント構成

```
App（メインステートマシン）                    src/App.jsx
├── DepotSelector（車両基地・電車選択画面）     screens/DepotSelector.jsx
├── CouplingDialog（連結アニメーション付き）    screens/CouplingDialog.jsx
├── CollectScreen（パーツ組み立て画面）         screens/CollectScreen.jsx
│   ├── TrainSVG（組み立て中の電車SVG）        svg/TrainSVG.jsx
│   ├── RapidTapGame / SwipeGame / HoldGame    games/*.jsx
│   └── BigButton / ProgressDots / PartGetBanner  ui/*.jsx
├── DepartureScreen（出発シーケンス）           screens/DepartureScreen.jsx
│   └── PlatformSVG（駅ホームSVG）             svg/PlatformSVG.jsx
├── RunningScreen（走行シーン）                 screens/RunningScreen.jsx
│   ├── ParallaxBg（2.5Dパララックス背景）     running/ParallaxBg.jsx
│   ├── RunTrainSVG（走行用電車SVG）           svg/RunTrainSVG.jsx
│   ├── 各種走行サブコンポーネント             running/*.jsx
│   └── RainEffect / RainbowArc               running/*.jsx
├── ArrivalSequence（到着シーケンス）           screens/ArrivalSequence.jsx
├── RewardScreen（ごほうび選択）                screens/RewardScreen.jsx
├── StampCard（スタンプカレンダー）             screens/StampCard.jsx
└── SettingsModal（保護者設定）                 screens/SettingsModal.jsx
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

1. **SVG ID衝突**: PlatformSVG（`svg/PlatformSVG.jsx`）はuseMemoで一意IDプレフィックス生成（`pid`変数）
2. **RunTrainSVGのflip**: HTML文脈→`flip`(CSS scaleX), SVG文脈→`svgFlip`(SVG transform)（`svg/RunTrainSVG.jsx`）
3. **buttonLocked**: useRef(`buttonLockedRef`)で管理、クロージャ問題回避（`screens/CollectScreen.jsx`）
4. **decoupled**: useRef(`decoupledRef`)で管理、useEffect再実行回避（`screens/RunningScreen.jsx`）
5. **onDepart**: useRef(`onDepartRef`)パターンでstale closure回避（`screens/DepartureScreen.jsx`）

## 依存関係レイヤー（循環依存なし）

```
Layer 0: data/*, systems/*, utils/*         ← 外部依存なし
Layer 1: svg/RunTrainSVG, TrainSVG, DepotTrainSVG, ui/*, games/*, running/の大部分
Layer 2: svg/PlatformSVG ← RunTrainSVG、ui/PartGetBanner ← ParticleBurst
Layer 3: screens/* ← 上記を組み合わせ
Layer 4: App.jsx ← 全screens
```

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
