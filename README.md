# @tegnike/mcp-simple-aivisspeech

MCP (Model Context Protocol) を通じて AIVISSPEECH のテキスト読み上げ機能を提供するシンプルなサーバーです。

## 概要

このプロジェクトは、AIVISSPEECH の音声合成エンジンを MCP ツールとして利用できるようにするサーバー実装です。Claude Code 等の MCP クライアントから、テキストの読み上げ機能を簡単に利用できます。

## 前提条件

- Node.js 18.0.0 以上
- **AIVISSPEECH エンジンが起動している必要があります**
  - [AIVISSPEECH 公式サイト](https://aivis.la/)から AIVISSPEECH をダウンロード・インストール
  - AIVISSPEECH を起動し、エンジンが `http://localhost:10101` で稼働していることを確認

## インストール

### npm からインストール（推奨）

```bash
npm install -g @tegnike/mcp-simple-aivisspeech
```

### ソースからインストール

```bash
# リポジトリをクローン
git clone https://github.com/tegnike/mcp-simple-aivisspeech.git

# 依存関係をインストール
npm install

# ビルド
npm run build

# グローバルリンク（オプション）
npm link
```

## 使用方法

### MCP サーバーとして起動

#### 方法 1: npm パッケージから実行（推奨）

```bash
# グローバルインストール後
mcp-simple-aivisspeech

# または npx で直接実行
npx @tegnike/mcp-simple-aivisspeech
```

#### 方法 2: ソースから直接実行

```bash
# プロジェクトディレクトリで
npm start
```

### MCP クライアントから利用

MCP クライアント（Claude Code 等）で以下のツールが利用できます。

**設定方法の詳細は [docs/usage.md](docs/usage.md) を参照してください。**

#### `speak` ツール

テキストを音声で読み上げます。

**パラメータ:**

- `text` (string, 必須): 読み上げるテキスト
- `speaker` (number, 必須): 話者 ID（スタイルID）
- `speedScale` (number, オプション): 読み上げ速度のスケール（0.5〜2.0、デフォルト: 1.0）
- `intonationScale` (number, オプション): 感情表現の強さ（0.0〜2.0、デフォルト: 1.0）

**使用例:**

```json
{
  \"text\": \"こんにちは、これはテスト音声です。\",
  \"speaker\": 888753760,
  \"speedScale\": 1.3,
  \"intonationScale\": 1.0
}
```

### 話者 ID について

AIVISSPEECH で利用可能な話者 ID は、AIVISSPEECH エンジンの `/speakers` エンドポイントから取得できます：

```bash
curl http://localhost:10101/speakers
```

一般的な話者 ID（参考）：

- 888753760: Anneli（通常）
- 888753761: Anneli（喜）
- 888753762: Anneli（怒）
- 888753763: Anneli（悲）

注意：AIVISSPEECHの話者IDはVOICEVOXとは異なる体系を使用しています。

## 開発

### 開発モード

```bash
npm run dev
```

### リント

```bash
npm run lint
```

### テスト

```bash
npm test
```

## 対応プラットフォーム

音声再生は以下のプラットフォームに対応しています：

- **macOS**: `afplay` コマンドを使用
- **Linux**: `aplay` コマンドを使用
- **Windows**: PowerShell の `Media.SoundPlayer` を使用

## トラブルシューティング

### AIVISSPEECH エンジンに接続できない

- AIVISSPEECH Editor または Engine が起動しているか確認
- `http://localhost:10101` で AIVISSPEECH API が利用可能か確認
- ファイアウォールの設定を確認

### 音声が再生されない

- 対応プラットフォームか確認
- 音声再生コマンドがインストールされているか確認
  - Linux: `aplay` (alsa-utils)
  - その他のプラットフォームは通常デフォルトで利用可能

## ライセンス

Apache License 2.0

## 貢献

プルリクエストや Issue の報告は歓迎します。詳細な仕様は `docs/specification.md` を参照してください。
