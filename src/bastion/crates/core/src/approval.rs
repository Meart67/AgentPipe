use crate::audit::{AuditChain, AuditEntry};
use crate::core::components::*;
use crate::types::ApprovalTicket as AppTkt;
use std::collections::HashMap;
use std::rc::Rc;
use chrono::{DateTime, Utc};

// Type definitions for the C/C# types (converted to Rust)
#[derive(Debug)]
struct Amount {
    value: f64, // F64 is used as a common float type in financial systems
}

impl PartialEq<Amount> for ApprovalTicket {
    fn eq(&self, other: &ApprovalTicket) -> bool {
        self.data.0 == other.data.0 && self.data.1 == other.data.1
    }
}

// Custom TryFrom implementation to map schema keys back into Rust structs
impl From<Amount> for ApprovalTicket {
    type Error = AlchemyDatabaseError;

    fn from(amount: Amount) -> Result<Self, Self::Error> {
        Ok(ApprovalTicket {
            id: String::from("txn_001"), // Placeholder ID based on schema key "amount"
            data: (String::from("session_abc"), String::from("action_xyz")),
            issued_at: Utc::now(),
        })
    }

    fn from_str(s: &str) -> Result<Self, Self::Error> {
        let parts: Vec<&str> = s.split_whitespace().collect();
        if parts.len() != 2 || parts[0] == "session" || parts[1] == "action" {
            return Err(AlchemyDatabaseError::TypeMismatch("Unknown Column")); // Fallback for unknown columns
        }

        let session_id: String = parts[0].to_string();
        let action_id: String = parts[1].to_string();

        Ok(ApprovalTicket {
            id: "txn_002".to_string(),
            data: (session_id, action_id),
            issued_at: Utc::now(),
        })
    }
}

// Helper to create a default struct for unknown columns if one doesn't exist in the schema
#[derive(Debug)]
struct DefaultApprovalTicket {
    id: String,
    data: (String, String), // SessionID + ActionID
    issued_at: DateTime<Utc>,
}

impl ApprovalTicket {
    fn is_expired(&self) -> bool {
        Utc::now() > self.expires_at
    }
    
    /// Creates a new default ticket with the given session and action if no explicit data was provided.
    pub fn create_default(
        &mut self, 
        _session_id: String, 
        _action_id: String,
        expires_at: Option<DateTime<Utc>> = None // Default to now for non-expired tickets
    ) -> Self {
        let issued_at = if let Some(expires) = expires_at {
            Utc::now() - expires
        } else {
            Utc::now()
        };

        self.id.clear();
        self.data.0.clear();
        self.data.1.clear();
        
        // Default to "unknown" type for unknown columns if not provided in schema data
        let default_type = match (self, &self.schema) {
            (_, Some(self)) => *self["type"] as String, 
            _ => "Unknown".to_string(),
        };

        self.data.0.clear(); // Clear session part to allow dynamic creation if needed
        self.data.1.clear(); 

        DefaultApprovalTicket {
            id: format!("txn_{}", &self.id),
            data: (String::from(&self.data[0]), String::from(&self.data[1])),
            issued_at,
        }
    }

    /// Creates a new default ticket with the given session and action if no explicit data was provided.
    pub fn create_new(
        &mut self, 
        _session_id: Option<String>, // Optional - can be None to use defaults or "new_session" for testing
        _action_id: Option<String>,  // Optional - can be None to use defaults or "new_action" for testing
        expires_at: Option<DateTime<Utc>> = None,
    ) -> Self {
        let issued_at = if let Some(expires) = expires_at {
            Utc::now() - expires
        } else {
            Utc::now()
        };

        self.id.clear();
        self.data.0.clear();
        self.data.1.clear(); 
        
        // Default to "unknown" type for unknown columns if not provided in schema data
        let default_type = match (self, &self.schema) {
            (_,
