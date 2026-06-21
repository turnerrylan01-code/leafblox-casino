export interface Tag {
  id: string;
  name: string;
  emoji: string;
  category: 'role' | 'wagered' | 'winner';
}

export const ALL_TAGS: Tag[] = [
  // Role tags
  { id: 'owner', name: 'Owner', emoji: '🔥', category: 'role' },
  { id: 'dev', name: 'Dev', emoji: '👨‍💻', category: 'role' },
  { id: 'beta_tester', name: 'Beta Tester', emoji: '🧪', category: 'role' },
  
  // Wagered tags
  { id: 'wagered_100', name: '100$ Wagered', emoji: '💰', category: 'wagered' },
  { id: 'wagered_1k', name: '1k Wagered', emoji: '💎', category: 'wagered' },
  { id: 'wagered_100k', name: '100k Wagered', emoji: '🏆', category: 'wagered' },
  { id: 'wagered_1m', name: '1M Wagered', emoji: '👑', category: 'wagered' },
  
  // Winner tags
  { id: 'winner_10_sol', name: '10 SOL Winner', emoji: '🎉', category: 'winner' },
];

export interface UserTags {
  walletAddress: string;
  email?: string;
  ownedTagIds: string[];
}

// Add wallet addresses and their tags here
export const USER_TAGS: UserTags[] = [
  {
    walletAddress: "G14ubwgBpfWnyHzU31U53KeUnw4M7J791Hrgg7G5TETo",
    ownedTagIds: ['owner']
  },
  {
    email: "turnerrylan01@gmail.com",
    ownedTagIds: ['owner', 'dev', 'beta_tester', 'wagered_100', 'wagered_1k', 'wagered_100k', 'wagered_1m', 'winner_10_sol']
  },
  // Add more users and their tags below:
  // {
  //   walletAddress: "another_wallet_address",
  //   ownedTagIds: ['dev', 'wagered_100', 'wagered_1k']
  // },
];

export function getUserTags(walletAddress: string, email?: string): string[] {
  const userTagData = USER_TAGS.find(u => u.walletAddress === walletAddress || (email && u.email === email));
  return userTagData?.ownedTagIds || [];
}

export function hasTag(walletAddress: string, tagId: string, email?: string): boolean {
  return getUserTags(walletAddress, email).includes(tagId);
}
