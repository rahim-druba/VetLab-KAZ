/**
 * Manual base64 encode/decode (no external libraries).
 * Used for Live API audio blobs.
 */

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeBase64(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    result += BASE64_ALPHABET[a >> 2];
    result += BASE64_ALPHABET[((a & 3) << 4) | (b ?? 0) >> 4];
    result += b === undefined ? '=' : BASE64_ALPHABET[((b & 15) << 2) | (c ?? 0) >> 6];
    result += c === undefined ? '=' : BASE64_ALPHABET[c & 63];
  }
  return result;
}

export function decodeBase64(base64: string): Uint8Array {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/**
 * Playback queue using nextStartTime to prevent gaps.
 * Play raw PCM 16-bit mono at 24kHz.
 */
export class PCMPlaybackQueue {
  private audioContext: AudioContext;
  private nextStartTime = 0;
  private sampleRate: number;

  constructor(sampleRate = 24000) {
    this.sampleRate = sampleRate;
    this.audioContext = new AudioContext({ sampleRate });
  }

  async playPCM(pcmBytes: ArrayBuffer): Promise<void> {
    const now = this.audioContext.currentTime;
    if (this.nextStartTime < now) this.nextStartTime = now;

    const buffer = this.audioContext.createBuffer(1, pcmBytes.byteLength / 2, this.sampleRate);
    const channel = buffer.getChannelData(0);
    const view = new DataView(pcmBytes);
    for (let i = 0; i < channel.length; i++) channel[i] = view.getInt16(i * 2, true) / 32768;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
  }

  getContext(): AudioContext {
    return this.audioContext;
  }

  close(): void {
    this.audioContext.close();
  }
}
