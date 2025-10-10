# ルーレットアプリ (Refactored)

Vue.js 3とReact.jsで実装されたルーレットアプリケーションです。

## 機能

- 選択肢の追加・削除
- 選択肢の重み付け（確率調整）
- ルーレットの回転アニメーション
- 当選結果の表示
- ローカルストレージによるデータ永続化

## プロジェクト構成

```
roulette/
├── components/roulette/
│   ├── RouletteCore.js      # 共有ルーレット機能
│   ├── VueRoulette.vue      # Vue.js 3コンポーネント
│   └── ReactRoulette.jsx    # Reactコンポーネント
├── src/
│   ├── vue/
│   │   └── index.html       # Vue.jsサンプルページ
│   └── react/
│       └── index.html       # Reactサンプルページ
├── index.html               # メインページ
├── package.json
└── README.md
```

## 使用方法

### オンライン版
このアプリはNetlifyにデプロイされており、直接アクセスできます。

### ローカル開発
任意のHTTPサーバーを使用してプロジェクトを実行できます:

```bash
# npxを使用（推奨）
npx serve .

# または、別のHTTPサーバーを使用
# Node.jsの場合
npx http-server

# Pythonの場合
python3 -m http.server 8000
```

ブラウザでサーバーのURLにアクセスし、Vue.jsまたはReactバージョンを選択してください。

### 直接アクセス
- メインページ: `index.html`
- Vue.jsバージョン: `src/vue/index.html`
- Reactバージョン: `src/react/index.html`

## 実装の特徴

### 共有機能 (RouletteCore.js)
- ルーレットの描画ロジック
- 回転アニメーション
- 当選判定アルゴリズム
- Vue.jsとReactで共通利用

### Vue.js 3実装
- Composition APIを使用
- リアクティブな状態管理
- コンポーネントベースの設計

### React実装
- React 18 Hooksを使用
- 関数コンポーネント
- 状態管理と副作用処理

## ローカルストレージ

選択肢データはブラウザのローカルストレージに保存され、ページをリロードしてもデータが保持されます。

## 技術スタック

- **Vue.js 3**: Composition API, リアクティブシステム
- **React 18**: Hooks, 関数コンポーネント
- **Bulma CSS**: レスポンシブデザイン
- **Font Awesome**: アイコン
- **Canvas API**: ルーレット描画

## Netlifyへのデプロイ

このプロジェクトはNetlifyに簡単にデプロイできます:

### 方法1: Git連携（推奨）
1. GitHubなどにリポジトリをプッシュ
2. Netlifyにログインし、「New site from Git」を選択
3. リポジトリを選択
4. ビルド設定は自動で検出されます（netlify.tomlに定義済み）
5. 「Deploy site」をクリック

### 方法2: ドラッグ&ドロップ
1. [Netlify Drop](https://app.netlify.com/drop)にアクセス
2. プロジェクトフォルダをドラッグ&ドロップ
3. 即座にデプロイ完了

### ビルド設定
- **Publish directory**: `.` （ルートディレクトリ）
- **Build command**: `npm run build`
- **Node version**: 任意（ビルド不要のため）
