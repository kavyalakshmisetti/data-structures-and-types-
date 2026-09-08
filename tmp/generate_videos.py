import os
import subprocess
import wave
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1280
HEIGHT = 720

os.makedirs("/tmp/vids/slides", exist_ok=True)
os.makedirs("src/Videos", exist_ok=True)

try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 34)
    font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    font_code = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 18)
    font_badge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_huge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 42)
except:
    font_title = ImageFont.load_default()
    font_subtitle = font_title
    font_body = font_title
    font_code = font_title
    font_badge = font_title
    font_huge = font_title

def draw_header(draw, topic_badge, main_title, subtitle):
    # Top banner background
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=(15, 23, 42))
    draw.line([(0, 70), (WIDTH, 70)], fill=(51, 65, 85), width=2)
    
    # Topic Badge
    draw.rounded_rectangle([(30, 18), (280, 52)], radius=6, fill=(30, 41, 59), outline=(99, 102, 241), width=1)
    draw.text((45, 25), topic_badge, fill=(165, 180, 252), font=font_badge)
    
    # Main Header
    draw.text((310, 18), main_title, fill=(248, 250, 252), font=font_title)
    
    # Subtitle at top right
    draw.text((WIDTH - 380, 26), subtitle, fill=(148, 163, 184), font=font_subtitle)

def draw_card(draw, x1, y1, x2, y2, bg_color=(20, 29, 47), border_color=(51, 65, 85), title="", badge=""):
    draw.rounded_rectangle([(x1, y1), (x2, y2)], radius=12, fill=bg_color, outline=border_color, width=2)
    if badge:
        draw.rounded_rectangle([(x1 + 16, y1 + 14), (x1 + 150, y1 + 38)], radius=6, fill=(30, 41, 59), outline=(99, 102, 241), width=1)
        draw.text((x1 + 24, y1 + 18), badge, fill=(199, 210, 254), font=font_badge)
    if title:
        draw.text((x1 + 16, y1 + 46), title, fill=(241, 245, 249), font=font_subtitle)

def draw_footer_caption(draw, text):
    # Footer caption bar
    draw.rectangle([(0, HEIGHT - 85), (WIDTH, HEIGHT)], fill=(15, 23, 42))
    draw.line([(0, HEIGHT - 85), (WIDTH, HEIGHT - 85)], fill=(51, 65, 85), width=2)
    
    draw.rounded_rectangle([(40, HEIGHT - 70), (160, HEIGHT - 35)], radius=6, fill=(49, 46, 129), outline=(129, 140, 248), width=1)
    draw.text((55, HEIGHT - 63), "AUDIO NARRATION", fill=(224, 231, 255), font=font_badge)
    
    draw.text((180, HEIGHT - 64), f'"{text}"', fill=(226, 232, 240), font=font_subtitle)

# ==========================================
# BUILD SLIDES FOR VIDEO 1: Data Structures and Types (67 seconds)
# ==========================================

