import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  PlusIcon, 
  SparklesIcon, 
  CameraIcon,
  XMarkIcon,
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Closet = () => {
  const [uploadedItems, setUploadedItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('closet');
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newItems = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name.split('.')[0],
        category: "unknown",
        color: "unknown",
        image: URL.createObjectURL(file),
        occasions: [],
        season: "unknown"
      }));
      
      setUploadedItems(prev => [...prev, ...newItems]);
      setIsUploading(false);
    }, 2000);
  };

  const analyzeCloset = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setSuggestions([
        {
          id: 1,
          type: "outfit",
          title: "Casual Weekend Look",
          description: "Perfect for brunch or shopping",
          items: ["Blue Denim Jacket", "White T-Shirt", "Black Jeans"],
          confidence: 95,
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop"
        },
        {
          id: 2,
          type: "missing",
          title: "Add a Statement Piece",
          description: "Your closet needs a pop of color",
          suggestion: "Red or pink blazer",
          confidence: 88,
          stores: ["Myntra", "Amazon"]
        },
        {
          id: 3,
          type: "outfit",
          title: "Work Professional",
          description: "Great for office meetings",
          items: ["White T-Shirt", "Black Jeans"],
          confidence: 92,
          image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop"
        }
      ]);
      setIsAnalyzing(false);
    }, 3000);
  };

  const removeItem = (id) => {
    setUploadedItems(prev => prev.filter(item => item.id !== id));
  };

  const allItems = [...uploadedItems];

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
            AI Closet Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your wardrobe and get personalized outfit suggestions and shopping recommendations
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CameraIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Your Wardrobe
              </h3>
              <p className="text-gray-600 mb-4">
                Take photos of your clothes or upload existing images
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-300 flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      <span>Upload Images</span>
                    </>
                  )}
                </button>
                <button
                  onClick={analyzeCloset}
                  disabled={isAnalyzing || allItems.length === 0}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-300 flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <SparklesIcon className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Analyze Closet</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('closet')}
              className={`flex-1 py-3 px-6 rounded-lg transition-all duration-300 ${
                activeTab === 'closet'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Closet ({allItems.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 py-3 px-6 rounded-lg transition-all duration-300 ${
                activeTab === 'suggestions'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Suggestions ({suggestions.length})
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'closet' && (
            <motion.div
              key="closet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {allItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-purple-600 capitalize">{item.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Color:</span>
                        <span className="text-gray-900 capitalize">{item.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Season:</span>
                        <span className="text-gray-900 capitalize">{item.season}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {suggestion.image && (
                        <img
                          src={suggestion.image}
                          alt={suggestion.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {suggestion.title}
                          </h3>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {suggestion.confidence}% match
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{suggestion.description}</p>
                        
                        {suggestion.type === 'outfit' && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Items needed:</h4>
                            <div className="flex flex-wrap gap-2">
                              {suggestion.items.map((item, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {suggestion.type === 'missing' && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Suggestion:</h4>
                            <p className="text-purple-600 font-semibold">{suggestion.suggestion}</p>
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Available on: </span>
                              <span className="text-sm text-purple-600 font-semibold">
                                {suggestion.stores.join(', ')}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-3">
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2">
                            <HeartIcon className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2">
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span>Shop Missing Items</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {suggestions.length === 0 && (
                <div className="text-center py-12">
                  <EyeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No suggestions yet
                  </h3>
                  <p className="text-gray-600">
                    Upload your wardrobe and click "Analyze Closet" to get personalized suggestions
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Closet; 