import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon, 
  PhotoIcon, 
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [rawCaption, setRawCaption] = useState('');
  const [refinedQuery, setRefinedQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file: file,
          preview: e.target.result
        });
        // Reset previous results and errors
        setResults([]);
        setError('');
        setSuccess(false);
        setRawCaption('');
        setRefinedQuery('');
        setApiStatus({});
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select an image file (JPEG, PNG, etc.)');
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const processImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", uploadedImage.file);

    try {
      console.log("Sending image to backend...");
      
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Received upload data:", data);
        
        if (data.success) {
          // Show raw caption and refined query
          setRawCaption(data.raw_caption || '');
          setRefinedQuery(data.refined_query || '');
          setApiStatus(data.processing_info?.apis_used || {});
          
          // Map tavily results into the existing results shape
          if (Array.isArray(data.results) && data.results.length > 0) {
            const mapped = data.results.map((r, idx) => ({
              id: idx + 1,
              name: r.title || r.name || 'Product',
              price: r.price || '',
              store: r.store || r.source || '',
              image: r.image || uploadedImage.preview,
              similarity: Math.round((r.score || 0.8) * 100) || 80,
              link: r.link || r.url || '#',
              snippet: r.snippet || r.description || '',
            }));
            setResults(mapped);
            setSuccess(true);
          } else {
            setResults([]);
            setError('No similar products found. Try uploading a different image.');
          }
        } else {
          setError(data.detail || 'Failed to process image');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Server error: ${response.status}`;
        console.error("Failed to process image:", errorMessage);
        setError(errorMessage);
        setResults([]);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError(`Network error: ${error.message}`);
      setResults([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setResults([]);
    setError('');
    setSuccess(false);
    setRawCaption('');
    setRefinedQuery('');
    setApiStatus({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Image-to-Product Matching
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image and our AI will find similar products across multiple stores
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <PhotoIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload an Image
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="relative">
                      <img
                        src={uploadedImage.preview}
                        alt="Uploaded"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        {isProcessing ? (
                          <>
                            <SparklesIcon className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <MagnifyingGlassIcon className="w-5 h-5" />
                            <span>Find Similar Products</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Smart Filter Chat
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="e.g., 'Can I get this in beige?' or 'Make it more casual'"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                    Send
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Try: "Show me cheaper alternatives" or "I want it in blue"
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Similar Products Found
              </h3>
              
              {isProcessing && (
                <div className="text-center py-8">
                  <SparklesIcon className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">AI is analyzing your image...</p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              )}

              {/* Success Display */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">Success!</span>
                  </div>
                  <p className="text-green-600 mt-1">Image processed successfully</p>
                </div>
              )}

              {/* API Status */}
              {Object.keys(apiStatus).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">API Status</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className={`px-2 py-1 rounded ${apiStatus.blip ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      BLIP: {apiStatus.blip ? '✓' : '✗'}
                    </div>
                    <div className={`px-2 py-1 rounded ${apiStatus.gemini ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Gemini: {apiStatus.gemini ? '✓' : '✗'}
                    </div>
                    <div className={`px-2 py-1 rounded ${apiStatus.tavily ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Tavily: {apiStatus.tavily ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              )}

              {/* Raw Caption */}
              {rawCaption && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                  <h4 className="font-semibold text-gray-900 mb-2">Raw Caption</h4>
                  <p className="text-gray-700">{rawCaption}</p>
                </div>
              )}
              
              {/* Refined Query */}
              {refinedQuery && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                  <h4 className="font-semibold text-gray-900 mb-2">Refined Query</h4>
                  <p className="text-gray-700">{refinedQuery}</p>
                </div>
              )}

              {/* No Results */}
              {!isProcessing && !error && results.length === 0 && rawCaption && (
                <div className="text-center py-8 text-gray-500">
                  <p>No similar products found. Try uploading a different image or check your API configuration.</p>
                </div>
              )}

              {/* Product Results */}
              {results.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Found {results.length} similar products:</h4>

                  {/* Responsive grid: 1 / 2 / 3 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-4 transform transition-transform duration-300 hover:scale-105"
                      >
                        <div className="h-40 w-full mb-4 overflow-hidden rounded-lg">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                          {product.price && <p className="text-green-600 font-semibold mt-2">{product.price}</p>}
                          {product.source && <p className="text-sm text-gray-500 mt-1">Source: {product.source}</p>}
                          {product.snippet && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.snippet}</p>}

                          <div className="mt-4 flex items-center justify-between">
                            <a
                              href={product.link || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors duration-200"
                            >
                              View Product
                            </a>

                            {/* similarity badge */}
                            <div className="text-sm text-gray-600">{product.similarity}% match</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message When Results Are Found */}
              {success && results.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">Success!</span>
                  </div>
                  <p className="text-green-600 mt-1">Found {results.length} similar products for your image.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;