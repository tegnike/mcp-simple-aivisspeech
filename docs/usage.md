# MCPクライアントからの使用方法

## Claude Codeでの設定

### 1. MCPサーバーとして登録

Claude CodeでMCP-AIVISSPEECHサーバーを使用するには、設定ファイルに追加する必要があります。

#### 方法1: npxを使用（推奨）

`~/.claude_desktop/config.json` ファイルを編集：

```json
{
  "mcpServers": {
    "aivisspeech": {
      "command": "npx",
      "args": ["@tegnike/mcp-simple-aivisspeech"]
    }
  }
}
```

#### 方法2: 直接パス指定

##### macOS/Linux の場合

```json
{
  "mcpServers": {
    "aivisspeech": {
      "command": "node",
      "args": ["/path/to/mcp-aivisspeech/dist/index.js"]
    }
  }
}
```

##### Windows の場合

```json
{
  "mcpServers": {
    "aivisspeech": {
      "command": "node",
      "args": ["C:\\path\\to\\mcp-aivisspeech\\dist\\index.js"]
    }
  }
}
```

### 2. 前提条件

- AIVISSPEECHエンジンが起動している（`http://localhost:10101`）
- Node.js がインストールされている
- **方法1の場合**: プロジェクトで `npm link` が実行済み
- **方法2の場合**: mcp-aivisspeechプロジェクトがビルド済み（`npm run build`）

### 3. Claude Codeでの使用

Claude Codeを再起動後、以下のように`speak`ツールが利用できます：

```
AIVISSPEECHで「こんにちは、テストです」を話者ID 888753760で読み上げてください。
```

Claude Codeが自動的に以下のパラメータで`speak`ツールを呼び出します：

```json
{
  "text": "こんにちは、テストです",
  "speaker": 888753760,
  "speedScale": 1.3,
  "intonationScale": 1.0
}
```

## 他のMCPクライアントでの使用

### 直接実行での動作確認

MCPサーバーが正しく動作するかテストするには：

```bash
# サーバーを起動
npm start

# 別のターミナルでテスト（標準入力でMCPプロトコルを送信）
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start
```

### カスタムMCPクライアント

独自のMCPクライアントから使用する場合：

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

// MCPサーバープロセスを起動
const serverProcess = spawn('node', ['dist/index.js']);

// クライアントを作成
const transport = new StdioClientTransport({
  stdin: serverProcess.stdin!,
  stdout: serverProcess.stdout!,
});

const client = new Client(
  {
    name: 'aivisspeech-client',
    version: '1.0.0',
  },
  {
    capabilities: {},
  }
);

await client.connect(transport);

// speakツールを呼び出し
const result = await client.request(
  {
    method: 'tools/call',
    params: {
      name: 'speak',
      arguments: {
        text: 'こんにちは、世界！',
        speaker: 888753760,
        speedScale: 1.3,
        intonationScale: 1.0,
      },
    },
  },
  {}
);

console.log(result);
```

## トラブルシューティング

### AIVISSPEECHが見つからない場合

```bash
# AIVISSPEECHエンジンが起動しているか確認
curl http://localhost:10101/speakers
```

### MCPサーバーが認識されない場合

1. パスが正しいか確認
2. Node.jsがインストールされているか確認
3. ビルドが完了しているか確認（`dist/index.js`が存在するか）
4. Claude Codeを完全に再起動

### 権限エラーの場合

```bash
# 実行権限を付与
chmod +x dist/index.js
```

## 話者IDの確認

使用可能な話者IDを確認：

```bash
curl http://localhost:10101/speakers | jq '.[].styles[].id'
```

よく使用される話者ID：

- 888753760: Anneli（通常）
- 888753761: Anneli（喜）
- 888753762: Anneli（怒）
- 888753763: Anneli（悲）
