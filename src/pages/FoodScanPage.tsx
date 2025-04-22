
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackButton from '@/components/BackButton';

const FoodScanPage = () => {
  return (
    <div className="min-h-screen bg-soft-green px-2 py-4 flex flex-col animate-[slide-in-right_0.3s_ease]">
      <BackButton className="mb-2 ml-1 self-start" />
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Food Allergen Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Enter a food product name to check for allergens.</p>
          <div className="mt-4 space-y-4">
            <Input placeholder="Enter food product name" />
            <Button variant="default" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">Scan Allergens</Button>
            <Button variant="outline" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">Scan Barcode</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScanPage;
