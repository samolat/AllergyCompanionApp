
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';

const AllergenProfilePage = () => {
  return (
    <div className="min-h-screen bg-soft-purple px-2 py-4 flex flex-col animate-[slide-in-right_0.3s_ease]">
      <BackButton className="mb-2 ml-1 self-start" />
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>My Allergen Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage and view your known allergens.</p>
          <div className="mt-4 space-y-4">
            <Button variant="default" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">Add New Allergen</Button>
            <Button variant="outline" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">View Test History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllergenProfilePage;
