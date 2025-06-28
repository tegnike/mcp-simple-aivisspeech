#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AivisSpeechClient } from './aivisspeech-client.js';

const AIVISSPEECH_ENDPOINT = 'http://localhost:10101';

class AivisSpeechMCPServer {
  private server: Server;
  private aivisspeechClient: AivisSpeechClient;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-aivisspeech',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.aivisspeechClient = new AivisSpeechClient(AIVISSPEECH_ENDPOINT);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'speak',
            description: 'AIVISSPEECHを使用してテキストを読み上げます',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: '読み上げるテキスト',
                },
                speaker: {
                  type: 'number',
                  description: '話者ID（AIVISSPEECHのスタイルID）',
                },
                speedScale: {
                  type: 'number',
                  description: '読み上げ速度のスケール（デフォルト1.0）',
                  minimum: 0.5,
                  maximum: 2.0,
                },
                intonationScale: {
                  type: 'number',
                  description: '感情表現の強さ（デフォルト1.0）',
                  minimum: 0.0,
                  maximum: 2.0,
                },
              },
              required: ['text', 'speaker'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'speak') {
        try {
          const { text, speaker, speedScale, intonationScale } = request.params
            .arguments as {
            text: string;
            speaker: number;
            speedScale?: number;
            intonationScale?: number;
          };

          await this.aivisspeechClient.speak(
            text,
            speaker,
            speedScale,
            intonationScale
          );

          return {
            content: [
              {
                type: 'text',
                text: '音声の読み上げが完了しました',
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `エラー: ${
                  error instanceof Error ? error.message : '不明なエラー'
                }`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP AIVISSPEECH Server running on stdio');

    // プロセス終了時の処理
    process.on('SIGINT', () => {
      console.error('Received SIGINT, shutting down...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('Received SIGTERM, shutting down...');
      process.exit(0);
    });
  }
}

async function main() {
  const server = new AivisSpeechMCPServer();
  await server.run();
}

// メインモジュールとして実行された場合
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
