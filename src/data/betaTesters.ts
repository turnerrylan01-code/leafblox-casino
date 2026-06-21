// Add wallet addresses here to give users beta tester tag
// Format: "wallet_address" (full Solana wallet address)
export const BETA_TESTERS: string[] = [
  // Add beta tester wallet addresses below
  // "example_wallet_address_1",
  // "example_wallet_address_2",
];

export function isBetaTester(walletAddress: string): boolean {
  return BETA_TESTERS.includes(walletAddress);
}
