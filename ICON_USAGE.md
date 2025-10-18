# Icon Generator Usage Guide

## 🎨 Two Scripts Available

### 1. **generate_icons.py** (Simple)
Basic icon generator with default settings.

```bash
python generate_icons.py
```

**Output**: Purple-to-blue gradient circular icons with "M"

---

### 2. **generate_icons_advanced.py** (Advanced)
Customizable icon generator with multiple styles and designs.

## 🚀 Quick Start

### Generate Default Icons
```bash
python generate_icons.py
```

### Generate with Different Colors
```bash
# Green theme
python generate_icons_advanced.py --style green

# Red theme
python generate_icons_advanced.py --style red

# Orange theme
python generate_icons_advanced.py --style orange

# Pink theme
python generate_icons_advanced.py --style pink

# Dark theme
python generate_icons_advanced.py --style dark
```

### Generate with Different Designs
```bash
# Circular design (default)
python generate_icons_advanced.py --design circular

# Rounded square design
python generate_icons_advanced.py --design rounded

# Minimal flat design
python generate_icons_advanced.py --design minimal

# Radial gradient design
python generate_icons_advanced.py --design radial
```

### Change the Text
```bash
# Single letter
python generate_icons_advanced.py --text "A"

# Multiple letters
python generate_icons_advanced.py --text "MI"

# Emoji (if font supports)
python generate_icons_advanced.py --text "🎨"
```

### Generate Multiple Sizes
```bash
# Standard PWA sizes
python generate_icons_advanced.py --sizes 192 512

# All common sizes
python generate_icons_advanced.py --sizes 72 96 128 144 192 384 512

# Custom sizes
python generate_icons_advanced.py --sizes 256 1024
```

## 🎨 Style Examples

### Gradient (Default)
```bash
python generate_icons_advanced.py --style gradient --design circular
```
- Purple to blue gradient
- Professional and modern
- Default Minterest style

### Green
```bash
python generate_icons_advanced.py --style green --design circular
```
- Fresh and natural
- Good for eco/health apps

### Red
```bash
python generate_icons_advanced.py --style red --design circular
```
- Bold and energetic
- Good for action/alert apps

### Orange
```bash
python generate_icons_advanced.py --style orange --design circular
```
- Warm and friendly
- Good for social/creative apps

### Pink
```bash
python generate_icons_advanced.py --style pink --design circular
```
- Playful and modern
- Good for lifestyle/fashion apps

### Dark
```bash
python generate_icons_advanced.py --style dark --design circular
```
- Sleek and professional
- Good for business/tech apps

## 🎯 Design Examples

### Circular (Default)
```bash
python generate_icons_advanced.py --design circular
```
- White circle in center
- Text inside circle
- Border around edge
- Classic PWA look

### Rounded Square
```bash
python generate_icons_advanced.py --design rounded
```
- Rounded rectangle shape
- Modern iOS-style
- More space for text

### Minimal
```bash
python generate_icons_advanced.py --design minimal
```
- Flat color background
- Text only, no shapes
- Clean and simple

### Radial
```bash
python generate_icons_advanced.py --design radial
```
- Radial gradient from center
- Dynamic and eye-catching
- Modern web app style

## 🔥 Combination Examples

### Professional Business App
```bash
python generate_icons_advanced.py --style dark --design rounded --text "B"
```

### Creative Portfolio
```bash
python generate_icons_advanced.py --style orange --design radial --text "P"
```

### Health & Wellness
```bash
python generate_icons_advanced.py --style green --design circular --text "H"
```

### Social Media App
```bash
python generate_icons_advanced.py --style pink --design minimal --text "S"
```

### Tech Startup
```bash
python generate_icons_advanced.py --style gradient --design circular --text "T"
```

## 📋 Command Reference

```bash
python generate_icons_advanced.py [OPTIONS]

Options:
  --text TEXT          Text to display (default: M)
  --style STYLE        Color style: gradient|green|red|orange|pink|dark
  --design DESIGN      Icon design: circular|rounded|minimal|radial
  --sizes SIZE [SIZE]  Icon sizes to generate (default: 192 512)
  -h, --help          Show help message
```

## 🎨 Custom Modifications

### Edit Colors in Script
Open `generate_icons_advanced.py` and modify the `colors` dictionary:

```python
self.colors = {
    "custom": [(R, G, B), (R, G, B)],  # Add your colors
}
```

Then use:
```bash
python generate_icons_advanced.py --style custom
```

### Change Circle Size
In the script, modify:
```python
circle_size = int(size * 0.6)  # Change 0.6 to your preference
```

### Change Font Size
In the script, modify:
```python
font_size = int(size * 0.4)  # Change 0.4 to your preference
```

## 📱 Testing Generated Icons

### View in Browser
1. Refresh your PWA app
2. Check DevTools → Application → Manifest
3. Verify icons are loaded

### Test Installation
1. Install PWA on device
2. Check home screen icon
3. Verify it looks good at different sizes

### Test in Different Contexts
- Home screen (mobile)
- Task switcher (mobile)
- Desktop shortcut
- Browser tab
- Splash screen

## 🔄 Regenerating Icons

Simply run the script again to overwrite existing icons:
```bash
python generate_icons.py
# or
python generate_icons_advanced.py --style green
```

## 💡 Best Practices

1. **Keep it simple**: Icons should be recognizable at 16x16
2. **Test at all sizes**: Generate and view at multiple sizes
3. **Use high contrast**: Ensure text is readable
4. **Match brand colors**: Use your app's color scheme
5. **Consider dark mode**: Test on light and dark backgrounds

## 🐛 Troubleshooting

### Icons not updating in browser
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Uninstall and reinstall PWA

### Text looks blurry
- Increase font size in script
- Use a different font
- Try bold font variant

### Colors don't match
- Edit RGB values in script
- Use a color picker to get exact values
- Test on different displays

## 📚 Next Steps

1. Generate icons with your preferred style
2. Test in your PWA
3. Customize colors if needed
4. Generate additional sizes if required
5. Update manifest.json if adding new sizes

---

**Quick Command for Minterest Default:**
```bash
python generate_icons.py
```

**Quick Command for Custom Style:**
```bash
python generate_icons_advanced.py --style green --design rounded
```
