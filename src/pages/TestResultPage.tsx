
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';

const TestResultPage = () => {
  return (
    <div className="min-h-screen bg-soft-blue px-2 py-4 flex flex-col animate-[slide-in-right_0.3s_ease]">
      <BackButton className="mb-2 ml-1 self-start" />
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Allergy Test Result Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Upload your allergy test results for detailed analysis.</p>
          <div className="mt-4 space-y-4">
            <Button variant="default" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">Upload PDF</Button>
            <Button variant="outline" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">Upload Image</Button>
            <Button variant="secondary" className="w-full hover:scale-105 active:scale-95 transition-transform duration-150">Enter Test Results Manually</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultPage;
