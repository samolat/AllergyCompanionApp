'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { ChevronLeft, Search, AlertTriangle, Camera, Keyboard } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { addSavedFood, SavedFoodData } from '@/lib/storage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BarcodeScannerComponent from '@/components/BarcodeScannerComponent'

export default function BarcodeScanner() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const [barcode, setBarcode] = useState('')
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera')
  
  useEffect(() => {
    setError(null);
  }, [scanMode, barcode]);
  
  const handleScanSuccess = (decodedText: string) => {
    setBarcode(decodedText)
    fetchProduct(decodedText)
  }

  const fetchProduct = async (barcodeToFetch = barcode) => {
    if (!barcodeToFetch || barcodeToFetch.length < 8) {
      setError("Please enter a valid barcode (at least 8 digits)")
      return
    }
    
    setLoading(true)
    setProduct(null)
    setError(null)
    
    try {
      const cleanBarcode = barcodeToFetch.trim();
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}.json`)
      const data = await res.json()
      
      if (data.status === 0) {
        setError("Product not found. Please try another barcode.")
      } else if (data.product) {
        setProduct(data.product)
      } else {
        setError("Could not retrieve product information")
      }
    } catch (err) {
      setError("Error fetching product data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const extractAllergens = (product: any): string[] => {
    if (!product) return []
    
    // Try to extract from allergens_tags first
    if (product.allergens_tags && product.allergens_tags.length > 0) {
      return product.allergens_tags.map((tag: string) => 
        tag.replace('en:', '').replace(/-/g, ' ')
      )
    }
    
    // Fallback to allergens string
    if (product.allergens) {
      return product.allergens.split(',').map((a: string) => a.trim())
    }
    
    return []
  }
  
  const saveProduct = () => {
    if (!product) return
    
    const allergens = extractAllergens(product)
    const severity = allergens.length > 0 ? 
      (allergens.some(a => a.includes('peanut') || a.includes('shellfish')) ? 
        'Severe' : 'Moderate') : 'None'
    
    const foodItem: SavedFoodData = {
      name: product.product_name || `Product (${barcode})`,
      allergens,
      severity,
      timestamp: new Date().toISOString()
    }
    
    addSavedFood(foodItem)
    setSaveSuccess(true)
    
    setTimeout(() => {
      setSaveSuccess(false)
    }, 2000)
  }

  return (
    <PageLayout lightBgColor="bg-soft-purple">
      <Card className={`w-full max-w-xl mx-auto ${isDark ? 'card-hover border-opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle>Barcode Food Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!product && (
            <>
              <Tabs value={scanMode} onValueChange={(value) => setScanMode(value as 'camera' | 'manual')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="camera">
                    <Camera className="h-4 w-4 mr-2" />
                    Camera Scanner
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <Keyboard className="h-4 w-4 mr-2" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="camera" className="space-y-4 pt-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-center mb-1">Position barcode in front of camera</p>
                    <div className="bg-black/5 p-4 rounded-lg">
                      <BarcodeScannerComponent onScanSuccess={handleScanSuccess} />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Scanning for product barcodes...
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="manual" className="space-y-4 pt-4">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter barcode number"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value.replace(/[^0-9]/g, ''))}
                    className={`w-full ${isDark ? 'bg-gray-900 border-white/30' : ''}`}
                  />
                  
                  <Button
                    onClick={() => fetchProduct()}
                    className="w-full hover:scale-105 active:scale-95 transition-transform duration-150"
                    disabled={loading || barcode.length < 8}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Search Barcode
                  </Button>
                </TabsContent>
              </Tabs>
              
              <Button
                onClick={() => navigate('/food-scan')}
                variant="outline"
                className="w-full hover:scale-105 active:scale-95 transition-transform duration-150"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Food Scanner
              </Button>
            </>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {product && (
            <div className={`p-4 border rounded-lg ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{product.product_name || 'Unknown Product'}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {product.brands || 'Unknown Brand'}
                    </p>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                      {barcode}
                    </span>
                  </div>
                </div>
                
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.product_name} 
                    className="w-16 h-16 object-contain rounded-md border"
                  />
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Allergen Information:</h4>
                {extractAllergens(product).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {extractAllergens(product).map((allergen, i) => (
                      <span 
                        key={i} 
                        className={`px-1.5 py-0.5 rounded-sm text-xs ${
                          isDark ? 'bg-amber-900 text-amber-100' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No allergens listed</p>
                )}
              </div>
              
              {product.ingredients_text && (
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Ingredients:</h4>
                  <p className="text-sm">{product.ingredients_text}</p>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={saveProduct}
                  className="flex-1 hover:scale-105 active:scale-95 transition-transform duration-150"
                  variant={saveSuccess ? "default" : "outline"}
                  disabled={saveSuccess}
                >
                  {saveSuccess ? "Saved Successfully" : "Save Product"}
                </Button>
                
                <Button
                  onClick={() => {
                    setProduct(null);
                    setBarcode('');
                  }}
                  variant="secondary"
                  className="hover:scale-105 active:scale-95 transition-transform duration-150"
                >
                  Scan Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  )
} 