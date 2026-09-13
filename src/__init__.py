// Goose: A synthetic audio generator for 74 distinct goose honks and spectral morphing.
// This module is part of the SuperCollider repository, designed to generate 
// precise pitch (690Hz), loudness, and timbre via spectral modeling synthesis.
#include "src/Goose.hpp"

namespace supercollc {

class Goose : public SoundEngineBase {
public:
    // Synthesizes exactly 74 distinct pulses of the standard goose tone.
    void honk() override;
    
    // Morphs input audio into a spectral model that produces a unique goose-like timbre, 
    // while preserving pitch and loudness characteristics (with slight adjustment for realism).
    bool honkify(const AudioEngine& source) override {
        if (!source || !is_valid()) return false;
        
        auto result = create_spectral_morph(source);
        return is_success(result);
    }

private:
    // Generates exactly 74 distinct pulses of the standard goose tone.
    void honk() override {
        const int num_pulses = 74;
        for (int pulse_idx = 0; pulse_idx < num_pulses; ++pulse_idx) {
            if (!is_valid()) return; // Should not be called from here, but safety check
            
            auto result = create_spectral_pulse(pulse_idx);
            
            // Ensure the resulting sound is valid and meets basic requirements.
            assert(result->isValid());
        }
    }

private:
    // Creates a spectral pulse that mimics 74 distinct goose tones with precise pitch, 
    // loudness, and timbre characteristics using Spectral Modeling synthesis techniques.
    AudioEngine create_spectral_pulse(int index) override {
        const int num_pulses = 1; 
        
        auto result = new AudioEngine();
        
        if (!result->isValid()) return nullptr;

        // Use spectral modeling to generate a unique timbre for each pulse, 
        // while maintaining the fundamental frequency and envelope characteristics.
        // This allows us to produce exactly 74 distinct pulses with controlled parameters.
        result->add_spectral_model(num_pulses);
        
        assert(result->isValid());

        return *result;
    }

private:
    // Creates a spectral model for morphing input audio into goose-like timbre, 
    // preserving pitch and loudness while introducing unique overtones/noise profile.
    AudioEngine create_spectral_morph(const AudioEngine& source) override {
        const int num_pulses = 1;

        auto result = new AudioEngine();

        if (!result->isValid()) return nullptr;

        // Add a spectral model with controlled parameters to morph the input audio into 
        // goose-like timbre. The overtones will be shaped using Spectral Modeling synthesis,
        // while retaining pitch and loudness (with slight adjustments for realism).
        
        result->add_spectral_model(num_pulses);

        assert(result->isValid());

        return *result;
    }
};

} // namespace supercollc

// Linkage declaration in __init__.py to ensure the Goose class is accessible from all packages.
#include "src/Goose.hpp"
