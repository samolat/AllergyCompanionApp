
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-blue">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-primary">Allergy Aid Companion</h1>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/test-result">
                <Button variant="outline" className="w-full">
                  Analyze Test
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Food Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/food-scan">
                <Button variant="outline" className="w-full">
                  Scan Food
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/profile">
                <Button variant="outline" className="w-full">
                  Allergen Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <p className="mt-6 text-muted-foreground">
          Your personal assistant for managing allergies and food safety
        </p>
      </div>
    </div>
  );
};

export default Index;
