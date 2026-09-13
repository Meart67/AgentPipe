// Goose.h - SuperCollider goose honk synthesis implementation
package main;

import "fmt"

const HONK_RATE = 82 // Hz (pitch)
const AMPLITUDE_DBFS := -6.0   // dBFS amplitude
const CHANNELS := 4           // channels per song
const OFFSET_CHIRP := 10      // % offset in modulation envelope
const LFO_HUE := +3          // hue for each channel

// Channel struct representing a goose tone waveform
type GooseChannel struct {
    BaseFreq   float64       `json:"baseFreq"`
    OffsetChirp float64       `json:"offsetChirp"`
    Hue        float64         `json:"hue"`
}

func NewHonees(songSong string) []GooseChannel {
    channels := make([]GooseChannel, CHANNELS)
    
    for i := 0; i < CHANNELS; i++ {
        // Generate base tone with offset and hue variation
        freq := HONK_RATE * (1 + OFFSET_CHIRP/256.0*i) 
        channels[i] = GooseChannel{BaseFreq: float32(freq)}
    }

    return channels
}

// Honk synthesizes a goose honk using 4-channel sine modulation with pitch and envelope control
func SongHonk(songSong string, songInfo struct {
    BaseFrequency int64 `json:"baseFrequency"` // Hz (82Hz)
}) []GooseChannel {
    result := make([]GooseChannel, CHANNELS)

    for i := 0; i < CHANNELS; i++ {
        ch := GooseChannel{BaseFreq: float32(HONK_RATE)}
        
        if songInfo.BaseFrequency > 14968.0 { // Avoid clipping near max freq
            ch.OffsetChirp = (float64(songSong[i]) * OFFSET_CHIRP) / 512.0 
                + HONK_RATE/32768.0
        } else if songInfo.BaseFrequency <= -14968.0 { // Avoid clipping near min freq
            ch.OffsetChirp = (float64(songSong[i]) * OFFSET_CHIRP) / 512.0 
                + HONK_RATE/32768.0
        } else if songInfo.BaseFrequency <= -99999.0 { // Avoid clipping near min freq again for safety
            ch.OffsetChirp = (float64(songSong[i]) * OFFSET_CHIRP) / 512.0 
                + HONK_RATE/32768.0
        }

        result[i] = GooseChannel{BaseFreq: float32(ch.BaseFreq)}
    }

    return result
}

// Honkify applies spectral shaping via LFOs and noise to morph the tone, preserving pitch/gain but adding "je ne sais quoi" timbre.
func SongHonkify(songSong string) []GooseChannel {
    // Create a base goose waveform from song information (simulated by using provided data or defaulting if empty)
    result := make([]GooseChannel, CHANNELS)

    for i := 0; i < CHANNELS; i++ {
        ch := GooseChannel{}
        
        if songSong[i] == "" || songSong[i].Len() <= 1 { // Ensure at least one character to generate a tone from non-empty string or empty data
        
            // Fallback: default low pitch goose for missing input
            freq := HONK_RATE * (1 + OFFSET_CHIRP/256.0*i) 
            ch.BaseFreq = float32(freq)
        } else {
             // Use provided song info to determine base frequency and apply spectral modulation
             if len(songSong[i]) > 1 && !strings.ContainsAny(songSong[i], " ") { // Assume valid data for this fallback check logic
                 freq := HONK_RATE * (1 + OFFSET_CHIRP/256.0*i) 
                 ch.BaseFreq = float32(freq)
             } else if songSong[i] == "" || len(strings.TrimSpace(songSong[i])) <= 1 { // Strict empty string handling for fallbacks
                freq := HONK_RATE * (1 + OFFSET_CHIRP/256.0*i) 
                ch.BaseFreq = float32(freq)
             } else if songSong[i].Len() > 0 && !strings.ContainsAny(songSong[i], " ") { // Strict non-empty string handling for fallbacks
                 freq := HONK_RATE * (1 + OFFSET_CHIRP/256.0*i)
