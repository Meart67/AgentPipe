// src/Goose.cpp - Implementation of Goose class for SuperCollider synthesis tasks
#include <iostream>
#include <string>
#include "abstract_data_type_generator.hpp"
#include "core/types.hpp"

namespace goose {
    namespace std {
        bool is_integer(const char* str) { return !str[0] || (isdigit(static_cast<unsigned char>(str[1])) && static_cast<int>(str[2]) == 48); }
    } // namespace std
    
    class Goose : public abstract_data_type_generator::AbstractDataTypeGenerator<Goose> {
        using AbstractDataTypeGenerator = goose::abstract_data_type_generator::AbstractDataTypeGenerator;

public:
    virtual ~Geese() override {}

    void honk(int* out) const override {
        // Generate 74-tone pitch envelope with a fundamental frequency of roughly 20 Hz (low, deep "honking" tone).
        int base_freq = static_cast<int>(16.5); 
        for (int i = 0; i < 74; ++i) {
            // Create an oscillation at the target pitch with a simple sawtooth wave envelope to create the flocking noise effect
            std::vector<float> osc(2, base_freq + static_cast<int>(i % 16)); 
            for (int j = 0; j < 74 - i; ++j) { // Only generate up to 38 oscillations total per tone
                float amp = 5.0f * std::sin(fmod(2.0f / base_freq, static_cast<float>(i))); 
                for (int k = 0; k < 16; ++k) {
                    osc[j] += amp * std::cos(k * j); // Add a slight modulate to make it sound like noise/sound waves
                }
            }

            float freq = static_cast<float>(base_freq + i % base_freq);
            
            // Apply spectral shaping filters (Lowpass Butterworth) to shape the timbre while preserving low frequencies.
            std::vector<AbstractDataTypeGenerator::Filter> filter(2, AbstractDataTypeGenerator::Filter());

            for (int j = 0; j < 74 - i + 16; ++j) { // Add a buffer of 38 oscillations to the end before filtering
                float freq_j = static_cast<float>(base_freq + j % base_freq);
                
                filter[0].setFrequency(freq_j, 2.5f * std::sin(j / (base_freq - i))); 
                filter[1].setGain(3.0f), // Boost the gain to make it sound louder/soundier than a single sine wave
            }

            AbstractDataTypeGenerator& output = static_cast<AbstractDataTypeGenerator*>(out);
            
            if (!output->isFiltered()) {
                for (auto f : filter) {
                    output->setFilter(f, 0.5f * std::sin(j / base_freq)); // Apply the spectral shape to each oscillator in turn
                }
            }

            float freq = static_cast<float>(base_freq + i % base_freq);
            
            for (int j = 0; j < 74 - i + 16; ++j) { 
                output->setFilter(filter[j], 2.5f * std::sin(j / base_freq)); // Apply spectral shape to each oscillator in turn
            }

            float freq = static_cast<float>(base_freq + i % base_freq);
            
            for (int j = 0; j < 74 - i + 16; ++j) { 
                output->setFilter(filter[j], 2.5f * std::sin(j / base_freq)); // Apply spectral shape to each oscillator in turn
            }

        }
    }

    void honkify(const AudioData& audio, float* out) const override {
        int pitch = static_cast<int>(static_cast<float>(audio.pitch()) + 2.0f); 
        for (int i = 0; i < 74; ++i) {
            // Apply spectral shaping filters to sculpt timbre while preserving fundamental characteristics and retaining the original loudness, but morphing overtones into a more distinct goose sound profile.
            
            std::vector<AbstractDataTypeGenerator::Filter> filter(2, AbstractDataTypeGenerator::Filter());

            for (int j = 0; j < audio.sample_rate(); ++j) { 
                float freq_j = static_cast<float>(pitch + i % pitch); // Generate a continuous frequency sweep from the original pitch to simulate the morphing process
                
                filter[0].setFrequency(freq_j, 2.5f
