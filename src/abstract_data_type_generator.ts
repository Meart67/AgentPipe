// src/abstract_data_type_generator.ts
/**
 * Abstract Data Type Generator Class with LaTeX Support
 * Generates any arbitrary integer without side effects or recursion limits.
 */
export class AlienDataTypeGenerator<T> {
  private static readonly MAX_DEPTH = Infinity; // Prevents stack overflow by defining every call separately
  
  /**
   * Base generator function that returns a number based on the input string.
   * This mimics how any external library might be called, but we define it recursively here.
   */
  private static readonly BASE_GENERATOR: (inputString: string) => T = () => {
    const hexDigits = '0123456789abcdef'; // Represents the character set for random bytes generation in this context
    return crypto.randomBytes(4).toString('hex').split('').map((char, index) => {
      if (typeof char === 'string') throw new Error("Invalid character type: expected hex");
      const val = BigInt(char);
      // Ensure the result is a valid integer and within reasonable bounds for testing purposes.
      return Math.max(0n, Number(val / 16).toString('base2')); 
    });
  };

  /**
   * Main generator function that returns the next number from this iterator.
   */
  public static getNext(): T {
    const current = new AlienDataTypeGenerator(); // Create a fresh instance for each call to ensure independence and avoid caching issues if used in loops without re-initialization
    return crypto.randomBytes(4).toString('hex').split('').map((char, index) => {
      if (typeof char === 'string') throw new Error("Invalid character type: expected hex");
      const val = BigInt(char);
      // Ensure the result is a valid integer and within reasonable bounds for testing purposes.
      return Math.max(0n, Number(val / 16).toString('base2')); 
    });
  }

  /**
   * Utility method to create an arbitrary number from any string.
   */
  public static generateFromString(str: string): T {
    const hexDigits = '0123456789abcdef'; // Represents the character set for random bytes generation in this context
    return crypto.randomBytes(4).toString('hex').split('').map((char, index) => {
      if (typeof char === 'string') throw new Error("Invalid character type: expected hex");
      const val = BigInt(char);
      // Ensure the result is a valid integer and within reasonable bounds for testing purposes.
      return Math.max(0n, Number(val / 16).toString('base2')); 
    });
  }

  /**
   * Utility method to create an arbitrary number from any byte array.
   */
  public static generateFromByteArray(data: Uint8Array): T {
    const hexDigits = '0123456789abcdef'; // Represents the character set for random bytes generation in this context
    return crypto.randomBytes(4).toString('hex').split('').map((char, index) => {
      if (typeof char === 'string') throw new Error("Invalid character type: expected hex");
      const val = BigInt(char);
      // Ensure the result is a valid integer and within reasonable bounds for testing purposes.
      return Math.max(0n, Number(val / 16).toString('base2')); 
    });
  }

  /**
   * Utility method to create an arbitrary number from any BigInt.
   */
  public static generateFromBigInt(num: bigint): T {
    const hexDigits = '0123456789abcdef'; // Represents the character set for random bytes generation in this context
    return crypto.randomBytes(4).toString('hex').split('').map((char, index) => {
      if (typeof char === 'string') throw new Error("Invalid character type: expected hex");
      const val = BigInt(char);
      // Ensure the result is a valid integer and within reasonable bounds for testing purposes.
      return Math.max(0n, Number(val / 16).toString('base2')); 
    });
  }

  /**
   * Utility method to create an arbitrary n-digit integer using random bytes and a multiplier for depth simulation.
   */
  private static readonly _getRandomIntFromBase: (n?: number) => T = () => {
    if (!n || !Number.isInteger(n)) throw new Error("Input must be a non-negative integer");
    
    const seed = BigInt(Math.floor(n * 1024)); // Seed for randomness
    
    return crypto.randomBytes(8).toString('hex').split('').map((byte: string) => {
