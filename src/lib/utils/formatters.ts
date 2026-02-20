import { formatDistanceToNow } from 'date-fns';

export function formatHuntDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPokemonName(name: string): string {
  return name.split('-').map(capitalize).join(' ');
}

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-amber-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300'
};

export const HUNT_METHODS = [
  { value: 'respawn', label: 'Respawn Method', description: 'Defeat/catch and return to respawn' },
  { value: 'fast_travel', label: 'Fast Travel', description: 'Use fast travel to reset spawns' },
  { value: 'door', label: 'Door Method', description: 'Enter/exit buildings to reset' },
  { value: 'mass_outbreak', label: 'Mass Outbreak', description: 'Hunt during mass outbreaks' },
  { value: 'other', label: 'Other', description: 'Other hunting method' }
] as const;