def build_v1_s1():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "01. What is Data?", "Fundamentals")
    
    draw_card(draw, 60, 110, 600, 580, title="Raw Facts & Information", badge="CONCEPT DEFINITION")
    draw.text((80, 180), "Data refers to raw, unorganized facts, figures, and symbols\nbefore processing into contextual knowledge.", fill=(203, 213, 225), font=font_body)
    
    examples = [
        ("Numbers:", "42, 3.1415, 1024, -17"),
        ("Characters:", "'A', 'Z', '$', '#', '@'"),
        ("Text Strings:", "\"Algorithm\", \"Stack\", \"Array\""),
        ("Logical Flags:", "True, False (1 / 0)")
    ]
    y = 260
    for label, val in examples:
        draw.rounded_rectangle([(80, y), (580, y + 50)], radius=8, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw.text((100, y + 15), label, fill=(148, 163, 184), font=font_body)
        draw.text((250, y + 15), val, fill=(129, 140, 248), font=font_code)
        y += 65
        
    draw_card(draw, 640, 110, 1220, 580, title="Visualized Data Elements", badge="REPRESENTATION")
    # Draw scattered numbers and symbols transforming into table
    draw.text((670, 180), "Unorganized Data vs Machine Memory:", fill=(203, 213, 225), font=font_body)
    
    cells = [("0x100", "42"), ("0x104", "'A'"), ("0x108", "3.14"), ("0x10C", "TRUE"), ("0x110", "\"DSA\"")]
    cx = 670
    for addr, val in cells:
        draw.rectangle([(cx, 260), (cx + 100, 360)], fill=(30, 41, 59), outline=(99, 102, 241), width=2)
        draw.text((cx + 15, 275), addr, fill=(148, 163, 184), font=font_badge)
        draw.line([(cx, 305), (cx + 100, 305)], fill=(71, 85, 105), width=1)
        draw.text((cx + 25, 320), val, fill=(52, 211, 153), font=font_code)
        cx += 105

    draw_footer_caption(draw, "Data means raw facts and information, such as numbers, characters, words, or symbols.")
    img.save("/tmp/vids/slides/v1_s1.png")

def build_v1_s2():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "02. Organized Data", "Efficiency & Access")
    
    draw_card(draw, 60, 110, 1220, 580, title="Why Organize Data?", badge="SYSTEM EFFICIENCY")
    draw.text((90, 180), "When data is organized properly, it becomes dramatically easier to:", fill=(203, 213, 225), font=font_subtitle)
    
    pillars = [
        ("Fast Access", "O(1) direct indexing via contiguous memory offsets.", (52, 211, 153)),
        ("Easy Management", "Systematic allocation and cleanup of runtime buffers.", (96, 165, 250)),
        ("Efficient Search", "Binary search O(log N) on sorted datasets vs O(N) scan.", (244, 114, 182)),
        ("Scalable Processing", "Pipelining high volumes without memory fragmentation.", (251, 191, 36))
    ]
    
    px = 90
    for title, desc, col in pillars:
        draw.rounded_rectangle([(px, 240), (px + 260, 480)], radius=12, fill=(15, 23, 42), outline=col, width=2)
        draw.text((px + 20, 265), title, fill=col, font=font_subtitle)
        draw.line([(px + 20, 305), (px + 240, 305)], fill=(51, 65, 85), width=1)
        # wrap text
        words = desc.split()
        line = ""
        ly = 325
        for w in words:
            if len(line + " " + w) > 22:
                draw.text((px + 20, ly), line, fill=(203, 213, 225), font=font_body)
                line = w
                ly += 28
            else:
                line = (line + " " + w).strip()
        if line:
            draw.text((px + 20, ly), line, fill=(203, 213, 225), font=font_body)
        px += 280

    draw_footer_caption(draw, "When data is organized properly, it becomes easier to access, manage, search, and process.")
    img.save("/tmp/vids/slides/v1_s2.png")

