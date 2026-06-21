import crypto from 'crypto';

export interface ProvablyFairResult {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  result: number;
  hash: string;
}

export class ProvablyFair {
  /**
   * Generate a random server seed
   */
  static generateServerSeed(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate a hash of the server seed (to be shown to player before game)
   */
  static hashServerSeed(serverSeed: string): string {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
  }

  /**
   * Generate a random client seed (player can provide their own)
   */
  static generateClientSeed(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate a provably fair result using server seed, client seed, and nonce
   */
  static generateResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    max: number
  ): ProvablyFairResult {
    const combinedSeed = `${serverSeed}-${clientSeed}-${nonce}`;
    const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
    
    // Convert hash to number between 0 and max
    const hashInt = BigInt('0x' + hash);
    const result = Number(hashInt % BigInt(max));
    
    return {
      serverSeed,
      clientSeed,
      nonce,
      result,
      hash
    };
  }

  /**
   * Verify a provably fair result
   */
  static verifyResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    expectedResult: number,
    max: number
  ): boolean {
    const result = this.generateResult(serverSeed, clientSeed, nonce, max);
    return result.result === expectedResult;
  }

  /**
   * Generate multiple results for games that need multiple outcomes (like Mines)
   */
  static generateMultipleResults(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    count: number,
    max: number
  ): number[] {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      const result = this.generateResult(serverSeed, clientSeed, nonce + i, max);
      results.push(result.result);
    }
    return results;
  }

  /**
   * Calculate Mines multiplier based on mines count and revealed tiles
   * Stake-style formula: multiply by (remaining tiles ÷ remaining safe tiles) at each step
   * Raw formula: product from i=0 to g-1 of (25-i)/(25-m-i)
   * 1% house edge applied at each step (incremental)
   */
  static calculateMinesMultiplier(mines: number, revealed: number): number {
    const totalTiles = 25;
    
    if (revealed === 0) return 1.0;
    
    // Prevent division by zero
    if (revealed >= totalTiles - mines) return 0;
    
    // Stake-style multiplier calculation with incremental house edge
    let multiplier = 1.0;
    const houseEdge = 0.01;
    
    for (let i = 0; i < revealed; i++) {
      const denominator = totalTiles - mines - i;
      if (denominator <= 0) return 0;
      multiplier *= (totalTiles - i) / denominator;
      // Apply house edge incrementally at each step
      multiplier *= (1 - houseEdge);
    }
    
    return multiplier;
  }

  /**
   * Calculate Chicks multiplier based on row and difficulty
   * Easy: 19x max (8 rows), Medium: 100x max (8 rows), Hard: 1000x max (8 rows)
   */
  static calculateChicksMultiplier(row: number, difficulty: 'easy' | 'medium' | 'hard'): number {
    const baseMultipliers = {
      easy: [1.13, 1.28, 1.45, 1.65, 1.88, 2.14, 2.44, 2.78, 3.16, 3.60, 4.10, 4.67, 5.32, 6.06, 6.90, 7.86, 8.95, 10.19, 11.62, 13.25, 15.10, 17.20, 19.0],
      medium: [1.25, 1.56, 1.95, 2.44, 3.05, 3.81, 4.76, 5.95, 7.44, 9.30, 11.63, 14.53, 18.17, 22.71, 28.39, 35.49, 44.36, 55.45, 69.31, 86.64, 100.0],
      hard: [1.43, 2.04, 2.92, 4.17, 5.96, 8.51, 12.16, 17.37, 24.82, 35.46, 50.66, 72.37, 103.53, 148.04, 211.72, 302.60, 432.47, 618.39, 884.41, 1000.0]
    };

    const multipliers = baseMultipliers[difficulty];
    return multipliers[row - 1] || multipliers[multipliers.length - 1];
  }

  /**
   * Calculate Latina Tower multiplier based on floor and difficulty
   * Easy: 10x top (7 floors, 4 buttons, 1 witch), Medium: 32.5x top (7 floors, 3 buttons, 1 witch), Hard: 428x top (7 floors, 2 buttons, 1 witch)
   */
  static calculateLatinaTowerMultiplier(floor: number, difficulty: 'easy' | 'medium' | 'hard'): number {
    const baseMultipliers = {
      easy: [1.33, 1.78, 2.37, 3.16, 4.22, 5.63, 7.50, 10.0],
      medium: [1.50, 2.25, 3.38, 5.06, 7.59, 11.39, 17.09, 25.63, 32.5],
      hard: [2.00, 4.00, 8.00, 16.00, 32.00, 64.00, 128.00, 256.00, 428.0]
    };

    const multipliers = baseMultipliers[difficulty];
    return multipliers[floor - 1] || multipliers[multipliers.length - 1];
  }
}
