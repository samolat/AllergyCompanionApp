import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import PageLayout from '@/components/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Plus, X, Clock, AlertTriangle, BarChart3, History, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent, 
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  getAllergens, 
  saveAllergens, 
  addOrUpdateAllergen,
  getTestResults,
  getSeverityLevel,
  AllergenData,
  TestResultData,
  initializeStorage
} from '@/lib/storage';
import { getLikelyAllergensForAllergen } from '@/lib/allergenAnalysis';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Common allergens for suggestions
const commonAllergens = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Wheat',
  'Soy',
  'Sesame',
  'Gluten',
];

// Severity color helper functions
const getSeverityColor = (severity: string, isDark: boolean) => {
  switch(severity) {
    case 'Severe':
      return isDark ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800';
    case 'Moderate':
      return isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800';
    case 'Mild':
      return isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800';
    default:
      return isDark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800';
  }
};

const AllergenProfilePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [myAllergens, setMyAllergens] = useState<AllergenData[]>([]);
  const [testResults, setTestResults] = useState<TestResultData[]>([]);
  const [newAllergen, setNewAllergen] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const [activeTab, setActiveTab] = useState('list');
  const [activeSection, setActiveSection] = useState<'profile' | 'history'>('profile');
  
  // Initialize storage and load data
  useEffect(() => {
    // Initialize storage with default data
    initializeStorage();
    
    // Load allergens and test results
    loadAllergenData();
  }, []);
  
  const loadAllergenData = () => {
    const allergens = getAllergens();
    const results = getTestResults();
    
    setMyAllergens(allergens);
    setTestResults(results);
  };
  
  const handleNewAllergenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAllergen(e.target.value);
  };
  
  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseFloat(e.target.value);
    setSelectedLevel(level);
    
    // Automatically update severity based on level
    if (level >= 7) {
      setSelectedSeverity('severe');
    } else if (level >= 3) {
      setSelectedSeverity('moderate');
    } else {
      setSelectedSeverity('mild');
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('-')) return dateString; // already formatted
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
    } catch (e) {
      return dateString;
    }
  };
  
  const addAllergen = () => {
    if (newAllergen.trim() && !myAllergens.some(a => a.name === newAllergen.trim())) {
      const newAllergenObj: AllergenData = {
        name: newAllergen.trim(),
        level: selectedLevel,
        severity: selectedSeverity === 'severe' ? 'Severe' : selectedSeverity === 'moderate' ? 'Moderate' : 'Mild',
        date: formatDate(new Date().toISOString())
      };
      
      // Add to storage and get updated list
      const updatedAllergens = addOrUpdateAllergen(newAllergenObj);
      setMyAllergens(updatedAllergens);
      
      // Reset form
      setNewAllergen('');
      setSelectedLevel(5);
      setSelectedSeverity('moderate');
      setShowDialog(false);
    }
  };
  
  const removeAllergen = (name: string) => {
    const updatedAllergens = myAllergens.filter(a => a.name !== name);
    saveAllergens(updatedAllergens);
    setMyAllergens(updatedAllergens);
  };
  
  const addCommonAllergen = (allergenName: string) => {
    if (!myAllergens.some(a => a.name === allergenName)) {
      const newAllergenObj: AllergenData = {
        name: allergenName,
        level: selectedLevel,
        severity: selectedSeverity === 'severe' ? 'Severe' : selectedSeverity === 'moderate' ? 'Moderate' : 'Mild',
        date: formatDate(new Date().toISOString())
      };
      
      // Add to storage and get updated list
      const updatedAllergens = addOrUpdateAllergen(newAllergenObj);
      setMyAllergens(updatedAllergens);
    }
  };
  
  // Function to render cross-reactive allergens with tooltips
  const renderCrossReactiveAllergens = (allergenName: string) => {
    const crossReactiveAllergens = getLikelyAllergensForAllergen(allergenName);
    
    if (crossReactiveAllergens.length === 0 || crossReactiveAllergens[0] === 'No known cross-reactive allergens') {
      return <span className="text-muted-foreground text-xs italic">None known</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {crossReactiveAllergens.slice(0, 3).map((related, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className={`text-xs ${isDark ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'}`}
          >
            {related}
          </Badge>
        ))}
        {crossReactiveAllergens.length > 3 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={`text-xs cursor-help ${isDark ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'}`}
                >
                  +{crossReactiveAllergens.length - 3} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold mb-1">Also watch for:</p>
                <ul className="text-xs space-y-1">
                  {crossReactiveAllergens.slice(3).map((allergen, i) => (
                    <li key={i}>{allergen}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };
  
  return (
    <PageLayout lightBgColor="bg-soft-purple">
      <Card className={`w-full max-w-2xl mx-auto ${isDark ? 'card-hover border-opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle>My Allergen Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeSection} onValueChange={setActiveSection as any} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Allergen Profile</TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Test History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 mt-4">
              <p>Manage and view your known allergens.</p>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="chart">Severity Chart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="mt-4">
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-2">My Allergens</h3>
                    {myAllergens.length === 0 ? (
                      <p className="text-muted-foreground text-sm italic">No allergens added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {myAllergens.map((allergen) => (
                          <Badge key={allergen.name} variant="secondary" className="py-2 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {allergen.name}
                            <Badge variant="outline" className={`ml-1 ${getSeverityColor(allergen.severity, isDark)}`}>
                              {allergen.severity}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 ml-1 rounded-full"
                              onClick={() => removeAllergen(allergen.name)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="chart" className="mt-4">
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-2">Allergen Severity Chart</h3>
                    
                    {myAllergens.length === 0 ? (
                      <p className="text-muted-foreground text-sm italic py-4">No allergens added yet.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className={isDark ? 'border-gray-700' : ''}>
                            <TableHead>Allergen</TableHead>
                            <TableHead>Severity Level (1-10)</TableHead>
                            <TableHead>Classification</TableHead>
                            <TableHead>
                              <div className="flex items-center gap-1">
                                <span>Likely to be allergic to</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">
                                        Based on OpenFoodFacts data analysis and known cross-reactivity patterns.
                                        These are potential allergens you might also react to.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableHead>
                            <TableHead>Last Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myAllergens.map((allergen) => (
                            <TableRow key={allergen.name} className={isDark ? 'border-gray-700' : ''}>
                              <TableCell className="font-medium">{allergen.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{allergen.level.toFixed(1)}</span>
                                  <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div 
                                      className={`h-full ${
                                        allergen.severity === 'Severe' 
                                          ? (isDark ? 'bg-red-600' : 'bg-red-500')
                                          : allergen.severity === 'Moderate'
                                            ? (isDark ? 'bg-amber-600' : 'bg-amber-500')
                                            : (isDark ? 'bg-green-600' : 'bg-green-500')
                                      }`}
                                      style={{ width: `${allergen.level * 10}%` }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(allergen.severity, isDark)}`}>
                                  {allergen.severity}
                                </span>
                              </TableCell>
                              <TableCell>
                                {renderCrossReactiveAllergens(allergen.name)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {allergen.date}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    
                    <div className={`mt-4 p-3 border rounded ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                      <h4 className="text-sm font-medium mb-2">Severity Scale</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className={`p-2 rounded ${isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'}`}>
                          <p className="text-xs font-medium">Mild (1-2.9)</p>
                          <p className="text-xs">Minimal reaction</p>
                        </div>
                        <div className={`p-2 rounded ${isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800'}`}>
                          <p className="text-xs font-medium">Moderate (3-6.9)</p>
                          <p className="text-xs">Significant reaction</p>
                        </div>
                        <div className={`p-2 rounded ${isDark ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
                          <p className="text-xs font-medium">Severe (7-10)</p>
                          <p className="text-xs">Dangerous reaction</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`mt-4 p-3 border rounded ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">About Cross-Reactive Allergens</h4>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs mt-1">
                        Cross-reactive allergens have similar protein structures to your known allergens and might also trigger allergic reactions. 
                        This data is derived from the OpenFoodFacts database analysis and clinical research on allergen cross-reactivity patterns.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-xs font-medium">Common patterns:</span>
                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/50">Peanuts → Tree nuts, Legumes</Badge>
                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/50">Shellfish → Fish, Mollusks</Badge>
                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/50">Wheat → Gluten, Rye, Barley</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Alert className={isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-200'}>
                <AlertTriangle className={isDark ? 'text-yellow-300' : 'text-yellow-600'} />
                <AlertTitle className={isDark ? 'text-slate-200' : ''}>Your Allergen Information</AlertTitle>
                <AlertDescription className={isDark ? 'text-slate-300' : ''}>
                  Always verify your allergen profile with a healthcare professional.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-4">
                <Button 
                  variant="default" 
                  onClick={() => setShowDialog(true)} 
                  className="w-full hover:scale-105 active:scale-95 transition-transform duration-150"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Allergen
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-4">Test History</h3>
                
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    <p>No test history found.</p>
                    <p className="text-sm mt-2">Complete a test analysis to see results here.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.href = '/test-result'}
                    >
                      Go to Test Analysis
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className={isDark ? 'border-gray-700' : ''}>
                            <TableHead>Allergen</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Test Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testResults.map((test, index) => (
                            <TableRow key={index} className={isDark ? 'border-gray-700' : ''}>
                              <TableCell className="font-medium">{test.allergen}</TableCell>
                              <TableCell>{test.level.toFixed(1)}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  getSeverityColor(getSeverityLevel(test.level), isDark)
                                }`}>
                                  {getSeverityLevel(test.level)}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">{formatDate(test.date)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Add Allergen Dialog */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className={isDark ? 'bg-gray-900 border-gray-700 text-white' : ''}>
              <DialogHeader>
                <DialogTitle>Add New Allergen</DialogTitle>
                <DialogDescription className={isDark ? 'text-gray-400' : ''}>
                  Add allergens to keep track of what to avoid.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Input 
                  placeholder="Type allergen name"
                  value={newAllergen}
                  onChange={handleNewAllergenChange}
                  className={isDark ? 'bg-gray-800 border-gray-700' : ''}
                />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Reaction Severity Level (1-10)</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={selectedLevel}
                      onChange={handleLevelChange}
                      className="w-full"
                    />
                    <span className="text-sm font-medium w-8 text-center">{selectedLevel.toFixed(1)}</span>
                  </div>
                  <div className={`mt-2 px-2 py-1 rounded text-xs text-center ${
                    selectedSeverity === 'severe' 
                      ? (isDark ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800')
                      : selectedSeverity === 'moderate'
                        ? (isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800')
                        : (isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800')
                  }`}>
                    {selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Common Allergens</h4>
                  <div className="flex flex-wrap gap-2">
                    {commonAllergens
                      .filter(allergen => !myAllergens.some(a => a.name === allergen))
                      .map(allergen => (
                        <Badge 
                          key={allergen} 
                          variant="outline" 
                          className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                            isDark ? 'border-gray-600' : ''
                          }`}
                          onClick={() => addCommonAllergen(allergen)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {allergen}
                        </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  className={isDark ? 'border-gray-700 hover:bg-gray-800' : ''}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={addAllergen}
                  disabled={!newAllergen.trim()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Add Allergen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AllergenProfilePage;
