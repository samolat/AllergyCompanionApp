import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { ThemeToggle } from '@/components/theme-toggle';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-soft-blue px-2 py-4 animate-[slide-in-right_0.3s_ease]">
      <div className="w-full flex justify-between items-center mb-6">
        <BackButton className="ml-1" />
        <ThemeToggle />
      </div>
      <div className="text-center w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">Allergy Aid Companion</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/test-result">
                <Button variant="outline" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">
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
                <Button variant="outline" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">
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
                <Button variant="outline" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">
                  Allergen Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <p className="mt-6 text-muted-foreground text-base">
          Your personal assistant for managing allergies and food safety
        </p>
      </div>
    </div>
  );
};

export default Index;
