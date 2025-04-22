import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import PageLayout from '@/components/PageLayout';
import { AlertCircle, Check, Search, Barcode, X, Info, Save, History, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSavedFoods, addSavedFood, removeSavedFood, SavedFoodData } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';

// Mock data for allergies
const mockAllergens = {
  'chocolate ice cream': ['milk', 'soy lecithin'],
  'peanut butter': ['peanuts'],
  'wheat bread': ['gluten', 'wheat'],
  'almond milk': ['tree nuts (almond)'],
  'shrimp pasta': ['shellfish', 'wheat', 'gluten'],
  'chocolate chip cookies': ['wheat', 'milk', 'soy', 'eggs'],
};

// Mock barcode data
const mockBarcodes = {
  '1234567890123': {
    name: 'Chocolate Ice Cream',
    allergens: ['milk', 'soy lecithin'],
  },
  '2345678901234': {
    name: 'Organic Wheat Bread',
    allergens: ['wheat', 'gluten'],
  },
  '3456789012345': {
    name: 'Crunchy Peanut Butter',
    allergens: ['peanuts'],
  },
};

const FoodScanPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [foodName, setFoodName] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const [scanResult, setScanResult] = useState<{
    found: boolean;
    name?: string;
    allergens?: string[];
    message?: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'saved'>('scan');
  const [savedFoods, setSavedFoods] = useState<SavedFoodData[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  
  // Load saved foods on component mount
  useEffect(() => {
    setSavedFoods(getSavedFoods());
  }, []);
  
  const handleFoodNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(e.target.value);
    setScanResult(null);
  };
  
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeInput(e.target.value);
    setScanResult(null);
  };
  
  const scanFood = () => {
    if (!foodName.trim()) return;
    
    setIsScanning(true);
    
    // Simulate network delay
    setTimeout(() => {
      const normalizedFoodName = foodName.trim().toLowerCase();
      const foundAllergens = Object.entries(mockAllergens).find(
        ([food]) => food.includes(normalizedFoodName)
      );
      
      if (foundAllergens) {
        const [name, allergens] = foundAllergens;
        setScanResult({
          found: true,
          name,
          allergens,
        });
      } else {
        setScanResult({
          found: false,
          message: 'No allergens found for this food item.',
        });
      }
      
      setIsScanning(false);
    }, 1500);
  };
  
  const scanBarcode = () => {
    if (!barcodeInput.trim()) return;
    
    setIsScanning(true);
    
    // Simulate scanner delay
    setTimeout(() => {
      const barcode = barcodeInput.trim();
      const product = mockBarcodes[barcode as keyof typeof mockBarcodes];
      
      if (product) {
        setScanResult({
          found: true,
          name: product.name,
          allergens: product.allergens,
        });
      } else {
        setScanResult({
          found: false,
          message: 'Barcode not recognized. Please try a different product.',
        });
      }
      
      setIsScanning(false);
    }, 1500);
  };
  
  const toggleBarcodeInput = () => {
    setShowBarcodeInput(!showBarcodeInput);
    setScanResult(null);
    setBarcodeInput('');
    setFoodName('');
  };
  
  const saveCurrentFood = () => {
    if (!scanResult?.found || !scanResult.name || !scanResult.allergens) return;
    
    const severity = scanResult.allergens.length > 0 ? 
      (scanResult.allergens.includes('peanuts') || scanResult.allergens.includes('shellfish') ? 
        'Severe' : 'Moderate') : 'None';
    
    const foodItem: SavedFoodData = {
      name: scanResult.name,
      allergens: scanResult.allergens,
      severity,
      timestamp: new Date().toISOString()
    };
    
    const updatedFoods = addSavedFood(foodItem);
    setSavedFoods(updatedFoods);
    setIsSaved(true);
    
    // Reset saved state after 2 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };
  
  const deleteSavedFood = (timestamp: string) => {
    const updatedFoods = removeSavedFood(timestamp);
    setSavedFoods(updatedFoods);
  };
  
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch (e) {
      return isoString;
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'scan' | 'saved');
    if (value === 'saved') {
      // Reset scan state when viewing saved foods
      setScanResult(null);
      setFoodName('');
      setBarcodeInput('');
      setShowBarcodeInput(false);
    }
  };
  
  return (
    <PageLayout lightBgColor="bg-soft-green">
      <Card className={`w-full max-w-xl mx-auto ${isDark ? 'card-hover border-opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle>Food Allergen Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">Scan Food</TabsTrigger>
              <TabsTrigger value="saved">
                <History className="h-4 w-4 mr-2" />
                Saved Foods
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="scan" className="space-y-4 pt-4">
              <p>{showBarcodeInput ? 'Enter a barcode to scan for allergens.' : 'Enter a food product name to check for allergens.'}</p>
              
              {scanResult && (
                <Alert className={
                  scanResult.found 
                    ? (isDark ? 'bg-amber-900 border-amber-500' : 'bg-amber-50 border-amber-200')
                    : (isDark ? 'bg-blue-900 border-blue-500' : 'bg-blue-50 border-blue-200')
                }>
                  {scanResult.found ? <AlertCircle className={isDark ? 'text-amber-300' : 'text-amber-500'} /> : <Info className={isDark ? 'text-blue-300' : 'text-blue-500'} />}
                  <AlertTitle className={scanResult.found ? (isDark ? 'text-amber-300' : 'text-amber-700') : (isDark ? 'text-blue-300' : 'text-blue-700')}>
                    {scanResult.found ? 'Allergens Detected' : 'No Allergens Found'}
                  </AlertTitle>
                  <AlertDescription className={scanResult.found ? (isDark ? 'text-amber-100' : 'text-amber-600') : (isDark ? 'text-blue-100' : 'text-blue-600')}>
                    {scanResult.found ? (
                      <>
                        <p><strong>{scanResult.name}</strong> contains the following allergens:</p>
                        <ul className="list-disc pl-5 mt-2">
                          {scanResult.allergens?.map((allergen) => (
                            <li key={allergen}>{allergen}</li>
                          ))}
                        </ul>
                        <Button 
                          onClick={saveCurrentFood}
                          className="mt-3 w-full" 
                          variant={isSaved ? "default" : "outline"}
                          disabled={isSaved}
                        >
                          {isSaved ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Saved Successfully
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save to My Foods
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <p>{scanResult.message}</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mt-4 space-y-4">
                {showBarcodeInput ? (
                  <>
                    <Input 
                      placeholder="Enter barcode number" 
                      value={barcodeInput}
                      onChange={handleBarcodeChange}
                      className={isDark ? 'bg-gray-900 border-white/30' : ''}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={scanBarcode}
                        disabled={isScanning || !barcodeInput.trim()}
                        className="flex-1 hover:scale-105 active:scale-95 transition-transform duration-150"
                      >
                        {isScanning ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                        ) : (
                          <Barcode className="mr-2 h-4 w-4" />
                        )}
                        Scan Barcode
                      </Button>
                      <Button 
                        onClick={toggleBarcodeInput}
                        variant="outline" 
                        className={`flex-1 hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'btn-outline' : ''}`}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Input 
                      placeholder="Enter food product name" 
                      value={foodName}
                      onChange={handleFoodNameChange}
                      className={isDark ? 'bg-gray-900 border-white/30' : ''}
                    />
                    <Button 
                      onClick={scanFood}
                      disabled={isScanning || !foodName.trim()}
                      className="w-full hover:scale-105 active:scale-95 transition-transform duration-150"
                    >
                      {isScanning ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                      ) : (
                        <Search className="mr-2 h-4 w-4" />
                      )}
                      Scan Allergens
                    </Button>
                    <Button 
                      onClick={toggleBarcodeInput}
                      variant="outline" 
                      className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'btn-outline' : ''}`}
                    >
                      <Barcode className="mr-2 h-4 w-4" />
                      Scan Barcode
                    </Button>
                    <Button 
                      onClick={() => navigate('/barcode-scanner')}
                      variant="secondary" 
                      className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${
                        isDark ? 'bg-gray-800 hover:bg-gray-700' : ''
                      }`}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Real Barcode Scanner (API)
                    </Button>
                  </>
                )}
              </div>
              
              {/* Hint for testing */}
              <div className={`mt-6 text-xs border rounded p-2 ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <p className="font-medium mb-1">Test with these examples:</p>
                <p>Foods: chocolate ice cream, peanut butter, wheat bread, almond milk, shrimp pasta</p>
                <p>Barcodes: 1234567890123, 2345678901234, 3456789012345</p>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4 pt-4">
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-3">My Saved Foods</h3>
                
                {savedFoods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <p>No saved foods found.</p>
                    <p className="text-sm mt-2">Scan foods and save them to see them listed here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={isDark ? 'border-gray-700' : ''}>
                          <TableHead>Food Name</TableHead>
                          <TableHead>Allergens</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedFoods.map((food, index) => (
                          <TableRow key={index} className={isDark ? 'border-gray-700' : ''}>
                            <TableCell className="font-medium">{food.name}</TableCell>
                            <TableCell>
                              {food.allergens.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {food.allergens.map((allergen, i) => (
                                    <span key={i} className={`px-1.5 py-0.5 rounded-sm text-xs ${
                                      isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {allergen}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">None detected</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                food.severity === 'Severe' 
                                  ? (isDark ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800')
                                  : food.severity === 'Moderate'
                                    ? (isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800')
                                    : (isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800')
                              }`}>
                                {food.severity}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDateTime(food.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSavedFood(food.timestamp)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default FoodScanPage;
