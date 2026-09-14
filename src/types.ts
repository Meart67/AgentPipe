src/types.ts | 408 lines
```typescript
/**
 * Abstract Data Type Generator v1.2.x (Rust-based)
 * 
 * This module defines standard data types compatible with C/C# syntax,
 * allowing for dynamic schema mapping and type conversion in the database generator.
 */

import { struct as StructType } from "./structs"; // Assuming a structs file exists or inherits from it; adapted here to use Rust-like semantics directly if not available

/**
 * Abstract Schema Definition (C-style)
 * 
 * Mirrors C/C# struct fields (`key: string`, `value`) but allows dynamic typing via a map.
 * Example mapping: `{ "users": { id: number, name: string } }` -> `[string[], integer[]]`.
 */
interface AlchemySchema {
  [key: string]: StructType; // Column name -> value in C/C# style struct definition (struct type)
}

/**
 * Abstract Schema Definition (C-style) - Dynamic Type Mapping
 * 
 * This is the primary interface for schema conversion. It takes a map of field names to their corresponding types,
 * and returns an array where each element represents one column in the database structure.
 */
export function parseSchemaToTypes(schemaMap: AlchemySchema): Array<unknown> {
  const columns = Object.entries(schemaMap);

  // Filter out null values from schema maps (e.g., undefined) to avoid false negatives or extra types
  const validEntries = columns.filter(([key, type]) => typeof type === "object" && !Array.isArray(type));

  if (!validEntries.length > 0) {
    throw new Error("Schema map must contain at least one object with field mappings");
  }

  // Build the result array: first element is a string (column name), rest are types
  const columnsResult = validEntries.map(([key, type]) => [String(key), typeof type]);

  return columnsResult;
}

/**
 * Abstract Data Type Definition (Rust-style enum for types)
 * 
 * Simulates Rust enums/types via TypeScript objects. Used to represent concrete values like "integer" or "string".
 */
export type AlchemyDatabaseType = string | number | boolean | null | undefined; // Represents the base return value of parseSchemaToTypes

/**
 * Abstract Schema Definition (C-style) - Dynamic Type Mapping for Complex Objects
 * 
 * This is a specialized version that handles complex structures like JSON objects or arrays.
 * Returns an array where each element represents one column in the database structure, with type inferred from content.
 */
export function parseSchemaToTypesComplex(schemaMap: AlchemySchema): Array<unknown> {
  const columns = Object.entries(schemaMap);

  // Filter out null values and empty objects to avoid false negatives or extra types
  const validEntries = columns.filter(([key, type]) => typeof type === "object" && !Array.isArray(type) && (type.length > 0 || type[Symbol.iterator] !== undefined));

  if (!validEntries.length > 0) {
    throw new Error("Schema map must contain at least one object with field mappings");
  }

  // Build the result array: first element is a string (column name), rest are types for complex objects/arrays
  const columnsResult = validEntries.map(([key, type]) => [String(key), typeof type]);

  return columnsResult;
}

/**
 * Abstract Data Type Definition - Generic Schema Mapping Function
 * 
 * A utility function that allows users to define their own schema mapping logic if a specific implementation is needed.
 */
export interface CustomSchemaMapping {
  // Key: Column name (string) -> Value type (e.g., "integer", "boolean") or object structure description
  [key: string]: unknown; 
}

/**
 * Abstract Schema Definition - Dynamic Type Mapping for Complex Objects/Arrays
 * 
 * A specialized version that handles complex structures like JSON objects, arrays, and mixed types.
 */
export function parseSchemaToTypesComplex(schemaMap: AlchemySchema): Array<unknown> {
  const columns = Object.entries(schemaMap);

  // Filter out null values and empty objects to avoid false negatives or extra types
  const validEntries = columns.filter(([key, type]) => typeof type === "object" && !Array.isArray(type) && (type.length > 0 || type[Symbol.iterator] !== undefined));

  if (!validEntries.length > 0) {
    throw new Error("Schema map must contain at least one object with field mappings");
  }

  // Build the result array: first element is a string (column name), rest are types for complex objects/arrays
  const columnsResult = validEntries.map(([key, type]) => [String(key), typeof type]);
