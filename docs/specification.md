# MCP-AIVISSPEECH 仕様書

## 概要

MCP-AIVISSPEECHは、Model Context Protocol (MCP) を通じてAIVISSPEECHのテキスト読み上げ機能を提供するサーバーです。

## 機能仕様

### 読み上げ機能 (speak)

AIVISSPEECHを使用してテキストを音声に変換し、読み上げを行います。

#### パラメータ

| パラメータ名    | 型     | 必須 | 説明                              |
| --------------- | ------ | ---- | --------------------------------- |
| text            | string | ✓    | 読み上げるテキスト                |
| speaker         | number | ✓    | 話者ID（AIVISSPEECHのスタイルID） |
| speedScale      | number |      | 読み上げ速度のスケール（0.5-2.0） |
| intonationScale | number |      | 感情表現の強さ（0.0-2.0）         |

#### 使用例

```json
{
  "text": "こんにちは、これはテスト音声です。",
  "speaker": 888753760,
  "speedScale": 1.3,
  "intonationScale": 1.0
}
```

#### 処理フロー

1. MCPクライアントから `speak` ツールが呼び出される
2. パラメータ `text`, `speaker`, `speedScale`, `intonationScale` を受け取る
3. AIVISSPEECHのAPIを使用して音声合成を実行
4. 生成された音声ファイルを再生
5. 実行結果をMCPクライアントに返却

#### 戻り値

成功時：

```json
{
  "success": true,
  "message": "音声の読み上げが完了しました"
}
```

エラー時：

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## AIVISSPEECH連携

### 前提条件

- **AIVISSPEECHエンジンが別途起動している必要があります**
- AIVISSPEECHエンジンは事前にユーザーが起動させておく必要があります
- デフォルトのAIVISSPEECH APIエンドポイント: `http://localhost:10101`
- AIVISSPEECHエンジンの起動確認は本MCPサーバーの責任範囲外とします

### 話者ID（スタイルID）

AIVISSPEECHで利用可能な話者IDは、AIVISSPEECHのAPIエンドポイント `/speakers` から取得できます。話者IDは888753760のような非連続的な値であり、VOICEVOXとは異なります。

## 技術仕様

### MCP Server

- Node.js / TypeScript で実装
- MCP SDK を使用してMCPサーバーを構築
- AIVISSPEECHとの通信にはHTTP APIを使用

### 依存関係

- `@modelcontextprotocol/sdk`: MCP SDK
- `axios`: HTTP通信
- その他必要な依存関係

## 制限事項

- 現在のMVPでは読み上げ機能（speak）のみを提供
- 音声ファイルの保存機能は含まれません
- 複数の音声の同時生成には対応していません
- AIVISSPEECHエンジンの起動・停止は本MCPサーバーでは行いません
- AIVISSPEECHエンジンが起動していない場合はエラーを返します
- 新たに追加されたパラメータ：speedScale(速度)、intonationScale(感情表現の強さ)をサポート
