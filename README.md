# MInterest - AI-Powered Pinterest Clone

An AI-powered content discovery platform that generates creative ideas on-demand, running entirely in your browser with no server required!

## ✨ Features

- 🤖 **AI-Powered Generation** - Uses Qwen3 0.6B model to generate creative content ideas
- 🎨 **Pinterest-Style UI** - Beautiful masonry grid layout with hover effects
- 📱 **Mobile & Desktop** - Automatic fallback: WebGPU (desktop) or WASM (mobile)
- 🔒 **Privacy-First** - Everything runs in your browser, no data sent to servers
- ⚡ **Real-Time Updates** - See ideas appear one by one as AI generates them
- 🌐 **Offline Ready** - Works offline after initial model download
- 🎯 **No Caching** - Fresh content every search, nothing stored

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Download Model Files (Optional but Recommended)

For better reliability and offline support, download model files locally:

```bash
node scripts/download-model.js
```

This will download ~800MB of model files to `public/models/`. See [MODEL_SETUP.md](./MODEL_SETUP.md) for details.

**Note:** If you skip this step, the app will automatically download from HuggingFace CDN on first use.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How It Works

1. **Auto-Load**: Model loads automatically when you open the page
2. **Search**: Type any topic (e.g., "space exploration", "healthy recipes")
3. **Generate**: AI creates 6 unique content ideas in real-time
4. **Explore**: Click any card to see details and generate more information
5. **Repeat**: Search again for fresh ideas - nothing is cached!

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI Model**: Qwen3 0.6B (ONNX format)
- **AI Runtime**: Transformers.js with WebGPU/WASM
- **UI**: React, TailwindCSS, shadcn/ui
- **Icons**: Lucide React

### Project Structure

```
minterest/
├── app/
│   ├── page.tsx              # Main Pinterest grid page
│   └── layout.tsx            # Root layout
├── components/
│   ├── PinterestCard.tsx     # Pinterest-style card component
│   ├── PinDetailModal.tsx    # Modal for pin details
│   └── ui/                   # shadcn/ui components
├── hooks/
│   └── useAIModel.ts         # Reusable AI model hook
├── public/
│   └── models/               # Local model files (optional)
├── scripts/
│   └── download-model.js     # Model download script
└── MODEL_SETUP.md            # Detailed model setup guide
```

### Key Components

**`useAIModel` Hook**
- Manages model loading and inference
- Auto-detects WebGPU/WASM support
- Handles local files with CDN fallback
- Supports streaming and non-streaming generation

**`PinterestCard` Component**
- Displays content ideas as cards
- Hover animations and effects
- Color-coded categories

**`PinDetailModal` Component**
- Shows full pin details
- Generate additional content on-demand
- Real-time streaming updates

## 🎯 System Prompt Architecture

The search query is embedded in the system prompt for better context:

```typescript
systemPrompt: `You are a creative content generator for "${searchQuery}". 
Generate diverse and interesting content ideas about this topic.`

userPrompt: `Generate a single creative idea. Provide: a short catchy title, 
a brief description, and a one-word category.`
```

This approach:
- ✅ Gives AI better context about the topic
- ✅ Produces more relevant and focused ideas
- ✅ Allows for 6 independent generations with variety

## 📱 Mobile Support

The app automatically detects device capabilities:

- **Desktop (WebGPU)**: Fast GPU-accelerated inference
- **Mobile (WASM)**: CPU-based inference, slower but compatible
- **Automatic Fallback**: Seamlessly switches based on browser support

## 🔧 Configuration

### Model Settings

Edit `hooks/useAIModel.ts` to customize:

```typescript
// Model configuration
const model_id = 'onnx-community/Qwen3-0.6B-ONNX';
const localModelPath = '/models/Qwen3-0.6B-ONNX';

// Generation settings
maxTokens: 80,        // Max tokens per generation
temperature: 0.9,     // Creativity (0.0-2.0)
```

### Number of Ideas

Edit `app/page.tsx` to change the number of generated ideas:

```typescript
for (let i = 0; i < 6; i++) {  // Change 6 to any number
  // Generate ideas...
}
```

## 🐛 Troubleshooting

### Model Not Loading

1. Check browser console for errors
2. Ensure WebGPU is enabled (Chrome/Edge 113+)
3. Try clearing browser cache
4. Check if local model files exist (if using local hosting)

### Slow Performance

1. Close other browser tabs
2. Use WebGPU-enabled browser on desktop
3. Reduce `maxTokens` in generation settings
4. Use smaller quantization (q4 instead of q4f16)

### Out of Memory

1. Close other applications
2. Use a device with more RAM (8GB+ recommended)
3. Try WASM mode instead of WebGPU
4. Reduce number of concurrent generations

## 📄 License

MIT License - feel free to use for any purpose!

## 🙏 Acknowledgments

- **Qwen Team** - For the amazing Qwen3 model
- **Hugging Face** - For model hosting and Transformers.js
- **Xenova** - For the incredible Transformers.js library
- **shadcn** - For beautiful UI components

## 🔗 Links

- [Qwen3 Model](https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX)
- [Transformers.js](https://huggingface.co/docs/transformers.js)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

---

Built with ❤️ using AI that runs in your browser!
# Minterest-clone
# Minterest-clone
# Minterest-clone
