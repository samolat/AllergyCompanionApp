
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AllergenProfilePage = () => {
  return (
    <div className="min-h-screen bg-soft-purple p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>My Allergen Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage and view your known allergens.</p>
          <div className="mt-4 space-y-4">
            <Button variant="default">Add New Allergen</Button>
            <Button variant="outline">View Test History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllergenProfilePage;
