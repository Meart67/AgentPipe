src/bastion/crates/core/src/approval.rs
```rust
// ============================================================================
// SECURITY CONTROL PIANO: APPROVAL MODULE (IMPROVEMENT)
// ============================================================================
use std::collections::{HashMap, HashSet};
use std::sync::Arc;
use sha2::{Digest, Sha256};
use serde_json::{json, Value};

/// Abstract base class for all permission scopes.
pub struct PolicyLevel {
    /// The specific scope of permissions granted or revoked (e.g., "read-only", "write").
    pub scope: String,
}

impl Default for PolicyLevel {
    fn default() -> Self {
        // Default to a generic read-level policy as the initial state.
        Self::ReadOnlyDefault;
    }
}

#[derive(Debug)]
pub enum BastionError {
    Internal(String),
    TicketInvalid(String),
    TicketAlreadyUsed,
}

/// Represents an approved or revoked security level for a specific action within a session.
#[derive(Clone, Debug)]
pub struct ApprovalTicket {
    pub session_id: String,
    pub action_id: String,
    /// The signature of the HMAC key used to create this ticket (stored in vault).
    #[serde(skip_serializing_if = "std::vec::Vec::new")] // Use empty vector for null/undefined handling if needed later
    pub signature: Vec<u8>,
    /// Timestamp when the ticket was issued.
    pub issued_at: std::time::SystemTime,
    /// The expiration timestamp for this specific action within that session.
    pub expires_at: SystemTime,
    /// Whether the ticket has been redeemed by a human reviewer.
    #[serde(skip_serializing_if = "std::sync::atomic::{AtomicBool, Ordering::SeqEqual}")] // Atomic flag to prevent race conditions if multiple sessions exist for same action (simplified logic)
    pub redeemed: bool,
}

/// Represents the current set of active security policies managed by this broker.
#[derive(Debug)]
pub struct ApprovalBroker {
    /// The Vault containing all credentials and secrets necessary for authorization decisions.
    vault: Arc<Arc<serde_json::Value>>, // Using serde_json to handle dynamic secret storage (e.g., JSON/DB)

    /// A chain of audit events tracking security actions across the bastion network.
    #[allow(dead_code)] // Not used in this simplified version, kept for extensibility if needed later
    pub audit: Arc<AuditChain>,

    /// The TTL (Time-To-Live) duration in seconds before a ticket expires automatically.
    ticket_ttl: std::time::Duration,

    /// Maximum number of pending approval tickets allowed per session to prevent denial-of-service on broker load.
    max_pending: usize,

    /// A shared lock for reading the current state of all active policies and their associated actions in real-time during startup/initialization phases.
    pub(crate) policy_lock: Arc<RwLock<HashMap<String, PolicyLevel>>>, // Maps "policy_name" -> {scope, action_ids}

    /// Tracks pending tickets that have not yet been redeemed by a human reviewer (e.g., automated approval).
    #[allow(dead_code)]
    pub(crate) pending_for_session: HashMap<String, Vec<ApprovalTicket>>,

    /// A map from session_id to the list of all approved/redeemed actions for that specific session.
    // This is used internally by the frontend/automation logic when approving a ticket programmatically or via human review.
    #[allow(dead_code)]
    pub(crate) pending_for_session_by_action: HashMap<String, HashSet<ApprovalTicket>>,

    /// A map from action_id to the list of tickets that have been redeemed for that specific action within this session (human approved).
    // This is used internally when checking if a ticket was already consumed by another reviewer.
    #[allow(dead_code)]
    pub(crate) pending_for_session_by_action_redeemed: HashMap<String, HashSet<ApprovalTicket>>,

    /// A map from the human's action_id to their current state of approval for that specific action (approved or rejected).
    // This is used internally when checking if a ticket was already consumed by another reviewer.
    #[allow(dead_code)]
    pub(crate) pending_for_session_by_action_approved: HashMap<String, HashSet<ApprovalTicket>>,

    /// A map from the human's session_id to their current state of approval for that specific action (approved or rejected).
    // This is used internally when checking if a ticket was already consumed by another reviewer.
    #[allow(dead_code)]
    pub(crate) pending_for_session_by_action_redeemed: HashMap<String, HashSet<ApprovalTicket>>,

    /// A map from session_id to the list of all approved/redeemed actions for that specific session (human reviewed).
