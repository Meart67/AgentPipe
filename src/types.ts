src/types.ts | 1054 lines (restructured from abstract_data_type_generator.js)

/**
 * Abstract Data Type Generator v2.3.x (Rust-based with C/C#-style struct mapping & JSON parsing support)
 * 
 * This module defines standard data types compatible with C/C++/C#/Java syntax, allowing for dynamic schema mapping and type conversion in the database generator.
 */

import { StructType } from "./structs"; // Assuming a structs file exists or inherits from it; adapted here to use Rust-like semantics directly if not available
// Note: In this context, we are simulating C/C# style types with TypeScript definitions for compatibility and JSON parsing support via native JS/TS modules

/**
 * Abstract Schema Definition (C-style)
 */
interface AlchemySchema {
  [key: string]: string; // Column name -> value in C/C++/Java style struct definition
}

// Helper to convert C-style struct definitions into TypeScript types for easier mapping
export function schemaToType(schemaMap: AlchemySchema): Type[] {
  return Object.values(schemaMap).map((val) => (typeof val === "string" ? "string" : typeof val === "number" ? "integer" : null));
}

/**
 * Abstract Data Type Definition (Rust-style enum for types, C/C# style struct mapping & JSON parsing support)
 */
export type AlchemyDatabaseType = string | number | boolean | undefined; // Simulating Rust enums/types via TypeScript objects in this context

// Helper to convert JSON-like schema definitions into abstract data types using native JS/TS logic (handles nulls, booleans, numbers without NaN issues for simplicity in specific contexts)
export function parseSchemaToTypes(schemaMap: Record<string, string>): Type[] {
  const parsed = Object.values(schemaMap).filter((val): val is number => typeof val === "number" || (typeof val !== 'undefined' && typeof val !== 'string') as any);
  
  // If we have a boolean field that isn't explicitly set to true/false, treat it as undefined/null for type safety in this context. 
  // In real production with JS/TS native modules, you would use explicit `true` or `false`.
  if (parsed.length === 0) {
    return [null]; // Return null array when no valid numeric fields found to avoid false positives from undefined/null handling
  }

  const typeMap: Record<string, string> = {};
  
  parsed.forEach((val): val is number => typeof val === "number" || (typeof val !== 'undefined' && typeof val !== 'string') as any) {
    if (!typeMap[val]) {
      // Handle boolean explicitly for clarity in this context to avoid relying on undefined/null semantics which can be brittle with complex logic
      typeMap[val] = true; 
    } else {
      const isNumber = (val: string | number): val is number => typeof val === "number";
      
      if (!isNumber(val)) {
        // Explicitly handle boolean flags to avoid false negatives from undefined/null handling in filter logic above
        typeMap[val] = true; 
      } else {
        const numVal: number = (val as string).toString();
        
        // If it's a non-boolean, non-number value that isn't explicitly set to 0 or 1, treat as undefined/null for this generator context
        if (!isNumber(val) && typeof val !== "number" && !("true" in typeMap[val] || false in typeMap[val])) {
          // This is a fallback: if the user has an explicit boolean field but it's not true/false (e.g., 0 or 1), treat as undefined/null to prevent runtime errors from non-numeric values like "null" strings being interpreted as booleans. 
          // In real production, you would use `Boolean(val)`.
        } else {
          typeMap[val] = numVal;
        }
      }
    }
  }

  return parsed.map((val): val is number => typeof val === "number" || (typeof val !== 'undefined' && typeof val !== 'string') as any); // Re-apply filter logic for consistency with previous versions but cleaner here
}

/**
 * Abstract Data Type Definition (Rust-style enum for types, C/C# style struct mapping & JSON parsing support)
 */
export type AlchemyDatabaseType = string | number | boolean | undefined; 

// Helper to convert JSON-like schema definitions into abstract data types using native JS/TS logic (handles nulls, booleans, numbers without NaN issues for simplicity in specific contexts)
export function parseSchemaToTypes(schemaMap: Record<string, string>): Type[] {
  const parsed = Object.values(schemaMap).filter((val
