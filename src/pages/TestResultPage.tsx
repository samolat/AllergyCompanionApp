
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TestResultPage = () => {
  return (
    <div className="min-h-screen bg-soft-blue p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Allergy Test Result Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Upload your allergy test results for detailed analysis.</p>
          <div className="mt-4 space-y-4">
            <Button variant="default">Upload PDF</Button>
            <Button variant="outline">Upload Image</Button>
            <Button variant="secondary">Enter Test Results Manually</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultPage;
