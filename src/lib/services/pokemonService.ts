import { browser } from '$app/environment';
import type { Pokemon } from '$lib/types';

const CACHE_KEY = 'za_pokedex_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Z-A Pokemon - Pokemon Legends: Z-A Pokedex (230 Pokemon)
// Based on the official list from IGN
const ZA_POKEMON_LIST: { id: number; name: string }[] = [
  { id: 152, name: 'chikorita' },
  { id: 153, name: 'bayleef' },
  { id: 154, name: 'meganium' },
  { id: 498, name: 'tepig' },
  { id: 499, name: 'pignite' },
  { id: 500, name: 'emboar' },
  { id: 158, name: 'totodile' },
  { id: 159, name: 'croconaw' },
  { id: 160, name: 'feraligatr' },
  { id: 661, name: 'fletchling' },
  { id: 662, name: 'fletchinder' },
  { id: 663, name: 'talonflame' },
  { id: 659, name: 'bunnelby' },
  { id: 660, name: 'diggersby' },
  { id: 664, name: 'scatterbug' },
  { id: 665, name: 'spewpa' },
  { id: 666, name: 'vivillon' },
  { id: 13, name: 'weedle' },
  { id: 14, name: 'kakuna' },
  { id: 15, name: 'beedrill' },
  { id: 16, name: 'pidgey' },
  { id: 17, name: 'pidgeotto' },
  { id: 18, name: 'pidgeot' },
  { id: 179, name: 'mareep' },
  { id: 180, name: 'flaaffy' },
  { id: 181, name: 'ampharos' },
  { id: 504, name: 'patrat' },
  { id: 505, name: 'watchog' },
  { id: 406, name: 'budew' },
  { id: 315, name: 'roselia' },
  { id: 407, name: 'roserade' },
  { id: 129, name: 'magikarp' },
  { id: 130, name: 'gyarados' },
  { id: 688, name: 'binacle' },
  { id: 689, name: 'barbaracle' },
  { id: 120, name: 'staryu' },
  { id: 121, name: 'starmie' },
  { id: 669, name: 'flabebe' },
  { id: 670, name: 'floette' },
  { id: 671, name: 'florges' },
  { id: 672, name: 'skiddo' },
  { id: 673, name: 'gogoat' },
  { id: 677, name: 'espurr' },
  { id: 678, name: 'meowstic' },
  { id: 667, name: 'litleo' },
  { id: 668, name: 'pyroar' },
  { id: 674, name: 'pancham' },
  { id: 675, name: 'pangoro' },
  { id: 568, name: 'trubbish' },
  { id: 569, name: 'garbodor' },
  { id: 702, name: 'dedenne' },
  { id: 172, name: 'pichu' },
  { id: 25, name: 'pikachu' },
  { id: 26, name: 'raichu' },
  { id: 173, name: 'cleffa' },
  { id: 35, name: 'clefairy' },
  { id: 36, name: 'clefable' },
  { id: 167, name: 'spinarak' },
  { id: 168, name: 'ariados' },
  { id: 23, name: 'ekans' },
  { id: 24, name: 'arbok' },
  { id: 63, name: 'abra' },
  { id: 64, name: 'kadabra' },
  { id: 65, name: 'alakazam' },
  { id: 92, name: 'gastly' },
  { id: 93, name: 'haunter' },
  { id: 94, name: 'gengar' },
  { id: 543, name: 'venipede' },
  { id: 544, name: 'whirlipede' },
  { id: 545, name: 'scolipede' },
  { id: 679, name: 'honedge' },
  { id: 680, name: 'doublade' },
  { id: 681, name: 'aegislash' },
  { id: 69, name: 'bellsprout' },
  { id: 70, name: 'weepinbell' },
  { id: 71, name: 'victreebel' },
  { id: 511, name: 'pansage' },
  { id: 512, name: 'simisage' },
  { id: 513, name: 'pansear' },
  { id: 514, name: 'simisear' },
  { id: 515, name: 'panpour' },
  { id: 516, name: 'simipour' },
  { id: 307, name: 'meditite' },
  { id: 308, name: 'medicham' },
  { id: 309, name: 'electrike' },
  { id: 310, name: 'manectric' },
  { id: 280, name: 'ralts' },
  { id: 281, name: 'kirlia' },
  { id: 282, name: 'gardevoir' },
  { id: 475, name: 'gallade' },
  { id: 228, name: 'houndour' },
  { id: 229, name: 'houndoom' },
  { id: 333, name: 'swablu' },
  { id: 334, name: 'altaria' },
  { id: 531, name: 'audino' },
  { id: 682, name: 'spritzee' },
  { id: 683, name: 'aromatisse' },
  { id: 684, name: 'swirlix' },
  { id: 685, name: 'slurpuff' },
  { id: 133, name: 'eevee' },
  { id: 134, name: 'vaporeon' },
  { id: 135, name: 'jolteon' },
  { id: 136, name: 'flareon' },
  { id: 196, name: 'espeon' },
  { id: 197, name: 'umbreon' },
  { id: 470, name: 'leafeon' },
  { id: 471, name: 'glaceon' },
  { id: 700, name: 'sylveon' },
  { id: 427, name: 'buneary' },
  { id: 428, name: 'lopunny' },
  { id: 353, name: 'shuppet' },
  { id: 354, name: 'banette' },
  { id: 582, name: 'vanillite' },
  { id: 583, name: 'vanillish' },
  { id: 584, name: 'vanilluxe' },
  { id: 322, name: 'numel' },
  { id: 323, name: 'camerupt' },
  { id: 449, name: 'hippopotas' },
  { id: 450, name: 'hippowdon' },
  { id: 529, name: 'drilbur' },
  { id: 530, name: 'excadrill' },
  { id: 551, name: 'sandile' },
  { id: 552, name: 'krokorok' },
  { id: 553, name: 'krookodile' },
  { id: 66, name: 'machop' },
  { id: 67, name: 'machoke' },
  { id: 68, name: 'machamp' },
  { id: 443, name: 'gible' },
  { id: 444, name: 'gabite' },
  { id: 445, name: 'garchomp' },
  { id: 703, name: 'carbink' },
  { id: 302, name: 'sableye' },
  { id: 303, name: 'mawile' },
  { id: 359, name: 'absol' },
  { id: 447, name: 'riolu' },
  { id: 448, name: 'lucario' },
  { id: 79, name: 'slowpoke' },
  { id: 80, name: 'slowbro' },
  { id: 199, name: 'slowking' },
  { id: 318, name: 'carvanha' },
  { id: 319, name: 'sharpedo' },
  { id: 602, name: 'tynamo' },
  { id: 603, name: 'eelektrik' },
  { id: 604, name: 'eelektross' },
  { id: 147, name: 'dratini' },
  { id: 148, name: 'dragonair' },
  { id: 149, name: 'dragonite' },
  { id: 1, name: 'bulbasaur' },
  { id: 2, name: 'ivysaur' },
  { id: 3, name: 'venusaur' },
  { id: 4, name: 'charmander' },
  { id: 5, name: 'charmeleon' },
  { id: 6, name: 'charizard' },
  { id: 7, name: 'squirtle' },
  { id: 8, name: 'wartortle' },
  { id: 9, name: 'blastoise' },
  { id: 618, name: 'stunfisk' },
  { id: 676, name: 'furfrou' },
  { id: 686, name: 'inkay' },
  { id: 687, name: 'malamar' },
  { id: 690, name: 'skrelp' },
  { id: 691, name: 'dragalge' },
  { id: 692, name: 'clauncher' },
  { id: 693, name: 'clawitzer' },
  { id: 704, name: 'goomy' },
  { id: 705, name: 'sliggoo' },
  { id: 706, name: 'goodra' },
  { id: 225, name: 'delibird' },
  { id: 361, name: 'snorunt' },
  { id: 362, name: 'glalie' },
  { id: 478, name: 'froslass' },
  { id: 459, name: 'snover' },
  { id: 460, name: 'abomasnow' },
  { id: 712, name: 'bergmite' },
  { id: 713, name: 'avalugg' },
  { id: 123, name: 'scyther' },
  { id: 212, name: 'scizor' },
  { id: 127, name: 'pinsir' },
  { id: 214, name: 'heracross' },
  { id: 587, name: 'emolga' },
  { id: 701, name: 'hawlucha' },
  { id: 708, name: 'phantump' },
  { id: 709, name: 'trevenant' },
  { id: 559, name: 'scraggy' },
  { id: 560, name: 'scrafty' },
  { id: 714, name: 'noibat' },
  { id: 715, name: 'noivern' },
  { id: 707, name: 'klefki' },
  { id: 607, name: 'litwick' },
  { id: 608, name: 'lampent' },
  { id: 609, name: 'chandelure' },
  { id: 142, name: 'aerodactyl' },
  { id: 696, name: 'tyrunt' },
  { id: 697, name: 'tyrantrum' },
  { id: 698, name: 'amaura' },
  { id: 699, name: 'aurorus' },
  { id: 95, name: 'onix' },
  { id: 208, name: 'steelix' },
  { id: 304, name: 'aron' },
  { id: 305, name: 'lairon' },
  { id: 306, name: 'aggron' },
  { id: 694, name: 'helioptile' },
  { id: 695, name: 'heliolisk' },
  { id: 710, name: 'pumpkaboo' },
  { id: 711, name: 'gourgeist' },
  { id: 246, name: 'larvitar' },
  { id: 247, name: 'pupitar' },
  { id: 248, name: 'tyranitar' },
  { id: 656, name: 'froakie' },
  { id: 657, name: 'frogadier' },
  { id: 658, name: 'greninja' },
  { id: 870, name: 'falinks' },
  { id: 650, name: 'chespin' },
  { id: 651, name: 'quilladin' },
  { id: 652, name: 'chesnaught' },
  { id: 227, name: 'skarmory' },
  { id: 653, name: 'fennekin' },
  { id: 654, name: 'braixen' },
  { id: 655, name: 'delphox' },
  { id: 371, name: 'bagon' },
  { id: 372, name: 'shelgon' },
  { id: 373, name: 'salamence' },
  { id: 115, name: 'kangaskhan' },
  { id: 780, name: 'drampa' },
  { id: 374, name: 'beldum' },
  { id: 375, name: 'metang' },
  { id: 376, name: 'metagross' },
  { id: 716, name: 'xerneas' },
  { id: 717, name: 'yveltal' },
  { id: 718, name: 'zygarde' }
];

// Extract just the IDs for API fetching
const ZA_POKEMON_IDS = ZA_POKEMON_LIST.map(p => p.id);

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
