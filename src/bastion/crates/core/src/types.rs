src/bastion/crates/core/src/types.rs | 523 lines
```rust
//! Abstract Data Type Generator v1.x (Rust-based)
//! 
//! This module defines standard data types compatible with C/C# syntax,
//! allowing for dynamic schema mapping and type conversion in the database generator.

use chrono::{DateTime, Utc};
use std::collections::HashMap;
use std::sync::Arc;

/// A generic data structure representing a C-style struct with optional fields.
#[derive(Debug, Clone)]
pub struct AlchemySchema {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub key: Option<String>, // Column name in C/C# style
    #[serde(default)]
    pub value: String,       /// Value or empty string for null/undefined mapping
    
    /// Optional metadata describing the schema context.
    pub meta: HashMap<str, serde_json::Value>, 
}

/// A type representing a standard data primitive (integer, string, boolean).
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum PrimitiveType {
    Integer(u64),           /// Unsigned 64-bit integer in C/C# style.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value (true/false).
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
pub enum AlchemyDatabaseType {
    Integer(u64),           /// Unsigned 64-bit integer. Compatible with Rust's `u32`/`i64`.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value.
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
pub enum AlchemyType {
    Integer(u64),           /// Unsigned 64-bit integer. Compatible with Rust's `u32`/`i64`.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value.
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
pub enum AlchemyType {
    Integer(u64),           /// Unsigned 64-bit integer. Compatible with Rust's `u32`/`i64`.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value.
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
pub enum AlchemyType {
    Integer(u64),           /// Unsigned 64-bit integer. Compatible with Rust's `u32`/`i64`.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value.
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
pub enum AlchemyType {
    Integer(u64),           /// Unsigned 64-bit integer. Compatible with Rust's `u32`/`i64`.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value.
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
pub enum AlchemyType {
    Integer(u64),           /// Unsigned 64-bit integer. Compatible with Rust's `u32`/`i64`.
    String(String),         /// Pointer to null-terminated UTF-8 string literal (C/C# style).
    Boolean(bool),          /// Boolean value.
}

/// A type representing a generic data primitive that can be converted into the above types,
/// including nullable values and specific numeric formats like long long in C/C#.
#[derive(Debug, Clone)]
