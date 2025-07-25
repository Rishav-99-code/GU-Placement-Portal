import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

const faqs = [
  {
    q: 'How do I apply for a job?',
    a: 'Navigate to Available Jobs, open a position, and click Apply. Fill required details and submit.'
  },
  {
    q: 'Can I edit my application?',
    a: 'Yes, go to My Applications, choose the job, and click Edit before the deadline.'
  },
  {
    q: 'Who can see my profile?',
    a: 'Recruiters approved by the placement office can view your profile once it is complete and approved.'
  },
  {
    q: 'I found a bug, where do I report?',
    a: 'Please email placementportal@gu.ac.in or contact the placement office.'
  }
];

const StudentFAQPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-gray-200 p-4 sm:p-8 lg:p-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl bg-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl text-gray-50">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <Separator className="bg-gray-700" />
        <CardContent>
          {faqs.map((item, idx) => (
            <details key={idx} className="mb-4 border-b border-gray-700 pb-2">
              <summary className="cursor-pointer font-semibold text-purple-400 mb-1">{item.q}</summary>
              <p className="mt-1 text-gray-300 pl-2">{item.a}</p>
            </details>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFAQPage; 