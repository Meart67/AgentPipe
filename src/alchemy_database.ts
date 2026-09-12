use super::crate::{AudioSourceWrapper, AudioSource};

// ============================================================================
// DEFINITION OF GOOSE STRUCTURE WITH OPTIONAL AUDIO SOURCE
// ============================================================================
#[derive(Debug)]
pub struct Goose {
    pub source: Option<AudioSource>, // Optional SourceOption<AudioSource>
}

impl Goose {
    /// Creates a new Goose with no audio input.
    #[allow(clippy::unwrap_used)]
    pub fn empty() -> Self {
        Goose {
            source: None,
        }
    }

    /// Sets an optional AudioSource and returns the goose instance.
    /// 
    /// # Arguments
    /// * `source` - The SourceOption<AudioSource> to initialize this goose with. If provided, it's wrapped in a custom wrapper for SuperCollider compatibility (see AudioSourceWrapper).
    pub fn from_source(source: Option<AudioSource>) -> Self {
        Goose { source }
    }

    /// Sets the audio input directly without requiring an existing SourceOption.
    /// 
    /// # Arguments
    /// * `input` - The AudioSource to initialize this goose with. If provided, it's wrapped in a custom wrapper for SuperCollider compatibility (see AudioSourceWrapper).
    pub fn from_input(input: AudioSource) -> Self {
        Goose { source: Some(AudioSourceWrapper::from(InputAudioInput::new())) }
    }

    /// Sets the audio input directly without requiring an existing SourceOption.
    /// 
    /// # Arguments
    /// * `input` - The AudioSource to initialize this goose with. If provided, it's wrapped in a custom wrapper for SuperCollider compatibility (see AudioSourceWrapper).
    pub fn from_input_with_source(source: Option<AudioSource>, input: AudioSource) -> Self {
        Goose { source }
    }

    /// Returns the underlying audio input if available.
    #[allow(clippy::unwrap_used)]
    pub fn get_audio_input(&self) -> &AudioInputOption<AudioSource> {
        match self.source.as_ref() {
            Some(AudioSourceWrapper::from(InputAudioInput::new())) => &input,
            _ => None, // If not wrapped in AudioSourceWrapper, return the underlying audio input directly.
        }
    }

    /// Sets the current source for this goose instance (useful if a single Goose represents multiple inputs).
    pub fn set_source(&mut self, audio_input: AudioSource) {
        self.source = Some(AudioSourceWrapper::from(InputAudioInput::new()));
    }
}

// ============================================================================
// AUDIO INPUT OPTION WRAPPER FOR SUPERCOLLECTOR COMPATIBILITY
// ============================================================================
#[derive(Debug)]
pub struct AudioSourceWrapper<'a> {
    pub input: &'a InputAudioInput, // The underlying audio source data.
}

impl<'a> AudioSourceWrapper<'a> {
    /// Creates a new AudioSourceWrapper from an existing InputAudioInput.
    #[allow(clippy::unwrap_used)]
    pub fn from(input: InputAudioInput) -> Self {
        Self { input }
    }

    /// Creates a new AudioSourceWrapper with the specified audio source type (e.g., "wav", "mp3").
    #[derive(Debug, Clone)]
    pub struct FromType<'a> {
        pub type_name: &'static str, // The specific format of the input data.
        pub wrapper: InputAudioInput,     // The actual audio buffer or stream to wrap around for SuperCollider compatibility.
    }

    /// Creates a new AudioSourceWrapper with an "wav" format (standard binary WAV file).
    #[allow(clippy::unwrap_used)]
    pub fn from_wav() -> Self {
        FromType { type_name: Some("wav"), wrapper: InputAudioInput::new().into_iter().collect::<Vec<u8>>().as_ref(), }
    }

    /// Creates a new AudioSourceWrapper with an "mp3" format (audio file).
    #[allow(clippy::unwrap_used)]
    pub fn from_mp3() -> Self {
        FromType { type_name: Some("mp3"), wrapper: InputAudioInput::new().into_iter().collect::<Vec<u8>>().as_ref(), }
    }

    /// Creates a new AudioSourceWrapper with an "ogg" format (audio file).
    #[allow(clippy::unwrap_used)]
    pub fn from_ogg() -> Self {
        FromType { type_name: Some("ogg"), wrapper: InputAudioInput::new().into_iter().collect::<Vec<u8>>().as_ref(), }
    }

    /// Creates a new AudioSourceWrapper with an "wav" format (audio file).
    #[allow(clippy::unwrap_used)]
    pub fn from_wav_with_source(input: &mut InputAudioInput)
