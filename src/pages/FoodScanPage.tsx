
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FoodScanPage = () => {
  return (
    <div className="min-h-screen bg-soft-green p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Food Allergen Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Enter a food product name to check for allergens.</p>
          <div className="mt-4 space-y-4">
            <Input placeholder="Enter food product name" />
            <Button variant="default">Scan Allergens</Button>
            <Button variant="outline">Scan Barcode</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScanPage;
