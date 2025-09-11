# nextjsApp
docker compose から Next.js のアプリを作成する。

## コマンドたち

アプリ作成
```bash
$ docker compose run --rm app sh -c 'npx create-next-app . --typescript'
````

npm install
```bash
$ docker compose run --rm app sh -c 'npm install'
````

アプリ開発時
```bash
$ docker compose up -d
````

起動したコンテナに入る<br>
compose.yamlの command: sh -c "npm run dev" をコメントアウトしてから、
```bash
$ docker compose exec app bash
````

アプリ開発終了時
```bash
$ docker compose down
````

本番環境で確認
```bash
$ npm start
````