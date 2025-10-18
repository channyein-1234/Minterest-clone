'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AutoTokenizer, AutoModelForCausalLM, TextStreamer } from '@huggingface/transformers';

// Configure ONNX Runtime to suppress execution provider warnings
import { env } from '@huggingface/transformers';
env.backends.onnx.logLevel = 'error'; // Suppress warnings, only show errors
if (typeof window !== 'undefined') {
  (globalThis as any).ort?.env && ((globalThis as any).ort.env.logLevel = 'error');
}

export default function AIInferencePage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const tokenizerRef = useRef<any>(null);
  const modelRef = useRef<any>(null);

  const loadModel = async () => {
    if (modelRef.current) return;
    
    setIsLoading(true);
    setLoadingProgress('Loading Qwen3 0.6B... This may take a few minutes on first load.');
    
    try {
      const model_id = 'onnx-community/Qwen3-0.6B-ONNX';
      
      // Load tokenizer
      setLoadingProgress('Loading tokenizer...');
      tokenizerRef.current = await AutoTokenizer.from_pretrained(model_id, {
        progress_callback: (progress: any) => {
          if (progress.status === 'downloading') {
            setLoadingProgress(`Downloading tokenizer: ${progress.file}`);
          }
        }
      });
      
      // Load model with WebGPU
      setLoadingProgress('Loading model (this will take a few minutes)...');
      modelRef.current = await AutoModelForCausalLM.from_pretrained(model_id, {
        dtype: 'q4f16',
        device: 'webgpu',
        progress_callback: (progress: any) => {
          if (progress.status === 'downloading') {
            setLoadingProgress(`Downloading: ${progress.file} - ${Math.round(progress.progress || 0)}%`);
          } else if (progress.status === 'progress') {
            setLoadingProgress(`Loading: ${Math.round(progress.progress || 0)}%`);
          } else if (progress.status === 'done') {
            setLoadingProgress(`Loaded: ${progress.file}`);
          }
        }
      });
      
      // Warm up the model - this compiles WebGPU shaders (can take 30-60 seconds)
      setLoadingProgress('Compiling WebGPU shaders... This may take up to a minute. Please wait...');
      console.log('Starting shader compilation...');
      const inputs = tokenizerRef.current('a');
      await modelRef.current.generate({ ...inputs, max_new_tokens: 1 });
      console.log('Shader compilation complete!');
      
      setModelLoaded(true);
      setLoadingProgress('Qwen3 0.6B loaded successfully!');
    } catch (error) {
      console.error('Error loading model:', error);
      setLoadingProgress(`Error: ${error instanceof Error ? error.message : 'Failed to load model'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (!modelRef.current || !tokenizerRef.current) {
      await loadModel();
      if (!modelRef.current || !tokenizerRef.current) return;
    }

    setIsLoading(true);
    setOutput('Generating...');
    console.log('Starting generation with prompt:', prompt);

    try {
      // Create chat messages format
      const messages = [
        { role: 'user', content: prompt }
      ];
      
      console.log('Applying chat template...');
      // Apply chat template
      const inputs = tokenizerRef.current.apply_chat_template(messages, {
        add_generation_prompt: true,
        return_dict: true,
      });
      
      console.log('Creating streamer...');
      // Create streamer for real-time output
      const streamer = new TextStreamer(tokenizerRef.current, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text: string) => {
          console.log('Streamer callback:', text);
          setOutput(prev => prev + text);
        }
      });
      
      console.log('Starting model.generate...');
      // Generate response
      const result = await modelRef.current.generate({
        ...inputs,
        max_new_tokens: 256,
        do_sample: true,
        temperature: 0.7,
        top_k: 20,
        streamer,
      });
      
      console.log('Generation complete!', result);
      
    } catch (error) {
      console.error('Error generating text:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to generate text'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Inference UI
          </h1>
          <p className="text-muted-foreground">
            Powered by Transformers.js - Running AI models in your browser
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${modelLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium">
              {modelLoaded ? 'Model Ready' : 'Model Not Loaded'}
            </span>
          </div>
        </div>

        {/* Model Info */}
        <Card className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">
              Model: Qwen3 0.6B
            </CardTitle>
            <CardDescription className="text-purple-700 dark:text-purple-300">
              A powerful 0.6B parameter model from Alibaba. Runs entirely in your browser with WebGPU acceleration!
            </CardDescription>
          </CardHeader>
          {!modelLoaded && (
            <CardContent>
              <Button 
                onClick={loadModel} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Loading Model...' : 'Load Model'}
              </Button>
              {loadingProgress && (
                <p className="text-sm text-center mt-2 text-purple-700 dark:text-purple-300">
                  {loadingProgress}
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Text Generation</CardTitle>
            <CardDescription>
              Enter a prompt and let the AI continue the text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Your Prompt
              </label>
              <Input
                id="prompt"
                placeholder="Write a short story about a robot..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleGenerate();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt.trim()}
                className="flex-1"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
              <Button 
                onClick={handleClear} 
                variant="outline"
                disabled={isLoading}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Card */}
        {output && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <p className="text-sm whitespace-pre-wrap">{output}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Info */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Runs entirely in your browser - No server required</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Privacy-first - Your data never leaves your device</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Works offline after initial model download</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">✓</span>
              <span>Powered by Transformers.js and WebAssembly</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
