// Add wallet addresses here to give users fire emoji and owner tag in chat
// Format: "wallet_address" (full Solana wallet address)
export const SPECIAL_USERS: string[] = [
"G14ubwgBpfWnyHzU31U53KeUnw4M7J791Hrgg7G5TETo",
  // Add more wallet addresses below
];

export function isSpecialUser(walletAddress: string): boolean {
  return SPECIAL_USERS.includes(walletAddress);
}
