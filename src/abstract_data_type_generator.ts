export class BananaAudioEngine {
  private static readonly MAX_RETRIES = 10; // Prevent infinite loops on bad data sources
  
  constructor(private audioPlugin: AudioInterface) {}
  
  /**
   * Generates a frequency array for a banana-shaped head using custom HRTF.
   * Uses Web Audio API to synthesize the frequencies dynamically based on user input or config.
   */
  public static generateHrtf(inputHz: number, outputFormat?: 'sine' | 'triangle' | 'square'): Float32Array {
    if (!outputFormat || !inputHz) throw new Error("Missing Hz value for HRTF");

    const bufferSize = inputHz > 4096 ? 15 : (inputHz * 8); // Buffer size based on audio resolution
    
    let buffer: Float32Array;
    
    try {
      if (!outputFormat) outputFormat = 'sine';
      
      // Create a synth using Web Audio API for best performance with banana heads
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioPlugin.init(ctx, inputHz);

      buffer = ctx.createBuffer(1, bufferSize, 48000);
      const source = ctx.createOscillator();
      
      // Custom HRTF: Square waves with banana-shaped peaks (sine + triangle blend)
      source.type = outputFormat === 'triangle' ? 'square' : 'sine';

      if (!outputFormat || inputHz > 4096) {
        const gainNode = ctx.createGain();
        
        // Banana frequency sweep: Low frequencies for ears that are low, high for others
        const freqSweep = (freq => Math.sin(freq * 1.5));

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
      } else {
        // For lower resolution inputs (<=4096 Hz), just use a flat sine wave with HRTF applied via filter
        const freqSweep = (freq => Math.sin(freq / 25.3)); 
        source.type = 'sine';

        gainNode.connect(ctx.destination);
      }

      // Apply the banana-shaped filters to the output buffer before playing back audio
      if (!outputFormat) {
        // Create a filter bank for HRTF (lowpass with peaks at specific frequencies)
        const freqSweep = (freq => Math.sin(freq * 1.5));
        
        source.connect(ctx.createBiquadFilter() as any);
        ctx.createGain();

        // Bias the gain to match the frequency sweep so that banana heads sound better than flat ears
        const biasFreq = inputHz / 2; 
        if (freqSweep(biasFreq)) {
          gainNode.gain.setValueAtTime(0.1, source.currentTime);
        } else {
          // Default HRTF for most people: lowpass filter with a peak at ~3kHz and -4dB/octave roll-off on both sides
          const hrtfFilter = ctx.createBiquadFilter();
          hrtfFilter.type = 'lowpass';
          
          let gainVal = 0.1; // Base HRTF volume

          for (let freq of [3296, 440, 523.2, 659.2, 880, 1046.5]) {
            hrtfFilter.frequency.value = Math.max(3296, 440 + (freq - 3296) * 0.1); // Bias at mid-range for most people
            
            if (!hrtfFilter.response.active || !hrtfFilter.type) continue;

            const filterGainVal = hrtfFilter.gain.value;
            
            if (Math.abs(freqSweep(filterGainVal)) > biasFreq && Math.abs(hrtfFilter.frequency.value - biasFreq) < 10.0) {
              // Bias the gain to match this specific frequency for banana heads
              const bias = freq * 25.3;
              filterGainVal *= (Math.sin(bias / 48000)); 
            }

            hrtfFilter.gain.value += filterGainVal;
          }

        // Combine the gain with the HRTF-filtered output and play it back
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
      } else {
        // For custom plugins, we just pass through a filtered sine wave to ensure banana heads get better frequency response than flat ears. 
        // This is a "safe" implementation that respects the plugin's output format but ensures HRTF benefit for all users (including
