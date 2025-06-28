# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

これは `@tegnike/mcp-simple-aivisspeech` として提供される、AIVISSPEECH統合のためのMCP（Model Context Protocol）サーバー実装プロジェクトです。

## 開発コマンド

```bash
npm install         # 依存関係のインストール
npm run build       # TypeScriptのビルド (dist/へ出力)
npm run dev         # 開発モード (--watch)
npm start           # ビルド済みサーバーの実行
npm test            # Jestテストの実行
npm run lint        # ESLintでコード品質チェック
npm run format      # Prettierでコード整形
npm run format:check # フォーマットチェック（CI用）
```

## アーキテクチャ

### MCP プロトコル実装

このプロジェクトは Model Context Protocol (MCP) サーバーとして実装されており、stdio トランスポートを使用してクライアントと通信します。MCPクライアント（Claude Code等）から `speak` ツールとして呼び出される仕組みです。

### コア構成

- **src/index.ts**: `AivisSpeechMCPServer` クラスでMCPサーバーを実装。ツール定義、リクエストハンドリング、エラー処理を担当
- **src/aivisspeech-client.ts**: `AivisSpeechClient` クラスでAIVISSPEECH API（http://localhost:10101）との通信、音声合成、クロスプラットフォーム音声再生を実装

### データフロー

1. MCPクライアントが `speak` ツールを呼び出し
2. `AivisSpeechMCPServer` がリクエストを受信、パラメータを検証
3. `AivisSpeechClient` がAIVISSPEECH APIで音声クエリ作成（/audio_query）
4. speedScale, intonationScale等のパラメータを音声クエリに適用
5. 音声合成実行（/synthesis）、WAVファイル生成
6. プラットフォーム固有コマンドで音声再生（afplay/aplay/PowerShell）
7. 結果をMCPクライアントに返却

### 話者IDシステム

AIVISSPEECHは非連続的な大きな数値をスタイルIDとして使用（例: 888753760）。VOICEVOXとは異なるID体系のため、移行時は話者IDの変更が必要です。

### 技術スタック

- TypeScript (ES2022, ES modules)
- @modelcontextprotocol/sdk ^0.5.0
- axios ^1.6.0
- Jest + ts-jest (テスト)
- ESLint + Prettier (コード品質)
- Husky (Git hooks)

## 開発時の注意事項

### AIVISSPEECHの前提条件

- AIVISSPEECH エンジンが `http://localhost:10101` で起動している必要があります
- 話者ID（スタイルID）は `/speakers` エンドポイントで確認可能

### テスト実行

```bash
npm test                              # 全テスト実行
npm test -- --watch                   # ウォッチモード
npm test aivisspeech-client.test      # AIVISSPEECHクライアントのテスト
npm test index.test                   # MCPサーバーのテスト
```

### ビルドとリリース

- `npm run build` 実行後、`dist/index.js` に実行可能ファイルが生成されます
- prepublishOnlyフックでlint、test、buildが自動実行されます
- GitHub Actions で CI/CD が設定済み (ci.yml, release.yml, publish.yml)

## ドキュメント管理

- 仕様書は `docs/` ディレクトリで管理します
- MVPのTODOは `docs/TODO.md` で管理します
- 仕様が変更される場合は、必ず `docs/specification.md` を更新してください
- 実装前に仕様書を確認し、実装後は仕様との整合性を確認してください

## 開発ワークフロー

- 開発中は適切な粒度でコミットを行ってください
- 各コミットは論理的にまとまった変更を含むようにします
- 機能追加、バグ修正、リファクタリングなど、変更の性質に応じて適切に分割します
- コミットメッセージは変更内容を明確に説明し、なぜその変更が必要だったかを記述します

## 音声通知設定

- タスク完了時や重要なお知らせが必要な場合は、AIVISSPEECHの音声通知機能を使用してください
- 音声通知の設定: speaker=888753760, speedScale=1.3, intonationScale=1.0
- 英単語は適切にカタカナに変換してAIVISSPEECHに送信してください

_注記：このCLAUDE.mdはプロジェクト構造とコードベースの開発に伴って更新されます。_
