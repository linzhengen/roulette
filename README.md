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

### 1. メインページから選択
```bash
# プロジェクトルートでHTTPサーバーを起動
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` にアクセスし、Vue.jsまたはReactバージョンを選択してください。

### 2. 直接アクセス
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

## 開発

```bash
# メインページを表示
npm run serve

# Vue.jsページを表示
npm run serve-vue

# Reactページを表示
npm run serve-react
```

## 元のプロジェクトからの変更点

- サーバーサイド実装を削除
- フロントエンドをVue.js 3とReact.jsで再実装
- ローカルストレージによるデータ永続化
- 共有コア機能の分離
- モダンなフレームワーク対応