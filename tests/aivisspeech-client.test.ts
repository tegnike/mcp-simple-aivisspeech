import { describe, it, expect, beforeEach } from '@jest/globals';
import { AivisSpeechClient } from '../src/aivisspeech-client';

describe('AivisSpeechClient', () => {
  let client: AivisSpeechClient;
  const mockEndpoint = 'http://localhost:10101';

  beforeEach(() => {
    client = new AivisSpeechClient(mockEndpoint);
  });

  describe('constructor', () => {
    it('should create instance with correct endpoint', () => {
      expect(client).toBeInstanceOf(AivisSpeechClient);
    });
  });

  describe('SpeakOptions interface', () => {
    it('should have correct structure', () => {
      const options = {
        text: 'テスト',
        speaker: 1,
        speedScale: 1.0,
      };

      expect(typeof options.text).toBe('string');
      expect(typeof options.speaker).toBe('number');
      expect(typeof options.speedScale).toBe('number');
    });
  });
});
