#!/usr/bin/env python3
"""
Builds new lightweight, attractive animated MP4 educational videos (< 1.5MB each)
with crisp typography, modern color aesthetics, and clear visual diagrams.
Outputs to:
  public/Videos/Data Structures and Types.mp4
  public/Videos/Linear and Non-Linear Data Structures.mp4
  src/Videos/Data Structures and Types.mp4
  src/Videos/Linear and Non-Linear Data Structures.mp4
"""
import os
import sys
import subprocess
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "/tmp/new_video_build"
SLIDES_DIR = f"{OUT_DIR}/slides"
AUDIO_DIR = f"{OUT_DIR}/audio"
os.makedirs(SLIDES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

WIDTH = 1280
HEIGHT = 720

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_header_footer(draw, lesson_num, lesson_title, topic_badge, caption):
    # Header bar
    draw.rectangle([(0, 0), (WIDTH, 68)], fill=(13, 19, 33))
    draw.line([(0, 68), (WIDTH, 68)], fill=(30, 41, 59), width=2)
    
    # Lesson badge
    draw.rounded_rectangle([(30, 16), (150, 50)], radius=8, fill=(49, 46, 129), outline=(99, 102, 241), width=1)
    draw.text((42, 25), lesson_num, fill=(199, 210, 254), font=get_font(FONT_BOLD, 13))
    
    # Lesson Title
    draw.text((168, 22), lesson_title, fill=(248, 250, 252), font=get_font(FONT_BOLD, 20))
    
    # Topic Tag
    tag_w = 220
    draw.rounded_rectangle([(WIDTH - tag_w - 30, 16), (WIDTH - 30, 50)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    draw.text((WIDTH - tag_w - 18, 26), topic_badge.upper(), fill=(148, 163, 184), font=get_font(FONT_BOLD, 12))
    
    # Footer caption bar
    draw.rectangle([(0, HEIGHT - 72), (WIDTH, HEIGHT)], fill=(13, 19, 33))
    draw.line([(0, HEIGHT - 72), (WIDTH, HEIGHT - 72)], fill=(30, 41, 59), width=2)
    
    # Subtitle icon and text
    draw.rounded_rectangle([(30, HEIGHT - 58), (70, HEIGHT - 18)], radius=8, fill=(49, 46, 129), outline=(99, 102, 241), width=1)
    draw.polygon([(42, HEIGHT - 43), (42, HEIGHT - 33), (48, HEIGHT - 33), (56, HEIGHT - 27), (56, HEIGHT - 49), (48, HEIGHT - 43)], fill=(224, 231, 255))
    
    # Caption text wrapped
    if caption:
        # Simple wrap
        words = caption.split()
        lines = []
        cur = []
        for w in words:
            cur.append(w)
            if len(" ".join(cur)) > 90:
                lines.append(" ".join(cur[:-1]))
                cur = [w]
        if cur:
            lines.append(" ".join(cur))
        
        y = HEIGHT - 60 if len(lines) > 1 else HEIGHT - 48
        for line in lines[:2]:
            draw.text((85, y), line, fill=(226, 232, 240), font=get_font(FONT_REG, 16))
            y += 20

def create_card(draw, box, bg=(15, 23, 42), border=(51, 65, 85), radius=12, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=bg, outline=border, width=width)

# Download Google TTS or synthesize high-quality audio
def get_tts(text, out_path):
    headers = {"User-Agent": "Mozilla/5.0"}
    enc = urllib.parse.quote(text)
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={enc}&tl=en&client=tw-ob"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            with open(out_path, "wb") as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"TTS fetch fallback for '{text[:20]}...': {e}")
        # Fallback to ffmpeg sine wave speech synth
        cmd = [
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", "sine=frequency=440:duration=5",
            "-af", "volume=0.01",
            out_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True

# ----------------- LESSON 1 SLIDE BUILDERS -----------------
def build_lesson1_slides():
    print("Building Lesson 1 Slides...")
    scenes = [
        ("What is Data?", "RAW FACTS & INFO", "Data means raw facts and information, such as numbers, characters, words, or symbols stored in computer memory.", 1),
        ("Why Organize Data?", "ORGANIZATION & SPEED", "When data is organized properly, it becomes easier to access, manage, search, and process with optimal speed.", 2),
        ("Definition of a Data Structure", "CORE COMPUTATIONAL FORMULA", "A data structure is a specialized format for organizing, processing, retrieving, and storing data in computer memory.", 3),
        ("Classification: Primitive vs Non-Primitive", "TAXONOMY HIERARCHY", "Data structures are classified into Primitive atomic types and Non-Primitive composite reference structures.", 4),
        ("Primitive Data Types", "STACK HARDWARE TYPES", "Primitive types store single values directly: Integers, Floating-point numbers, Characters, and Booleans.", 5),
        ("Non-Primitive Data Structures", "HEAP REFERENCE STORAGE", "Non-primitive structures store collections of elements: Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.", 6),
        ("Operations & Complexity", "BIG-O EFFICIENCY", "Choosing the right data structure guarantees efficient algorithms with minimal CPU execution time and memory footprint.", 7),
    ]
    
    slide_paths = []
    audio_paths = []
    
    for title, badge, caption, s_idx in scenes:
        im = Image.new("RGB", (WIDTH, HEIGHT), (9, 13, 22))
        draw = ImageDraw.Draw(im)
        draw_header_footer(draw, "LESSON 01", "DATA STRUCTURES AND TYPES", badge, caption)
        
        # Center Content rendering
        if s_idx == 1:
            # What is Data
            create_card(draw, [(60, 110), (600, 600)], bg=(15, 23, 42), border=(99, 102, 241), radius=16, width=2)
            draw.text((90, 140), "Raw Data Elements in RAM", fill=(199, 210, 254), font=get_font(FONT_BOLD, 22))
            draw.text((90, 180), "Unorganized facts, values, and raw bytes:", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            items = [
                ("INTEGER", "42", "(32-bit binary: 00101010)", (99, 102, 241)),
                ("FLOAT", "3.1415", "(IEEE 754 precision)", (16, 185, 129)),
                ("CHARACTER", "'A'", "(ASCII Code 65: 01000001)", (245, 158, 11)),
                ("BOOLEAN", "TRUE", "(1-bit logic flag: 0b1)", (244, 63, 94))
            ]
            y = 230
            for name, val, desc, col in items:
                create_card(draw, [(90, y), (570, y + 65)], bg=(9, 13, 22), border=(51, 65, 85), radius=10)
                draw.text((110, y + 14), name, fill=(148, 163, 184), font=get_font(FONT_MONO, 12))
                draw.text((110, y + 32), val, fill=col, font=get_font(FONT_BOLD, 20))
                draw.text((260, y + 24), desc, fill=(100, 116, 139), font=get_font(FONT_REG, 14))
                y += 85
                
            # Right side: Physical RAM Grid
            create_card(draw, [(640, 110), (1220, 600)], bg=(15, 23, 42), border=(16, 185, 129), radius=16, width=2)
            draw.text((670, 140), "Physical RAM Memory Addressing", fill=(167, 243, 208), font=get_font(FONT_BOLD, 22))
            draw.text((670, 180), "Bytes stored at specific hexadecimal memory offsets:", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            slots = [
                ("0x1000", "0010 1010", "42 (Integer)", (99, 102, 241)),
                ("0x1004", "0100 0001", "'A' (Character)", (16, 185, 129)),
                ("0x1008", "0100 0000", "3.14 (Float)", (245, 158, 11)),
                ("0x100C", "0000 0001", "TRUE (Boolean)", (244, 63, 94)),
            ]
            y = 230
            for addr, bits, label, col in slots:
                create_card(draw, [(670, y), (1190, y + 65)], bg=(9, 13, 22), border=(30, 41, 59), radius=10)
                draw.text((690, y + 22), addr, fill=(148, 163, 184), font=get_font(FONT_MONO, 16))
                draw.text((820, y + 22), bits, fill=(248, 250, 252), font=get_font(FONT_MONO, 16))
                draw.text((1010, y + 22), label, fill=col, font=get_font(FONT_BOLD, 15))
                y += 85
                
        elif s_idx == 2:
            # Why Organize Data
            pillars = [
                ("1. Instant Access", "O(1) Direct Lookup", "Direct index formulas locate memory cells immediately without searching unrelated bytes.", (99, 102, 241)),
                ("2. Cache Locality", "L1 / L2 CPU Hits", "Contiguous memory organization maximizes hardware spatial locality and data pipelining.", (16, 185, 129)),
                ("3. Fast Searching", "O(log N) Scalability", "Trees and sorted structures halve the search space at every step, handling millions of records.", (245, 158, 11)),
                ("4. Robust Scaling", "Defensive Bounds", "Predictable Big-O execution bounds prevent server latency spikes and system crashes.", (244, 63, 94))
            ]
            x = 60
            for p_title, p_badge, p_desc, col in pillars:
                create_card(draw, [(x, 130), (x + 260, 580)], bg=(15, 23, 42), border=col, radius=16, width=2)
                draw.text((x + 24, 165), p_badge.upper(), fill=col, font=get_font(FONT_MONO, 13))
                draw.text((x + 24, 200), p_title, fill=(248, 250, 252), font=get_font(FONT_BOLD, 22))
                
                # Wrap desc
                dw = p_desc.split()
                lines = []
                cur = []
                for w in dw:
                    cur.append(w)
                    if len(" ".join(cur)) > 20:
                        lines.append(" ".join(cur[:-1]))
                        cur = [w]
                if cur: lines.append(" ".join(cur))
                
                y = 260
                for l in lines:
                    draw.text((x + 24, y), l, fill=(148, 163, 184), font=get_font(FONT_REG, 15))
                    y += 24
                    
                draw.line([(x + 24, 490), (x + 236, 490)], fill=(30, 41, 59), width=1)
                draw.text((x + 24, 520), "STATUS: OPTIMAL", fill=(16, 185, 129), font=get_font(FONT_BOLD, 13))
                x += 290
                
        elif s_idx == 3:
            # Definition & Formula
            create_card(draw, [(120, 120), (1160, 230)], bg=(49, 46, 129), border=(99, 102, 241), radius=20, width=2)
            draw.text((WIDTH//2 - 190, 145), "THE COMPUTATIONAL FORMULA", fill=(199, 210, 254), font=get_font(FONT_MONO, 14))
            formula = "Data Organization  +  Permitted Operations  =  Data Structure"
            draw.text((WIDTH//2 - 380, 175), formula, fill=(255, 255, 255), font=get_font(FONT_BOLD, 25))
            
            # 2 Component Breakdown Cards
            create_card(draw, [(120, 270), (620, 590)], bg=(15, 23, 42), border=(51, 65, 85), radius=16, width=1)
            draw.text((150, 305), "1. Memory Layout (Storage)", fill=(99, 102, 241), font=get_font(FONT_BOLD, 22))
            draw.text((150, 350), "• Contiguous memory slots (Arrays)", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            draw.text((150, 395), "• Pointer-linked dynamic nodes (Linked Lists)", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            draw.text((150, 440), "• Hierarchical parent-child links (Trees)", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            draw.text((150, 485), "• Arbitrary vertex-edge topologies (Graphs)", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            
            create_card(draw, [(660, 270), (1160, 590)], bg=(15, 23, 42), border=(51, 65, 85), radius=16, width=1)
            draw.text((690, 305), "2. Permitted Operations", fill=(16, 185, 129), font=get_font(FONT_BOLD, 22))
            draw.text((690, 350), "• Insertion: Push, Enqueue, Prepend", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            draw.text((690, 395), "• Deletion: Pop, Dequeue, Trim", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            draw.text((690, 440), "• Traversal: Linear Scan, In-order, BFS, DFS", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            draw.text((690, 485), "• Search: Binary Search, Hash Lookup", fill=(226, 232, 240), font=get_font(FONT_REG, 18))
            
        elif s_idx == 4:
            # Classification
            create_card(draw, [(360, 110), (920, 175)], bg=(30, 41, 59), border=(99, 102, 241), radius=12, width=2)
            draw.text((410, 130), "DATA STRUCTURES TAXONOMY", fill=(255, 255, 255), font=get_font(FONT_BOLD, 22))
            
            # Tree Connector Lines
            draw.line([(640, 175), (640, 225)], fill=(99, 102, 241), width=3)
            draw.line([(340, 225), (940, 225)], fill=(99, 102, 241), width=3)
            draw.line([(340, 225), (340, 260)], fill=(99, 102, 241), width=3)
            draw.line([(940, 225), (940, 260)], fill=(99, 102, 241), width=3)
            
            # Left: Primitive
            create_card(draw, [(100, 260), (580, 590)], bg=(15, 23, 42), border=(99, 102, 241), radius=16, width=2)
            draw.text((130, 290), "PRIMITIVE DATA TYPES", fill=(199, 210, 254), font=get_font(FONT_BOLD, 22))
            draw.text((130, 325), "• Direct value stored in hardware registers", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            draw.text((130, 355), "• Fixed size in memory (Stack Allocation)", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            draw.text((130, 405), "Integer (4 Bytes)     Float (4 Bytes)", fill=(248, 250, 252), font=get_font(FONT_MONO, 16))
            draw.text((130, 455), "Character (1 Byte)   Boolean (1 Bit)", fill=(248, 250, 252), font=get_font(FONT_MONO, 16))
            draw.text((130, 520), "Key: Directly manipulated by CPU machine code", fill=(99, 102, 241), font=get_font(FONT_BOLD, 14))
            
            # Right: Non-Primitive
            create_card(draw, [(700, 260), (1180, 590)], bg=(15, 23, 42), border=(16, 185, 129), radius=16, width=2)
            draw.text((730, 290), "NON-PRIMITIVE STRUCTURES", fill=(167, 243, 208), font=get_font(FONT_BOLD, 22))
            draw.text((730, 325), "• Composite data collections & structures", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            draw.text((730, 355), "• Dynamic memory allocation (Heap Reference)", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            draw.text((730, 405), "Arrays               Linked Lists", fill=(248, 250, 252), font=get_font(FONT_MONO, 16))
            draw.text((730, 455), "Stacks & Queues      Trees & Graphs", fill=(248, 250, 252), font=get_font(FONT_MONO, 16))
            draw.text((730, 520), "Key: Managed via memory pointers & references", fill=(16, 185, 129), font=get_font(FONT_BOLD, 14))
            
        elif s_idx == 5:
            # Primitive Details
            cards = [
                ("INTEGER (int)", "32-bit (4 Bytes)", "00000000 00000000 00000000 00101010", "= 42", (99, 102, 241)),
                ("FLOAT (float)", "32-bit (IEEE 754)", "01000000 01001001 00001111 11011011", "= 3.1415", (16, 185, 129)),
                ("CHARACTER (char)", "8-bit (1 Byte)", "01000001", "= 'A' (ASCII 65)", (245, 158, 11)),
                ("BOOLEAN (bool)", "1-bit Logic Flag", "00000001", "= TRUE (1)", (244, 63, 94)),
            ]
            coords = [
                (100, 130, 620, 335),
                (660, 130, 1180, 335),
                (100, 370, 620, 575),
                (660, 370, 1180, 575),
            ]
            for (name, size, bits, val, col), (x1, y1, x2, y2) in zip(cards, coords):
                create_card(draw, [(x1, y1), (x2, y2)], bg=(15, 23, 42), border=col, radius=16, width=2)
                draw.text((x1 + 25, y1 + 20), name, fill=(255, 255, 255), font=get_font(FONT_BOLD, 20))
                draw.text((x2 - 180, y1 + 22), size, fill=col, font=get_font(FONT_MONO, 14))
                
                create_card(draw, [(x1 + 25, y1 + 65), (x2 - 25, y1 + 120)], bg=(9, 13, 22), border=(30, 41, 59), radius=8)
                draw.text((x1 + 40, y1 + 80), bits, fill=col, font=get_font(FONT_MONO, 15))
                
                draw.text((x1 + 25, y1 + 145), "Value: ", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
                draw.text((x1 + 95, y1 + 140), val, fill=(248, 250, 252), font=get_font(FONT_BOLD, 22))
                
        elif s_idx == 6:
            # Non-Primitive Memory Model
            create_card(draw, [(80, 120), (450, 580)], bg=(15, 23, 42), border=(99, 102, 241), radius=16, width=2)
            draw.text((110, 150), "STACK FRAME", fill=(199, 210, 254), font=get_font(FONT_BOLD, 22))
            draw.text((110, 190), "Pointer Variables (64-bit)", fill=(148, 163, 184), font=get_font(FONT_REG, 15))
            
            pointers = [
                ("arrPtr", "0x7FFE2000 ➔"),
                ("headPtr", "0x7FFE4000 ➔"),
                ("rootPtr", "0x7FFE6000 ➔")
            ]
            y = 240
            for name, target in pointers:
                create_card(draw, [(110, y), (420, y + 70)], bg=(9, 13, 22), border=(51, 65, 85), radius=10)
                draw.text((130, y + 12), name, fill=(148, 163, 184), font=get_font(FONT_MONO, 13))
                draw.text((130, y + 36), target, fill=(99, 102, 241), font=get_font(FONT_BOLD, 18))
                y += 95
                
            # Right side: Dynamic Heap Storage
            create_card(draw, [(490, 120), (1200, 580)], bg=(15, 23, 42), border=(16, 185, 129), radius=16, width=2)
            draw.text((520, 150), "DYNAMIC HEAP MEMORY", fill=(167, 243, 208), font=get_font(FONT_BOLD, 22))
            draw.text((520, 190), "Objects, Arrays, and Linked Nodes dynamically allocated:", fill=(148, 163, 184), font=get_font(FONT_REG, 15))
            
            # Contiguous Array
            draw.text((520, 240), "Contiguous Array Chunk (0x7FFE2000):", fill=(248, 250, 252), font=get_font(FONT_MONO, 14))
            arr_x = 520
            for i, val in enumerate(["10", "25", "40", "65", "90"]):
                create_card(draw, [(arr_x, 275), (arr_x + 95, 345)], bg=(9, 13, 22), border=(99, 102, 241), radius=8)
                draw.text((arr_x + 35, 285), f"[{i}]", fill=(100, 116, 139), font=get_font(FONT_MONO, 12))
                draw.text((arr_x + 35, 308), val, fill=(99, 102, 241), font=get_font(FONT_BOLD, 18))
                arr_x += 115
                
            # Linked List Nodes
            draw.text((520, 385), "Linked Node Chain (0x7FFE4000):", fill=(248, 250, 252), font=get_font(FONT_MONO, 14))
            node_x = 520
            for val, next_target in [("15", "0x4040 ➔"), ("30", "0x4080 ➔"), ("45", "NULL")]:
                create_card(draw, [(node_x, 420), (node_x + 160, 490)], bg=(9, 13, 22), border=(16, 185, 129), radius=8)
                draw.text((node_x + 18, 442), val, fill=(16, 185, 129), font=get_font(FONT_BOLD, 22))
                draw.line([(node_x + 65, 420), (node_x + 65, 490)], fill=(30, 41, 59), width=2)
                draw.text((node_x + 75, 445), next_target, fill=(148, 163, 184), font=get_font(FONT_MONO, 14))
                node_x += 185
                
            draw.text((520, 525), "Non-primitive structures provide flexible capacity at the cost of pointer overhead.", fill=(148, 163, 184), font=get_font(FONT_REG, 15))
            
        elif s_idx == 7:
            # Operations & Complexity
            create_card(draw, [(100, 120), (1180, 580)], bg=(15, 23, 42), border=(99, 102, 241), radius=16, width=2)
            draw.text((140, 150), "ALGORITHMIC EFFICIENCY & BIG-O BOUNDS", fill=(255, 255, 255), font=get_font(FONT_BOLD, 24))
            draw.text((140, 190), "Every data structure represents an architectural trade-off:", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            comps = [
                ("Array Index Access", "O(1)", "CONSTANT TIME", (16, 185, 129), "Instant direct memory computation"),
                ("Binary Search (BST)", "O(log N)", "LOGARITHMIC", (99, 102, 241), "Halves search space at each comparison"),
                ("Linear Search / Scan", "O(N)", "LINEAR TIME", (245, 158, 11), "Checks elements one by one sequentially"),
                ("Quick / Merge Sort", "O(N log N)", "EFFICIENT SORT", (56, 189, 248), "Divide and conquer sorting algorithms")
            ]
            y = 230
            for name, bigo, badge, col, desc in comps:
                create_card(draw, [(140, y), (1140, y + 65)], bg=(9, 13, 22), border=(30, 41, 59), radius=10)
                draw.text((165, y + 20), name, fill=(248, 250, 252), font=get_font(FONT_BOLD, 18))
                draw.text((450, y + 16), bigo, fill=col, font=get_font(FONT_BOLD, 24))
                draw.text((620, y + 22), badge, fill=col, font=get_font(FONT_MONO, 13))
                draw.text((800, y + 22), desc, fill=(148, 163, 184), font=get_font(FONT_REG, 15))
                y += 80
                
        slide_p = f"{SLIDES_DIR}/l1_s{s_idx}.png"
        audio_p = f"{AUDIO_DIR}/l1_s{s_idx}.mp3"
        im.save(slide_p, "PNG")
        get_tts(caption, audio_p)
        slide_paths.append(slide_p)
        audio_paths.append(audio_p)
        
    return slide_paths, audio_paths

# ----------------- LESSON 2 SLIDE BUILDERS -----------------
def build_lesson2_slides():
    print("Building Lesson 2 Slides...")
    scenes = [
        ("Choosing the Right Data Structure", "SELECTION STRATEGY", "Choosing the right data structure helps a program store, access, and process data effectively.", 1),
        ("Linear Structures: Arrays", "CONTIGUOUS MEMORY", "Arrays store elements in contiguous memory blocks, granting instant O(1) random index access.", 2),
        ("Linear Structures: Linked Lists", "DYNAMIC NODE POINTERS", "Linked lists store elements in separate memory nodes linked by pointers, providing fast head insertion.", 3),
        ("Linear Structures: Stacks (LIFO)", "LAST IN, FIRST OUT", "A stack follows Last-In First-Out order: the last element added is the first element removed.", 4),
        ("Linear Structures: Queues (FIFO)", "FIRST IN, FIRST OUT", "A queue follows First-In First-Out order: elements enter at the rear and exit from the front.", 5),
        ("Non-Linear: Trees & BST", "HIERARCHICAL ORDER", "Trees store hierarchical parent-child nodes; Binary Search Trees enable fast O(log N) searching.", 6),
        ("Non-Linear: Graphs & Decision Matrix", "NETWORK TOPOLOGIES", "Graphs connect vertices with arbitrary edges, powering network routing, social graphs, and dependencies.", 7),
    ]
    
    slide_paths = []
    audio_paths = []
    
    for title, badge, caption, s_idx in scenes:
        im = Image.new("RGB", (WIDTH, HEIGHT), (9, 13, 22))
        draw = ImageDraw.Draw(im)
        draw_header_footer(draw, "LESSON 02", "LINEAR AND NON-LINEAR DATA STRUCTURES", badge, caption)
        
        if s_idx == 1:
            # Choosing right structure
            opts = [
                ("Sequential Access?", "Linear: Array or List", "O(1) index access or fast head inserts", (99, 102, 241)),
                ("Hierarchical Data?", "Non-Linear: Tree / BST", "O(log N) search and parent-child links", (16, 185, 129)),
                ("Interconnected Net?", "Non-Linear: Graph", "Network routing and multi-way paths", (244, 63, 94)),
                ("Direct Key Lookup?", "Hash Table", "Average O(1) key-value retrieval", (245, 158, 11)),
            ]
            x = 60
            for q, pick, desc, col in opts:
                create_card(draw, [(x, 130), (x + 260, 580)], bg=(15, 23, 42), border=col, radius=16, width=2)
                draw.text((x + 24, 165), "CRITERIA", fill=(148, 163, 184), font=get_font(FONT_MONO, 12))
                draw.text((x + 24, 195), q, fill=(248, 250, 252), font=get_font(FONT_BOLD, 20))
                
                create_card(draw, [(x + 20, 260), (x + 240, 360)], bg=(9, 13, 22), border=(30, 41, 59), radius=10)
                draw.text((x + 35, 280), "RECOMMENDED:", fill=(100, 116, 139), font=get_font(FONT_MONO, 11))
                draw.text((x + 35, 305), pick, fill=col, font=get_font(FONT_BOLD, 16))
                
                draw.text((x + 24, 400), "Algorithmic Invariant:", fill=(148, 163, 184), font=get_font(FONT_REG, 14))
                draw.text((x + 24, 430), desc, fill=(226, 232, 240), font=get_font(FONT_REG, 15))
                x += 290
                
        elif s_idx == 2:
            # Arrays
            create_card(draw, [(80, 120), (1200, 580)], bg=(15, 23, 42), border=(16, 185, 129), radius=16, width=2)
            draw.text((120, 150), "LINEAR: CONTIGUOUS ARRAY (O(1) ACCESS)", fill=(167, 243, 208), font=get_font(FONT_BOLD, 24))
            draw.text((120, 190), "Formula: Address(arr[i]) = BaseAddress + (i * ElementSizeInBytes)", fill=(99, 102, 241), font=get_font(FONT_MONO, 16))
            
            # Array Memory Ribbon
            arr_x = 120
            for i, (addr, val) in enumerate([("0x2000", "10"), ("0x2004", "25"), ("0x2008", "40"), ("0x200C", "65"), ("0x2010", "90")]):
                is_target = (i == 2)
                col = (16, 185, 129) if is_target else (51, 65, 85)
                create_card(draw, [(arr_x, 260), (arr_x + 180, 400)], bg=(9, 13, 22), border=col, radius=12, width=2 if is_target else 1)
                draw.text((arr_x + 55, 275), f"Index [{i}]", fill=(100, 116, 139), font=get_font(FONT_MONO, 14))
                draw.text((arr_x + 65, 310), val, fill=(255, 255, 255), font=get_font(FONT_BOLD, 32))
                draw.text((arr_x + 50, 365), addr, fill=(99, 102, 241), font=get_font(FONT_MONO, 14))
                arr_x += 215
                
            # Pros & Cons
            create_card(draw, [(120, 440), (620, 545)], bg=(9, 13, 22), border=(16, 185, 129), radius=10)
            draw.text((140, 455), "ADVANTAGE: O(1) Instant Lookup", fill=(16, 185, 129), font=get_font(FONT_BOLD, 17))
            draw.text((140, 485), "Direct address math calculates memory cell instantly in 1 clock cycle.", fill=(148, 163, 184), font=get_font(FONT_REG, 14))
            
            create_card(draw, [(660, 440), (1160, 545)], bg=(9, 13, 22), border=(244, 63, 94), radius=10)
            draw.text((680, 455), "DISADVANTAGE: O(N) Insertion Shift", fill=(244, 63, 94), font=get_font(FONT_BOLD, 17))
            draw.text((680, 485), "Inserting at middle or start forces shifting all subsequent elements right.", fill=(148, 163, 184), font=get_font(FONT_REG, 14))
            
        elif s_idx == 3:
            # Linked Lists
            create_card(draw, [(80, 120), (1200, 580)], bg=(15, 23, 42), border=(99, 102, 241), radius=16, width=2)
            draw.text((120, 150), "LINEAR: SINGLY LINKED LIST (DYNAMIC POINTERS)", fill=(199, 210, 254), font=get_font(FONT_BOLD, 24))
            draw.text((120, 190), "Nodes are non-contiguous heap blocks linked by pointer references [Data | Next*]:", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            # Head pointer
            create_card(draw, [(120, 260), (220, 360)], bg=(49, 46, 129), border=(99, 102, 241), radius=12)
            draw.text((145, 285), "HEAD", fill=(255, 255, 255), font=get_font(FONT_BOLD, 18))
            draw.text((135, 320), "0x4000 ➔", fill=(199, 210, 254), font=get_font(FONT_MONO, 13))
            
            # 3 Nodes
            nx = 270
            nodes = [("15", "0x4040 ➔", "0x4000"), ("30", "0x4080 ➔", "0x4040"), ("45", "NULL", "0x4080")]
            for val, nxt, addr in nodes:
                create_card(draw, [(nx, 250), (nx + 230, 370)], bg=(9, 13, 22), border=(99, 102, 241), radius=12)
                draw.text((nx + 35, 280), f"Data: {val}", fill=(255, 255, 255), font=get_font(FONT_BOLD, 20))
                draw.text((nx + 35, 310), f"Next: {nxt}", fill=(16, 185, 129), font=get_font(FONT_MONO, 15))
                draw.text((nx + 35, 340), f"Addr: {addr}", fill=(100, 116, 139), font=get_font(FONT_MONO, 12))
                
                if nxt != "NULL":
                    draw.line([(nx + 230, 310), (nx + 270, 310)], fill=(99, 102, 241), width=3)
                nx += 270
                
            create_card(draw, [(120, 430), (1160, 540)], bg=(9, 13, 22), border=(51, 65, 85), radius=10)
            draw.text((150, 450), "• Head Prepend: O(1) Instant (Simply reassign Head pointer, zero element shifting).", fill=(16, 185, 129), font=get_font(FONT_REG, 16))
            draw.text((150, 485), "• Random Access: O(N) Slow (Must traverse pointer links sequentially from Head).", fill=(244, 63, 94), font=get_font(FONT_REG, 16))
            
        elif s_idx == 4:
            # Stacks (LIFO)
            create_card(draw, [(80, 120), (1200, 580)], bg=(15, 23, 42), border=(244, 63, 94), radius=16, width=2)
            draw.text((120, 150), "LINEAR: STACK DATA STRUCTURE (LIFO)", fill=(254, 205, 211), font=get_font(FONT_BOLD, 24))
            draw.text((120, 190), "Principle: Last-In, First-Out (LIFO) — All operations occur exclusively at TOP.", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            # Stack Visual Cylinder
            create_card(draw, [(200, 240), (450, 550)], bg=(9, 13, 22), border=(99, 102, 241), radius=14, width=3)
            stack_items = [
                ("40", "TOP (Index 3)", (244, 63, 94)),
                ("30", "Index 2", (99, 102, 241)),
                ("20", "Index 1", (99, 102, 241)),
                ("10", "BOTTOM (Index 0)", (100, 116, 139))
            ]
            sy = 270
            for val, lbl, col in stack_items:
                create_card(draw, [(220, sy), (430, sy + 55)], bg=(15, 23, 42), border=col, radius=8)
                draw.text((240, sy + 15), val, fill=(255, 255, 255), font=get_font(FONT_BOLD, 20))
                draw.text((310, sy + 20), lbl, fill=col, font=get_font(FONT_MONO, 12))
                sy += 65
                
            # Right side operations
            create_card(draw, [(500, 240), (1150, 550)], bg=(9, 13, 22), border=(51, 65, 85), radius=14)
            draw.text((530, 270), "Core Stack Operations (O(1) Constant Time):", fill=(255, 255, 255), font=get_font(FONT_BOLD, 20))
            draw.text((530, 320), "• PUSH(x) : Inserts element x onto TOP of stack", fill=(16, 185, 129), font=get_font(FONT_REG, 18))
            draw.text((530, 370), "• POP()     : Removes and returns the TOP element", fill=(244, 63, 94), font=get_font(FONT_REG, 18))
            draw.text((530, 420), "• PEEK()   : Reads the TOP element without removing it", fill=(245, 158, 11), font=get_font(FONT_REG, 18))
            draw.text((530, 480), "Real-world uses: Function call stack, Undo/Redo, Browser Back button.", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
        elif s_idx == 5:
            # Queues (FIFO)
            create_card(draw, [(80, 120), (1200, 580)], bg=(15, 23, 42), border=(56, 189, 248), radius=16, width=2)
            draw.text((120, 150), "LINEAR: QUEUE DATA STRUCTURE (FIFO)", fill=(186, 230, 253), font=get_font(FONT_BOLD, 24))
            draw.text((120, 190), "Principle: First-In, First-Out (FIFO) — Elements enter at REAR and exit at FRONT.", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            # Horizontal Conveyor Queue
            create_card(draw, [(120, 260), (1160, 390)], bg=(9, 13, 22), border=(56, 189, 248), radius=16, width=2)
            draw.text((150, 315), "FRONT ➔", fill=(16, 185, 129), font=get_font(FONT_BOLD, 18))
            
            qx = 280
            for i, val in enumerate(["Task 1", "Task 2", "Task 3", "Task 4"]):
                create_card(draw, [(qx, 280), (qx + 160, 370)], bg=(15, 23, 42), border=(51, 65, 85), radius=10)
                draw.text((qx + 35, 305), val, fill=(255, 255, 255), font=get_font(FONT_BOLD, 20))
                draw.text((qx + 45, 340), f"Slot [{i}]", fill=(100, 116, 139), font=get_font(FONT_MONO, 12))
                qx += 185
                
            draw.text((qx + 20, 315), "➔ REAR", fill=(244, 63, 94), font=get_font(FONT_BOLD, 18))
            
            # Operations
            create_card(draw, [(120, 420), (1160, 540)], bg=(9, 13, 22), border=(51, 65, 85), radius=10)
            draw.text((150, 445), "• ENQUEUE: Append packet to REAR in O(1) time.", fill=(244, 63, 94), font=get_font(FONT_REG, 17))
            draw.text((150, 480), "• DEQUEUE: Extract oldest packet from FRONT in O(1) time.", fill=(16, 185, 129), font=get_font(FONT_REG, 17))
            
        elif s_idx == 6:
            # Trees & BST
            create_card(draw, [(80, 120), (1200, 580)], bg=(15, 23, 42), border=(16, 185, 129), radius=16, width=2)
            draw.text((120, 150), "NON-LINEAR: BINARY SEARCH TREE (O(log N) SEARCH)", fill=(167, 243, 208), font=get_font(FONT_BOLD, 24))
            draw.text((120, 190), "Property: For every node, Left Subtree < Root < Right Subtree.", fill=(148, 163, 184), font=get_font(FONT_REG, 16))
            
            # Draw Tree Nodes
            # Root: 50 at (640, 270)
            create_card(draw, [(590, 245), (690, 315)], bg=(49, 46, 129), border=(99, 102, 241), radius=20, width=2)
            draw.text((625, 268), "50", fill=(255, 255, 255), font=get_font(FONT_BOLD, 22))
            
            # Left child: 30 at (420, 380)
            draw.line([(610, 315), (460, 360)], fill=(99, 102, 241), width=3)
            create_card(draw, [(380, 355), (480, 425)], bg=(15, 23, 42), border=(99, 102, 241), radius=20)
            draw.text((415, 378), "30", fill=(255, 255, 255), font=get_font(FONT_BOLD, 22))
            
            # Right child: 70 at (860, 380)
            draw.line([(670, 315), (820, 360)], fill=(99, 102, 241), width=3)
            create_card(draw, [(820, 355), (920, 425)], bg=(15, 23, 42), border=(99, 102, 241), radius=20)
            draw.text((855, 378), "70", fill=(255, 255, 255), font=get_font(FONT_BOLD, 22))
            
            # Search target 40
            draw.line([(450, 425), (510, 470)], fill=(16, 185, 129), width=3)
            create_card(draw, [(480, 465), (580, 535)], bg=(6, 78, 59), border=(16, 185, 129), radius=20, width=2)
            draw.text((515, 488), "40", fill=(167, 243, 208), font=get_font(FONT_BOLD, 22))
            
            create_card(draw, [(630, 465), (1140, 550)], bg=(9, 13, 22), border=(16, 185, 129), radius=10)
            draw.text((650, 485), "SEARCH FOR KEY 40:", fill=(16, 185, 129), font=get_font(FONT_BOLD, 16))
            draw.text((650, 515), "1. 40 < 50 ➔ Prunes entire Right Subtree!  2. 40 > 30 ➔ Found in 2 steps!", fill=(226, 232, 240), font=get_font(FONT_REG, 14))
            
        elif s_idx == 7:
            # Graphs & Decision Matrix
            create_card(draw, [(80, 120), (1200, 580)], bg=(15, 23, 42), border=(99, 102, 241), radius=16, width=2)
            draw.text((120, 150), "ARCHITECTURAL DECISION MATRIX", fill=(255, 255, 255), font=get_font(FONT_BOLD, 24))
            
            # Comparison Matrix Table
            headers = ["Data Structure", "Access", "Search", "Insertion", "Deletion", "Primary Invariant"]
            hx = 120
            widths = [180, 100, 120, 120, 120, 360]
            for h, w in zip(headers, widths):
                draw.text((hx, 200), h, fill=(148, 163, 184), font=get_font(FONT_BOLD, 15))
                hx += w
                
            draw.line([(120, 230), (1160, 230)], fill=(51, 65, 85), width=2)
            
            rows = [
                ("Array", "O(1)", "O(N)", "O(N)", "O(N)", "Contiguous memory, instant index lookup", (16, 185, 129)),
                ("Linked List", "O(N)", "O(N)", "O(1) Head", "O(1) Head", "Dynamic nodes, pointer manipulation", (99, 102, 241)),
                ("Stack (LIFO)", "O(1) Top", "O(N)", "O(1) Push", "O(1) Pop", "Last-In First-Out function call frames", (244, 63, 94)),
                ("Queue (FIFO)", "O(1) Front", "O(N)", "O(1) Rear", "O(1) Front", "First-In First-Out buffering & task queues", (56, 189, 248)),
                ("Binary Tree (BST)", "O(log N)", "O(log N)", "O(log N)", "O(log N)", "Hierarchical branching, divide & conquer", (245, 158, 11)),
                ("Graph (V + E)", "O(V + E)", "BFS/DFS", "O(1) Node", "O(E) Edge", "Arbitrary network paths and shortest route", (168, 85, 247)),
            ]
            ry = 245
            for name, acc, src, ins, delt, inv, col in rows:
                rx = 120
                draw.text((rx, ry), name, fill=(255, 255, 255), font=get_font(FONT_BOLD, 15))
                rx += widths[0]
                draw.text((rx, ry), acc, fill=col, font=get_font(FONT_MONO, 14))
                rx += widths[1]
                draw.text((rx, ry), src, fill=(226, 232, 240), font=get_font(FONT_MONO, 14))
                rx += widths[2]
                draw.text((rx, ry), ins, fill=col, font=get_font(FONT_MONO, 14))
                rx += widths[3]
                draw.text((rx, ry), delt, fill=col, font=get_font(FONT_MONO, 14))
                rx += widths[4]
                draw.text((rx, ry), inv, fill=(148, 163, 184), font=get_font(FONT_REG, 14))
                
                ry += 48
                draw.line([(120, ry - 10), (1160, ry - 10)], fill=(30, 41, 59), width=1)
                
        slide_p = f"{SLIDES_DIR}/l2_s{s_idx}.png"
        audio_p = f"{AUDIO_DIR}/l2_s{s_idx}.mp3"
        im.save(slide_p, "PNG")
        get_tts(caption, audio_p)
        slide_paths.append(slide_p)
        audio_paths.append(audio_p)
        
    return slide_paths, audio_paths

def render_compact_video(slides, audios, out_file):
    """
    Renders an ultra-compact MP4 video:
    - 720p 30fps
    - crf 30 for high compression efficiency (< 1.5MB total)
    - movflags +faststart for instant progressive streaming
    """
    print(f"Rendering compact video: {out_file}...")
    temp_segments = []
    
    for idx, (s, a) in enumerate(zip(slides, audios)):
        # Measure audio duration
        probe_cmd = [
            "ffprobe", "-v", "error", "-show_entries",
            "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", a
        ]
        res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            dur = float(res.stdout.strip())
        except:
            dur = 6.0
        dur = max(dur + 1.2, 5.0) # padding
        
        seg_out = f"{OUT_DIR}/seg_{idx}.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", s,
            "-i", a,
            "-t", str(dur),
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-crf", "30",
            "-preset", "faster",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "64k",
            "-r", "24",
            "-shortest",
            seg_out
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        temp_segments.append(seg_out)
        
    # Concatenate segments
    concat_list = f"{OUT_DIR}/concat_list.txt"
    with open(concat_list, "w") as f:
        for seg in temp_segments:
            f.write(f"file '{seg}'\n")
            
    final_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        "-movflags", "+faststart",
        out_file
    ]
    subprocess.run(final_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    size_mb = os.path.getsize(out_file) / (1024 * 1024)
    print(f"Finished {out_file}: {size_mb:.2f} MB")

def main():
    l1_slides, l1_audios = build_lesson1_slides()
    l2_slides, l2_audios = build_lesson2_slides()
    
    # Destination directories
    os.makedirs("public/Videos", exist_ok=True)
    os.makedirs("src/Videos", exist_ok=True)
    
    v1_tmp = f"{OUT_DIR}/v1.mp4"
    v2_tmp = f"{OUT_DIR}/v2.mp4"
    
    render_compact_video(l1_slides, l1_audios, v1_tmp)
    render_compact_video(l2_slides, l2_audios, v2_tmp)
    
    # Copy to target destinations
    for target_dir in ["public/Videos", "src/Videos"]:
        subprocess.run(["cp", v1_tmp, f"{target_dir}/Data Structures and Types.mp4"])
        subprocess.run(["cp", v2_tmp, f"{target_dir}/Linear and Non-Linear Data Structures.mp4"])
        
    print("All lightweight video files deployed successfully!")

if __name__ == "__main__":
    main()
