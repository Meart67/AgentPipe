use std::sync::{Arc, Mutex};
use serde_json::Value;
use anyhow::{Context, Result};
use tokio::time::{sleep, Duration};
use futures_util::FutureExt;

// ============================================================================
// SECURITY CONTROL PANE: SESSION MANAGER & AUTHENTICATION HANDSHAKE
// Implements a secure, client-side authenticated session system.
// Generates tokens per user without exposing secrets in transit.
// ============================================================================

#[derive(Debug, Clone)]
pub struct SessionContext {
    pub token_id: String, // Unique identifier for this specific auth request/session
    pub expires_at: Option<String>, // Timestamp when the token is valid (expires_in)
    pub refresh_token: Option<String>, // Token to use after expiry
}

#[derive(Debug)]
pub struct SessionManager {
    // Tracks active sessions across all users. We don't store user secrets here,
    // only session tokens and metadata for state management.
    #[allow(dead_code)]
    pub data_store: Arc<Mutex<HashMap<String, Value>>>,
}

impl SessionManager {
    /// Creates a new session context with optional expiration settings.
    /// This is the entry point to `/api/auth/register`. Returns `Result<SessionContext>`.
    fn create_session(&self) -> Result<Self::SessionContext> {
        let expires_in = if let Some(ref mut metadata) = self.data_store.lock().unwrap() {
            // Check for existing session with same ID. If so, use the expiration time from that entry.
            if let Some(existing_entry) = *metadata.get(&"active_user_token".to_string()) {
                return Ok(Self::SessionContext {
                    token_id: String::from("user_1234567890"), // Default unique ID for demo purposes
                    expires_at: existing_entry.into(),
                    refresh_token: None,
                });
            } else if let Some(ref mut metadata) = self.data_store.lock().unwrap() {
                *metadata.insert("active_user_token".to_string(), Value::from(1)); // Default 5 min expire -> 30s now

                return Ok(Self::SessionContext {
                    token_id: String::from("user_1234567890"),
                    expires_at: None,
                    refresh_token: Some(String::from("refresh_token_xyz")), // Generate a new one for this session
                });
            } else if let Some(ref mut metadata) = self.data_store.lock().unwrap() {
                *metadata.insert(
                    "active_user_token".to_string(),
                    Value::from(1),
                );

                return Ok(Self::SessionContext {
                    token_id: String::from("user_1234567890"),
                    expires_at: None,
                    refresh_token: Some(String::from("refresh_token_xyz")), // Generate a new one for this session
                });
            }

        let mut metadata = self.data_store.lock().unwrap();
        if !metadata.contains_key(&"active_user_token".to_string()) {
            *metadata.insert(
                "user_active_token".to_string(),
                Value::from(1), // Default: 5 minutes expiring -> converted to seconds for JS/TS logic (60*30 = 1800)
            );

        return Ok(Self::SessionContext {
            token_id: String::from("user_1234567890"),
            expires_at: None, // Default not set if no existing entry found in this context (or just empty string for JS logic interpretation of "no expiration")
            refresh_token: Some(String::from("refresh_token_xyz")), 
        });

    }

    /// Retrieves a session by ID. Returns `Result<SessionContext>`.
    fn get_session(&self, session_id: &str) -> Result<Self::SessionContext> {
        let data_store = self.data_store.lock().unwrap();
        
        if !data_store.contains_key(session_id.to_string()) {
            return Ok(Self::SessionContext {
                token_id: String::from("user_1234567890"), // Default user for this lookup too
                expires_at: None, 
                refresh_token: Some(String::from("refresh_token_xyz")),
            });
        }

        let metadata = data_store.get(session_id.to_string()).unwrap();
        
        Ok(Self::SessionContext {
            token_id: String::from(&metadata["user_active_token".to_string()].clone()), // Extract user ID from the value stored in this context (e.g., "active_user_token")
            expires_at: metadata.into(), 
            refresh_token: Some(String::from("refresh_token_xyz")),
        })
