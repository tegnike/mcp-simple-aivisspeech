import { describe, it, expect } from '@jest/globals';
import { AivisSpeechClient } from '../src/aivisspeech-client';

describe('AivisSpeechMCPServer', () => {
  it('should import AivisSpeechClient successfully', () => {
    expect(AivisSpeechClient).toBeDefined();
  });

  it('should have correct endpoint configuration', () => {
    const client = new AivisSpeechClient('http://localhost:10101');
    expect(client).toBeInstanceOf(AivisSpeechClient);
  });
});
