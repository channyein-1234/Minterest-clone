'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIModel } from '@/hooks/useAIModel';
import { PinterestCard, PinData } from '@/components/PinterestCard';
import { PinDetailModal } from '@/components/PinDetailModal';
import { Search, Loader2, Sparkles } from 'lucide-react';

export default function PinterestAIPage() {
  const { isLoading: modelLoading, modelLoaded, loadingProgress, error, loadModel, generate } = useAIModel();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [pins, setPins] = useState<PinData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingCount, setGeneratingCount] = useState(0);
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedPins, setRelatedPins] = useState<PinData[]>([]);
  const [isGeneratingRelated, setIsGeneratingRelated] = useState(false);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  // Auto-load model on page mount
  useEffect(() => {
    loadModel();
  }, [loadModel]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsGenerating(true);
    setPins([]); // Clear previous pins
    setGeneratingCount(0);
    
    try {
      // Generate 6 pins one by one and render immediately
      for (let i = 0; i < 6; i++) {
        setGeneratingCount(i + 1);
        
        const systemPrompt = `You are a creative content generator for "${searchQuery}". Generate diverse and interesting content ideas about this topic.`;
        const prompt = `Generate a single creative idea. Provide: a short catchy title (max 6 words), a brief description (1-2 sentences), and a one-word category. Be concise and creative.`;
        
        const response = await generate(prompt, {
          systemPrompt,
          maxTokens: 80,
          temperature: 0.9,
        });
        
        // Extract title, description, and category from response
        const lines = response.trim().split('\n').filter(line => line.trim());
        const title = lines[0]?.replace(/^(Title:|Idea:|-)?\s*/i, '').trim() || `Idea ${i + 1}`;
        const description = lines.slice(1, -1).join(' ').replace(/^(Description:|-)?\s*/i, '').trim() || response.substring(0, 100);
        const category = lines[lines.length - 1]?.replace(/^(Category:|-)?\s*/i, '').trim().split(' ')[0] || 'General';
        
        const pin: PinData = {
          id: `${Date.now()}-${i}-${Math.random()}`,
          title: title.substring(0, 50),
          description: description.substring(0, 150),
          category: category.substring(0, 20),
          color: colors[i % colors.length],
        };
        
        // Immediately render each pin as it's generated
        setPins(prevPins => [...prevPins, pin]);
      }
    } catch (err) {
      console.error('Error generating pins:', err);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingCount(0);
    }
  };

  const generateRelatedIdeas = async (pin: PinData) => {
    setIsGeneratingRelated(true);
    setRelatedPins([]);
    
    try {
      const topicContext = searchQuery.trim() || pin.category || pin.title;
      const relatedCount = 6;
      
      for (let i = 0; i < relatedCount; i++) {
        const systemPrompt = `You are a creative content generator for "${topicContext}". Generate diverse and interesting content ideas related to this topic.`;
        const prompt = `Generate a single creative idea inspired by and related to "${pin.title}". Provide: a short catchy title (max 6 words), a brief description (1-2 sentences), and a one-word category. Be concise and creative.`;

        const response = await generate(prompt, {
          systemPrompt,
          maxTokens: 80,
          temperature: 0.9,
        });

        const lines = response.trim().split('\n').filter(line => line.trim());
        const title = lines[0]?.replace(/^(Title:|Idea:|-)?\s*/i, '').trim() || `Related Idea ${i + 1}`;
        const description = lines.slice(1, -1).join(' ').replace(/^(Description:|-)?\s*/i, '').trim() || response.substring(0, 100);
        const category = lines[lines.length - 1]?.replace(/^(Category:|-)?\s*/i, '').trim().split(' ')[0] || pin.category || 'General';

        const newPin: PinData = {
          id: `${Date.now()}-${i}-${Math.random()}`,
          title: title.substring(0, 50),
          description: description.substring(0, 150),
          category: category.substring(0, 20),
          color: colors[i % colors.length],
        };

        setRelatedPins(prevPins => [...prevPins, newPin]);
      }
    } catch (err) {
      console.error('Error generating related pins:', err);
      alert('Failed to generate related ideas. Please try again.');
    } finally {
      setIsGeneratingRelated(false);
    }
  };

  const handlePinClick = (pin: PinData) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
    void generateRelatedIdeas(pin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              MInterest
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-Powered Content Discovery - Search anything and let AI generate creative ideas
          </p>
          
          {/* Model Status */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${modelLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm font-medium">
                {modelLoaded ? 'AI Ready' : 'AI Not Loaded'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading Model Card */}
        {!modelLoaded && modelLoading && (
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading AI Model
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Initializing Qwen3 0.6B model... This runs entirely in your browser!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProgress && (
                <div className="space-y-2">
                  <p className="text-sm text-center text-purple-700 dark:text-purple-300">
                    {loadingProgress}
                  </p>
                  <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Error Card */}
        {!modelLoaded && error && (
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-100">
                Failed to Load Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                ❌ {error}
              </p>
              <Button onClick={loadModel} variant="destructive" className="w-full">
                Retry Loading Model
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search Bar */}
        {modelLoaded && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search for ideas... (e.g., 'space exploration', 'healthy recipes', 'AI art')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isGenerating) {
                        handleSearch();
                      }
                    }}
                    className="pl-10 h-12 text-lg"
                    disabled={isGenerating}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={isGenerating || !searchQuery.trim()}
                  size="lg"
                  className="px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating {generatingCount}/6...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pinterest Grid */}
        {pins.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pins.map((pin) => (
              <PinterestCard key={pin.id} pin={pin} onClick={handlePinClick} />
            ))}
          </div>
        )}


        {/* Empty State */}
        {modelLoaded && pins.length === 0 && !isGenerating && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Exploring</h3>
              <p className="text-muted-foreground max-w-md">
                Search for any topic and let AI generate creative content ideas for you. No data is cached - every search generates fresh content!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {modelLoaded && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-2">
                <span className="font-semibold">🔍</span>
                <span>Search for any topic and AI generates 6 creative content ideas</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">🎨</span>
                <span>Click any card to see related ideas in an expanded view</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">🚀</span>
                <span>Everything runs in your browser - no data is sent to servers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">📱</span>
                <span>Works on mobile and desktop - automatic fallback to WASM if WebGPU unavailable</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">✨</span>
                <span>Fresh content every time - nothing is cached or stored</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pin Detail Modal */}
        <PinDetailModal
          pin={selectedPin}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPin(null);
            setRelatedPins([]);
          }}
          relatedPins={relatedPins}
          isGeneratingRelated={isGeneratingRelated}
          onRelatedPinClick={handlePinClick}
        />
      </div>
    </div>
  );
}
