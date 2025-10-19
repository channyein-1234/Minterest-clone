'use client';

import { useRef, useState, useCallback } from 'react';
import { AutoTokenizer, AutoModelForCausalLM, TextStreamer } from '@huggingface/transformers';

// WebGPU type declaration
declare global {
  interface Navigator {
    gpu?: GPU;
  }
  interface GPU {
    requestAdapter(): Promise<GPUAdapter | null>;
  }
  interface GPUAdapter {
    requestDevice(): Promise<GPUDevice>;
  }
  interface GPUDevice {}
}

// Configure ONNX Runtime
import { env } from '@huggingface/transformers';
env.backends.onnx.logLevel = 'fatal'; // Suppress all warnings and errors except fatal
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
env.useCustomCache = false;

if (typeof window !== 'undefined') {
  // Suppress ONNX Runtime warnings
  const ort = (globalThis as unknown as { 
    ort?: { 
      env?: { 
        logLevel?: string;
        wasm?: {
          numThreads?: number;
        };
      } 
    } 
  }).ort;
  
  if (ort?.env) {
    ort.env.logLevel = 'fatal'; // Only show fatal errors
  }
  
  // Suppress console warnings from ONNX Runtime
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const message = args.join(' ');
    // Filter out ONNX Runtime warnings about node assignments
    if (
      message.includes('VerifyEachNodeIsAssignedToAnEp') ||
      message.includes('Some nodes were not assigned') ||
      message.includes('session_state.cc')
    ) {
      return; // Suppress this warning
    }
    originalWarn.apply(console, args);
  };
}

export interface GenerateOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export interface AIModelState {
  isLoading: boolean;
  modelLoaded: boolean;
  loadingProgress: string;
  error: string | null;
}

