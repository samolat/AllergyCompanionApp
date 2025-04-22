import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import PageLayout from '@/components/PageLayout';

const Index = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageLayout>
      <div className="text-center w-full max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary dark:text-white">Allergy Aid Companion</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className={`card-hover ${isDark ? 'border-opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/test-result">
                <Button variant="outline" className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'btn-outline' : ''}`}>
                  Analyze Test
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className={`card-hover ${isDark ? 'border-opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle>Food Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/food-scan">
                <Button variant="outline" className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'btn-outline' : ''}`}>
                  Scan Food
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className={`card-hover ${isDark ? 'border-opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/profile">
                <Button variant="outline" className={`w-full hover:scale-105 active:scale-95 transition-transform duration-150 ${isDark ? 'btn-outline' : ''}`}>
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
    </PageLayout>
  );
};

export default Index;
