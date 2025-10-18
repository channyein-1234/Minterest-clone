/**
 * Script to download Qwen3-0.6B model files from HuggingFace
 * Run with: node scripts/download-model.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';
const BASE_URL = `https://huggingface.co/${MODEL_ID}/resolve/main`;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models', 'Qwen3-0.6B-ONNX');

// Files to download
const FILES = [
  'config.json',
  'tokenizer.json',
  'tokenizer_config.json',
  'special_tokens_map.json',
  'generation_config.json',
  'onnx/model_q4f16.onnx',
  'onnx/model_q4f16.onnx_data',
  'onnx/model_q4.onnx',
  'onnx/model_q4.onnx_data',
];

// Create directory structure
function createDirs() {
  const onnxDir = path.join(OUTPUT_DIR, 'onnx');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(onnxDir)) {
    fs.mkdirSync(onnxDir, { recursive: true });
  }
}

// Download a single file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    console.log(`Downloading: ${path.basename(outputPath)}...`);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          const totalSize = parseInt(redirectResponse.headers['content-length'], 10);
          let downloaded = 0;
          
          redirectResponse.on('data', (chunk) => {
            downloaded += chunk.length;
            const percent = ((downloaded / totalSize) * 100).toFixed(1);
            process.stdout.write(`\r  Progress: ${percent}% (${(downloaded / 1024 / 1024).toFixed(1)}MB / ${(totalSize / 1024 / 1024).toFixed(1)}MB)`);
          });
          
          redirectResponse.pipe(file);
          
          file.on('finish', () => {
            file.close();
            console.log('\n  ✓ Downloaded successfully\n');
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('  ✓ Downloaded successfully\n');
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

// Main download function
async function downloadAllFiles() {
  console.log('🚀 Starting model download...\n');
  console.log(`Model: ${MODEL_ID}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
  
  createDirs();
  
  for (const file of FILES) {
    const url = `${BASE_URL}/${file}`;
    const outputPath = path.join(OUTPUT_DIR, file);
    
    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${file} (already exists)\n`);
      continue;
    }
    
    try {
      await downloadFile(url, outputPath);
    } catch (error) {
      console.error(`❌ Failed to download ${file}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('✅ All files downloaded successfully!');
  console.log(`\nModel files are in: ${OUTPUT_DIR}`);
  console.log('\nYou can now run the app with: npm run dev');
}

// Run the download
downloadAllFiles().catch((error) => {
  console.error('❌ Download failed:', error);
  process.exit(1);
});
