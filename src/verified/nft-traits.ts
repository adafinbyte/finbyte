
interface props {
  collection_name: string;
  policy: string;
  traits: Record<string, Record<string, number>>;
}

const nft_traits: props[] = [
  {
    collection_name: 'TheBabyDux',
    policy: 'de53e935d272dd079f3e785ee0f3aa21db5579d5399a3b5d0ce3485c',
    traits: {
      "arms": {
        "Gin": 232,
        "TNT": 308,
        "Bong": 258,
        "Hook": 231,
        "None": 299,
        "Note": 285,
        "Gamer": 243,
        "GM Mug": 261,
        "Tablet": 282,
        "Wallet": 271,
        "Grenade": 254,
        "Popsicle": 308,
        "Cope Bomb": 162,
        "Basketball": 238,
        "Ghettoblaster": 213,
        "Proof of Steak": 295
      },
      "beak": {
        "Lock": 417,
        "Cigar": 361,
        "Normal": 1673,
        "Rabbit": 402,
        "Vampire": 428,
        "Drooling": 431,
        "Pacifier": 428
      },
      "body": {
        "Gold": 369,
        "Pepe": 1243,
        "White": 1428,
        "Zombie": 866,
        "Diamond": 196,
        "Amethyst": 38
      },
      "eyes": {
        "Dead": 358,
        "Down": 383,
        "High": 383,
        "Angry": 356,
        "Tears": 428,
        "Closed": 204,
        "Chilled": 376,
        "Glowing": 210,
        "Bandages": 203,
        "Confused": 378,
        "Retarded": 447,
        "Eye Patch": 225,
        "Sunglasses": 189
      },
      "head": {
        "Cook": 381,
        "None": 422,
        "Crown": 56,
        "Nihon": 431,
        "Candle": 367,
        "Cowboy": 406,
        "Mohawk": 415,
        "Earpods": 384,
        "Astro Hat": 9,
        "Pepe Head": 38,
        "Bobble Hat": 346,
        "Bucket Hat": 373,
        "Bunny Head": 30,
        "Teddy Head": 39,
        "Propeller Hat": 400,
        "Sad Pepe Head": 43
      },
      "legs": {
        "Naked": 2607,
        "Prisoner": 734,
        "Sneakers": 799
      },
      "version": {
        "1.0": 4140
      },
      "clothing": {
        "None": 458,
        "Leash": 339,
        "Shirt": 255,
        "Diaper": 370,
        "Plumber": 320,
        "Shinobi": 362,
        "White T": 446,
        "Astronaut": 104,
        "GenP Robe": 88,
        "Accident T": 401,
        "Gold Chain": 120,
        "Pepe Onesie": 81,
        "Bunny Onesie": 30,
        "Hoodie Black": 367,
        "Hoodie White": 360,
        "Teddy Onesie": 39
      },
      "background": {
        "ADA": 264,
        "BTC": 78,
        "Red": 410,
        "GenP": 240,
        "Grey": 412,
        "Mint": 381,
        "Rose": 423,
        "Green": 435,
        "White": 406,
        "Violet": 415,
        "Yellow": 440,
        "Psychedelic": 236
      },
      "traitcount": {
        "6": 6,
        "7": 105,
        "8": 951,
        "9": 3078
      } 
    }
  },
  {
    collection_name: 'TheChosenDux',
    policy: '444c89e7c273530f108c4b68b8788fba58ae4e503b0b439a4806d1cb',
    traits: {
      "eyes": {
        "Down": 1033,
        "Fire": 1030,
        "High": 994,
        "Tears": 961,
        "Closed": 971,
        "Squint": 1005,
        "Quackardio": 975
      },
      "clothes": {
        "OG": 98,
        "QTC": 553,
        "None": 1989,
        "Roon": 284,
        "Goofy": 288,
        "Shell": 183,
        "Bloody": 603,
        "Quaxedo": 612,
        "Warrior": 264,
        "Cardanzo": 588,
        "PoorKing": 76,
        "BehindBars": 585,
        "DuckInSpace": 65,
        "Motherchain": 187,
        "GenerationalPoverty": 594
      },
      "background": {
        "$BTC": 64,
        "Rose": 801,
        "Black": 854,
        "Chart": 445,
        "DYEQA": 837,
        "Green": 814,
        "White": 863,
        "Orange": 808,
        "Purple": 878,
        "Whiteboard": 121,
        "Blue Matrix": 248,
        "BloodInTheStreets": 236
      },
      "traitcount": {
        "2": 1989,
        "3": 4980
      }
    }
  },
];

const totalSupplyByPolicy: Record<string, number> = {
  'de53e935d272dd079f3e785ee0f3aa21db5579d5399a3b5d0ce3485c': 4140, //TheBabyDux
  '444c89e7c273530f108c4b68b8788fba58ae4e503b0b439a4806d1cb': 6969, //TheChosenDux
};

interface TraitRarity {
  trait_type: string;
  value: string;
  rarity: number;
}

export interface RarityResult {
  traits: TraitRarity[];
  overallScore: number;
  rarityScore: number;
}

function calculateMaxOverallScore(policy: string): number {
  const collection = nft_traits.find(c => c.policy === policy);
  if (!collection) return 0;

  const total = totalSupplyByPolicy[policy];
  let maxOverallScore = 0;

  for (const [traitType, traitValues] of Object.entries(collection.traits)) {
    const minCount = Math.min(...Object.values(traitValues));
    const rarity = minCount / total;
    maxOverallScore += 1 / rarity;
  }

  return maxOverallScore;
}

export function computeRarityFromMetadata(policy: string, metadata: Record<string, any>): RarityResult | null {
  const collection = nft_traits.find(c => c.policy === policy);
  if (!collection) return null;

  const total = totalSupplyByPolicy[policy];
  const traits: TraitRarity[] = [];
  let overallScore = 0;

  for (const [traitTypeRaw, value] of Object.entries(metadata)) {
    const traitType = traitTypeRaw.toLowerCase(); // Normalize the trait name
    const valueStr = String(value);

    // Try to find a matching trait key (case insensitive)
    const matchedTraitKey = Object.keys(collection.traits).find(
      k => k.toLowerCase() === traitType
    );

    if (matchedTraitKey) {
      const count = collection.traits[matchedTraitKey]?.[valueStr];
      if (count !== undefined) {
        const rarity = count / total;
        traits.push({ trait_type: matchedTraitKey, value: valueStr, rarity: (rarity * 100) });
        overallScore += 1 / rarity;
      }
    }
  }

  const maxOverallScore = calculateMaxOverallScore(policy);
  const rarityScore = ((overallScore / maxOverallScore) * 100);

  return { traits, overallScore, rarityScore };
}
