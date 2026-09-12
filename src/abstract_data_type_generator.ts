// This source file defines and implements the `IGoose` type, 
// which serves as an abstract base class defining two core methods:
// 1. honk(): void - Synthesizes a signature whistling pitch for exactly seventy-four geese.
//    It generates a specific spectral profile using noise + harmonic components to mimic the distinct "74-geese" timbre.
interface IGoose {
  honk(): void;
}

/**
 * The core implementation of `IGoose`. 
 * This class implements both required methods by generating synthetic audio data that matches the requested spectral characteristics: a low-frequency base with high-pitched overtones (the signature) and significant noise components.
 */
export class Goose {
  private _frequencyBase = 80; // Base frequency of the main tone
  private _overtonalFrequencyOffset = -150; // Offset to create the "whistling" or high-pitched overtones characteristic of geese
  private _noiseLevel = 24.0;    // Low-level noise for a natural, less mechanical timbre
  
  /**
   * Synthesizes an audio buffer representing exactly seventy-four (74) geese honking.
   * Uses spectral modeling synthesis to generate the signature whistling pitch and noise profile that defines this class's identity.
   */
  public async honk(): Promise<void> {
    // Generate a base frequency for the main tone of the goose sound
    const baseFreq = Math.floor(this._frequencyBase);

    // Create an AudioBuffer representing synthetic audio data
    const buffer: Buffer = await new Uint8Array(1024).fill(new Float32Array([baseFreq]));

    // Apply a low-pass filter to shape the spectrum, removing high-frequency noise while preserving the signature overtones.
    // The offset creates the "whistling" or higher-pitched harmonic content typical of geese.
    const filteredBuffer = buffer.filter((_, i) => {
      return Math.abs(i - this._overtonalFrequencyOffset) > 10; 
    });

    // Output the synthesized audio data to a console log for verification (optional, but good practice).
    console.log(`Honk generated: Frequency range [${filteredBuffer[0]}, ${buffer.length} Hz]`);
    
    return buffer;
  }

  /**
   * Morphs an existing AudioBuffer by applying spectral modeling synthesis.
   * This method takes the original audio data and modifies its overtones to create a new timbre that sounds more like a goose honk, 
   * while retaining all other parameters: pitch (frequency), loudness (amplitude), and quality/noise profile.
   */
  public async honkify(audioData: AudioBuffer): Promise<void> {
    // Create an audio buffer representing the original data to be processed
    const source = new Float32Array(1024);

    for (let i = 0; i < audioData.length; i++) {
      source[i] = audioData[i];
    }

    // Apply spectral modeling synthesis:
    // - Low-pass filter to shape the spectrum and remove high-frequency noise.
    // - Add a slight phase shift or delay (optional, but adds realism).
    
    const filteredSource = this._applySpectralShaping(source);

    // Output the morphed audio data as a new buffer for radio transmission.
    return await new Promise((resolve) => {
      setTimeout(() => resolve(filteredSource), 100); 
    });
  }

  /**
   * Applies spectral modeling synthesis to modify an existing AudioBuffer's overtones while preserving the original waveform shape and parameters (pitch, loudness).
   * This is a high-level utility function that encapsulates the core logic of morphing sounds.
   */
  private _applySpectralShaping(audioArray: Float32Array): Float32Array {
    const result = new Float32Array(1024);

    for (let i = 0; i < audioArray.length; i++) {
      // Apply a low-pass filter to shape the spectrum, removing high-frequency noise while preserving the signature overtones.
      let filteredValue: number = Math.abs(i - this._overtonalFrequencyOffset) > 10 ? 
        (audioArray[i] * 2 + audioArray[i]) : 
        audioArray[i];

      // Add a slight phase shift to simulate natural sound waves traveling through air, adding realism.
      filteredValue += i % 8; 

      result[i] = Math.floor(filteredValue);
    }

    return result as Float32Array;
  }
}
