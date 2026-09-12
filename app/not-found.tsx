'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Home, LayoutGrid } from 'lucide-react';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black flex items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          {/* Animated 404 Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
              404
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-white">
              System Route Not Found
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              The page or resource you are looking for does not exist in our current architecture. It may have been moved, deleted, or you might have mistyped the URL.
            </p>
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <LayoutGrid className="w-5 h-5" />
              View Services
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          {/* Technical Aesthetic Detail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-12 mt-12 border-t border-neutral-900"
          >
            <code className="text-emerald-500/50 text-sm font-mono">
              ERR_CODE: 404_RESOURCE_UNAVAILABLE
            </code>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
