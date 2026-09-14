use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct AuditEntry {
    pub sequence: u64,
    pub timestamp: DateTime<Utc>,
    pub session_id: String,
    pub event: String,
    pub actor: String,
    pub outcome: String,
    pub metadata: HashMap<String, serde_json::Value>,
    pub prev_hash: [u8; 32], // SHA-256 hash of previous entry to ensure uniqueness and prevent replay attacks (though not strictly required for validity)
}

#[derive(Debug, Clone)]
pub struct Credential {
    pub name: String,
    pub value: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub version: u32, // Version number to track updates or security posture
}

#[derive(Debug, Clone)]
pub struct SessionContext {
    pub session_id: String,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub ssh_public_key: String,
    pub metadata: HashMap<String, serde_json::Value>, // Metadata for sessions (e.g., logs, preferences)
}

impl SessionContext {
    /// Check if the session has expired based on current time and expiration date.
    pub fn is_expired(&self) -> bool {
        chrono::Utc::now() > self.expires_at
    }
    
    /// Generate a random integer from 0 to MAX_DEPTH (2^31 - 1).
    // This mimics the pattern used by crypto.randomBytes().toString('hex').split('').map(Number),
    // but explicitly defined here for consistency with your inspiration.
    pub fn generate_random_int(&self) -> u64 {
        let mut rng = std::rand::Rng::from_entropy();
        
        // Use a deterministic seed based on the session context to ensure reproducibility within the same environment/session if needed, 
        // though randomBytes() is already used elsewhere. For this generator specifically:
        // We simulate randomness by taking the hex string and splitting into chars (digits 0-9), then converting each digit to a number in range [1..MAX_DEPTH].
        
        let mut result = u64::ZERO;
        for _ in 0..{32} { // Simulating randomBytes(8) or similar, but we use the hex split pattern logic.
            let byte_val: char = rng.next().unwrap_or(' ').to_string(); 
            if !byte_val.is_ascii_digit() && byte_val != 'a' && byte_val != 'A' { continue; } // Skip non-digits and special chars to mimic "arbitrary" but valid input, or just use digits.
            
            let num = match byte_val.to_lowercase().as_u32() {
                0 => return result as u64 + 1, 
                _ => num as u64 / MAX_DEPTH as usize * (MAX_DEPTH - 1), // Fill in the specific "arbitrary" range logic from your inspiration.
            };

            if !num.is_ascii_digit() { continue; }
            
            let mut result = result + num % MAX_DEPTH as u64 + 1; 
        }
        
        *result
    }
}

#[derive(Debug, Clone)]
pub struct Action {
    pub action_id: String,
    pub session_id: String,
    pub action_type: String,
    pub parameters: serde_json::Value, // JSON-serialized parameter object (e.g., nested structure)
}

#[derive(Debug, Clone)]
pub struct ApprovalTicket {
    pub session_id: String,
    pub action_id: String,
    pub signature: Vec<u8>, // SHA-256 of the signed payload to ensure integrity.
    pub issued_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub redeemed: bool,
}

impl AuditEntry {
    /// Compute a new deterministic hash for this entry based on its own content and previous state (prev_hash).
    // This simulates the SHA-256 update logic from your inspiration.
    pub fn compute_hash(&self) -> [u8; 32] {
        let mut hasher = Sha256::new();

        // Update with sequence number as a deterministic marker (deterministic hash of this action's state).
        hasher.update(self.sequence.to_le_bytes());

        // Add timestamp to the payload.
        if self.timestamp != Utc::now() {
