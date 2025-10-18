"""
Advanced PWA Icon Generator using Pillow
Generates customizable icons with various styles and options
"""

from PIL import Image, ImageDraw, ImageFont
import os
import argparse

class IconGenerator:
    """Advanced icon generator with multiple styles"""
    
    def __init__(self, text="M", style="gradient"):
        self.text = text
        self.style = style
        self.colors = {
            "gradient": [(139, 92, 246), (59, 130, 246)],  # Purple to Blue
            "green": [(16, 185, 129), (5, 150, 105)],      # Green gradient
            "red": [(239, 68, 68), (220, 38, 38)],         # Red gradient
            "orange": [(251, 146, 60), (249, 115, 22)],    # Orange gradient
            "pink": [(236, 72, 153), (219, 39, 119)],      # Pink gradient
            "dark": [(31, 41, 55), (17, 24, 39)],          # Dark gradient
        }
    
    def create_gradient_background(self, size, color1, color2):
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
    
    def create_radial_gradient(self, size, color1, color2):
        """Create a radial gradient from center"""
        img = Image.new('RGB', (size, size))
        draw = ImageDraw.Draw(img)
        
        center = size // 2
        max_radius = int(size * 0.7)
        
        for r in range(max_radius, 0, -1):
            ratio = r / max_radius
            color = tuple(
                int(color1[i] + (color2[i] - color1[i]) * (1 - ratio))
                for i in range(3)
            )
            draw.ellipse(
                [center - r, center - r, center + r, center + r],
                fill=color
            )
        
        return img
    
    def get_font(self, size):
        """Get the best available font"""
        font_size = int(size * 0.4)
        font_paths = [
            "C:\\Windows\\Fonts\\arial.ttf",
            "C:\\Windows\\Fonts\\arialbd.ttf",
            "C:\\Windows\\Fonts\\calibri.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc"
        ]
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    return ImageFont.truetype(font_path, font_size)
                except:
                    continue
        
        return ImageFont.load_default()
    
    def create_circular_icon(self, size, output_path):
        """Create icon with circular design"""
        colors = self.colors.get(self.style, self.colors["gradient"])
        img = self.create_gradient_background(size, colors[0], colors[1])
        draw = ImageDraw.Draw(img)
        
        # Circle
        circle_size = int(size * 0.6)
        circle_pos = (size - circle_size) // 2
        draw.ellipse(
            [circle_pos, circle_pos, circle_pos + circle_size, circle_pos + circle_size],
            fill=(255, 255, 255, 230),
            outline=(255, 255, 255)
        )
        
        # Text
        font = self.get_font(size)
        bbox = draw.textbbox((0, 0), self.text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2 - int(size * 0.02)
        
        # Shadow
        shadow_offset = max(2, size // 100)
        draw.text((text_x + shadow_offset, text_y + shadow_offset), self.text,
                  fill=(100, 100, 100), font=font)
        draw.text((text_x, text_y), self.text, fill=colors[0], font=font)
        
        # Border
        border_width = max(2, size // 50)
        draw.ellipse(
            [border_width, border_width, size - border_width, size - border_width],
            outline=(255, 255, 255, 100),
            width=border_width
        )
        
        img.save(output_path, 'PNG', quality=95)
    
    def create_rounded_square_icon(self, size, output_path):
        """Create icon with rounded square design"""
        colors = self.colors.get(self.style, self.colors["gradient"])
        img = self.create_gradient_background(size, colors[0], colors[1])
        draw = ImageDraw.Draw(img)
        
        # Rounded square
        padding = int(size * 0.15)
        corner_radius = int(size * 0.15)
        draw.rounded_rectangle(
            [padding, padding, size - padding, size - padding],
            radius=corner_radius,
            fill=(255, 255, 255, 230)
        )
        
        # Text
        font = self.get_font(size)
        bbox = draw.textbbox((0, 0), self.text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2 - int(size * 0.02)
        
        # Shadow
        shadow_offset = max(2, size // 100)
        draw.text((text_x + shadow_offset, text_y + shadow_offset), self.text,
                  fill=(100, 100, 100), font=font)
        draw.text((text_x, text_y), self.text, fill=colors[0], font=font)
        
        img.save(output_path, 'PNG', quality=95)
    
    def create_minimal_icon(self, size, output_path):
        """Create minimal flat design icon"""
        colors = self.colors.get(self.style, self.colors["gradient"])
        img = Image.new('RGB', (size, size), colors[0])
        draw = ImageDraw.Draw(img)
        
        # Text only, no background shape
        font = self.get_font(size)
        bbox = draw.textbbox((0, 0), self.text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2
        
        draw.text((text_x, text_y), self.text, fill=(255, 255, 255), font=font)
        
        img.save(output_path, 'PNG', quality=95)
    
    def create_radial_icon(self, size, output_path):
        """Create icon with radial gradient"""
        colors = self.colors.get(self.style, self.colors["gradient"])
        img = self.create_radial_gradient(size, colors[1], colors[0])
        draw = ImageDraw.Draw(img)
        
        # Text
        font = self.get_font(size)
        bbox = draw.textbbox((0, 0), self.text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2
        
        # Shadow
        shadow_offset = max(2, size // 100)
        draw.text((text_x + shadow_offset, text_y + shadow_offset), self.text,
                  fill=(0, 0, 0, 128), font=font)
        draw.text((text_x, text_y), self.text, fill=(255, 255, 255), font=font)
        
        img.save(output_path, 'PNG', quality=95)
    
    def generate(self, sizes=[192, 512], design="circular"):
        """Generate icons with specified design"""
        script_dir = os.path.dirname(os.path.abspath(__file__))
        public_dir = os.path.join(script_dir, 'public')
        
        if not os.path.exists(public_dir):
            os.makedirs(public_dir)
        
        print(f"🎨 Generating {design} icons with {self.style} style...")
        print("-" * 50)
        
        design_methods = {
            "circular": self.create_circular_icon,
            "rounded": self.create_rounded_square_icon,
            "minimal": self.create_minimal_icon,
            "radial": self.create_radial_icon,
        }
        
        method = design_methods.get(design, self.create_circular_icon)
        
        for size in sizes:
            output_path = os.path.join(public_dir, f'icon-{size}x{size}.png')
            method(size, output_path)
            file_size = os.path.getsize(output_path) / 1024
            print(f"✓ Created icon-{size}x{size}.png ({file_size:.1f} KB)")
        
        print("-" * 50)
        print("✅ All icons generated successfully!")

def main():
    parser = argparse.ArgumentParser(description='Generate PWA icons with custom styles')
    parser.add_argument('--text', default='M', help='Text to display (default: M)')
    parser.add_argument('--style', default='gradient', 
                        choices=['gradient', 'green', 'red', 'orange', 'pink', 'dark'],
                        help='Color style (default: gradient)')
    parser.add_argument('--design', default='circular',
                        choices=['circular', 'rounded', 'minimal', 'radial'],
                        help='Icon design (default: circular)')
    parser.add_argument('--sizes', nargs='+', type=int, default=[192, 512],
                        help='Icon sizes to generate (default: 192 512)')
    
    args = parser.parse_args()
    
    generator = IconGenerator(text=args.text, style=args.style)
    generator.generate(sizes=args.sizes, design=args.design)
    
    print(f"\n💡 Tips:")
    print(f"  - Try different styles: --style green|red|orange|pink|dark")
    print(f"  - Try different designs: --design rounded|minimal|radial")
    print(f"  - Change text: --text 'Your Text'")
    print(f"  - Add more sizes: --sizes 72 96 128 144 192 512")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
