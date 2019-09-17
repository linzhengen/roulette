# roulette

## 開発環境構築
### 前提
+ Docker
+ Docker Compose
+ Node.js(v11.11.0+)
+ Yarn
+ Port Number
  + 4466(for prisma)
  + 5432(for postgres)

### Install the Prisma CLI
```
brew tap prisma/prisma
brew install prisma
```

### Run frontend
```
cd frontend
yarn install 
yarn serve
```

### Run server
```
cd server
docker-compose up -d 
prisma deploy
```

## 稼働環境構築
### netlify deploy
+ githubを選択、siteを新規作成
+ `Build & deploy` > `Build settings` の画面で下記の項目を設定
  + Base directory: `frontend`
  + Build command: `echo "VUE_APP_API_URL=https://{heroku appに書き換え}.herokuapp.com" > .env.production && yarn build --mode production`
  + Publish directory: `frontend/dist`

### heroku deploy
+ prismaにログイン、下記URLに書いてある手順でheroku側のサーバーを作成(初回のみ必須、サーバ作成済みの場合不要)
  + https://www.prisma.io/blog/heroku-integration-homihof6eifi
+ managementApiSecretを調べる(server/.env.productionに使う)
  + `heroku prisma app` > `Settings` > `Config Vars` > `CONFIG`の中の `managementApiSecret`をメモ 
+ server/.env.productionを作成  
  vi server/.env.production
  ```
  PRISMA_ENDPOINT="https://{heroku appに書き換え}.herokuapp.com"
  PRISMA_MANAGEMENT_API_SECRET="{メモしたmanagementApiSecret}"
  ```
+ deploy
  ```
  cd server
  prisma deploy --env-file .env.production
  ```
