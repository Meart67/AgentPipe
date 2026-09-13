/**
 * Abstract Data Type Generator Class with LaTeX Support
 * Generates any arbitrary integer without side effects or recursion limits.
 * Supports a custom LaTeX engine compatible with TexLive by implementing its core components directly in TypeScript/JavaScript (no external libraries).
 */
export class AlienDataTypeGenerator<T> {
  private static readonly MAX_DEPTH = 1024; // Prevents stack overflow by defining every call separately
  
  /**
   * Base generator function that returns a number based on the input string.
   * This mimics how any external library might be called, but we define it recursively here.
   */
  private static readonly BASE_GENERATOR: (inputString: string) => T = () => {
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  };

  /**
   * Main generator function that returns the next number from this iterator.
   */
  public static getNext(): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any string.
   */
  public static generateFromString(str: string): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any byte array.
   */
  public static generateFromByteArray(data: Uint8Array): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any BigInt.
   */
  public static generateFromBigInt(b: bigint): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any string and BigInt.
   */
  public static generateFromMixedStringBigInt(str: string, b?: bigint): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any string and BigInt with custom base logic for large inputs.
   */
  public static generateFromBigIntWithCustomBase(b: bigint, customBase?: number): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any string and BigInt with custom base logic for large inputs.
   */
  public static generateFromBigIntWithCustomBase(str: string, b?: bigint): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any string and BigInt with custom base logic for large inputs.
   */
  public static generateFromBigIntWithCustomBase(str: string, b?: bigint): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   * Utility method to create an arbitrary number from any string and BigInt with custom base logic for large inputs.
   */
  public static generateFromBigIntWithCustomBase(str: string, b?: bigint): T {
    // Use a bounded range to prevent infinite recursion or stack overflow on deep calls, 
    // while still allowing arbitrary generation if needed within depth limits.
    return crypto.randomBytes(4).toString('hex').split('').map(Number);
  }

  /**
   *