export function useAIModel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenizerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelRef = useRef<any>(null);

  const [state, setState] = useState<AIModelState>({
    isLoading: false,
    modelLoaded: false,
    loadingProgress: '',
    error: null,
  });

  const updateState = useCallback((updates: Partial<AIModelState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadModel = useCallback(async () => {
    if (modelRef.current) return;

    updateState({ isLoading: true, loadingProgress: 'Initializing... Checking device capabilities.' });
    console.log('Starting model load...');

    try {
      // Check device capabilities and choose best available backend
      let device = 'wasm'; // Default fallback
      let dtype = 'q4'; // Default quantization
      
      if (navigator.gpu) {
        console.log('WebGPU is supported - using GPU acceleration');
        device = 'webgpu';
        dtype = 'q4f16';
        updateState({ loadingProgress: 'Using WebGPU acceleration (fastest)' });
      } else {
        console.log('WebGPU not available - using WASM fallback (slower but compatible)');
        updateState({ loadingProgress: 'Using WASM mode (compatible with all devices)' });
      }

      // Try local model first, fallback to HuggingFace CDN
      const model_id = 'onnx-community/Qwen3-0.6B-ONNX';
      const localModelPath = '/models/Qwen3-0.6B-ONNX'; // Local path in public folder
      
      console.log('Model ID:', model_id);
      console.log('Device:', device, 'Dtype:', dtype);

      // Load tokenizer - try local first, then remote
      updateState({ loadingProgress: 'Loading tokenizer...' });
      console.log('Starting tokenizer load...');
      
      let tokenizerLoaded = false;
      
      // Try loading from local public folder first
      try {
        console.log('Attempting to load tokenizer from local path:', localModelPath);
        tokenizerRef.current = await AutoTokenizer.from_pretrained(localModelPath, {
          local_files_only: true,
        });
        tokenizerLoaded = true;
        console.log('Tokenizer loaded from local files');
        updateState({ loadingProgress: 'Tokenizer loaded from local files' });
      } catch (localError) {
        console.log('Local tokenizer not found, falling back to HuggingFace CDN');
      }
      
      // Fallback to HuggingFace CDN if local fails
      if (!tokenizerLoaded) {
        tokenizerRef.current = await AutoTokenizer.from_pretrained(model_id, {
          cache_dir: './.cache',
          local_files_only: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          progress_callback: (progress: any) => {
            console.log('Tokenizer progress:', progress);
            if (progress.status === 'downloading') {
              updateState({ loadingProgress: `Downloading tokenizer from CDN: ${progress.file}` });
            } else if (progress.status === 'done') {
              updateState({ loadingProgress: `Tokenizer cached for offline use` });
            } else if (progress.status === 'progress') {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              updateState({ loadingProgress: `Downloading tokenizer: ${percent}%` });
            }
          }
        });
        console.log('Tokenizer loaded from HuggingFace CDN');
      }

      // Load model with detected device - try local first, then remote
      updateState({ loadingProgress: `Loading model with ${device.toUpperCase()}...` });
      console.log('Starting model load...');
      
      let modelLoaded = false;
      
      // Try loading from local public folder first
      try {
        console.log('Attempting to load model from local path:', localModelPath);
        modelRef.current = await AutoModelForCausalLM.from_pretrained(localModelPath, {
          dtype: dtype as 'q4' | 'q4f16' | 'q8' | 'fp16' | 'fp32',
          device: device as 'webgpu' | 'wasm',
          local_files_only: true,
        });
        modelLoaded = true;
        console.log('Model loaded from local files');
        updateState({ loadingProgress: 'Model loaded from local files' });
      } catch (localError) {
        console.log('Local model not found, falling back to HuggingFace CDN');
      }
      
      // Fallback to HuggingFace CDN if local fails
      if (!modelLoaded) {
        modelRef.current = await AutoModelForCausalLM.from_pretrained(model_id, {
          dtype: dtype as 'q4' | 'q4f16' | 'q8' | 'fp16' | 'fp32',
          device: device as 'webgpu' | 'wasm',
          cache_dir: './.cache',
          local_files_only: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        progress_callback: (progress: any) => {
          console.log('Model progress:', progress);
          if (progress.status === 'downloading' || progress.status === 'download') {
            const percent = progress.progress ? Math.round(progress.progress) : 0;
            const loaded = progress.loaded ? Math.round(progress.loaded / 1024 / 1024) : 0;
            const total = progress.total ? Math.round(progress.total / 1024 / 1024) : 0;
            updateState({ loadingProgress: `Downloading: ${progress.file} - ${loaded}MB / ${total}MB (${percent}%)` });
          } else if (progress.status === 'progress') {
            const percent = Math.round(progress.progress || 0);
            updateState({ loadingProgress: `Loading: ${progress.file || 'model'} - ${percent}%` });
          } else if (progress.status === 'done') {
            updateState({ loadingProgress: `Cached: ${progress.file}` });
          } else if (progress.status === 'initiate') {
            updateState({ loadingProgress: `Starting download: ${progress.file}` });
          } else {
            updateState({ loadingProgress: `${progress.status}: ${progress.file || ''}` });
          }
        }
        });
        console.log('Model loaded from HuggingFace CDN');
      }

      // Warm up the model
      const warmupMessage = device === 'webgpu' 
        ? 'Compiling WebGPU shaders... This may take up to a minute. Please wait...'
        : 'Initializing WASM runtime... Please wait...';
      updateState({ loadingProgress: warmupMessage });
      console.log('Starting model warmup...');
      const inputs = tokenizerRef.current('a');
      await modelRef.current.generate({ ...inputs, max_new_tokens: 1 });
      console.log('Model warmup complete!');

      const successMessage = device === 'webgpu'
        ? 'Qwen3 0.6B loaded with WebGPU acceleration!'
        : 'Qwen3 0.6B loaded with WASM (mobile-compatible)!';
      
      updateState({
        modelLoaded: true,
        isLoading: false,
        loadingProgress: successMessage,
        error: null,
      });
    } catch (error) {
      console.error('Error loading model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load model';
      updateState({
        isLoading: false,
        loadingProgress: '',
        error: errorMessage,
      });
    }
  }, [updateState]);

  const generate = useCallback(async (
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<string> => {
    if (!modelRef.current || !tokenizerRef.current) {
      await loadModel();
      if (!modelRef.current || !tokenizerRef.current) {
        throw new Error('Model failed to load');
      }
    }

    const {
      systemPrompt = 'You are a helpful AI assistant.',
      maxTokens = 100,
      temperature = 0.7,
      topP = 0.9,
      topK = 10,
      stream = false,
      onToken,
    } = options;

    try {
      // Create messages with system prompt and user prompt
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ];

      // Apply chat template
      const inputs = tokenizerRef.current.apply_chat_template(messages, {
        add_generation_prompt: true,
        return_dict: true,
        enable_thinking: false,
      });

      let output = '';

      if (stream && onToken) {
        // Streaming mode
        const streamer = new TextStreamer(tokenizerRef.current, {
          skip_prompt: true,
          skip_special_tokens: true,
          callback_function: (text: string) => {
            output += text;
            onToken(text);
          }
        });

        await modelRef.current.generate({
          ...inputs,
          max_new_tokens: maxTokens,
          do_sample: true,
          temperature,
          top_p: topP,
          top_k: topK,
          repetition_penalty: 1.1,
          streamer,
        });
      } else {
        // Non-streaming mode
        const result = await modelRef.current.generate({
          ...inputs,
          max_new_tokens: maxTokens,
          do_sample: true,
          temperature,
          top_p: topP,
          top_k: topK,
          repetition_penalty: 1.1,
        });

        // First decode with special tokens to see the structure
        const decodedWithTokens = tokenizerRef.current.batch_decode(result, {
          skip_special_tokens: false,
        });
        
        const fullTextWithTokens = decodedWithTokens[0];
        console.log('Full output with tokens:', fullTextWithTokens);
        
        // Now decode without special tokens for clean output
        const decoded = tokenizerRef.current.batch_decode(result, {
          skip_special_tokens: true,
        });

        const fullText = decoded[0];
        console.log('Full output without tokens:', fullText);
        
        // Extract only the NEW generated tokens (not the input prompt)
        // The model generates: [input_ids] + [new_generated_ids]
        // We need to skip the input and only get the new generation
        const inputLength = inputs.input_ids.size;
        const generatedIds = result.slice(null, [inputLength, null]);
        const generatedText = tokenizerRef.current.batch_decode(generatedIds, {
          skip_special_tokens: true,
        });
        
        output = generatedText[0]?.trim() || fullText;
      }

      return output;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }, [loadModel]);

  return {
    ...state,
    loadModel,
    generate,
  };
}
