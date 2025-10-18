# Local Model Setup Guide

This guide explains how to host the Qwen3-0.6B model locally to avoid dependency on HuggingFace CDN.

## Why Host Locally?

- **Reliability**: No dependency on external CDN availability
- **Speed**: Faster loading from local files
- **Offline**: Works completely offline after initial setup
- **Control**: Full control over model files

## Setup Instructions

### Option 1: Download Model Files (Recommended)

1. **Create the models directory:**
   ```bash
   mkdir -p public/models/Qwen3-0.6B-ONNX
   ```

2. **Download model files from HuggingFace:**
   
   Visit: https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX/tree/main
   
   Download these files to `public/models/Qwen3-0.6B-ONNX/`:
   
   **Required files:**
   - `config.json` - Model configuration
   - `tokenizer.json` - Tokenizer data
   - `tokenizer_config.json` - Tokenizer configuration
   - `special_tokens_map.json` - Special tokens mapping
   - `generation_config.json` - Generation settings
   
   **Model weights (choose based on your needs):**
   
   For **WebGPU (Desktop)**:
   - `onnx/model_q4f16.onnx` - Quantized 4-bit with float16 (fastest, ~400MB)
   - `onnx/model_q4f16.onnx_data` - Model weights data
   
   For **WASM (Mobile)**:
   - `onnx/model_q4.onnx` - Quantized 4-bit (~350MB)
   - `onnx/model_q4.onnx_data` - Model weights data

3. **Your directory structure should look like:**
   ```
   public/
   └── models/
       └── Qwen3-0.6B-ONNX/
           ├── config.json
           ├── tokenizer.json
           ├── tokenizer_config.json
           ├── special_tokens_map.json
           ├── generation_config.json
           └── onnx/
               ├── model_q4f16.onnx
               ├── model_q4f16.onnx_data
               ├── model_q4.onnx
               └── model_q4.onnx_data
   ```

### Option 2: Use Git LFS (For Version Control)

If you want to include model files in your repository:

1. **Install Git LFS:**
   ```bash
   git lfs install
   ```

2. **Track ONNX files:**
   ```bash
   git lfs track "public/models/**/*.onnx"
   git lfs track "public/models/**/*.onnx_data"
   ```

3. **Download and commit:**
   ```bash
   # Download files as described in Option 1
   git add public/models/
   git commit -m "Add local model files"
   ```

## How It Works

The app automatically:

1. **Tries to load from local files first** (`/models/Qwen3-0.6B-ONNX`)
2. **Falls back to HuggingFace CDN** if local files not found
3. **Caches downloaded files** in browser for offline use

## File Sizes

- **Total size**: ~800MB (both WebGPU and WASM models)
- **WebGPU only**: ~400MB
- **WASM only**: ~350MB
- **Config files**: ~5MB

## Notes

- Model files are served from the `public` folder
- Next.js automatically serves files from `public` at the root URL
- Local path: `/models/Qwen3-0.6B-ONNX` maps to `public/models/Qwen3-0.6B-ONNX`
- Browser cache will store downloaded files for offline use

## Testing

To verify local loading works:

1. Place model files in `public/models/Qwen3-0.6B-ONNX/`
2. Open browser DevTools Console
3. Look for: `"Tokenizer loaded from local files"` and `"Model loaded from local files"`
4. If you see `"falling back to HuggingFace CDN"`, check file paths

## Troubleshooting

**Model not loading from local files:**
- Check file paths match exactly: `public/models/Qwen3-0.6B-ONNX/`
- Ensure all required files are present
- Check browser console for errors
- Verify files are accessible at `http://localhost:3000/models/Qwen3-0.6B-ONNX/config.json`

**Out of memory errors:**
- Use smaller quantization (q4 instead of q4f16)
- Close other browser tabs
- Try on a device with more RAM
