# TMOD Timer / Toastmasters Time Management App

## 日本語

### 概要
TMOD Timer は、Toastmasters club 例会における **Toastmaster of the Day (TMOD)** 向けの時間管理用 Web アプリです。  
例会セクションの名前と所要時間（分）を編集し、予定タイムラインを積み上げ棒グラフで可視化できます。さらに、開始後は経過時間をリアルタイム表示できます。

### 主な機能
- セクション名（自由入力）と所要時間（分・数値）の編集
- セクションの追加 / 削除 / 上下入れ替え
- 入力内容の `localStorage` 保存
- 初回アクセス時のデフォルトセクション自動投入
- `セット` ボタンで横向き積み上げ棒グラフ（予定）を表示
- `スタート` ボタンで「経過時間」系列を追加し、1秒ごとに更新（ラベル表示 `m:ss`）

### デフォルトセクション（日本語版）
- オープニング（5分）
- ヘルパー紹介（5分）
- 準備スピーチ（25分）
- Tabletopics（20分）
- 休憩（5分）
- 論評（20分）
- クロージング（5分）

### 英語版
英語 UI は `index_en.html` / `app_en.js` で提供しています。  
日本語版と英語版は保存キーを分離しており、設定が混ざらないようになっています。

- 日本語版保存キー: `tmod-timer-sections`
- 英語版保存キー: `tmod-timer-sections-en`

### ファイル構成
- `index.html` : 日本語 UI エントリーポイント
- `app.js` : 日本語版ロジック
- `index_en.html` : 英語 UI エントリーポイント
- `app_en.js` : 英語版ロジック
- `style.css` : 共通スタイル

### 使い方
1. `index.html`（日本語）または `index_en.html`（英語）を開く
2. セクション名・所要時間を編集（必要に応じて追加/入れ替え）
3. `セット` / `Set` を押して予定グラフを表示
4. `スタート` / `Start` を押して経過時間の計測を開始


---

## English

### Overview
TMOD Timer is a lightweight web app for **Toastmaster of the Day (TMOD)** time management in Toastmasters club meetings.  
You can edit section names and durations (in minutes), visualize the planned timeline as a stacked horizontal bar chart, and track real-time elapsed time after starting the timer.

### Key Features
- Edit section name (free text) and duration (numeric, minutes)
- Add / remove / reorder sections
- Persist settings to `localStorage`
- Auto-seed default sections when no local data exists
- Show planned stacked timeline with `Set`
- Add/update `Elapsed` series with `Start` every second (`m:ss` label)

### Default Sections (English)
- Opening (5 min)
- Helper Introductions (5 min)
- Prepared Speeches (25 min)
- Table Topics (20 min)
- Break (5 min)
- Evaluations (20 min)
- Closing (5 min)

### Project Files
- `index.html`: Japanese UI entry point
- `app.js`: Japanese app logic
- `index_en.html`: English UI entry point
- `app_en.js`: English app logic
- `style.css`: shared styles

### Usage
1. Open `index.html` (JP) or `index_en.html` (EN)
2. Edit sections and durations as needed
3. Click `セット` / `Set` to render the planned chart
4. Click `スタート` / `Start` to begin elapsed-time tracking
