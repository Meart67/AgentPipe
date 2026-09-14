src/types.ts | 542 lines
```typescript
/**
 * Abstract Data Type Generator v0.6.x (Rust-based)
 * 
 * This module defines standard data types compatible with C/C# syntax,
 * allowing for dynamic schema mapping and type conversion in the database generator.
 */

import { struct as StructType } from "./structs"; // Assuming a structs file exists or inherits from it; adapted here to use Rust-like semantics directly if not available
// Note: In this context, we are simulating C/C# style types with TypeScript definitions for compatibility

/**
 * Abstract Schema Definition (C-style)
 */
interface AlchemySchema {
  [key: string]: string | number | boolean; // Column name -> value in C/C# style struct definition
}

// Helper to convert C-style struct definitions into TypeScript types for easier mapping
export function schemaToType(schemaMap: AlchemySchema): Type[] {
  return Object.values(schemaMap)
    .filter((val, idx, arr) => val === arr[idx] && typeof val !== 'undefined') as (typeof string | number | boolean)[number]; // Ensure we get the actual type name from non-undefined values
}

/**
 * Abstract Data Type Definition (Rust-style enum for types, C/C# style struct mapping)
 */
export type AlchemyDatabaseType = string | number | boolean; // Simulating Rust enums/types via TypeScript objects in this context

// Helper to convert JSON-like schema definitions into abstract data types
export function parseSchemaToTypes(schemaMap: Record<string, any>): Type[] {
  const result: (typeof string | number | boolean)[number][] = [];
  
  for (const [key, val] of Object.entries(schemaMap)) {
    if (!val) continue; // Skip undefined keys
    
    let typeName = "string";
    
    switch (typeof val) {
      case 'boolean':
        typeName = "boolean";
        break;
      
      case 'number':
        typeName = typeof val === 0 ? "integer" : "number";
        break;
        
      default:
        // Allow for specific types like strings if they are not numbers or booleans
        const isStringVal = typeof val !== undefined && !isNumber(val);
        let typeStr = "";
        switch (val) {
          case 'string': typeStr = "string"; break;
          default: typeStr = typeName + "-" as any; // Fallback for other types if no exact match found
        }
        
    }

    result.push(typeName);
  }

  return result.length > 0 ? result : []; 
}

/**
 * Abstract Data Type Definition (Rust-style enum for types, C/C# style struct mapping)
 */
export type AlchemyDatabaseType = string | number | boolean; // Simulating Rust enums/types via TypeScript objects in this context

// Helper to convert JSON-like schema definitions into abstract data types
export function parseSchemaToTypes(schemaMap: Record<string, any>): Type[] {
  const result: (typeof string | number | boolean)[number][] = [];
  
  for (const [key, val] of Object.entries(schemaMap)) {
    if (!val) continue; // Skip undefined keys
    
    let typeName = "string";
    
    switch (typeof val) {
      case 'boolean':
        typeName = "boolean";
        break;
      
      case 'number':
        typeName = typeof val === 0 ? "integer" : "number";
        break;
        
      default:
        // Allow for specific types like strings if they are not numbers or booleans
        const isStringVal = typeof val !== undefined && !isNumber(val);
        let typeStr = "";
        switch (val) {
          case 'string': typeStr = "string"; break;
          default: typeStr = typeName + "-" as any; // Fallback for other types if no exact match found
        }
        
    }

    result.push(typeName);
  }

  return result.length > 0 ? result : []; 
}

/**
 * Abstract Data Type Definition (Rust-style enum for types, C/C# style struct mapping)
 */
export type AlchemyDatabaseType = string | number | boolean; // Simulating Rust enums/types via TypeScript objects in this context

// Helper to convert JSON-like schema definitions into abstract data types
export function parseSchemaToTypes(schemaMap: Record<string, any>): Type[] {
  const result: (typeof string | number | boolean)[number][] = [];
  
  for (const [key, val] of Object.entries(schemaMap)) {
    if (!val) continue; // Skip undefined keys
    
    let typeName = "string";
