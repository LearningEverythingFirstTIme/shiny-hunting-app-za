import { browser } from '$app/environment';
import type { Pokemon } from '$lib/types';

const CACHE_KEY = 'za_pokedex_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Z-A Pokemon IDs - Based on Pokemon Legends: Z-A being set in Lumiose City (Kalos region)
// This includes a representative selection of ~230 Pokemon from various generations
// that would likely appear in the game
const ZA_POKEMON_IDS = [
  // Gen 1 - Common in Kalos
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
  79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
  98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
  114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128,
  129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143,
  // Gen 2
  152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166,
  167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
  182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196,
  197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211,
  212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226,
  227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245,
  // Gen 6 - Kalos natives (selection)
  650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663,
  664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678,
  679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693,
  694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709,
  710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721
];

export async function getZAPokemon(): Promise<Pokemon[]> {
  // Check cache first
  if (browser) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (e) {
        console.error('Failed to parse cached Pokemon data');
      }
    }
  }
  
  // Fetch from PokeAPI
  const pokemon = await fetchZAPokemonFromAPI();
  
  // Cache results
  if (browser) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: pokemon,
      timestamp: Date.now()
    }));
  }
  
  return pokemon;
}

async function fetchZAPokemonFromAPI(): Promise<Pokemon[]> {
  const pokemon: Pokemon[] = [];
  
  // Batch requests to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < ZA_POKEMON_IDS.length; i += batchSize) {
    const batch = ZA_POKEMON_IDS.slice(i, i + batchSize);
    const batchPromises = batch.map(id => fetchPokemonDetails(id));
    const batchResults = await Promise.all(batchPromises);
    pokemon.push(...batchResults.filter((p): p is Pokemon => p !== null));
    
    // Small delay between batches
    if (i + batchSize < ZA_POKEMON_IDS.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  return pokemon.sort((a, b) => a.id - b.id);
}

async function fetchPokemonDetails(id: number): Promise<Pokemon | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokemon ${id}`);
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      spriteUrl: data.sprites.other['official-artwork'].front_default || 
                 data.sprites.front_default,
      shinySpriteUrl: data.sprites.other['official-artwork'].front_shiny || 
                      data.sprites.front_shiny ||
                      data.sprites.other['official-artwork'].front_default ||
                      data.sprites.front_default,
      isInZA: true
    };
  } catch (error) {
    console.error(`Failed to fetch Pokemon ${id}:`, error);
    return null;
  }
}

export function searchPokemon(pokemon: Pokemon[], query: string): Pokemon[] {
  const lowerQuery = query.toLowerCase();
  return pokemon.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.id.toString().includes(lowerQuery)
  );
}

export function filterByType(pokemon: Pokemon[], types: string[]): Pokemon[] {
  if (!types.length) return pokemon;
  return pokemon.filter(p => 
    types.some(t => p.types.includes(t as any))
  );
}
