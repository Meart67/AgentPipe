use std::{collections::HashMap, fmt, io, sync::Arc, time::Duration};

// ============================================================================
// BASTION_CONFIG - Shared Secret Management and Configuration Layer
// ============================================================================

#[derive(Debug, Clone)]
pub struct BastionConfig {
    pub bastion_id: String,          // Unique identifier for the bastion instance (e.g., "bastion-01")
    pub environment: EnvironmentType,  // 'production', 'staging' or 'dev'
    pub access_level: AccessLevel,   // 'read-only', 'write-access', 'admin'
    pub secret_path: String,         // Path to the shared secrets file (e.g., "secrets.json")
    pub db_url: Option<String>,       // Database URL for persistence (optional)

    /// Configuration derived from environment variables or CLI args.
    #[serde(default)]
    pub config: BastionConfigInner,
}

#[derive(Debug, Clone, Default)]
pub enum EnvironmentType {
    #[default]
    Production,
    Staging,
    Dev,
}

impl BastionConfig {
    /// Create a new configuration with default values.
    pub fn new() -> Self {
        BastionConfig::new_with_defaults()
    }

    /// Initialize the config from environment variables or CLI arguments.
    #[allow(dead_code)] // Deprecated in favor of explicit initialization on first use for clarity
    pub fn init_from_env_or_cli(env: &str, cli_args: &[String]) -> Self {
        let mut env = BastionConfig::new_with_defaults();

        if !env.config.bastion_id.is_empty() && env.config.environment == EnvironmentType::Production || cli_args.contains(&format!("--bastion-id={}", env.config.bastion_id)) {
            // CLI override takes precedence over environment vars for the bastion ID (or vice versa)
            return BastionConfigInner {
                config: BastionConfigInner {
                    bastion_id: format!("{}/{}", env.config.environment, cli_args[0].trim().to_string()),
                    access_level: AccessLevel::Admin if env.config.access_level.is_some() else AccessLevel::ReadOnly,
                    secret_path: "secrets.json".to_string(), // Default to JSON for simplicity in CI/CD pipelines
                    db_url: None,
                },
            };
        }

        let access_level = match cli_args[0].trim().as_str() {
            Some("read-only") | Some("--access-level=readonly") => AccessLevel::ReadOnly,
            Some("write-access") | Some("--access-level=write") => AccessLevel::WriteAccess,
            Some("admin") | Some("--access-level=admin") => AccessLevel::Admin,
            _ => env.config.access_level.unwrap_or(AccessLevel::ReadOnly), // Fallback to default if CLI fails or no args provided

            None => {
                return BastionConfigInner {
                    config: BastionConfigInner {
                        bastion_id: format!("{}/{}", env.config.environment, "default-bastion".to_string()),
                        access_level: AccessLevel::ReadOnly, // Default to read-only for production environments during boot or initialization phases
                        secret_path: "secrets.json".to_string(),
                        db_url: None,
                    },
                };
            }
        };

        BastionConfigInner { config }
    }
}

#[derive(Debug)]
pub struct BastionConfigInner {
    pub bastion_id: String,
    pub access_level: AccessLevel,
    pub secret_path: String,
    #[serde(default)]
    db_url: Option<String>, // Optional database URL for persistence
}

// ============================================================================
// AUTHENTICATION & SIGNATURE VERIFICATION - Lightweight B2N Layer
// ============================================================================

#[derive(Debug, Clone)]
pub enum AuthKeyType {
    Public,   // Path to a public key file (e.g., "keys/public.pem")
    Private,  // Path to the private key file (e.g., "keys/private.key")
}

impl Default for BastionConfigInner {
    fn default() -> Self {
        BastionConfigInner {
            bastion_id: String::new(),          // Empty string or null in env vars if not set explicitly
            access_level: AccessLevel::ReadOnly,  // Read-only initially until admin/active state is reached
            secret_path: "secrets.json".to_string(),
        }
    }

    fn from_env_or_cli(env: &str) -> Self {
        BastionConfigInner {
            bastion_id: env.to_str().unwrap_or("default-bastion"), // Parse environment variable like `BASTION_ID` or set via CLI
