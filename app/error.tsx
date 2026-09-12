'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('System Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            System Architecture Error
          </h1>
          
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            An unexpected process exception occurred while rendering this interface. Our telemetry systems have been notified of the anomaly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Reboot Interface
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-12 border-t border-neutral-900 text-left bg-neutral-950 p-6 rounded-lg font-mono text-sm overflow-auto max-w-full"
        >
          <div className="text-red-400 mb-2">EXCEPTION_TRACE:</div>
          <code className="text-gray-500 block">
            {error.message || 'Unknown runtime exception'}
          </code>
          {error.digest && (
            <code className="text-gray-600 block mt-2 text-xs">
              DIGEST_ID: {error.digest}
            </code>
          )}
        </motion.div>
      </div>
    </div>
  );
}
