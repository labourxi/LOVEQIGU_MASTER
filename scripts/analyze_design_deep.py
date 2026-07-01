#!/usr/bin/env python3
"""
DEEP DESIGN ANALYSIS — zone-by-zone with edge detection
"""
import sys, json, os, math
from PIL import Image, ImageFilter, ImageOps

def deep_analyze(image_path: str):
    img = Image.open(image_path).convert('RGB')
    w, h = img.size
    pixels = img.load()
    
    results = {
        "dimensions": f"{w}x{h}",
        "ratio": round(w/h, 4),
    }
    
    # ── Edge detection to find horizontal boundaries ──
    # Convert to grayscale and detect rows with significant changes
    gray = ImageOps.grayscale(img)
    row_changes = []
    for y in range(1, h):
        diff = 0
        for x in range(0, w, 4):
            diff += abs(gray.getpixel((x, y)) - gray.getpixel((x, y-1)))
        row_changes.append((y, diff / (w//4)))
    
    # Find peak change rows (potential zone boundaries)
    threshold = max(c[1] for c in row_changes) * 0.3
    boundaries = [0]
    for i in range(1, len(row_changes) - 1):
        if row_changes[i][1] > threshold and row_changes[i][1] > row_changes[i-1][1] and row_changes[i][1] > row_changes[i+1][1]:
            boundaries.append(row_changes[i][0])
    boundaries.append(h)
    
    results["detected_boundaries_y"] = boundaries
    results["zone_count"] = len(boundaries) - 1
    
    # ── Detect specific elements ──
    # Search for green button (WeChat green ~ #07C160)
    green_btn_found = False
    green_btn_zone = None
    
    # Search for gold elements (#C8A24A range)
    gold_elements = []
    
    # Search for white text
    white_text_zone = None
    
    zone_info = []
    for zi in range(len(boundaries) - 1):
        y0 = boundaries[zi]
        y1 = boundaries[zi+1]
        zone_h = y1 - y0
        zone_pct = round(zone_h / h * 100, 1)
        
        # Sample colors in this zone
        colors = {'r': [], 'g': [], 'b': []}
        green_px = 0
        gold_px = 0
        dark_px = 0
        bright_px = 0
        total_px = 0
        
        for y in range(y0, min(y1, h), 4):
            for x in range(0, w, 4):
                total_px += 1
                r, g, b = pixels[x, y]
                colors['r'].append(r)
                colors['g'].append(g)
                colors['b'].append(b)
                
                # Gold
                if 170 <= r <= 230 and 130 <= g <= 190 and 40 <= b <= 110:
                    gold_px += 1
                # Green (WeChat button)
                if g > 150 and g > r * 1.3 and g > b * 1.5:
                    green_px += 1
                # Dark
                if r < 40 and g < 40 and b < 40:
                    dark_px += 1
                # Bright
                if r > 200 and g > 200 and b > 200:
                    bright_px += 1
        
        avg_r = sum(colors['r']) // len(colors['r']) if colors['r'] else 0
        avg_g = sum(colors['g']) // len(colors['g']) if colors['g'] else 0
        avg_b = sum(colors['b']) // len(colors['b']) if colors['b'] else 0
        brightness = (avg_r * 299 + avg_g * 587 + avg_b * 114) / 1000
        
        zone_data = {
            "zone": zi,
            "y_range": [y0, y1],
            "height_pct": zone_pct,
            "avg_color": f"rgb({avg_r},{avg_g},{avg_b})",
            "brightness": round(brightness, 1),
            "type": "unknown",
            "gold_pct": round(gold_px / total_px * 100, 1) if total_px else 0,
            "green_pct": round(green_px / total_px * 100, 1) if total_px else 0,
            "dark_pct": round(dark_px / total_px * 100, 1) if total_px else 0,
            "bright_pct": round(bright_px / total_px * 100, 1) if total_px else 0,
        }
        
        # Classify zone
        if zone_data['bright_pct'] > 60 and brightness > 200:
            zone_data['type'] = 'likely_bright_content'
        elif zone_data['dark_pct'] > 50:
            zone_data['type'] = 'likely_dark_void'
        elif zone_data['gold_pct'] > 3:
            zone_data['type'] = 'likely_gold_accent'
        elif zone_data['green_pct'] > 5:
            zone_data['type'] = 'likely_green_button'
            green_btn_found = True
            green_btn_zone = zi
        
        zone_info.append(zone_data)
    
    results["zones"] = zone_info
    
    # ── Detect layout structure ──
    # Top 15%: what's there?
    top_bright = sum(1 for z in zone_info if z['y_range'][1] <= h * 0.15 and z['bright_pct'] > 50)
    # Bottom 25%: what's there?
    bot_bright = sum(1 for z in zone_info if z['y_range'][0] >= h * 0.75 and z['bright_pct'] > 30)
    
    results["layout_summary"] = {
        "top_zone_bright": top_bright > 0,
        "bottom_zone_bright": bot_bright > 0,
        "green_button_detected": green_btn_found,
        "green_button_zone": green_btn_zone,
        "gold_accent_detected": any(z['gold_pct'] > 3 for z in zone_info),
    }
    
    # ── Structural notes ──
    notes = []
    
    # Ratio check
    if abs(w/h - 9/16) > 0.02:
        notes.append(f"比例偏差: {round(w/h, 4)} (期望 0.5625)")
    
    # Background color check — spec says deepest black #050505
    top_bg = zone_info[0]['avg_color'] if zone_info else "unknown"
    top_bright = zone_info[0]['brightness'] if zone_info else 0
    if top_bright > 60:
        notes.append(f"顶部背景明亮 (亮度{top_bright})，规范要求最深黑(#050505)")
    
    # Gold presence check
    if not results["layout_summary"]["gold_accent_detected"]:
        notes.append("金色元素检测不足，规范 gold=#C8A24A")
    
    results["notes"] = notes
    
    return results


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/analyze_design_deep.py <image_path>")
        sys.exit(1)
    
    result = deep_analyze(sys.argv[1])
    print(json.dumps(result, indent=2, ensure_ascii=False))
