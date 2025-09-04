// Sound manager for game audio
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1;
    }

    return buffer;
  }

  private playBuffer(buffer: AudioBuffer | null) {
    if (!this.audioContext || !buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    source.start();
  }

  playEatSound() {
    // Higher pitched sound for eating
    const buffer = this.createTone(800, 0.1);
    this.playBuffer(buffer);
  }

  playGameOverSound() {
    // Lower pitched sound for game over
    const buffer = this.createTone(200, 0.5);
    this.playBuffer(buffer);
  }

  playMoveSound() {
    // Very subtle sound for movement
    const buffer = this.createTone(400, 0.05);
    this.playBuffer(buffer);
  }

  // Background music methods
  async loadBGM(): Promise<void> {
    if (this.bgmAudio) return;
    
    this.bgmAudio = new Audio('/MONTAGEM XONADA.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.5; // 50% volume
    
    // Preload the audio
    try {
      await this.bgmAudio.load();
    } catch (error) {
      console.error('Error loading BGM:', error);
    }
  }

  async playBGM(): Promise<void> {
    if (!this.bgmAudio) {
      await this.loadBGM();
      if (!this.bgmAudio) return;
    }
    
    // Play from the beginning if already ended
    if (this.bgmAudio.ended) {
      this.bgmAudio.currentTime = 0;
    }
    
    try {
      await this.bgmAudio.play();
    } catch (error) {
      console.error('Error playing BGM:', error);
    }
  }

  pauseBGM(): void {
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
  }

  stopBGM(): void {
    if (this.bgmAudio) {
      this.pauseBGM();
      this.bgmAudio.currentTime = 0;
    }
  }
}


export const soundManager = new SoundManager();
