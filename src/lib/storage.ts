// Define types for our storage
export interface AllergenData {
  name: string;
  level: number;
  severity: string;
  date: string;
}

export interface TestResultData {
  allergen: string;
  level: number;
  date: string;
}

export interface SavedFoodData {
  name: string;
  allergens: string[];
  severity: string;
  timestamp: string;
}

// Storage keys
const ALLERGEN_STORAGE_KEY = 'allergy-aid-allergens';
const TEST_RESULTS_STORAGE_KEY = 'allergy-aid-test-results';
const SAVED_FOODS_STORAGE_KEY = 'allergy-aid-saved-foods';

// Helper function to safely get data from localStorage
const getStoredData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

// Helper function to safely set data to localStorage
const setStoredData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

// Get all stored allergens
export const getAllergens = (): AllergenData[] => {
  return getStoredData<AllergenData[]>(ALLERGEN_STORAGE_KEY, []);
};

// Save all allergens
export const saveAllergens = (allergens: AllergenData[]): void => {
  setStoredData(ALLERGEN_STORAGE_KEY, allergens);
};

// Add or update an allergen
export const addOrUpdateAllergen = (allergen: AllergenData): AllergenData[] => {
  const allergens = getAllergens();
  const existingIndex = allergens.findIndex(a => a.name === allergen.name);
  
  if (existingIndex !== -1) {
    allergens[existingIndex] = allergen;
  } else {
    allergens.push(allergen);
  }
  
  saveAllergens(allergens);
  return allergens;
};

// Get all test results
export const getTestResults = (): TestResultData[] => {
  return getStoredData<TestResultData[]>(TEST_RESULTS_STORAGE_KEY, []);
};

// Save test results
export const saveTestResults = (results: TestResultData[]): void => {
  setStoredData(TEST_RESULTS_STORAGE_KEY, results);
  
  // Also update allergens based on test results
  const allergens = getAllergens();
  let updated = false;
  
  results.forEach(result => {
    const severity = getSeverityLevel(result.level);
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
    
    const existingIndex = allergens.findIndex(a => a.name === result.allergen);
    if (existingIndex !== -1) {
      allergens[existingIndex] = {
        ...allergens[existingIndex],
        level: result.level,
        severity,
        date: today
      };
    } else {
      allergens.push({
        name: result.allergen,
        level: result.level,
        severity,
        date: today
      });
    }
    updated = true;
  });
  
  if (updated) {
    saveAllergens(allergens);
  }
};

// Remove a test result
export const removeTestResult = (allergen: string): TestResultData[] => {
  const results = getTestResults();
  const newResults = results.filter(r => r.allergen !== allergen);
  saveTestResults(newResults);
  return newResults;
};

// Helper to convert level to severity string
export const getSeverityLevel = (level: number): string => {
  if (level >= 7) return 'Severe';
  if (level >= 3) return 'Moderate';
  return 'Mild';
};

// Initial default data for new installations
export const initialAllergenData: AllergenData[] = [
  { name: 'Peanuts', level: 8.5, severity: 'Severe', date: '2023-09-15' },
  { name: 'Shellfish', level: 9.1, severity: 'Severe', date: '2023-07-22' },
];

// Initialize storage with default data if empty
export const initializeStorage = (): void => {
  const allergens = getAllergens();
  if (allergens.length === 0) {
    saveAllergens(initialAllergenData);
  }
};

// Get all saved foods
export const getSavedFoods = (): SavedFoodData[] => {
  return getStoredData<SavedFoodData[]>(SAVED_FOODS_STORAGE_KEY, []);
};

// Save all foods
export const saveFoods = (foods: SavedFoodData[]): void => {
  setStoredData(SAVED_FOODS_STORAGE_KEY, foods);
};

// Add a food to saved foods
export const addSavedFood = (food: SavedFoodData): SavedFoodData[] => {
  const foods = getSavedFoods();
  foods.push(food);
  saveFoods(foods);
  return foods;
};

// Remove a saved food
export const removeSavedFood = (timestamp: string): SavedFoodData[] => {
  const foods = getSavedFoods();
  const newFoods = foods.filter(f => f.timestamp !== timestamp);
  saveFoods(newFoods);
  return newFoods;
}; 