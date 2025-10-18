"""
PWA Icon Generator using Pillow
Generates 192x192 and 512x512 icons for Progressive Web Apps
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_background(size, color1, color2):
    """Create a gradient background from color1 to color2"""
    base = Image.new('RGB', (size, size), color1)
    top = Image.new('RGB', (size, size), color2)
    mask = Image.new('L', (size, size))
    mask_data = []
    for y in range(size):
        for x in range(size):
            mask_data.append(int(255 * (y / size)))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def create_icon(size, output_path):
    """Create a PWA icon with gradient background and text"""
    
    # Create gradient background (purple to blue)
    img = create_gradient_background(size, (139, 92, 246), (59, 130, 246))
    draw = ImageDraw.Draw(img)
    
    # Add a circular shape in the center
    circle_size = int(size * 0.6)
    circle_pos = (size - circle_size) // 2
    draw.ellipse(
        [circle_pos, circle_pos, circle_pos + circle_size, circle_pos + circle_size],
        fill=(255, 255, 255, 230),
        outline=(255, 255, 255)
    )
    
    # Add letter "M" in the center
    try:
        # Try to use a nice font if available
        font_size = int(size * 0.4)
        try:
            # Try common font paths
            font_paths = [
                "C:\\Windows\\Fonts\\arial.ttf",
                "C:\\Windows\\Fonts\\calibri.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/System/Library/Fonts/Helvetica.ttc"
            ]
            font = None
            for font_path in font_paths:
                if os.path.exists(font_path):
                    font = ImageFont.truetype(font_path, font_size)
                    break
            if font is None:
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
    except:
        font = None
    
    # Draw the letter "M"
    text = "M"
    
    if font:
        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    else:
        # Fallback for default font
        text_width = size // 4
        text_height = size // 4
    
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - int(size * 0.02)
    
    # Draw text with shadow for depth
    shadow_offset = max(2, size // 100)
    draw.text((text_x + shadow_offset, text_y + shadow_offset), text, 
              fill=(100, 100, 100), font=font)
    draw.text((text_x, text_y), text, fill=(139, 92, 246), font=font)
    
    # Add a subtle border
    border_width = max(2, size // 50)
    draw.ellipse(
        [border_width, border_width, size - border_width, size - border_width],
        outline=(255, 255, 255, 100),
        width=border_width
    )
    
    # Save the image
    img.save(output_path, 'PNG', quality=95)
    print(f"✓ Created {output_path} ({size}x{size})")

def main():
    """Generate all required PWA icons"""
    print("🎨 Generating PWA Icons...")
    print("-" * 50)
    
    # Get the public directory path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(script_dir, 'public')
    
    # Ensure public directory exists
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
        print(f"Created directory: {public_dir}")
    
    # Generate icons
    icons = [
        (192, os.path.join(public_dir, 'icon-192x192.png')),
        (512, os.path.join(public_dir, 'icon-512x512.png'))
    ]
    
    for size, path in icons:
        create_icon(size, path)
    
    print("-" * 50)
    print("✅ All icons generated successfully!")
    print("\nGenerated files:")
    for size, path in icons:
        file_size = os.path.getsize(path) / 1024
        print(f"  - {os.path.basename(path)}: {file_size:.1f} KB")
    
    print("\n💡 Tip: You can customize the colors and design in the script")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
