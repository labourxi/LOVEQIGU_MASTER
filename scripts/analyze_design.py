#!/usr/bin/env python3
"""
DESIGN IMAGE ANALYSIS SCRIPT
Analyze a design image for compliance audit.
Outputs: detailed JSON with image stats, color clusters, zones, layout structure.
"""

import sys, json, os
from pathlib import Path
from PIL import Image

def analyze_image(image_path: str) -> dict:
    img = Image.open(image_path)
    w, h = img.size
    ratio = w / h
    target_ratio = 9 / 16  # 0.5625
    
    # Convert to RGB for color analysis
    if img.mode != 'RGB':
        img = img.convert('RGB')
    pixels = img.load()
    
    # Sample grid points for zone analysis (skip every N pixels)
    step = max(w // 50, 1)
    
    # Divide image into horizontal zones (each 10% height)
    zones = {}
    zone_height = h // 10
    for zi in range(10):
        y_start = zi * zone_height
        y_end = (zi + 1) * zone_height if zi < 9 else h
        zone_pixels = []
        for y in range(y_start, y_end, step):
            for x in range(0, w, step):
                r, g, b = pixels[x, y]
                zone_pixels.append((r, g, b))
        # Average color
        avg_r = sum(p[0] for p in zone_pixels) // len(zone_pixels)
        avg_g = sum(p[1] for p in zone_pixels) // len(zone_pixels)
        avg_b = sum(p[2] for p in zone_pixels) // len(zone_pixels)
        # Brightness
        brightness = (avg_r * 299 + avg_g * 587 + avg_b * 114) / 1000
        zones[f"zone_{zi*10}_{(zi+1)*10}pct"] = {
            "y_range": [y_start, y_end],
            "avg_color": f"rgb({avg_r},{avg_g},{avg_b})",
            "brightness": round(brightness, 1),
            "is_dark": brightness < 60,
            "is_bright": brightness > 180,
        }
    
    # Detect dominant color clusters (simplified: sample across top/bottom)
    # Top 15% (title area)
    top_sample = []
    for y in range(0, int(h * 0.15), step):
        for x in range(0, w, step):
            top_sample.append(pixels[x, y])
    top_avg_r = sum(p[0] for p in top_sample) // len(top_sample)
    top_avg_g = sum(p[1] for p in top_sample) // len(top_sample)
    top_avg_b = sum(p[2] for p in top_sample) // len(top_sample)
    
    # Middle 30-70% (portal area)
    mid_sample = []
    for y in range(int(h * 0.30), int(h * 0.70), step):
        for x in range(0, w, step):
            mid_sample.append(pixels[x, y])
    mid_avg_r = sum(p[0] for p in mid_sample) // len(mid_sample)
    mid_avg_g = sum(p[1] for p in mid_sample) // len(mid_sample)
    mid_avg_b = sum(p[2] for p in mid_sample) // len(mid_sample)
    
    # Bottom 20% (button area)
    bot_sample = []
    for y in range(int(h * 0.80), h, step):
        for x in range(0, w, step):
            bot_sample.append(pixels[x, y])
    bot_avg_r = sum(p[0] for p in bot_sample) // len(bot_sample)
    bot_avg_g = sum(p[1] for p in bot_sample) // len(bot_sample)
    bot_avg_b = sum(p[2] for p in bot_sample) // len(bot_sample)
    
    # Detect gold elements (looking for #C8A24A or nearby colors)
    gold_count = 0
    green_count = 0
    white_count = 0
    black_count = 0
    total_sample = 0
    
    for y in range(0, h, step * 2):
        for x in range(0, w, step * 2):
            total_sample += 1
            r, g, b = pixels[x, y]
            # Gold: warm yellow ~ #C8A24A (200, 162, 74)
            if 180 <= r <= 230 and 140 <= g <= 190 and 50 <= b <= 110:
                gold_count += 1
            # WeChat green ~ #07C160 (7, 193, 96)
            if g > 150 and g > r * 1.5 and g > b * 1.5:
                green_count += 1
            # White/light
            if r > 200 and g > 200 and b > 200:
                white_count += 1
            # Black/dark
            if r < 30 and g < 30 and b < 30:
                black_count += 1
    
    gold_pct = round(gold_count / total_sample * 100, 1) if total_sample else 0
    green_pct = round(green_count / total_sample * 100, 1) if total_sample else 0
    white_pct = round(white_count / total_sample * 100, 1) if total_sample else 0
    black_pct = round(black_count / total_sample * 100, 1) if total_sample else 0
    
    return {
        "file": os.path.basename(image_path),
        "dimensions": {"width": w, "height": h},
        "aspect_ratio": round(ratio, 4),
        "is_9_16": abs(ratio - target_ratio) < 0.02,
        "target_9_16": round(target_ratio, 4),
        "pixel_count": w * h,
        "file_size_bytes": os.path.getsize(image_path),
        "zones": zones,
        "color_analysis": {
            "top_15pct_avg": f"rgb({top_avg_r},{top_avg_g},{top_avg_b})",
            "mid_30_70pct_avg": f"rgb({mid_avg_r},{mid_avg_g},{mid_avg_b})",
            "bottom_20pct_avg": f"rgb({bot_avg_r},{bot_avg_g},{bot_avg_b})",
            "top_brightness": round((top_avg_r * 299 + top_avg_g * 587 + top_avg_b * 114) / 1000, 1),
            "mid_brightness": round((mid_avg_r * 299 + mid_avg_g * 587 + mid_avg_b * 114) / 1000, 1),
            "bot_brightness": round((bot_avg_r * 299 + bot_avg_g * 587 + bot_avg_b * 114) / 1000, 1),
        },
        "element_detection": {
            "gold_pixels_pct": gold_pct,
            "green_pixels_pct": green_pct,
            "white_pixels_pct": white_pct,
            "black_pixels_pct": black_pct,
        },
        "has_gold_accent": gold_pct > 1.0,
        "has_green_button": green_pct > 0.5,
        "has_light_text": white_pct > 1.0,
        "has_dark_bg": black_pct > 30 or (sum(p[0] for p in top_sample) // len(top_sample) < 60),
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/analyze_design.py <image_path>")
        sys.exit(1)
    
    result = analyze_image(sys.argv[1])
    print(json.dumps(result, indent=2, ensure_ascii=False))
