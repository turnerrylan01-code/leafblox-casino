import minesImage from '../assets/games/mines.png';
import latinaTowerImage from '../assets/games/latina-tower.png';
import coinflipImage from '../assets/games/coinflip.png';
import crashImage from '../assets/games/crash.png';

export type GameId =
  | 'mines'
  | 'latina-tower'
  | 'coinflip'
  | 'crash';

export type GamePnLKey = GameId;

export interface GameDefinition {
  id: GameId;
  name: string;
  path: string;
  soon: boolean;
  previewMultiplier?: string;
  previewLabel?: string;
  image?: string;
}

export const GAMES: GameDefinition[] = [
  { id: 'mines', name: 'Mines', path: '/mines', soon: false, previewMultiplier: '9000.0x', previewLabel: 'MAX MULTIPLIER', image: minesImage },
  { id: 'latina-tower', name: 'Latina Tower', path: '/latina-tower', soon: false, previewMultiplier: '500.0x', previewLabel: 'MAX MULTIPLIER', image: latinaTowerImage },
  { id: 'coinflip', name: 'Coinflip', path: '/coinflip', soon: false, previewMultiplier: '2.0x', previewLabel: 'POT MULTIPLIER', image: coinflipImage },
  { id: 'crash', name: 'Crash', path: '/crash', soon: false, previewMultiplier: '∞', previewLabel: 'MAX MULTIPLIER', image: crashImage },
];

export const GAME_PNL_LABELS: Record<GamePnLKey, string> = {
  mines: 'Total Mines PnL',
  'latina-tower': 'Total Latina Tower PnL',
  coinflip: 'Coinflip PnL',
  crash: 'Total Crash PnL',
};

export function getGameByPath(path: string): GameDefinition | undefined {
  return GAMES.find(g => g.path === path);
}

export function getGameById(id: GameId): GameDefinition | undefined {
  return GAMES.find(g => g.id === id);
}
