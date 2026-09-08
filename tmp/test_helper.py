import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1280
HEIGHT = 720
SLIDES_DIR = "/tmp/vids/slides"
os.makedirs(SLIDES_DIR, exist_ok=True)
os.makedirs("src/Videos", exist_ok=True)

# Fonts
FONT_BOLD_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def measure_text(draw, text, font):
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        return bbox[2] - bbox[0], bbox[3] - bbox[1]
    except:
        return draw.textlength(text, font=font), font.size

def wrap_text_to_lines(draw, text, font, max_width):
    words = text.split()
    if not words:
        return []
    lines = []
    current_line = ""
    for word in words:
        test_line = f"{current_line} {word}".strip() if current_line else word
        w, _ = measure_text(draw, test_line, font)
        if w <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines

def draw_wrapped_text_in_box(draw, text, box, font_path=FONT_REG_PATH, initial_size=15, 
                             fill=(203, 213, 225), line_spacing=4, align="left", min_size=10):
    x1, y1, x2, y2 = box
    max_w = x2 - x1
    max_h = y2 - y1
    
    size = initial_size
    lines = []
    font = None
    line_h = 0
    total_h = 0

    while size >= min_size:
        font = get_font(font_path, size)
        _, line_h = measure_text(draw, "Ay", font)
        lines = []
        # Support manual newlines in text
        paragraphs = text.split("\n")
        possible = True
        for p in paragraphs:
            wrapped = wrap_text_to_lines(draw, p, font, max_w)
            if not wrapped and p.strip() == "":
                lines.append("")
            else:
                lines.extend(wrapped)
        total_h = len(lines) * (line_h + line_spacing) - line_spacing
        if total_h <= max_h:
            break
        size -= 1

    cur_y = y1
    for line in lines:
        if not line:
            cur_y += line_h + line_spacing
            continue
        w, _ = measure_text(draw, line, font)
        if align == "center":
            cur_x = x1 + (max_w - w) / 2
        elif align == "right":
            cur_x = x2 - w
        else:
            cur_x = x1
        draw.text((cur_x, cur_y), line, fill=fill, font=font)
        cur_y += line_h + line_spacing
    return cur_y

print("Helper tested successfully")
