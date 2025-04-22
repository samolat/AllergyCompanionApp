import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import PageLayout from '@/components/PageLayout';
import { Input } from '@/components/ui/input';
import { AlertCircle, FileText, Image, Upload, ChevronRight, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getTestResults, saveTestResults, getSeverityLevel, TestResultData } from '@/lib/storage';

// Mock test results data for demo purposes
const generateMockTestResults = (): TestResultData[] => [
  { allergen: 'Peanuts', level: 8.5, date: new Date().toISOString() },
  { allergen: 'Tree Nuts', level: 4.2, date: new Date().toISOString() },
  { allergen: 'Shellfish', level: 9.1, date: new Date().toISOString() },
  { allergen: 'Milk', level: 2.3, date: new Date().toISOString() },
  { allergen: 'Eggs', level: 1.5, date: new Date().toISOString() },
  { allergen: 'Wheat', level: 6.7, date: new Date().toISOString() },
];

const getSeverityColor = (level: number, isDark: boolean) => {
  if (level >= 7) {
    return isDark ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800';
  } else if (level >= 3) {
    return isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800';
  } else {
    return isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800';
  }
};

const getSeverityProgressColor = (level: number, isDark: boolean) => {
  if (level >= 7) {
    return isDark ? 'bg-red-600' : 'bg-red-500';
  } else if (level >= 3) {
    return isDark ? 'bg-amber-600' : 'bg-amber-500';
  } else {
    return isDark ? 'bg-green-600' : 'bg-green-500';
  }
};

const TestResultPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image' | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [testResults, setTestResults] = useState<TestResultData[] | null>(null);
  const [previousResults, setPreviousResults] = useState<TestResultData[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  // Load previous test results from storage
  useEffect(() => {
    const storedResults = getTestResults();
    setPreviousResults(storedResults);
  }, []);
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handlePdfClick = () => {
    pdfInputRef.current?.click();
  };
  
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setFileType(type);
      setMessage(`Selected ${type.toUpperCase()}: ${files[0].name}`);
      setUploadStatus('idle');
      setTestResults(null);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    
    // Simulate file upload with timeout
    setTimeout(() => {
      setUploadStatus('success');
      setMessage(`${fileType === 'pdf' ? 'PDF' : 'Image'} analyzed successfully!`);
      
      // Generate test results after successful analysis
      const newResults = generateMockTestResults();
      setTestResults(newResults);
      
      // Save results to storage
      saveTestResults(newResults);
      
      // Update previous results list
      setPreviousResults(getTestResults());
    }, 1500);
  };
  
  const handleManualEntry = () => {
    setUploadStatus('success');
    setMessage('Manual entry mode activated. Test results loaded.');
    
    // Generate test results for manual entry as well
    const newResults = generateMockTestResults();
    setTestResults(newResults);
    
    // Save results to storage
    saveTestResults(newResults);
    
    // Update previous results list
    setPreviousResults(getTestResults());
  };
  
  const updateAllergenProfile = () => {
    // Navigate to allergen profile
    navigate('/profile');
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <PageLayout lightBgColor="bg-soft-blue">
      <Card className={`w-full max-w-2xl mx-auto ${isDark ? 'card-hover border-opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle>Allergy Test Result Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab as any} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Test</TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Test History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="space-y-4 pt-4">
              <p>Upload your allergy test results for detailed analysis.</p>
              
              {uploadStatus === 'success' && (
                <Alert className={isDark ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-200'}>
                  <FileText className={isDark ? 'text-green-300' : 'text-green-500'} />
                  <AlertTitle className={isDark ? 'text-green-300' : 'text-green-700'}>Success</AlertTitle>
                  <AlertDescription className={isDark ? 'text-green-100' : 'text-green-600'}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {message}
                  </AlertDescription>
                </Alert>
              )}
              
              {selectedFile && uploadStatus === 'idle' && (
                <Alert className={isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-50'}>
                  {fileType === 'pdf' ? <FileText /> : <Image />}
                  <AlertTitle>File Selected</AlertTitle>
                  <AlertDescription>
                    {message}
                    <Button 
                      onClick={handleUpload}
                      className="mt-2 w-full" 
                      variant="outline"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Analyze {fileType?.toUpperCase()}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadStatus === 'uploading' && (
                <div className="flex justify-center my-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {/* Test Results Display */}
              {testResults && (
                <div className={`mt-6 border rounded-lg p-4 ${isDark ? 'border-gray-700 bg-black/20' : 'border-gray-200 bg-gray-50'}`}>
                  <h3 className="text-lg font-semibold mb-3">Test Results</h3>
                  
                  <Table>
                    <TableCaption>Allergen sensitivity test results - {new Date().toLocaleDateString()}</TableCaption>
                    <TableHeader>
                      <TableRow className={isDark ? 'border-gray-700' : ''}>
                        <TableHead>Allergen</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result, index) => (
                        <TableRow key={index} className={isDark ? 'border-gray-700' : ''}>
                          <TableCell className="font-medium">{result.allergen}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{result.level.toFixed(1)}</span>
                              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div 
                                  className={`h-full ${getSeverityProgressColor(result.level, isDark)}`}
                                  style={{ width: `${result.level * 10}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(result.level, isDark)}`}>
                              {getSeverityLevel(result.level)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <Button 
                    onClick={updateAllergenProfile}
                    className="w-full mt-4 hover:scale-105 active:scale-95 transition-transform duration-150"
                  >
                    Update Allergen Profile
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!testResults && uploadStatus !== 'success' && (
                <div className="mt-4 space-y-4">
                  {/* Hidden file inputs */}
                  <Input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'pdf')}
                  />
                  <Input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'image')}
                  />
                  
                  <Button 
                    onClick={handlePdfClick}
                    variant="default" 
                    className="w-full hover:scale-105 active:scale-95 transition-transform duration-150"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Upload PDF
                  </Button>
                  <Button 
                    onClick={handleImageClick}
                    variant="outline" 
                    className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'btn-outline' : ''}`}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button 
                    onClick={handleManualEntry}
                    variant="secondary" 
                    className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : ''}`}
                  >
                    Enter Test Results Manually
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 pt-4">
              <div className={`border rounded-lg p-4 ${isDark ? 'border-gray-700 bg-black/20' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-3">Previous Test Results</h3>
                
                {previousResults.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className={isDark ? 'border-gray-700' : ''}>
                        <TableHead>Allergen</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previousResults.map((result, index) => (
                        <TableRow key={index} className={isDark ? 'border-gray-700' : ''}>
                          <TableCell className="font-medium">{result.allergen}</TableCell>
                          <TableCell>{result.level.toFixed(1)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(result.level, isDark)}`}>
                              {getSeverityLevel(result.level)}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(result.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No previous test results found.</p>
                    <p className="text-sm mt-2">Upload a new test to see results here.</p>
                  </div>
                )}
                
                {previousResults.length > 0 && (
                  <Button 
                    onClick={updateAllergenProfile}
                    className="w-full mt-4 hover:scale-105 active:scale-95 transition-transform duration-150"
                  >
                    View Full Allergen Profile
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TestResultPage;
