import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CameraIcon, 
  SparklesIcon, 
  ShoppingBagIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [isUploading, setIsUploading] = useState(false);

  const features = [
    {
      icon: CameraIcon,
      title: "Image-to-Product Matching",
      description: "Upload an image and find visually similar items from online stores",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: SparklesIcon,
      title: "Live Fashion Trend Tracker",
      description: "Daily/weekly trending outfits from fashion blogs and social media",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: ShoppingBagIcon,
      title: "Event-Based Outfit Suggestions",
      description: "Get personalized outfit suggestions for any occasion",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Smart Filter Chat",
      description: "Chat-based refinement: 'Can I get this in beige?'",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: UserIcon,
      title: "AI Closet Integration",
      description: "Upload your wardrobe and match with new suggestions",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: ArrowTrendingUpIcon,
      title: "Multi-store Aggregation",
      description: "Compare prices across Myntra, Amazon, Ajio, and more",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Price Comparison",
      description: "Find the best deals across multiple retailers",
      color: "from-red-500 to-pink-600"
    }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        // Here you would handle the actual upload
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
                Personal Shopper
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Upload an image, describe your style, or chat with our AI to discover the perfect fashion finds across multiple stores.
            </p>
            
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <label className="group cursor-pointer">
                <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <CameraIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">
                        {isUploading ? 'Processing...' : 'Upload an Image'}
                      </p>
                      <p className="text-sm text-gray-300">
                        {isUploading ? 'Finding similar products...' : 'Click to browse or drag & drop'}
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of shopping with our intelligent AI-powered features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover your perfect style with AI assistance.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;