def build_v1_s3():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "03. Data Structures Definition", "Core Definition")
    
    draw_card(draw, 60, 110, 1220, 580, title="Data Structure = Storage Layout + Set of Operations", badge="CORE PRINCIPLE")
    draw.text((90, 180), "A data structure is a specialized format for organizing, processing, retrieving and storing data.", fill=(203, 213, 225), font=font_subtitle)
    
    # Mathematical equation box
    draw.rounded_rectangle([(120, 240), (1160, 350)], radius=16, fill=(30, 41, 59), outline=(99, 102, 241), width=3)
    draw.text((150, 275), "Data Structure  =  Data Organization (Memory)  +  Algorithms (Operations)", fill=(244, 244, 245), font=font_huge)
    
    # 3 operational pillars
    ops = [
        ("Insertion / Deletion", "Adding or removing elements efficiently"),
        ("Traversal / Iteration", "Systematically visiting every element"),
        ("Access / Search", "Finding targets with minimal time complexity")
    ]
    ox = 120
    for op, desc in ops:
        draw.rounded_rectangle([(ox, 380), (ox + 320, 500)], radius=10, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw.text((ox + 20, 405), op, fill=(165, 180, 252), font=font_subtitle)
        draw.text((ox + 20, 445), desc, fill=(148, 163, 184), font=font_body)
        ox += 350

    draw_footer_caption(draw, "Data structures are ways of organizing and storing data, so that we can use it efficiently.")
    img.save("/tmp/vids/slides/v1_s3.png")

def build_v1_s4():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "04. Classification of Data Structures", "Architecture")
    
    # Root Node
    draw.rounded_rectangle([(440, 110), (840, 180)], radius=12, fill=(49, 46, 129), outline=(129, 140, 248), width=3)
    draw.text((490, 130), "DATA STRUCTURES", fill=(255, 255, 255), font=font_title)
    
    # Branches
    draw.line([(540, 180), (320, 240)], fill=(129, 140, 248), width=3)
    draw.line([(740, 180), (960, 240)], fill=(129, 140, 248), width=3)
    
    # Primitive Node
    draw.rounded_rectangle([(160, 240), (480, 310)], radius=10, fill=(30, 41, 59), outline=(52, 211, 153), width=2)
    draw.text((190, 260), "1. PRIMITIVE STRUCTURES", fill=(52, 211, 153), font=font_subtitle)
    
    # Non-Primitive Node
    draw.rounded_rectangle([(800, 240), (1120, 310)], radius=10, fill=(30, 41, 59), outline=(96, 165, 250), width=2)
    draw.text((820, 260), "2. NON-PRIMITIVE STRUCTURES", fill=(96, 165, 250), font=font_subtitle)
    
    # Primitive content
    draw.rounded_rectangle([(160, 340), (480, 560)], radius=10, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
    draw.text((180, 360), "Basic machine-level types:", fill=(203, 213, 225), font=font_body)
    draw.text((180, 400), "• Integer  (4 bytes)", fill=(165, 180, 252), font=font_body)
    draw.text((180, 440), "• Float    (4/8 bytes)", fill=(165, 180, 252), font=font_body)
    draw.text((180, 480), "• Character (1/2 bytes)", fill=(165, 180, 252), font=font_body)
    draw.text((180, 520), "• Boolean   (1 bit/byte)", fill=(165, 180, 252), font=font_body)

    # Non-primitive content
    draw.rounded_rectangle([(800, 340), (1120, 560)], radius=10, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
    draw.text((820, 360), "Composites organizing values:", fill=(203, 213, 225), font=font_body)
    draw.text((820, 400), "• Linear: Arrays, Linked Lists", fill=(147, 197, 253), font=font_body)
    draw.text((820, 440), "• Linear: Stacks, Queues", fill=(147, 197, 253), font=font_body)
    draw.text((820, 480), "• Non-Linear: Trees", fill=(244, 114, 182), font=font_body)
    draw.text((820, 520), "• Non-Linear: Graphs", fill=(244, 114, 182), font=font_body)

    draw_footer_caption(draw, "Data structures can be broadly classified into Primitive and Non-Primitive data structures.")
    img.save("/tmp/vids/slides/v1_s4.png")

def build_v1_s5():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "05. Primitive Data Structures", "Atomic Values")
    
    draw.text((60, 95), "Primitive structures hold single, indivisible raw values directly in hardware registers or stack frames:", fill=(203, 213, 225), font=font_subtitle)
    
    primitives = [
        ("INTEGER", "Stores whole numbers without fractions.", "Examples: -50, 0, 42, 999", "int age = 25;", (52, 211, 153)),
        ("FLOAT / DOUBLE", "Stores real numbers with fractional points.", "Examples: 3.1415, -0.05, 9.8", "float pi = 3.14f;", (96, 165, 250)),
        ("CHARACTER", "Stores single alphanumeric glyph or symbol.", "Examples: 'A', '7', '$', '\\n'", "char grade = 'A';", (244, 114, 182)),
        ("BOOLEAN", "Stores 1-bit binary logical truth state.", "Examples: True (1), False (0)", "bool isActive = true;", (251, 191, 36))
    ]
    
    px = 60
    for name, desc, ex, code, col in primitives:
        draw.rounded_rectangle([(px, 140), (px + 265, 560)], radius=12, fill=(15, 23, 42), outline=col, width=2)
        draw.text((px + 20, 165), name, fill=col, font=font_title)
        draw.line([(px + 20, 215), (px + 245, 215)], fill=(51, 65, 85), width=1)
        
        draw.text((px + 20, 235), "Description:", fill=(148, 163, 184), font=font_badge)
        words = desc.split()
        line = ""
        ly = 260
        for w in words:
            if len(line + " " + w) > 20:
                draw.text((px + 20, ly), line, fill=(203, 213, 225), font=font_body)
                line = w
                ly += 26
            else:
                line = (line + " " + w).strip()
        if line:
            draw.text((px + 20, ly), line, fill=(203, 213, 225), font=font_body)
            
        draw.text((px + 20, 360), "Values:", fill=(148, 163, 184), font=font_badge)
        draw.text((px + 20, 385), ex, fill=(244, 244, 245), font=font_body)
        
        draw.rounded_rectangle([(px + 15, 460), (px + 250, 525)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw.text((px + 25, 485), code, fill=(52, 211, 153), font=font_code)
        
        px += 295

    draw_footer_caption(draw, "Primitive data structures are basic data types that directly store simple values: Integer, Float, Character, and Boolean.")
    img.save("/tmp/vids/slides/v1_s5.png")

def build_v1_s6():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "06. Non-Primitive Data Structures", "Composites")
    
    draw.text((60, 95), "Non-primitive structures group multiple primitive or composite elements into structured relationships:", fill=(203, 213, 225), font=font_subtitle)
    
    non_prims = [
        ("Arrays", "Fixed-size contiguous blocks of identical elements.", "Access O(1) by index"),
        ("Linked Lists", "Nodes holding values + pointers to next node.", "Dynamic size O(1) insert"),
        ("Stacks", "LIFO (Last-In First-Out) push and pop deck.", "Call stacks, undo buffer"),
        ("Queues", "FIFO (First-In First-Out) enqueue & dequeue line.", "Task scheduling, buffers"),
        ("Trees", "Hierarchical root with parent-child child branches.", "DOM, AST, Binary Search"),
        ("Graphs", "Interconnected networks of vertices and edges.", "Social networks, Maps")
    ]
    
    positions = [
        (60, 140), (440, 140), (820, 140),
        (60, 360), (440, 360), (820, 360)
    ]
    
    for i, (name, desc, benefit) in enumerate(non_prims):
        x, y = positions[i]
        draw.rounded_rectangle([(x, y), (x + 360, y + 190)], radius=12, fill=(15, 23, 42), outline=(99, 102, 241), width=2)
        draw.text((x + 20, y + 18), name, fill=(244, 244, 245), font=font_title)
        draw.line([(x + 20, y + 60), (x + 340, y + 60)], fill=(51, 65, 85), width=1)
        draw.text((x + 20, y + 75), desc, fill=(203, 213, 225), font=font_body)
        draw.rounded_rectangle([(x + 20, y + 130), (x + 340, y + 168)], radius=6, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw.text((x + 30, y + 140), benefit, fill=(52, 211, 153), font=font_body)

    draw_footer_caption(draw, "Non-primitive data structures organize multiple values, including arrays, linked lists, stacks, queues, trees, and graphs.")
    img.save("/tmp/vids/slides/v1_s6.png")

def build_v1_s7():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES & TYPES", "07. Summary Taxonomy", "Complete Classification")
    
    # Complete Master Taxonomy
    draw_card(draw, 60, 100, 1220, 580, title="Data Structures Architecture Overview", badge="RECAP & MASTERY")
    
    draw.rounded_rectangle([(100, 180), (600, 520)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw.text((130, 205), "PRIMITIVE DATA STRUCTURES", fill=(52, 211, 153), font=font_title)
    draw.text((130, 250), "• Directly manipulated by machine instructions", fill=(203, 213, 225), font=font_body)
    draw.text((130, 285), "• Fixed memory footprint allocated at compile/stack time", fill=(203, 213, 225), font=font_body)
    draw.text((130, 320), "• Integer (int): whole numbers", fill=(148, 163, 184), font=font_body)
    draw.text((130, 355), "• Float (float, double): fractional numbers", fill=(148, 163, 184), font=font_body)
    draw.text((130, 390), "• Character (char): textual symbols", fill=(148, 163, 184), font=font_body)
    draw.text((130, 425), "• Boolean (bool): true/false logic", fill=(148, 163, 184), font=font_body)
    draw.text((130, 465), "Result: Foundation for all non-primitive constructs.", fill=(96, 165, 250), font=font_body)
    
    draw.rounded_rectangle([(640, 180), (1180, 520)], radius=12, fill=(15, 23, 42), outline=(96, 165, 250), width=2)
    draw.text((670, 205), "NON-PRIMITIVE DATA STRUCTURES", fill=(96, 165, 250), font=font_title)
    draw.text((670, 250), "LINEAR (Sequential Single-Predecessor):", fill=(165, 180, 252), font=font_subtitle)
    draw.text((690, 285), "• Arrays: Contiguous indexing", fill=(203, 213, 225), font=font_body)
    draw.text((690, 315), "• Linked Lists: Node-pointer dynamic chains", fill=(203, 213, 225), font=font_body)
    draw.text((690, 345), "• Stacks: LIFO access", fill=(203, 213, 225), font=font_body)
    draw.text((690, 375), "• Queues: FIFO buffer order", fill=(203, 213, 225), font=font_body)
    
    draw.text((670, 415), "NON-LINEAR (Multi-Dimensional):", fill=(244, 114, 182), font=font_subtitle)
    draw.text((690, 450), "• Trees: Hierarchical parent-child acyclic trees", fill=(203, 213, 225), font=font_body)
    draw.text((690, 480), "• Graphs: Arbitrary networks with cycles & weights", fill=(203, 213, 225), font=font_body)

    draw_footer_caption(draw, "Data structures organize data efficiently and can be classified into different types based on how they store and connect information.")
    img.save("/tmp/vids/slides/v1_s7.png")

# ==========================================
# BUILD SLIDES FOR VIDEO 2: Linear and Non-Linear Data Structures (24 seconds)
# ==========================================

def build_v2_s1():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES VISUALIZATION", "01. Choosing the Right Structure", "Architectural Decision")
    
    draw_card(draw, 60, 100, 1220, 580, title="Strategic Impact of Structure Selection", badge="CRITICAL ARCHITECTURE")
    draw.text((90, 175), "Choosing the right data structure helps a program store, access, and process data effectively:", fill=(203, 213, 225), font=font_subtitle)
    
    options = [
        ("Sequential Data?", "Choose Linear (Array, List)", "Predictable consecutive element ordering", (96, 165, 250)),
        ("Hierarchical Data?", "Choose Trees (BST, Trie)", "Nested child categories and quick subtrees", (52, 211, 153)),
        ("Interconnected Data?", "Choose Graphs (Adjacency)", "Arbitrary relational links and shortest paths", (244, 114, 182)),
        ("Tabular Grid Data?", "Choose 2D Arrays / Tables", "Fixed row-column mathematical operations", (251, 191, 36))
    ]
    
    ox = 90
    for q, ans, note, col in options:
        draw.rounded_rectangle([(ox, 230), (ox + 260, 500)], radius=12, fill=(15, 23, 42), outline=col, width=2)
        draw.text((ox + 20, 255), q, fill=(244, 244, 245), font=font_subtitle)
        draw.line([(ox + 20, 295), (ox + 240, 295)], fill=(51, 65, 85), width=1)
        draw.text((ox + 20, 315), ans, fill=col, font=font_subtitle)
        draw.text((ox + 20, 380), note, fill=(148, 163, 184), font=font_body)
        ox += 280

    draw_footer_caption(draw, "Choosing the right data structure helps a program store, access, and process data more effectively.")
    img.save("/tmp/vids/slides/v2_s1.png")

def build_v2_s2():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES VISUALIZATION", "02. Linear Data Structures", "Sequential Order")
    
    draw.text((60, 95), "Linear data structures arrange elements in a sequential order, where each element follows another element:", fill=(203, 213, 225), font=font_subtitle)
    
    linear_types = [
        ("Array", "Contiguous indexable slots", ["Slot 0: [ 10 ]", "Slot 1: [ 20 ]", "Slot 2: [ 30 ]"], (52, 211, 153)),
        ("Linked List", "Nodes linked by pointers", ["Node(A) ➔ Next", "Node(B) ➔ Next", "Node(C) ➔ NULL"], (96, 165, 250)),
        ("Stack", "LIFO vertical order", ["[ Top: 30 ]", "[ Mid: 20 ]", "[ Base: 10 ]"], (244, 114, 182)),
        ("Queue", "FIFO linear buffer", ["[ Front: 10 ]", "[ Mid: 20 ]", "[ Rear: 30 ]"], (251, 191, 36))
    ]
    
    lx = 60
    for name, subtitle, items, col in linear_types:
        draw.rounded_rectangle([(lx, 140), (lx + 265, 560)], radius=12, fill=(15, 23, 42), outline=col, width=2)
        draw.text((lx + 20, 165), name, fill=col, font=font_title)
        draw.text((lx + 20, 205), subtitle, fill=(148, 163, 184), font=font_badge)
        draw.line([(lx + 20, 230), (lx + 245, 230)], fill=(51, 65, 85), width=1)
        
        iy = 260
        for itm in items:
            draw.rounded_rectangle([(lx + 20, iy), (lx + 245, iy + 65)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
            draw.text((lx + 35, iy + 22), itm, fill=(244, 244, 245), font=font_code)
            iy += 85
            
        draw.text((lx + 20, 520), "Sequence: 1-to-1 link", fill=col, font=font_badge)
        lx += 295

    draw_footer_caption(draw, "Linear data structures arrange elements in a sequential order: Arrays, Linked Lists, Stacks, and Queues.")
    img.save("/tmp/vids/slides/v2_s2.png")

def build_v2_s3():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "DATA STRUCTURES VISUALIZATION", "03. Non-Linear Data Structures", "Trees & Graphs")
    
    draw.text((60, 95), "Non-linear data structures do not follow a single sequential order. Elements connect in multi-dimensional branching:", fill=(203, 213, 225), font=font_subtitle)
    
    # Left: Tree
    draw.rounded_rectangle([(60, 140), (620, 560)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw.text((85, 165), "TREES (Hierarchical Acyclic)", fill=(52, 211, 153), font=font_title)
    draw.text((85, 205), "One root node branching into child nodes and subtrees.", fill=(203, 213, 225), font=font_body)
    
    # Visual Tree diagram
    draw.ellipse([(310, 250), (370, 310)], fill=(49, 46, 129), outline=(129, 140, 248), width=2)
    draw.text((328, 272), "R", fill=(255, 255, 255), font=font_title)
    
    draw.line([(320, 305), (220, 365)], fill=(129, 140, 248), width=3)
    draw.line([(360, 305), (460, 365)], fill=(129, 140, 248), width=3)
    
    draw.ellipse([(190, 365), (250, 425)], fill=(30, 41, 59), outline=(52, 211, 153), width=2)
    draw.text((212, 387), "A", fill=(255, 255, 255), font=font_title)
    
    draw.ellipse([(430, 365), (490, 425)], fill=(30, 41, 59), outline=(52, 211, 153), width=2)
    draw.text((452, 387), "B", fill=(255, 255, 255), font=font_title)
    
    draw.text((85, 470), "• Root, Children, Parents, Siblings\n• Binary Search Trees, Tries, Heaps\n• Time Complexity: O(log N) operations", fill=(148, 163, 184), font=font_body)

    # Right: Graph
    draw.rounded_rectangle([(660, 140), (1220, 560)], radius=12, fill=(15, 23, 42), outline=(96, 165, 250), width=2)
    draw.text((685, 165), "GRAPHS (Interconnected Networks)", fill=(96, 165, 250), font=font_title)
    draw.text((685, 205), "Vertices (V) and Edges (E) representing arbitrary networks.", fill=(203, 213, 225), font=font_body)
    
    # Visual Graph diagram
    nodes = [(780, 280, "1"), (1050, 280, "2"), (880, 380, "3"), (1050, 430, "4")]
    # Edges
    draw.line([(780, 280), (1050, 280)], fill=(96, 165, 250), width=2)
    draw.line([(780, 280), (880, 380)], fill=(96, 165, 250), width=2)
    draw.line([(1050, 280), (880, 380)], fill=(96, 165, 250), width=2)
    draw.line([(880, 380), (1050, 430)], fill=(96, 165, 250), width=2)
    
    for nx, ny, nval in nodes:
        draw.ellipse([(nx - 28, ny - 28), (nx + 28, ny + 28)], fill=(30, 41, 59), outline=(96, 165, 250), width=2)
        draw.text((nx - 8, ny - 12), nval, fill=(255, 255, 255), font=font_title)
        
    draw.text((685, 470), "• Directed / Undirected, Weighted / Unweighted\n• Shortest path algorithms (Dijkstra, BFS/DFS)\n• Networks, Social graphs, Recommendation engines", fill=(148, 163, 184), font=font_body)

    draw_footer_caption(draw, "Non-linear data structures do not follow a single sequential order. Trees and graphs are common examples.")
    img.save("/tmp/vids/slides/v2_s3.png")

print("Rendering slide PNGs...")
build_v1_s1()
build_v1_s2()
build_v1_s3()
build_v1_s4()
build_v1_s5()
build_v1_s6()
build_v1_s7()

build_v2_s1()
build_v2_s2()
build_v2_s3()
print("All slide PNGs generated successfully!")
