'use client';

import React from 'react';
import Setting from '@/app/manager/setting/page';
import Navbar from '@/components/Navbar';

const Page = () => {
  return (
    <div className="flex h-screen">
      {/* Navbar */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <Setting />
      </div>
    </div>
  );
}

export default Page;
