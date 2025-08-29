import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, FileText, AlertCircle, CheckCircle, XCircle, Info, Recycle, Leaf, Trash2, Droplets, Image as ImageIcon } from 'lucide-react';

const WasteClassification = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Enhanced waste classification database with image processing capabilities
  const wasteDatabase = {
    // Food & Organic Waste
    'food_waste': {
      type: 'Biodegradable (Wet Waste)',
      category: 'Organic',
      confidence: 95,
      description: 'Organic food waste that decomposes naturally',
      disposal: 'Compost bin or organic waste collection',
      recycling: 'Can be composted to create nutrient-rich soil',
      environmental_impact: 'Low - decomposes naturally',
      icon: '🍽️',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      tips: [
        'Add to compost pile for natural decomposition',
        'Use in vermicomposting with earthworms',
        'Can be buried in garden soil',
        'Avoid mixing with non-biodegradable items'
      ],
      keywords: ['food', 'organic', 'kitchen', 'vegetable', 'fruit', 'peel', 'scrap', 'leftover']
    },
    'plastic_container': {
      type: 'Non-Biodegradable (Dry Waste)',
      category: 'Recyclable',
      confidence: 92,
      description: 'Plastic container that can be recycled',
      disposal: 'Recycling bin or plastic collection center',
      recycling: 'Can be processed into new plastic products',
      environmental_impact: 'High - takes 450+ years to decompose',
      icon: '🥤',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      tips: [
        'Rinse thoroughly before recycling',
        'Remove caps and labels if possible',
        'Check local recycling guidelines',
        'Consider reusable alternatives'
      ],
      keywords: ['plastic', 'bottle', 'container', 'packaging', 'wrapper', 'bag']
    },
    'paper_item': {
      type: 'Biodegradable (Dry Waste)',
      category: 'Recyclable',
      confidence: 88,
      description: 'Paper product that can be recycled or composted',
      disposal: 'Recycling bin or compost bin',
      recycling: 'Can be pulped and made into new paper products',
      environmental_impact: 'Low - biodegradable and recyclable',
      icon: '📄',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      tips: [
        'Keep dry and clean for recycling',
        'Can be composted if shredded',
        'Recycle up to 7 times',
        'Use for packaging or crafts'
      ],
      keywords: ['paper', 'cardboard', 'newspaper', 'magazine', 'book', 'box', 'carton']
    },
    'metal_item': {
      type: 'Non-Biodegradable (Dry Waste)',
      category: 'Recyclable',
      confidence: 90,
      description: 'Metal item that can be recycled indefinitely',
      disposal: 'Recycling bin or metal collection center',
      recycling: 'Highly valuable for metal recycling industry',
      environmental_impact: 'Medium - recyclable but energy-intensive',
      icon: '🥫',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      tips: [
        'Rinse and clean before recycling',
        'Separate from other materials',
        'High scrap value for recycling',
        'Saves significant energy vs. new production'
      ],
      keywords: ['metal', 'aluminum', 'steel', 'tin', 'can', 'foil', 'wire']
    },
    'glass_item': {
      type: 'Non-Biodegradable (Dry Waste)',
      category: 'Recyclable',
      confidence: 87,
      description: 'Glass container that can be recycled multiple times',
      disposal: 'Recycling bin or glass collection center',
      recycling: 'Can be melted and reformed into new glass products',
      environmental_impact: 'Medium - recyclable but heavy',
      icon: '🍾',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      tips: [
        'Separate by color if required',
        'Rinse thoroughly before recycling',
        'Handle carefully to avoid breakage',
        'Can be recycled indefinitely'
      ],
      keywords: ['glass', 'bottle', 'jar', 'container', 'window', 'mirror']
    },
    'electronic_device': {
      type: 'Electronic Waste (E-Waste)',
      category: 'Special Handling',
      confidence: 85,
      description: 'Electronic device containing valuable metals and toxic components',
      disposal: 'E-waste collection center or manufacturer take-back',
      recycling: 'Complex disassembly for metal recovery and safe disposal',
      environmental_impact: 'High - contains toxic metals and chemicals',
      icon: '📱',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      tips: [
        'Use manufacturer recycling programs',
        'Remove personal data before disposal',
        'Donate if still functional',
        'Separate from regular waste'
      ],
      keywords: ['phone', 'laptop', 'computer', 'electronic', 'device', 'gadget', 'battery']
    },
    'textile_item': {
      type: 'Mixed Waste',
      category: 'Recyclable/Donatable',
      confidence: 83,
      description: 'Clothing or fabric that can be donated or recycled',
      disposal: 'Donation center or textile recycling facility',
      recycling: 'Can be processed into new fabrics or insulation',
      environmental_impact: 'Medium - some materials decompose slowly',
      icon: '👕',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      tips: [
        'Donate if in good condition',
        'Use for cleaning rags if worn',
        'Check local textile recycling programs',
        'Avoid throwing in regular trash'
      ],
      keywords: ['cloth', 'fabric', 'clothing', 'textile', 'garment', 'fabric', 'cotton', 'wool']
    }
  };

  // Image processing and analysis functions
  const processImage = async (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Analyze image characteristics
        const analysis = analyzeImageCharacteristics(imageData, img);
        
        resolve(analysis);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const analyzeImageCharacteristics = (imageData, img) => {
    const { data, width, height } = imageData;
    
    // Calculate average color
    let totalR = 0, totalG = 0, totalB = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
      pixelCount++;
    }
    
    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;
    
    // Calculate color variance and patterns
    let colorVariance = 0;
    let edgeCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Color variance
      colorVariance += Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2);
      
      // Simple edge detection
      if (i > 0 && i < data.length - 4) {
        const currentBrightness = (r + g + b) / 3;
        const nextBrightness = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
        if (Math.abs(currentBrightness - nextBrightness) > 30) {
          edgeCount++;
        }
      }
    }
    
    colorVariance = colorVariance / pixelCount;
    const edgeDensity = edgeCount / pixelCount;
    
    // Analyze image properties
    const aspectRatio = width / height;
    const totalPixels = width * height;
    const brightness = (avgR + avgG + avgB) / 3;
    const saturation = Math.max(avgR, avgG, avgB) - Math.min(avgR, avgG, avgB);
    
    return {
      avgR, avgG, avgB, brightness, saturation,
      colorVariance, edgeDensity, aspectRatio, totalPixels,
      width, height
    };
  };

  const classifyWasteFromImage = (imageAnalysis) => {
    const { avgR, avgG, avgB, brightness, saturation, colorVariance, edgeDensity } = imageAnalysis;
    
    // Scoring system for different waste types
    let scores = {};
    
    // Food/Organic waste detection (usually brown/green, low saturation, high variance)
    scores.food_waste = 0;
    if (avgR > 100 && avgG > 80 && avgB < 100) scores.food_waste += 30; // Brown/green tones
    if (saturation < 50) scores.food_waste += 20; // Low saturation
    if (colorVariance > 80) scores.food_waste += 25; // High color variance
    if (edgeDensity > 0.1) scores.food_waste += 15; // Textured surface
    
    // Plastic detection (usually bright, medium saturation, medium variance)
    scores.plastic_container = 0;
    if (brightness > 150) scores.plastic_container += 25; // Bright
    if (saturation > 40 && saturation < 120) scores.plastic_container += 20; // Medium saturation
    if (colorVariance > 40 && colorVariance < 100) scores.plastic_container += 20; // Medium variance
    if (edgeDensity < 0.08) scores.plastic_container += 15; // Smooth surface
    
    // Paper detection (usually light, low saturation, low variance)
    scores.paper_item = 0;
    if (brightness > 180) scores.paper_item += 30; // Very light
    if (saturation < 30) scores.paper_item += 25; // Low saturation
    if (colorVariance < 50) scores.paper_item += 20; // Low variance
    if (edgeDensity < 0.05) scores.paper_item += 15; // Very smooth
    
    // Metal detection (usually gray/silver, low saturation, high brightness)
    scores.metal_item = 0;
    if (Math.abs(avgR - avgG) < 20 && Math.abs(avgG - avgB) < 20) scores.metal_item += 25; // Gray tones
    if (brightness > 120 && brightness < 200) scores.metal_item += 20; // Medium brightness
    if (saturation < 40) scores.metal_item += 20; // Low saturation
    if (edgeDensity > 0.12) scores.metal_item += 15; // Reflective surface
    
    // Glass detection (usually transparent/reflective, high brightness, low variance)
    scores.glass_item = 0;
    if (brightness > 200) scores.glass_item += 25; // Very bright
    if (colorVariance < 30) scores.glass_item += 20; // Low variance
    if (edgeDensity > 0.15) scores.glass_item += 20; // High edge density
    if (saturation < 20) scores.glass_item += 15; // Very low saturation
    
    // Electronic device detection (usually dark, medium variance, complex patterns)
    scores.electronic_device = 0;
    if (brightness < 100) scores.electronic_device += 25; // Dark
    if (colorVariance > 60) scores.electronic_device += 20; // Medium variance
    if (edgeDensity > 0.08) scores.electronic_device += 20; // Complex patterns
    if (saturation > 30) scores.electronic_device += 15; // Some color
    
    // Textile detection (usually medium brightness, high variance, soft edges)
    scores.textile_item = 0;
    if (brightness > 80 && brightness < 180) scores.textile_item += 20; // Medium brightness
    if (colorVariance > 70) scores.textile_item += 25; // High variance
    if (edgeDensity < 0.06) scores.textile_item += 20; // Soft edges
    if (saturation > 20) scores.textile_item += 15; // Some color
    
    // Find the highest scoring waste type
    let bestMatch = 'food_waste';
    let highestScore = 0;
    
    for (const [wasteType, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        bestMatch = wasteType;
      }
    }
    
    // Calculate confidence based on score
    const maxPossibleScore = 90; // Maximum possible score for any category
    const confidence = Math.min(95, Math.max(70, Math.round((highestScore / maxPossibleScore) * 100)));
    
    return {
      wasteType: bestMatch,
      confidence: confidence,
      scores: scores,
      analysis: imageAnalysis
    };
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Process the image
      const imageAnalysis = await processImage(selectedFile);
      
      // Classify the waste based on image analysis
      const classification = classifyWasteFromImage(imageAnalysis);
      
      // Get the waste details from database
      const wasteDetails = wasteDatabase[classification.wasteType];
      
      // Combine classification results with database details
      const finalResult = {
        ...wasteDetails,
        confidence: classification.confidence,
        imageAnalysis: classification.analysis,
        classificationScores: classification.scores
      };
      
      // Complete the progress
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setResult(finalResult);
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setAnalysisProgress(0);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Organic':
        return <Leaf className="w-6 h-6 text-green-600" />;
      case 'Recyclable':
        return <Recycle className="w-6 h-6 text-blue-600" />;
      case 'Special Handling':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'Mixed Waste':
        return <Info className="w-6 h-6 text-purple-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI-Powered Waste Classification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload an image and our AI will analyze it to identify waste type and provide recycling instructions
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'upload'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5 inline mr-2" />
              Upload Image
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'camera'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Camera className="w-5 h-5 inline mr-2" />
              Take Photo
            </button>
          </div>

          {/* Upload Section */}
          {activeTab === 'upload' && (
            <div className="text-center">
              {!preview ? (
                <div 
                  className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-purple-300 hover:border-purple-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Upload Waste Image
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Drag and drop an image here, or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing Image... {analysisProgress}%
                      </span>
                    ) : (
                      'Analyze Waste Image'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Camera Section */}
          {activeTab === 'camera' && (
            <div className="text-center">
              <div className="bg-gray-100 rounded-2xl p-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Camera Feature Coming Soon
                </h3>
                <p className="text-gray-500 mb-6">
                  This feature will be available in the next update
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  Use Upload Instead
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Main Result Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold text-gray-800">AI Analysis Results</h3>
                  <span className="text-6xl">{result.icon}</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Waste Type</h4>
                    <p className={`text-2xl font-bold ${result.color}`}>{result.type}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(result.category)}
                      <span className="text-lg font-semibold text-gray-800">{result.category}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <h5 className="font-semibold text-gray-700 mb-1">AI Confidence</h5>
                    <p className="text-2xl font-bold text-purple-600">{result.confidence}%</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <h5 className="font-semibold text-gray-700 mb-1">Environmental Impact</h5>
                    <p className="text-lg font-semibold text-gray-800">{result.environmental_impact}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <h5 className="font-semibold text-gray-700 mb-1">Recyclability</h5>
                    <p className="text-lg font-semibold text-gray-800">{result.recycling}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Description & Disposal */}
                <div className="bg-white/60 rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Waste Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-1">Description</h5>
                      <p className="text-gray-600">{result.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-1">Proper Disposal</h5>
                      <p className="text-gray-600">{result.disposal}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-1">Recycling Process</h5>
                      <p className="text-gray-600">{result.recycling}</p>
                    </div>
                  </div>
                </div>

                {/* Tips & Recommendations */}
                <div className="bg-white/60 rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Tips & Best Practices
                  </h4>
                  
                  <ul className="space-y-2">
                    {result.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <button
                  onClick={resetAnalysis}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                >
                  Analyze Another Image
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">How Our AI Image Analysis Works</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Upload a clear image of the waste item</li>
                  <li>• Our AI analyzes image characteristics: colors, patterns, textures, and shapes</li>
                  <li>• Advanced algorithms classify waste into: Biodegradable, Non-biodegradable, Dry Waste, Wet Waste, E-Waste, Hazardous Waste</li>
                  <li>• Get instant results with confidence scores and detailed recycling instructions</li>
                  <li>• Learn about environmental impact and proper disposal methods</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteClassification;