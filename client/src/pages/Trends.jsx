import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon
} from '@heroicons/react/24/outline';

const Trends = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live Fashion Trends
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what's trending in fashion right now, updated daily from social media and fashion blogs
          </p>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center min-h-[400px]"
        >
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Yet to be developed
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              This feature is currently under development. We're working on integrating live fashion trend tracking with AI analysis.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Trends; 