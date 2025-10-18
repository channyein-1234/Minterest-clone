# PWA Icon Generator

A Python script using Pillow to generate beautiful PWA icons for your application.

## 🎨 Generated Icons

The script creates two icons required for PWA:
- **icon-192x192.png** (192x192 pixels) - Standard PWA icon
- **icon-512x512.png** (512x512 pixels) - High-resolution PWA icon

## 📋 Features

- ✨ Gradient background (purple to blue)
- ⭕ Circular design with white center
- 🔤 Letter "M" for Minterest
- 🎯 Professional shadow effects
- 📱 Optimized for PWA requirements

## 🚀 Usage

### Prerequisites
```bash
# Install Pillow (if not already installed)
pip install Pillow
```

Or use the requirements file:
```bash
pip install -r requirements.txt
```

### Generate Icons
```bash
python generate_icons.py
```

### Output
```
🎨 Generating PWA Icons...
--------------------------------------------------
✓ Created D:\minterest\public\icon-192x192.png (192x192)
✓ Created D:\minterest\public\icon-512x512.png (512x512)
--------------------------------------------------
✅ All icons generated successfully!

Generated files:
  - icon-192x192.png: 4.6 KB
  - icon-512x512.png: 11.3 KB
```

## 🎨 Customization

You can customize the icons by editing `generate_icons.py`:

### Change Colors
```python
# Gradient colors (RGB)
img = create_gradient_background(size, 
    (139, 92, 246),  # Purple - Top color
    (59, 130, 246)   # Blue - Bottom color
)

# Circle fill color
fill=(255, 255, 255, 230)  # White with transparency

# Text color
fill=(139, 92, 246)  # Purple
```

### Change Text
```python
# Change the letter
text = "M"  # Change to any letter or emoji
```

### Adjust Sizes
```python
# Circle size (percentage of icon size)
circle_size = int(size * 0.6)  # 60% of icon size

# Font size (percentage of icon size)
font_size = int(size * 0.4)  # 40% of icon size
```

## 🎯 Design Elements

### Gradient Background
- Creates a smooth gradient from purple to blue
- Gives a modern, professional look
- Matches common design trends

### Circular Shape
- White circle in the center (60% of icon size)
- Provides contrast for the letter
- Clean, minimalist design

### Letter "M"
- Represents "Minterest"
- Purple color matching the gradient
- Shadow effect for depth
- Centered perfectly

### Border
- Subtle white border around the edge
- Adds definition to the icon
- Professional finish

## 📐 Technical Details

### Image Format
- **Format**: PNG
- **Color Mode**: RGB
- **Quality**: 95%
- **Transparency**: Not used (solid background)

### Font Handling
The script tries to use system fonts in this order:
1. Arial (Windows)
2. Calibri (Windows)
3. DejaVu Sans Bold (Linux)
4. Helvetica (macOS)
5. Default font (fallback)

### File Sizes
- 192x192: ~4-5 KB
- 512x512: ~11-12 KB

Both sizes are optimized for web delivery.

## 🔧 Advanced Customization

### Add More Icon Sizes
```python
icons = [
    (192, os.path.join(public_dir, 'icon-192x192.png')),
    (512, os.path.join(public_dir, 'icon-512x512.png')),
    (144, os.path.join(public_dir, 'icon-144x144.png')),  # Add more
    (72, os.path.join(public_dir, 'icon-72x72.png')),     # Add more
]
```

### Create Rounded Square Instead of Circle
```python
# Replace ellipse with rounded rectangle
from PIL import ImageDraw

def rounded_rectangle(draw, xy, corner_radius, fill):
    draw.rounded_rectangle(xy, corner_radius, fill=fill)
```

### Add Image/Logo
```python
# Load and paste a logo
logo = Image.open('logo.png')
logo = logo.resize((size // 2, size // 2))
img.paste(logo, (size // 4, size // 4), logo)
```

## 🐛 Troubleshooting

### Font Not Found
If you get font errors, the script will use the default font. To use custom fonts:
```python
font = ImageFont.truetype("path/to/your/font.ttf", font_size)
```

### Permission Errors
Make sure the `public` directory exists and is writable:
```bash
mkdir public
```

### Module Not Found
Install Pillow:
```bash
pip install Pillow
```

## 📱 PWA Integration

These icons are automatically used by your PWA through `manifest.json`:

```json
{
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 🎨 Design Tips

1. **Keep it simple**: Icons should be recognizable at small sizes
2. **High contrast**: Ensure text/logo stands out from background
3. **Test at different sizes**: View at 16x16, 32x32, 192x192, 512x512
4. **Avoid fine details**: They get lost at smaller sizes
5. **Use brand colors**: Match your app's color scheme

## 📚 Resources

- [Pillow Documentation](https://pillow.readthedocs.io/)
- [PWA Icon Requirements](https://web.dev/add-manifest/)
- [Icon Design Best Practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## 🔄 Regenerating Icons

Simply run the script again to regenerate:
```bash
python generate_icons.py
```

The script will overwrite existing icons with new ones.

## 📝 License

This script is part of the Minterest PWA project and can be freely modified for your needs.
