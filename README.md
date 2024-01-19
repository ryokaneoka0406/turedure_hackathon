## これは何

スマ社のハッカソンで作った文字起こしアプリ

## 環境構築

### .env
フロントとバック両方にあるので
OpenAIのAPIキー、Superbase（DBに利用）のURLとAPIキーを編集。

- [OpenAI](https://openai.com/blog/openai-api)
- [supabase](https://supabase.com/)

### フロントエンド

```
cd frontend
yarn install
```

#### 起動
```
yarn run dev
```

### バックエンド

```
pipenv shell
```

#### 起動
```
uvicorn main:app --reload
```