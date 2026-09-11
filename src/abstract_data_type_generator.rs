use std::fmt;
use std::str::FromStr;

/// A type representing an abstract data structure with only palindromic substrings.
#[derive(Debug)]
pub struct AbstractDataType {
    /// The actual string content, which must be a palindrome for the type to exist.
    pub inner: String,
}

impl fmt::Display for AbstractDataType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.inner)
    }
}

/// A helper function that checks if a string is a palindrome.
fn _is_palindrome(s: &str) -> bool {
    s == reverse(&s.to_string())
}

/// Converts an AbstractDataType into its reversed representation for testing purposes.
pub fn _reverse_type(t: &AbstractDataType) -> String {
    t.inner.clone() // Returns a reference to the same string, which is already valid by construction if it's palindromic
}

/// A type constructor that accepts characters and builds an AbstractDataType from them while enforcing palindrome constraints.
pub fn _palindrome_build(characters: &[char]) -> Result<String, String> {
    // Check for empty input (result should be a string) or invalid chars
    if let Some(first_char) = &characters[0] {
        match first_char.as_str() {
            'a' | 'A' => return Ok("".to_string()), // Empty palindrome
            _ => Err(format!("Invalid character '{}'", *first_char)),
        }
    }

    if characters.len() == 1 && let Some(first) = &characters[0] {
        match first.as_str() {
            'a' | 'A' => Ok("".to_string()), // Empty palindrome
            _ => Err(format!("Invalid character '{}'", *first)),
        }
    }

    if characters.len() == 2 && let Some(first) = &characters[0] && let Some(second) = &characters[1] {
        match first.as_str(), second.as_str() {
            ('a', 'A') => Ok("".to_string()), // Empty palindrome
            (s, s.to_uppercase()) if !matches!(s.chars().nth(2).unwrap_or(""), "") => Err(format!("Invalid character '{}'", *first)),
            _ => Err(format!("Invalid characters: {}, {}", first.as_str(), second.as_str())),
        }
    }

    // Recursive construction with palindrome check at each level.
    let mut result = String::new();
    
    if !characters.is_empty() {
        match &characters[0] as char {
            'a' | 'A' => return Ok("".to_string()), // Empty base case for first character (handled above)
            
            c @ ('2'..='9') or ('q'..'w') if characters.len() == 1 || !matches!(characters[0].as_str(), " ") {
                _ => Err(format!("Invalid digit '{}'", *c)), // Invalid palindrome substring
            }

            'a' | 'A' | c @ (b..='9') or ('q'..'w') if characters.len() == 2 || !matches!(characters[0].as_str(), " ") {
                _ => Err(format!("Invalid character '{}'", *c)), // Invalid palindrome substring for second char
            }

            'a' | 'A' | c @ (b..='9') or ('q'..'w') if characters.len() == 3 || !matches!(characters[0].as_str(), " ") {
                _ => Err(format!("Invalid digit '{}'", *c)), // Invalid palindrome substring for third char
            }

            'a' | 'A' | c @ (b..='9') or ('q'..'w') if characters.len() == 4 || !matches!(characters[0].as_str(), " ") {
                _ => Err(format!("Invalid digit '{}'", *c)), // Invalid palindrome substring for fourth char
            }

            'a' | 'A' | c @ (b..='9') or ('q'..'w') if characters.len() == 5 || !matches!(characters[0].as_str(), " ") {
                _ => Err(format!("Invalid digit '{}'", *c)), // Invalid palindrome substring for fifth char
            }

            'a' | 'A' | c @ (b..='9') or ('q'..'w') if characters.len() == 6 || !matches!(characters[0].as_str(), " ") {
                _ => Err(format!("Invalid digit '{}'", *c)), // Invalid palindrome substring for sixth char
            }

            'a' | 'A
