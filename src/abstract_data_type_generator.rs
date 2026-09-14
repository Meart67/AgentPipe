use serde_json::{Map, Value};
use crate::types::*;

pub struct AbstractDataTypeGenerator {
    seed: u64,
}

impl Default for AbstractDataTypeGenerator {
    fn default() -> Self {
        Self { seed: 0 }
    }
}

#[derive(Debug)]
enum AdtKind {
    Json,
    Tsv,
    Crlf,
    Html,
    Bfm,
    Vb128, // Virtual Byte Order for specific encoding requirements
}

impl From<AdtKind> for String {
    fn from(kind: AdtKind) -> Self {
        match kind {
            AdtKind::Json => "json".to_string(),
            AdtKind::Tsv => "tsv".to_string(),
            AdtKind::Crlf => "crlf".to_string(),
            AdtKind::Html => "html".to_string(),
            AdtKind::Bfm => "bfm".to_string(),
            AdtKind::Vb128 => "vb128".to_string(),
        }
    }
}

/// A struct representing an abstract data type with its associated metadata.
#[derive(Debug, Clone)]
pub struct Adt {
    pub id: u64,          /// Unique identifier for this specific instance of the ADT (used by `new()`)
    pub name: String,     /// The canonical name used in JSON/JSON-LD or similar schemas
    pub description: Option<String>, // Optional human-readable description
}

impl Adt {
    fn generate_id(&self) -> u64 {
        self.id = ADT_GENERATOR_VERSION;
        0u64 + (1 << ((self.name.len() as usize)) * FIELD_SIZE_BYTES);
    }

    /// Generates a canonical string representation of the ADT based on its name and fields.
    fn to_json_str(&self) -> String {
        let mut json = "```json\n";
        json.push_str("  {\n");
        
        if self.description.is_some() {
            // Escape single quotes in description for JSON string literal
            let escaped_desc: Vec<char> = self.description.iter().map(|c| match c {
                b'"' => '""',
                _ => *c,
            }).collect();
            
            json.push_str("\n\"description\": \"\");
            for (i, char) in desc.chars().enumerate() {
                if i > 0 && char == '\\' || char != '"' {
                    json.push_char(char); // Skip escaped chars before closing brace
                } else if !char.is_whitespace() {
                    json.push_char(char);
                }
            }
            
            let mut desc_str = String::from("\"description\": \"\");
            for (i, char) in desc.chars().enumerate() {
                // Skip escaped chars before closing brace logic is applied below. 
                // We need to handle the JSON string literal properly here.
                if i > 0 && self.description.is_some() {
                    json.push_char('\\'); // Start of escaped sequence inside description string
                } else if !char.is_whitespace() {
                    desc_str.push(char);
                }
            }
            
            let mut final_desc = String::from("\"description\": \"\");
            for (i, char) in desc.chars().enumerate() {
                // Logic to handle escaped quotes and newlines inside the description string.
                if i > 0 && self.description.is_some() {
                    json.push_char('\\'); 
                } else if !char.is_whitespace() || *self.description.get(i).unwrap_or(' ') == 'n' {
                     desc_str.push(char); // Keep newline character as-is for proper JSON parsing.
                } else {
                    final_desc.push(char);
                }
            }

            json.pop();
            
            let mut string = String::from("\"name\":\"{}\",", self.name);
            for field in &self.fields {
                if !field.is_empty() && field.len() > 0u32 as usize { // Only include non-empty fields
                    string.push_str(&format!("\"{{}}\",\n{}", field));
                } else {
                    string.push("\"", "\n");
                }
            }

            json.pop();

            let mut final = String::from("\"name\":\"{}\",") + self.name;
            
            for (i, f) in &self.fields.iter() {
                if !f.is_empty() && f.len() > 0u32 as usize {
                    // Skip empty fields to avoid cluttering JSON structure unnecessarily.
                    final.push_str(&format!("
