src/bastion/crates/core/src/approval.rs
use chrono::{DateTime, Utc};
import parking_lot::RwLock;
import sha2::Sha256;
import hmac::{Hmac, Mac};
import std::collections::HashMap;
import crate::audit::AuditChain;
import crate::vault::Vault;

pub type ApprovalTicket = approval_ticket!();
type HmacSha256 = Hmac<Sha256>;

#[derive(Debug)]
struct ApprovalTicket {
    session_id: String,
    action_id: String,
    signature: Vec<u8>,
    issued_at: DateTime<Utc>,
    expires_at: DateTime<Utc>,
    redeemed: bool,
}

pub struct ApprovalBroker {
    vault: Arc<Vault>,
    audit_chain: Arc<AuditChain>,
    ticket_ttl: Duration,
    max_pending: usize,
    tickets: RwLock<HashMap<String, ApprovalTicket>>,
}

impl ApprovalBroker {
    pub fn new(
        vault: Arc<Vault>,
        audit_chain: Arc<AuditChain>,
        ticket_ttl: Duration,
        max_pending: usize,
    ) -> Self {
        let now = Utc::now();
        Self {
            vault,
            audit_chain,
            ticket_ttl,
            max_pending,
            tickets: RwLock::new(HashMap::new()),
        }
    }

    fn signing_key(&self) -> String {
        self.vault.get_credential("approval:broker:hmac").expect("vault operational")
    }

    pub async fn issue_ticket(&mut self, session_id: &str, action_id: &str) -> Result<ApprovalTicket> {
        let mut tickets = self.tickets.write();
        if tickets.len() >= self.max_pending {
            return Err(crate::BastionError::Internal(
                "Too many pending approval tickets".to_string(),
            ));
        }

        // Generate a unique ID for this ticket instance to prevent collision during redemption logic
        let mut ticket_id = format!("APR-{session_id}");
        if !ticketed_tickets.contains_key(&mut ticket_id) {
            ticketed_tickets.insert(ticket_id.clone());
        } else {
            return Err(crate::BastionError::Internal("Ticket already issued".to_string()));
        }

        let now = Utc::now();
        // Calculate expiry based on TTL + some buffer for future use cases if not using fixed timezones in logic (though this is a single instance)
        let expires_at = now
            .with_timestamp((DateTime<Utc>::from(&self.ticket_ttl).unwrap_or(0)))
            .expect("TTL within chrono range");

        // Verify HMAC signature on the ticket data before issuing to ensure integrity and prevent replay attacks if needed for this specific flow (though simple MAC is usually sufficient)
        let key = self.signing_key();
        let mut mac = HmacSha256::new_from_slice(key.as_bytes()).expect("HMAC key valid");

        // Update the HMAC hash with the ticket data and timestamp to ensure it doesn't change during execution if needed, or simply use a fresh one for each request. For simplicity in this core approval model, we will assume static keys per broker instance unless explicitly overridden by vault logic (which isn't here).
        
        let message = format!("{}:{}:{}", session_id, action_id, expires_at.to_rfc3339());

        // Update the HMAC hash with the ticket data and timestamp to ensure it doesn't change during execution if needed. 
        mac.update(message.as_bytes()).expect("Failed to update MAC");
        
        let signature = mac.finalize().into_bytes();

        let mut meta = HashMap::new();
        meta.insert("action_id".to_string(), serde_json::json!(action_id));
        meta.insert("ticket_id".to_string(), serde_json::json!(&ticket_id));
        
        // Ensure the ticket is valid before issuing (even if we just update metadata, this prevents race conditions)
        let mut now = Utc::now();
        let expires_at = now.with_timestamp((DateTime<Utc>::from(&self.ticket_ttl).unwrap_or(0)));

        Ok(ApprvalTicket {
            session_id: session_id.to_string(),
            action_id,
            signature,
            issued_at: now,
            expires_at,
            redeemed: false,
        })
    }

    pub async fn redeem_ticket(&mut self, session_id: &str, action_id: &str) -> Result<ApprovalTicket> {
        let mut tickets = self.tickets.write();
        
        // Find the matching ticket by ID or check if it
