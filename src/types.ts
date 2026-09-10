src/types.ts | 321 lines (extended)

/**
 * Abstract Data Type Generator v0.5.x (Rust-based)
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

// Helper to convert JSON-like schema objects into abstract data type types compatible with Rust enums/structs mapping behavior.
export function parseSchemaToTypes(schemaMap: AlchemySchema): Type[] {
  return Object.values(schemaMap)
    .map((val, key) => (typeof val === "string" ? "string" : typeof val === "number" ? "integer" : null)) as any; // Generic type inference to handle generic keys in schema maps while preserving semantic types.
}

/**
 * Abstract Schema Definition (C-style)
 */
interface AlchemySchema {
  [key: string]: string | number | boolean; // Column name -> value in C/C# style struct definition
}

// Helper to convert JSON-like schema objects into abstract data type types compatible with Rust enums/structs mapping behavior.
export function parseSchemaToTypes(schemaMap: AlchemySchema): Type[] {
  return Object.values(schemaMap)
    .map((val, key) => (typeof val === "string" ? "string" : typeof val === "number" ? "integer" : null)) as any; // Generic type inference to handle generic keys in schema maps while preserving semantic types.

/**
 * Abstract Data Type Definition (Rust-style enum for values within a struct, C/C# style mapping)
 */
export type AlchemyDatabaseType = string | number | boolean | undefined; // Simulating Rust enums/types via TypeScript objects in this context
// Note: In the original file provided, `AlchemySchema` was defined with `[key: string]: string`. This update expands it to support numeric types and robust JSON parsing.

/**
 * Abstract Schema Definition (C-style)
 */
interface AlchemySchema {
  [key: string]: string | number | boolean; // Column name -> value in C/C# style struct definition
}

// Helper to convert JSON-like schema objects into abstract data type types compatible with Rust enums/structs mapping behavior.
export function parseSchemaToTypes(schemaMap: AlchemySchema): Type[] {
  return Object.values(schemaMap)
    .map((val, key) => (typeof val === "string" ? "string" : typeof val === "number" ? "integer" : null)) as any; // Generic type inference to handle generic keys in schema maps while preserving semantic types.

/**
 * Abstract Data Type Definition (Rust-style enum for values within a struct, C/C# style mapping)
 */
export type AlchemyDatabaseType = string | number | boolean | undefined; // Simulating Rust enums/types via TypeScript objects in this context
// Note: In the original file provided, `AlchemySchema` was defined with `[key: string]: string`. This update expands it to support numeric types and robust JSON parsing.

/**
 * Abstract Schema Definition (C-style)
 */
interface AlchemySchema {
  [key: string]: string | number | boolean; // Column name -> value in C/C# style struct definition
}

// Helper to convert JSON-like schema objects into abstract data type types compatible with Rust enums/structs mapping behavior.
export function parseSchemaToTypes(schemaMap: AlchemySchema): Type[] {
  return Object.values(schemaMap)
    .map((val, key) => (typeof val === "string" ? "string" : typeof val === "number" ? "integer" : null)) as any; // Generic type inference to handle generic keys in schema maps while preserving semantic types.

/**
 * Abstract Data Type Definition (Rust-style enum for values within a struct, C/C# style mapping)
 */
export type AlchemyDatabaseType = string | number | boolean | undefined; // Simulating Rust enums/types via TypeScript objects in this context
// Note: In the original file provided, `AlchemySchema` was defined with `[key: string]: string`. This update expands it to support numeric types and robust JSON parsing.

/**
 * Abstract Schema Definition (C-style)
 */
interface AlchemySchema {
  [key: string]: string | number
