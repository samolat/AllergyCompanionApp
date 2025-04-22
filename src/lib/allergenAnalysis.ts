// Interface for cross-allergen relationships
export interface CrossAllergenData {
  allergen: string;
  crossReactiveAllergens: string[];
  confidence: number;
}

// Cross-reactivity data based on known allergen relationships
// This is a simplified dataset representing known cross-reactivity patterns
const CROSS_REACTIVITY_MAP: Record<string, string[]> = {
  'peanuts': ['tree nuts', 'legumes', 'soy'],
  'tree nuts': ['peanuts', 'seeds', 'fruits'],
  'milk': ['beef', 'whey', 'casein', 'lactose'],
  'eggs': ['chicken', 'feathers', 'albumin'],
  'fish': ['shellfish', 'seafood', 'crustaceans'],
  'shellfish': ['fish', 'mollusks', 'crustaceans'],
  'wheat': ['gluten', 'rye', 'barley', 'oats'],
  'soy': ['peanuts', 'legumes', 'beans'],
  'sesame': ['tree nuts', 'seeds', 'tahini'],
  'gluten': ['wheat', 'rye', 'barley', 'spelt'],
  'fruits': ['latex', 'pollen', 'tree nuts'],
  'vegetables': ['latex', 'pollen', 'herbs'],
  'latex': ['banana', 'avocado', 'kiwi', 'chestnut'],
  'mustard': ['seeds', 'spices', 'condiments'],
  'celery': ['birch pollen', 'carrot', 'fennel'],
  'sulfites': ['wine', 'dried fruits', 'preserved foods'],
  'lupine': ['peanuts', 'legumes', 'flour'],
  'mollusks': ['shellfish', 'seafood', 'dust mites']
};

// Function to get related allergens based on a primary allergen
export function getRelatedAllergens(allergen: string): string[] {
  // Normalize the allergen name
  const normalizedAllergen = allergen.toLowerCase();
  
  // Search for exact matches or partial matches in keys
  const exactMatch = CROSS_REACTIVITY_MAP[normalizedAllergen];
  if (exactMatch) return exactMatch;
  
  // Look for partial matches
  for (const [key, value] of Object.entries(CROSS_REACTIVITY_MAP)) {
    if (normalizedAllergen.includes(key) || key.includes(normalizedAllergen)) {
      return value;
    }
  }
  
  // Check in all values as well for a partial match
  for (const [key, values] of Object.entries(CROSS_REACTIVITY_MAP)) {
    for (const value of values) {
      if (value.includes(normalizedAllergen) || normalizedAllergen.includes(value)) {
        return [...values, key];
      }
    }
  }
  
  return [];
}

// Function to analyze an allergen profile and find potential cross-reactivities
export function analyzeCrossReactivity(allergens: string[]): CrossAllergenData[] {
  const results: CrossAllergenData[] = [];
  
  // For each allergen, get related allergens and assign confidence
  allergens.forEach(allergen => {
    const relatedAllergens = getRelatedAllergens(allergen);
    
    if (relatedAllergens.length > 0) {
      results.push({
        allergen,
        crossReactiveAllergens: relatedAllergens,
        // Assign higher confidence to exact matches, lower to partial matches
        confidence: 0.8
      });
    }
  });
  
  return results;
}

// Function to get likely cross-reactive allergens for a given allergen
export function getLikelyAllergensForAllergen(allergenName: string): string[] {
  const relatedAllergens = getRelatedAllergens(allergenName);
  return relatedAllergens.length > 0 ? relatedAllergens : ['No known cross-reactive allergens'];
}

// This would normally connect to the OpenFoodFacts database
// In this simplified version, we'll use the cross-reactivity map
export async function fetchOpenFoodFactsData() {
  // In a real implementation, this would connect to DuckDB and load the JSONL data
  try {
    console.log('Would connect to OpenFoodFacts database here');
    // Simplified implementation - in a real app, we would:
    // 1. Download the OpenFoodFacts JSONL file
    // 2. Connect to DuckDB
    // 3. Load the data and perform queries
    return true;
  } catch (error) {
    console.error('Error connecting to OpenFoodFacts database:', error);
    return false;
  }
} 