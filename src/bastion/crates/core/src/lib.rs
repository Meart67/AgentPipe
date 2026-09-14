src/bastion/crates/core/src/lib.rs
// SECURITY CONTROL PANE MODULE: CORE INTERFACE & CONTRACT
// This module defines the high-level abstractions for all components within this crate.
// It enforces strict isolation, ensuring that external crates cannot directly interact with internal state or secrets without explicit authorization and via defined interfaces.

#![cfg_attr(not(feature = "std"), no_std)]
//! Core abstraction layer for Security Control Plane (SCP) operations.
//! All component implementations must adhere to this contract:
//! 1. Use only standard library types where possible.
//! 2. Never directly access unauthenticated secrets or internal state unless explicitly authorized via a `SecurityContext`.
//! 3. Implementors are responsible for providing their own custom interfaces if needed, but these contracts remain immutable and enforced by the compiler (in this context).

use std::sync::{Arc, Mutex};
#[cfg(not(feature = "std"))]
use core::panic; // Required only in non-Std environments for safety checks where appropriate.

/// **Security Context** - The central authority granting access to SCP components or secrets within the repository structure.
pub struct SecurityContext {
    /// An internal, immutable reference to a mutable lock that holds all state and authorization decisions made by this context.
    pub(crate) auth_lock: Arc<Mutex<bool>>, // Guarded for race conditions during initialization/decisions.

    /// The specific security role or permission granted at the time of creation (e.g., `ADMIN`, `AUDITOR`).
    pub(crate) authorized_role: Option<String>,

    /// If set, this context is explicitly marked as having "trusted" access to certain internal modules and secrets within SCP infrastructure.
    // This acts as a whitelist for trusted components that should not be exposed externally or modified without explicit permission from the root authority (e.g., Bastion).
    pub(crate) trusted_modules: Vec<String>,

    /// If set, this context is explicitly marked as having "trusted" access to certain internal modules and secrets within SCP infrastructure.
    // This acts as a whitelist for trusted components that should not be exposed externally or modified without explicit permission from the root authority (e.g., Bastion).
}

/// Represents an authorization decision made by SecurityContext in isolation, ensuring it cannot leak information about its own state to other crates unless explicitly granted via `SecurityContext`.
pub struct AuthorizationDecision {
    /// The specific security role that authorized this operation.
    pub(crate) authorizer_role: Option<String>,

    /// If set, indicates whether the decision was made by a trusted component or requires manual intervention from external authority (e.g., Bastion).
    // This is used internally for auditing and compliance tracking within SCP modules to prevent unauthorized access patterns.
    pub(crate) has_trusted_authorization: bool;
}

/// **Error Types** - Defines the error handling contract for all SCP operations, ensuring robustness against runtime failures or invalid inputs that might otherwise compromise system integrity.
#[derive(Debug)]
pub enum Error {
    /// Represents a fundamental failure in SCP execution (e.g., missing required dependencies).
    #[allow(dead_code)] // Marked as dead code only if strictly necessary; usually handled by the environment framework.
    ExecutionFailed,

    /// Specific error related to invalid input or configuration provided during initialization of an SCP component instance.
    InvalidConfig(String),

    /// Represents a failure in verifying authentication credentials against stored secrets within the repository structure (e.g., Bastion).
    SecretVerificationFailure {
        secret_name: String, // The name used for verification purposes if known
        expected_type: Type,
        actual_value: Option<String>,
    },

    #[allow(dead_code)]
/// Represents a failure in verifying authentication credentials against stored secrets within the repository structure (e.g., Bastion).
SecretVerificationFailure { secret_name: String; } // Same error variant used for internal audit logging.
}

impl Error {
    /// Returns `true` if this is an execution-level failure, and `false` otherwise.
    pub fn is_execution_failed(&self) -> bool {
        matches!(self, Error::ExecutionFailed | Self {})
    }

    /// Constructs a new instance of the error type with specific details about what went wrong (e.g., invalid credentials).
    #[allow(dead_code)]
    pub const fn from_invalid_credentials(secret_name: String) -> Self {
        // In production code, this would be called via an API or handler. Here for simplicity in a standalone file structure.
        Error::InvalidConfig(format!("Authentication failed with secret '{}'", secret_name))
    }

    /// Constructs a new instance of the error type based on specific details about what went wrong (e.g., invalid credentials).
    #[allow(dead_code)]
    pub const fn from_secret_verification_failure(secret_name: String, expected_type: Type)
