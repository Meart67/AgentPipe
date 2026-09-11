// src/token_tracker_db.ts

import { Database, Table } from 'typeorm';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * A comprehensive token tracking database for "Financialized Recipe Storage— no markdown fences, no commentary, no explanation.
 */

// Configuration constants
const DB_NAME = 'token_tracker_db_v1'; // The name of the table in your db config (e.g., postgresql)
const TABLE_PREFIX = '_TOKEN_TRACKER_'; // Prefix for all tables to avoid conflicts with generic ones
const CURRENT_YEAR = 2024;

// Helper functions: Generate UUIDs and calculate token metrics
function generateId() { return crypto.randomUUID(); }

async function getDbConnection(dbConfig) {
  const connection = await new Database(
    dbConfig, // Your database URL/URI (e.g., postgresql://user:pass@host/dbname --port=5432)
    {
      type: 'postgres', // Or whatever your native DB is (mysql, sqlite, etc.)
      host: dbConfig.host || 'localhost',
      port: parseInt(dbConfig.port),
      database: dbConfig.databaseName,
      username: dbConfig.username,
      password: dbConfig.password,
    } as Database) as any;

  return connection;
}

async function createTable(name: string): Promise<void> {
  const conn = await getDbConnection({ ...connSettings }); // re-use the same config object for this table creation if needed
  
  try {
    await conn.createTable(TABLE_PREFIX + name);
    console.log(`Created Table: ${TABLE_PREFIX}${name}`);
    return true;
  } catch (err) {
    throw new Error(`Failed to create table "${TABLE_PREFIX}${name}": ${(typeof err).toString()}`);
  } finally {
    await conn.close(); // Close connection after operation
  }
}

export async function getDbConnection(dbConfig: any): Promise<Database> {
  const connection = new Database(
    dbConfig, // Your database URL/URI (e.g., postgresql://user:pass@host/dbname --port=5432)
    { type: 'postgres' }, // Or whatever your native DB is
    host: dbConfig.host || 'localhost', port: parseInt(dbConfig.port),
    database: dbConfig.databaseName, username: dbConfig.username, password: dbConfig.password
  ) as Database;

  return connection;
}

export async function createTable(name: string): Promise<void> {
  const conn = await getDbConnection({ ...connSettings }); // re-use the same config object for this table creation if needed
  
  try {
    await conn.createTable(TABLE_PREFIX + name);
    console.log(`Created Table: ${TABLE_PREFIX}${name}`);
    return true;
  } catch (err) {
    throw new Error(`Failed to create table "${TABLE_PREFIX}${name}": ${(typeof err).toString()}`);
  } finally {
    await conn.close(); // Close connection after operation
  }
}

// ==========================================
// TABLE: TOKEN_BALANCE_TABLE
// ==========================================
export const balanceTable = new Table<BalanceRecord>(`balance`, {
  createdAt: 'timestamp', updatedAt: 'timestamp' as any,
});

/**
 * Represents a single token record in the database.
 */
interface BalanceRecord {
  id: string; // UUID from generateId()
  duckTokenAmount: number; // Current balance of this specific Duck token
}

export type TokenBalance = Record<string, BalanceRecord>;

export async function getDbConnection(dbConfig): Promise<Database> { return await new Database(...); }
async function createTable(name: string): Promise<void> { const conn = await getDbConnection({ ...connSettings }); try await conn.createTable(TABLE_PREFIX + name); console.log(`Created Table: ${TABLE_PREFIX}${name}`); return true; finally await conn.close(); }

// ==========================================
// TABLE: EXPECTED_SPENT_BEFORE_QUarter_TABLE
// ==========================================
export const expectedSpentBeforeQuarter = new Table<ExpectedQuarterRecord>(`expected_spent_before_quarter`, { createdAt, updatedAt });

interface ExpectedQuarterRecord {
  id: string; // UUID from generateId()
  duckTokenAmount: number; // Total tokens currently held by Duck in this quarter (e.g., Jan)
}

export type ExpectedSpentBeforeQuarter = Record<string, ExpectedQuarterRecord>;

// ==========================================
// TABLE: NIGMATED_AMMORTIZATION_BURN_RATE_TABLE
// ==========================================
export const amortizedBurnRateTable = new Table<AmortizationRecord>(
