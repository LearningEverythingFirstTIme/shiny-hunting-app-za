export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultSpriteView: 'regular' | 'shiny';
  compactMode: boolean;
  theme: 'light' | 'dark' | 'system';
}

export type HuntMethod = 'respawn' | 'fast_travel' | 'door' | 'mass_outbreak' | 'other';
export type HuntStatus = 'active' | 'completed' | 'abandoned';

export interface Hunt {
  id: string;
  userId: string;
  pokemonId: number;
  pokemonName: string;
  spriteUrl: string;
  shinySpriteUrl: string;
  method: HuntMethod;
  status: HuntStatus;
  encounters: number;
  startedAt: Date;
  lastUpdated: Date;
  completedAt?: Date;
  durationMinutes: number;
  notes?: string;
  caught?: boolean;
}

export interface Shiny {
  id: string;
  userId: string;
  pokemonId: number;
  pokemonName: string;
  shinySpriteUrl: string;
  caughtAt: Date;
  method: HuntMethod;
  encounters: number;
  notes?: string;
  favorite: boolean;
  tags: string[];
  isAlpha?: boolean;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  spriteUrl: string;
  shinySpriteUrl: string;
  isInZA: boolean;
}

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface HuntTip {
  id: string;
  category: 'odds' | 'method' | 'strategy' | 'type' | 'efficiency' | 'pokemon';
  title: string;
  content: string;
  pokemonIds?: number[];
  order: number;
  icon?: string;
}

export interface HuntStats {
  totalActive: number;
  totalCompleted: number;
  totalAbandoned: number;
  totalEncounters: number;
  totalTimeMinutes: number;
  byMethod: Record<HuntMethod, number>;
  byType: Record<PokemonType, number>;
}
