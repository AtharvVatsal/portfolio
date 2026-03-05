import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={28} className="animate-spin text-cyan-400" />
      <span className="text-gray-500 text-sm">Loading...</span>
    </div>
  </div>
);

export default PageLoader;