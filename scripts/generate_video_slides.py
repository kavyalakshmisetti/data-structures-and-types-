import os
from PIL import Image, ImageDraw, ImageFont

SLIDES_DIR = "/tmp/video_slides"
os.makedirs(SLIDES_DIR, exist_ok=True)

WIDTH = 1280
HEIGHT = 720

FONT_BOLD_PATH = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_MONO_PATH = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_header(draw, topic, lesson_title, tag):
    # Header bar
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=(15, 23, 42))
    draw.line([(0, 70), (WIDTH, 70)], fill=(30, 41, 59), width=2)
    
    # Topic badge
    draw.rounded_rectangle([(30, 18), (170, 52)], radius=8, fill=(49, 46, 129), outline=(99, 102, 241), width=1)
    draw.text((42, 27), topic, fill=(199, 210, 254), font=get_font(FONT_BOLD_PATH, 12))
    
    # Lesson Title
    draw.text((185, 23), lesson_title, fill=(248, 250, 252), font=get_font(FONT_BOLD_PATH, 20))
    
    # Category Tag
    tag_w = 140
    draw.rounded_rectangle([(WIDTH - tag_w - 30, 18), (WIDTH - 30, 52)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    draw.text((WIDTH - tag_w - 18, 27), tag.upper(), fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 12))

def draw_footer_caption(draw, caption_text):
    # Caption Box at bottom
    draw.rectangle([(0, HEIGHT - 76), (WIDTH, HEIGHT)], fill=(15, 23, 42))
    draw.line([(0, HEIGHT - 76), (WIDTH, HEIGHT - 76)], fill=(30, 41, 59), width=2)
    
    # Audio speaker icon box
    draw.rounded_rectangle([(30, HEIGHT - 62), (72, HEIGHT - 20)], radius=8, fill=(49, 46, 129), outline=(99, 102, 241), width=1)
    draw.polygon([(44, HEIGHT - 46), (44, HEIGHT - 36), (50, HEIGHT - 36), (58, HEIGHT - 30), (58, HEIGHT - 52), (50, HEIGHT - 46)], fill=(224, 231, 255))
    draw.arc([(56, HEIGHT - 47), (64, HEIGHT - 35)], -60, 60, fill=(165, 180, 252), width=2)
    
    # Audio Caption Text wrapped
    draw_wrapped_text_in_box(
        draw, caption_text,
        (88, HEIGHT - 68, WIDTH - 40, HEIGHT - 12),
        font_path=FONT_REG_PATH,
        initial_size=16,
        fill=(226, 232, 240),
        align="left",
        line_spacing=5
    )

def draw_card(draw, x1, y1, x2, y2, title="", badge="", border_color=(51, 65, 85), fill_color=(15, 23, 42)):
    draw.rounded_rectangle([(x1, y1), (x2, y2)], radius=14, fill=fill_color, outline=border_color, width=2)
    if title:
        draw.text((x1 + 24, y1 + 18), title, fill=(241, 245, 249), font=get_font(FONT_BOLD_PATH, 17))
    if badge:
        bw = 180
        draw.rounded_rectangle([(x2 - bw - 20, y1 + 16), (x2 - 20, y1 + 42)], radius=6, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw.text((x2 - bw - 10, y1 + 23), badge, fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 10))

def draw_wrapped_text_in_box(draw, text, box, font_path=FONT_REG_PATH, initial_size=16, fill=(244, 244, 245), align="left", line_spacing=4):
    x1, y1, x2, y2 = box
    max_w = x2 - x1
    max_h = y2 - y1
    
    size = initial_size
    while size >= 9:
        font = get_font(font_path, size)
        lines = []
        for paragraph in text.split("\n"):
            words = paragraph.split()
            if not words:
                lines.append("")
                continue
            cur_line = []
            for w in words:
                test_line = " ".join(cur_line + [w])
                w_test = draw.textlength(test_line, font=font)
                if w_test <= max_w:
                    cur_line.append(w)
                else:
                    if cur_line:
                        lines.append(" ".join(cur_line))
                        cur_line = [w]
                    else:
                        lines.append(w)
                        cur_line = []
            if cur_line:
                lines.append(" ".join(cur_line))
                
        total_h = len(lines) * (size + line_spacing)
        if total_h <= max_h:
            break
        size -= 1
        
    font = get_font(font_path, size)
    cur_y = y1
    for line in lines:
        if align == "center":
            line_w = draw.textlength(line, font=font)
            line_x = x1 + (max_w - line_w) / 2
        else:
            line_x = x1
        draw.text((line_x, cur_y), line, fill=fill, font=font)
        cur_y += size + line_spacing

# ==========================================
# VIDEO 1 SLIDES: DATA STRUCTURES AND TYPES (67s)
# ==========================================

def build_v1_s1():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "01. What is Data? (Raw Facts & Symbols)", "Fundamentals")
    
    # Left Box: Definition & Explanation
    draw_card(draw, 40, 85, 620, 620, title="Raw, Unorganized Information", badge="INPUT LAYER")
    text_content = (
        "Data represents the fundamental raw facts, figures, and symbols processed by computer systems.\n\n"
        "Without structural organization, data exists merely as disconnected bytes in physical RAM memory. "
        "It possesses no intrinsic relational meaning until structured by computational logic.\n\n"
        "KEY DATA FORMS:\n"
        "  • Numeric Values: Integers (42, -18) & Real numbers (3.14159)\n"
        "  • Textual Symbols: Characters ('A', '#') & Strings (\"DSA\")\n"
        "  • Logical States: Boolean flags (True / False, 1 / 0)\n"
        "  • Memory Addresses: Physical pointer coordinates (0x7FFE)"
    )
    draw_wrapped_text_in_box(draw, text_content, (65, 140, 595, 595), font_path=FONT_REG_PATH, initial_size=15, fill=(203, 213, 225), line_spacing=6)
    
    # Right Box: Physical RAM visualization
    draw_card(draw, 650, 85, 1240, 620, title="Physical Memory (RAM) Layout", badge="HARDWARE LEVEL")
    draw_wrapped_text_in_box(draw, "Raw byte values stored in consecutive memory address cells:", (675, 135, 1215, 165), font_path=FONT_REG_PATH, initial_size=14, fill=(148, 163, 184))
    
    raw_cells = [
        ("0x1000", "0010 1010", "42 (Integer)", (99, 102, 241)),
        ("0x1004", "0100 0001", "'A' (Character)", (52, 211, 153)),
        ("0x1008", "0100 0000", "3.14 (Float)", (251, 191, 36)),
        ("0x100C", "0000 0001", "TRUE (Boolean)", (244, 114, 182)),
        ("0x1010", "0100 0100", "\"DSA\" (String Ref)", (56, 189, 248))
    ]
    cy = 180
    for addr, bits, desc, col in raw_cells:
        draw.rounded_rectangle([(675, cy), (1215, cy + 68)], radius=10, fill=(30, 41, 59), outline=col, width=1)
        # Address tag
        draw.rounded_rectangle([(685, cy + 12), (775, cy + 56)], radius=6, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw.text((695, cy + 24), addr, fill=(148, 163, 184), font=get_font(FONT_MONO_PATH, 13))
        # Bits
        draw.text((795, cy + 18), "RAW BITS:", fill=(100, 116, 139), font=get_font(FONT_BOLD_PATH, 10))
        draw.text((795, cy + 34), bits, fill=(244, 244, 245), font=get_font(FONT_MONO_PATH, 15))
        # Meaning
        draw.rounded_rectangle([(1020, cy + 14), (1200, cy + 54)], radius=6, fill=(15, 23, 42), outline=col, width=1)
        draw_wrapped_text_in_box(draw, desc, (1025, cy + 22, 1195, cy + 48), font_path=FONT_BOLD_PATH, initial_size=12, fill=col, align="center")
        cy += 82

    draw_footer_caption(draw, "Data means raw facts and information, such as numbers, characters, words, or symbols.")
    img.save(f"{SLIDES_DIR}/v1_s1.png")

def build_v1_s2():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "02. Why Organize Data? (Access & Efficiency)", "Optimization")
    
    draw_card(draw, 40, 85, 1240, 620, title="The 4 Pillars of Structured Data", badge="PERFORMANCE CORE")
    draw_wrapped_text_in_box(draw, "Raw data becomes valuable when structured. Structured organization provides four computational guarantees:", 
                             (65, 140, 1215, 175), font_path=FONT_REG_PATH, initial_size=16, fill=(203, 213, 225))
    
    pillars = [
        ("1. Fast Access", "Instant O(1) Lookups", "Direct address calculation enables immediate item retrieval without scanning through unrelated records.", (99, 102, 241)),
        ("2. Systematic Storage", "Cache Optimization", "Contiguous and linked memory architectures maximize CPU L1/L2 cache hit ratios and throughput.", (52, 211, 153)),
        ("3. Efficient Search", "O(log N) Pruning", "Hierarchies like Binary Search Trees prune half the dataset per step, scaling smoothly to millions of items.", (251, 191, 36)),
        ("4. Scalable Processing", "Predictable Scaling", "Consistent algorithmic Big-O boundaries prevent catastrophic latency degradation under heavy load.", (244, 114, 182))
    ]
    
    px = 65
    for ptitle, psub, pdesc, pcol in pillars:
        draw.rounded_rectangle([(px, 195), (px + 270, 595)], radius=12, fill=(30, 41, 59), outline=pcol, width=2)
        # Title
        draw_wrapped_text_in_box(draw, ptitle, (px + 15, 215, px + 255, 245), font_path=FONT_BOLD_PATH, initial_size=18, fill=pcol, align="center")
        # Subtitle
        draw.rounded_rectangle([(px + 20, 255), (px + 250, 285)], radius=6, fill=(15, 23, 42), outline=pcol, width=1)
        draw_wrapped_text_in_box(draw, psub, (px + 25, 262, px + 245, 278), font_path=FONT_BOLD_PATH, initial_size=12, fill=(244, 244, 245), align="center")
        # Divider
        draw.line([(px + 20, 305), (px + 250, 305)], fill=(51, 65, 85), width=1)
        # Description
        draw_wrapped_text_in_box(draw, pdesc, (px + 20, 325, px + 250, 490), font_path=FONT_REG_PATH, initial_size=14, fill=(203, 213, 225), line_spacing=6)
        # Indicator tag
        draw.rounded_rectangle([(px + 20, 520), (px + 250, 570)], radius=8, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw_wrapped_text_in_box(draw, "OPTIMAL PERFORMANCE", (px + 25, 535, px + 245, 555), font_path=FONT_BOLD_PATH, initial_size=11, fill=pcol, align="center")
        px += 295

    draw_footer_caption(draw, "When data is organized properly, it becomes easier to access, manage, search, and process.")
    img.save(f"{SLIDES_DIR}/v1_s2.png")

def build_v1_s3():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "03. What is a Data Structure? (Definition & Formula)", "Theory")
    
    draw_card(draw, 40, 85, 1240, 620, title="The Core Formula of Computational Data Structures", badge="DEFINITION")
    
    # Formula Box
    draw.rounded_rectangle([(70, 145), (1210, 255)], radius=14, fill=(30, 41, 59), outline=(99, 102, 241), width=2)
    formula_text = "DATA STRUCTURE  =  MEMORY ORGANIZATION  +  PERMITTED OPERATIONS"
    draw_wrapped_text_in_box(draw, formula_text, (85, 175, 1195, 225), font_path=FONT_BOLD_PATH, initial_size=23, fill=(129, 140, 248), align="center")
    
    # Left Half: Memory Organization
    draw.rounded_rectangle([(70, 280), (620, 595)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw_wrapped_text_in_box(draw, "1. MEMORY ORGANIZATION", (95, 305, 595, 335), font_path=FONT_BOLD_PATH, initial_size=18, fill=(52, 211, 153))
    left_desc = (
        "Defines how data elements are laid out in physical RAM memory and how they reference each other:\n\n"
        "• Contiguous Storage: Consecutive RAM addresses (e.g. Arrays).\n"
        "• Pointer Links: Discrete memory nodes linked by reference (e.g. Linked Lists).\n"
        "• Hierarchical Pointers: Parent-to-child memory references (e.g. Trees).\n"
        "• Network Edges: Arbitrary relational coordinates (e.g. Graphs)."
    )
    draw_wrapped_text_in_box(draw, left_desc, (95, 350, 595, 575), font_path=FONT_REG_PATH, initial_size=15, fill=(203, 213, 225), line_spacing=6)
    
    # Right Half: Permitted Operations
    draw.rounded_rectangle([(660, 280), (1210, 595)], radius=12, fill=(15, 23, 42), outline=(251, 191, 36), width=2)
    draw_wrapped_text_in_box(draw, "2. ALGORITHMIC OPERATIONS", (685, 305, 1185, 335), font_path=FONT_BOLD_PATH, initial_size=18, fill=(251, 191, 36))
    right_desc = (
        "Defines the strict algorithmic rules used to manipulate the stored data:\n\n"
        "• Insertion & Deletion: Adding or removing elements under structure invariants.\n"
        "• Traversal: Systematically visiting every record in defined sequence.\n"
        "• Searching: Locating a target element by key or value.\n"
        "• Big-O Bounds: Mathematical guarantees on time and space complexity."
    )
    draw_wrapped_text_in_box(draw, right_desc, (685, 350, 1185, 575), font_path=FONT_REG_PATH, initial_size=15, fill=(203, 213, 225), line_spacing=6)

    draw_footer_caption(draw, "Data structures are ways of organizing and storing data, so that we can use it efficiently.")
    img.save(f"{SLIDES_DIR}/v1_s3.png")

def build_v1_s4():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "04. Master Classification: Primitive vs Non-Primitive", "Taxonomy")
    
    draw_card(draw, 40, 85, 1240, 620, title="The Data Structures Taxonomy Tree", badge="MASTER ARCHITECTURE")
    
    # Root Node
    draw.rounded_rectangle([(490, 135), (790, 185)], radius=10, fill=(49, 46, 129), outline=(129, 140, 248), width=2)
    draw_wrapped_text_in_box(draw, "DATA STRUCTURES", (500, 148, 780, 172), font_path=FONT_BOLD_PATH, initial_size=16, fill=(255, 255, 255), align="center")
    
    # Connecting Lines
    draw.line([(570, 185), (320, 235)], fill=(129, 140, 248), width=3)
    draw.line([(710, 185), (960, 235)], fill=(129, 140, 248), width=3)
    
    # Left Branch: Primitive
    draw.rounded_rectangle([(70, 235), (570, 595)], radius=12, fill=(15, 23, 42), outline=(99, 102, 241), width=2)
    draw_wrapped_text_in_box(draw, "PRIMITIVE DATA TYPES", (90, 250, 550, 280), font_path=FONT_BOLD_PATH, initial_size=18, fill=(129, 140, 248), align="center")
    draw_wrapped_text_in_box(draw, "Built directly into computer hardware. Stored directly on Call Stack memory.", (90, 285, 550, 315), font_path=FONT_REG_PATH, initial_size=12, fill=(148, 163, 184), align="center")
    
    p_types = [
        ("Integer (int)", "Fixed-size 32-bit (4 bytes) whole number values (-2^31 to 2^31-1)."),
        ("Float (float)", "IEEE 754 32/64-bit floating-point real decimal values."),
        ("Character (char)", "Single ASCII (8-bit) or Unicode (16-bit) text symbol."),
        ("Boolean (bool)", "Atomic logical binary state: True (1) or False (0).")
    ]
    py = 330
    for p_name, p_desc in p_types:
        draw.rounded_rectangle([(90, py), (550, py + 55)], radius=8, fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.text((105, py + 8), p_name, fill=(165, 180, 252), font=get_font(FONT_BOLD_PATH, 13))
        draw_wrapped_text_in_box(draw, p_desc, (105, py + 26, 535, py + 50), font_path=FONT_REG_PATH, initial_size=11, fill=(203, 213, 225))
        py += 65

    # Right Branch: Non-Primitive
    draw.rounded_rectangle([(710, 235), (1210, 595)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw_wrapped_text_in_box(draw, "NON-PRIMITIVE DATA STRUCTURES", (730, 250, 1190, 280), font_path=FONT_BOLD_PATH, initial_size=18, fill=(52, 211, 153), align="center")
    draw_wrapped_text_in_box(draw, "Composite user-defined structures stored on Heap memory via pointer references.", (730, 285, 1190, 315), font_path=FONT_REG_PATH, initial_size=12, fill=(148, 163, 184), align="center")
    
    np_groups = [
        ("Linear Structures", "Sequential 1-to-1 ordering: Arrays, Linked Lists, Stacks, Queues."),
        ("Non-Linear Structures", "Hierarchical and network ordering: Trees, Heaps, and Graphs."),
        ("Hash-Based Structures", "Key-to-value O(1) hash maps, hash sets, and dictionary lookup tables.")
    ]
    npy = 340
    for np_name, np_desc in np_groups:
        draw.rounded_rectangle([(730, npy), (1190, npy + 70)], radius=8, fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.text((745, npy + 10), np_name, fill=(110, 231, 183), font=get_font(FONT_BOLD_PATH, 14))
        draw_wrapped_text_in_box(draw, np_desc, (745, npy + 32, 1175, npy + 64), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225))
        npy += 80

    draw_footer_caption(draw, "Data structures can be broadly classified into Primitive and Non-Primitive data structures.")
    img.save(f"{SLIDES_DIR}/v1_s4.png")

def build_v1_s5():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "05. Primitive Data Types: Stack Memory & Bit Registers", "Primitives")
    
    draw_card(draw, 40, 85, 1240, 620, title="Hardware-Level Representation of Primitive Types", badge="STACK STORED")
    
    draw_wrapped_text_in_box(draw, "Primitive types hold atomic values directly within CPU registers and call stack frames with fixed byte boundaries:", 
                             (65, 140, 1215, 175), font_path=FONT_REG_PATH, initial_size=15, fill=(203, 213, 225))
    
    registers = [
        ("INTEGER (int)", "4 Bytes (32 Bits)", "Value: 42", "00000000 00000000 00000000 00101010", "Signed two's complement integer. Direct ALU addition and subtraction in single CPU cycle.", (99, 102, 241)),
        ("FLOAT (float)", "4 Bytes (32 Bits)", "Value: 3.1415", "01000000 01001001 00001111 11011011", "IEEE 754 standard: 1 sign bit, 8 exponent bits, 23 mantissa bits for real fractions.", (52, 211, 153)),
        ("CHAR (char)", "1 Byte (8 Bits)", "Value: 'A' (ASCII 65)", "01000001", "Fixed 8-bit character mapping. Extends to UTF-16 (2 bytes) in modern language runtimes.", (251, 191, 36)),
        ("BOOLEAN (bool)", "1 Byte (1 Bit Flag)", "Value: TRUE (1)", "00000001", "Hardware logic gate flag. Evaluated by conditional branch instructions (JMP, BNE).", (244, 114, 182))
    ]
    
    ry = 195
    for rname, rsize, rval, rbits, rnotes, rcol in registers:
        draw.rounded_rectangle([(65, ry), (1215, ry + 88)], radius=10, fill=(30, 41, 59), outline=rcol, width=1)
        # Name & Size
        draw.text((85, ry + 12), rname, fill=rcol, font=get_font(FONT_BOLD_PATH, 15))
        draw.text((85, ry + 36), rsize, fill=(148, 163, 184), font=get_font(FONT_REG_PATH, 12))
        draw.text((85, ry + 56), rval, fill=(244, 244, 245), font=get_font(FONT_BOLD_PATH, 13))
        # Bits box
        draw.rounded_rectangle([(320, ry + 14), (730, ry + 74)], radius=8, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
        draw.text((335, ry + 22), "BIT REGISTER PATTERN:", fill=(100, 116, 139), font=get_font(FONT_BOLD_PATH, 10))
        draw.text((335, ry + 42), rbits, fill=(244, 244, 245), font=get_font(FONT_MONO_PATH, 13))
        # Explanation box
        draw.rounded_rectangle([(750, ry + 14), (1195, ry + 74)], radius=8, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
        draw_wrapped_text_in_box(draw, rnotes, (765, ry + 22, 1180, ry + 68), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)
        ry += 98

    draw_footer_caption(draw, "Primitive data structures are basic data types that directly store simple values: Integer, Float, Character, and Boolean.")
    img.save(f"{SLIDES_DIR}/v1_s5.png")

def build_v1_s6():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "06. Non-Primitive Data Types: Heap Storage & Pointers", "Composite Types")
    
    draw_card(draw, 40, 85, 1240, 620, title="Stack vs Heap Memory Model for Composite Structures", badge="REFERENCE BASED")
    
    # Left: Call Stack Frame
    draw.rounded_rectangle([(65, 145), (450, 595)], radius=12, fill=(15, 23, 42), outline=(99, 102, 241), width=2)
    draw_wrapped_text_in_box(draw, "CALL STACK (References)", (85, 165, 430, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(129, 140, 248), align="center")
    draw_wrapped_text_in_box(draw, "Stack holds lightweight 64-bit pointer addresses that reference dynamic heap memory:", (85, 205, 430, 255), font_path=FONT_REG_PATH, initial_size=13, fill=(148, 163, 184))
    
    stack_ptrs = [
        ("arrRef", "0x7FFE2000", "Points to 5-element Array chunk"),
        ("listHead", "0x7FFE4000", "Points to Head Node of Linked List"),
        ("treeRoot", "0x7FFE6000", "Points to Root Node of Binary Tree")
    ]
    spy = 270
    for pname, pval, pdesc in stack_ptrs:
        draw.rounded_rectangle([(85, spy), (430, spy + 85)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw.text((100, spy + 10), pname, fill=(244, 244, 245), font=get_font(FONT_BOLD_PATH, 14))
        draw.text((100, spy + 32), f"PTR: {pval}", fill=(165, 180, 252), font=get_font(FONT_MONO_PATH, 13))
        draw_wrapped_text_in_box(draw, pdesc, (100, spy + 55, 415, spy + 78), font_path=FONT_REG_PATH, initial_size=11, fill=(203, 213, 225))
        spy += 105

    # Right: Heap Memory Area
    draw.rounded_rectangle([(480, 145), (1215, 595)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw_wrapped_text_in_box(draw, "HEAP ALLOCATION SPACE (Dynamic Objects)", (500, 165, 1195, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(52, 211, 153), align="center")
    
    # Heap Item 1: Array
    draw.rounded_rectangle([(500, 215), (1195, 315)], radius=10, fill=(30, 41, 59), outline=(52, 211, 153), width=1)
    draw.text((515, 225), "CONTIGUOUS ARRAY AT 0x7FFE2000:", fill=(110, 231, 183), font=get_font(FONT_BOLD_PATH, 12))
    ax = 515
    for idx, val in enumerate([10, 25, 40, 65, 90]):
        draw.rounded_rectangle([(ax, 250), (ax + 120, 302)], radius=6, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw.text((ax + 10, 256), f"[{idx}]", fill=(148, 163, 184), font=get_font(FONT_MONO_PATH, 11))
        draw.text((ax + 45, 266), str(val), fill=(244, 244, 245), font=get_font(FONT_BOLD_PATH, 16))
        ax += 135

    # Heap Item 2: Linked List
    draw.rounded_rectangle([(500, 335), (1195, 435)], radius=10, fill=(30, 41, 59), outline=(96, 165, 250), width=1)
    draw.text((515, 345), "LINKED LIST CHAIN AT 0x7FFE4000:", fill=(147, 197, 253), font=get_font(FONT_BOLD_PATH, 12))
    lx = 515
    for val, nxt in [("15", "0x4040"), ("30", "0x4080"), ("45", "NULL")]:
        draw.rounded_rectangle([(lx, 370), (lx + 180, 422)], radius=6, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw.text((lx + 15, 385), f"Data: {val}", fill=(244, 244, 245), font=get_font(FONT_BOLD_PATH, 13))
        draw.text((lx + 90, 385), f"Next: {nxt}", fill=(147, 197, 253), font=get_font(FONT_MONO_PATH, 11))
        lx += 225

    # Heap Item 3: Tree / Graph Summary
    draw.rounded_rectangle([(500, 455), (1195, 575)], radius=10, fill=(30, 41, 59), outline=(244, 114, 182), width=1)
    draw.text((515, 465), "TREES & GRAPHS AT 0x7FFE6000:", fill=(244, 114, 182), font=get_font(FONT_BOLD_PATH, 12))
    draw_wrapped_text_in_box(
        draw,
        "Nodes contain data plus multiple child or edge pointer references (left, right, neighbors). "
        "Dynamic heap allocation allows trees and graphs to expand gracefully at runtime without fixed memory boundaries.",
        (515, 490, 1175, 565),
        font_path=FONT_REG_PATH,
        initial_size=13,
        fill=(203, 213, 225),
        line_spacing=5
    )

    draw_footer_caption(draw, "Non-primitive data structures are created using primitive types to store multiple or complex values: Arrays, Lists, and Files.")
    img.save(f"{SLIDES_DIR}/v1_s6.png")

def build_v1_s7():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "07. Operations & Algorithmic Big-O Complexity", "Big-O Analysis")
    
    draw_card(draw, 40, 85, 1240, 620, title="Fundamental Operations & Algorithmic Complexity Boundaries", badge="EFFICIENCY")
    
    # 5 Operation Cards
    ops = [
        ("Traversal", "Visiting Every Element", "Sequential scan across all N nodes.", "O(N)", (99, 102, 241)),
        ("Insertion", "Adding New Records", "Instant at head/top; requires shift in arrays.", "O(1) to O(N)", (52, 211, 153)),
        ("Deletion", "Removing Records", "Instant at head/top; shift penalty in arrays.", "O(1) to O(N)", (251, 191, 36)),
        ("Search", "Querying Target Key", "Binary search prunes tree; linear search scans.", "O(log N) - O(N)", (244, 114, 182)),
        ("Sorting", "Ordering Dataset", "QuickSort, MergeSort, and HeapSort algorithms.", "O(N log N)", (56, 189, 248))
    ]
    
    ox = 65
    for oname, osub, odesc, obigo, ocol in ops:
        draw.rounded_rectangle([(ox, 145), (ox + 215, 415)], radius=10, fill=(30, 41, 59), outline=ocol, width=2)
        draw_wrapped_text_in_box(draw, oname, (ox + 10, 160, ox + 205, 188), font_path=FONT_BOLD_PATH, initial_size=16, fill=ocol, align="center")
        draw.text((ox + 12, 198), osub, fill=(148, 163, 184), font=get_font(FONT_REG_PATH, 11))
        draw.line([(ox + 12, 222), (ox + 203, 222)], fill=(51, 65, 85), width=1)
        draw_wrapped_text_in_box(draw, odesc, (ox + 12, 235, ox + 203, 335), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)
        
        # Big-O pill
        draw.rounded_rectangle([(ox + 15, 350), (ox + 200, 395)], radius=6, fill=(15, 23, 42), outline=ocol, width=1)
        draw_wrapped_text_in_box(draw, obigo, (ox + 20, 362, ox + 195, 385), font_path=FONT_BOLD_PATH, initial_size=13, fill=ocol, align="center")
        ox += 235

    # Bottom Summary Box
    draw.rounded_rectangle([(65, 440), (1215, 595)], radius=12, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
    summary_text = (
        "CORE ARCHITECTURAL TAKEAWAY:\n"
        "No single data structure is optimal for every workload. The fundamental duty of computer science is selecting the "
        "structure whose operation complexity matches your program's critical bottlenecks — trading memory consumption for runtime velocity."
    )
    draw_wrapped_text_in_box(draw, summary_text, (85, 460, 1195, 575), font_path=FONT_REG_PATH, initial_size=15, fill=(203, 213, 225), line_spacing=6)

    draw_footer_caption(draw, "Data structures organize data efficiently and can be classified into different types based on how they store and connect information.")
    img.save(f"{SLIDES_DIR}/v1_s7.png")

# ==========================================
# VIDEO 2 SLIDES: LINEAR AND NON-LINEAR DATA STRUCTURES (70s)
# ==========================================

def build_v2_s1():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "01. Choosing the Right Data Structure (Selection Strategy)", "Strategy")
    
    draw_card(draw, 40, 85, 1240, 620, title="Matching Structural Topology to Computational Workload", badge="CRITICAL DECISION")
    draw_wrapped_text_in_box(draw, "Selecting the optimal data structure dictates memory scaling, algorithm speed, and CPU cache performance:", 
                             (65, 140, 1215, 175), font_path=FONT_REG_PATH, initial_size=16, fill=(203, 213, 225))
    
    options = [
        ("Sequential Access?", "Choose Linear", "Arrays, Linked Lists, Stacks, Queues", "Predictable consecutive order where each element follows a predecessor.", "O(1) Read / O(1) Top", (99, 102, 241)),
        ("Hierarchical Data?", "Choose Trees", "Binary Search Trees, Heaps, Tries", "Multi-level parent-child groupings with fast sub-branch pruning.", "O(log N) Search", (52, 211, 153)),
        ("Interconnected Net?", "Choose Graphs", "Adjacency Matrix / Adjacency List", "Arbitrary relational topologies between entities and networks.", "Shortest Path Routing", (244, 114, 182)),
        ("Key-Value Pairs?", "Choose Hash Tables", "Hash Maps, Sets, Dictionaries", "Direct mathematical hash indexing for immediate average lookup.", "Average O(1) Lookup", (251, 191, 36))
    ]
    
    ox = 65
    for q, ans, types, note, benefit, col in options:
        draw.rounded_rectangle([(ox, 195), (ox + 270, 595)], radius=12, fill=(15, 23, 42), outline=col, width=2)
        draw_wrapped_text_in_box(draw, q, (ox + 10, 215, ox + 260, 245), font_path=FONT_BOLD_PATH, initial_size=16, fill=(244, 244, 245), align="center")
        
        draw.rounded_rectangle([(ox + 20, 255), (ox + 250, 285)], radius=6, fill=(30, 41, 59), outline=col, width=1)
        draw_wrapped_text_in_box(draw, ans, (ox + 25, 262, ox + 245, 278), font_path=FONT_BOLD_PATH, initial_size=13, fill=col, align="center")
        
        draw.line([(ox + 15, 298), (ox + 255, 298)], fill=(51, 65, 85), width=1)
        
        draw.text((ox + 15, 310), "Recommended:", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
        draw_wrapped_text_in_box(draw, types, (ox + 15, 328, ox + 255, 375), font_path=FONT_BOLD_PATH, initial_size=12, fill=(199, 210, 254), line_spacing=4)
        
        draw.text((ox + 15, 385), "Why It Works:", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
        draw_wrapped_text_in_box(draw, note, (ox + 15, 405, ox + 255, 510), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)
        
        draw.rounded_rectangle([(ox + 15, 530), (ox + 255, 575)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw_wrapped_text_in_box(draw, benefit, (ox + 20, 542, ox + 250, 565), font_path=FONT_BOLD_PATH, initial_size=12, fill=col, align="center")
        ox += 295

    draw_footer_caption(draw, "Choosing the right data structure helps a program store, access, and process data more effectively.")
    img.save(f"{SLIDES_DIR}/v2_s1.png")

def build_v2_s2():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "02. Linear Structures: Arrays (Contiguous Memory)", "Linear: Arrays")
    
    draw_card(draw, 40, 85, 1240, 620, title="Contiguous Memory Allocation & Instant O(1) Indexing", badge="ARRAYS")
    
    # Array Diagram
    draw.rounded_rectangle([(70, 145), (1210, 315)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw_wrapped_text_in_box(draw, "PHYSICAL CONTIGUOUS RAM CELLS (Base Address: 0x2000, Element Size: 4 Bytes)", (90, 160, 1190, 185), font_path=FONT_BOLD_PATH, initial_size=14, fill=(110, 231, 183))
    
    arr_cells = [
        ("0", "10", "0x2000"),
        ("1", "25", "0x2004"),
        ("2", "40", "0x2008"),
        ("3", "65", "0x200C"),
        ("4", "90", "0x2010")
    ]
    ax = 90
    for idx, val, addr in arr_cells:
        draw.rounded_rectangle([(ax, 195), (ax + 200, 295)], radius=8, fill=(30, 41, 59), outline=(52, 211, 153) if idx == "2" else (71, 85, 105), width=2 if idx == "2" else 1)
        draw.text((ax + 15, 205), f"Index [{idx}]", fill=(148, 163, 184), font=get_font(FONT_MONO_PATH, 12))
        draw.text((ax + 75, 228), val, fill=(52, 211, 153) if idx == "2" else (244, 244, 245), font=get_font(FONT_BOLD_PATH, 24))
        draw.text((ax + 15, 270), f"RAM: {addr}", fill=(148, 163, 184), font=get_font(FONT_MONO_PATH, 11))
        if idx == "2":
            draw.rounded_rectangle([(ax + 110, 202), (ax + 190, 222)], radius=4, fill=(15, 23, 42), outline=(52, 211, 153), width=1)
            draw.text((ax + 118, 206), "TARGET", fill=(52, 211, 153), font=get_font(FONT_BOLD_PATH, 9))
        ax += 225

    # Direct Index Formula Box
    draw.rounded_rectangle([(70, 335), (620, 595)], radius=12, fill=(30, 41, 59), outline=(99, 102, 241), width=1)
    draw_wrapped_text_in_box(draw, "DIRECT O(1) ADDRESS CALCULATION", (90, 355, 600, 385), font_path=FONT_BOLD_PATH, initial_size=16, fill=(129, 140, 248))
    math_text = (
        "Memory Address Formula:\n"
        "  Address(arr[i]) = BaseAddress + (i * ElementSize)\n\n"
        "Example for arr[2]:\n"
        "  = 0x2000 + (2 * 4 bytes) = 0x2008\n\n"
        "Because multiplication and addition execute in 1 CPU cycle, array lookup takes constant O(1) time regardless of array length!"
    )
    draw_wrapped_text_in_box(draw, math_text, (90, 395, 600, 575), font_path=FONT_REG_PATH, initial_size=14, fill=(203, 213, 225), line_spacing=6)

    # Trade-offs Box
    draw.rounded_rectangle([(660, 335), (1210, 595)], radius=12, fill=(30, 41, 59), outline=(251, 191, 36), width=1)
    draw_wrapped_text_in_box(draw, "ARRAY ADVANTAGES & LIMITATIONS", (680, 355, 1190, 385), font_path=FONT_BOLD_PATH, initial_size=16, fill=(251, 191, 36))
    tradeoff_text = (
        "ADVANTAGES:\n"
        "• Instant O(1) random access by index.\n"
        "• Superb CPU cache spatial locality (contiguous RAM cells).\n\n"
        "LIMITATIONS & TRADE-OFFS:\n"
        "• Fixed size: Resizing requires allocating a new block and copying.\n"
        "• Expensive O(N) Insertion & Deletion: Inserting at index 0 forces every subsequent element to shift right."
    )
    draw_wrapped_text_in_box(draw, tradeoff_text, (680, 395, 1190, 575), font_path=FONT_REG_PATH, initial_size=14, fill=(203, 213, 225), line_spacing=6)

    draw_footer_caption(draw, "Arrays store elements in contiguous memory blocks, granting instant O(1) index access with expensive insertion.")
    img.save(f"{SLIDES_DIR}/v2_s2.png")

def build_v2_s3():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "03. Linear Structures: Linked Lists (Dynamic Pointers)", "Linear: Linked Lists")
    
    draw_card(draw, 40, 85, 1240, 620, title="Node-Based Dynamic Memory Allocation via Pointers", badge="LINKED LISTS")
    
    # Linked List Diagram
    draw.rounded_rectangle([(70, 145), (1210, 325)], radius=12, fill=(15, 23, 42), outline=(96, 165, 250), width=2)
    draw_wrapped_text_in_box(draw, "SINGLY LINKED LIST: HEAD POINTER CONNECTING DISCRETE HEAP NODES", (90, 160, 1190, 185), font_path=FONT_BOLD_PATH, initial_size=14, fill=(147, 197, 253))
    
    # Head pointer
    draw.rounded_rectangle([(90, 215), (190, 275)], radius=8, fill=(49, 46, 129), outline=(129, 140, 248), width=2)
    draw.text((105, 225), "HEAD", fill=(199, 210, 254), font=get_font(FONT_BOLD_PATH, 13))
    draw.text((105, 245), "0x4000", fill=(244, 244, 245), font=get_font(FONT_MONO_PATH, 12))
    draw.line([(190, 245), (240, 245)], fill=(129, 140, 248), width=3)
    draw.polygon([(235, 238), (245, 245), (235, 252)], fill=(129, 140, 248))
    
    nodes = [
        ("15", "0x4080", "Node 1 (0x4000)", 245),
        ("30", "0x5120", "Node 2 (0x4080)", 545),
        ("45", "NULL", "Node 3 (0x5120)", 845)
    ]
    for val, nxt, ntag, nx in nodes:
        draw.rounded_rectangle([(nx, 205), (nx + 230, 285)], radius=8, fill=(30, 41, 59), outline=(96, 165, 250), width=1)
        draw.text((nx + 15, 215), ntag, fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 10))
        # Data box
        draw.rounded_rectangle([(nx + 15, 235), (nx + 95, 275)], radius=4, fill=(15, 23, 42), outline=(71, 85, 105), width=1)
        draw.text((nx + 25, 245), f"Data: {val}", fill=(244, 244, 245), font=get_font(FONT_BOLD_PATH, 12))
        # Pointer box
        draw.rounded_rectangle([(nx + 105, 235), (nx + 215, 275)], radius=4, fill=(15, 23, 42), outline=(96, 165, 250), width=1)
        draw.text((nx + 115, 245), f"Next: {nxt}", fill=(147, 197, 253), font=get_font(FONT_MONO_PATH, 11))
        # Arrow to next
        if nxt != "NULL":
            draw.line([(nx + 230, 245), (nx + 295, 245)], fill=(96, 165, 250), width=3)
            draw.polygon([(nx + 290, 238), (nx + 300, 245), (nx + 290, 252)], fill=(96, 165, 250))

    # Left: Advantages
    draw.rounded_rectangle([(70, 345), (620, 595)], radius=12, fill=(30, 41, 59), outline=(52, 211, 153), width=1)
    draw_wrapped_text_in_box(draw, "LINKED LIST ADVANTAGES", (90, 365, 600, 395), font_path=FONT_BOLD_PATH, initial_size=16, fill=(52, 211, 153))
    adv_text = (
        "• Truly Dynamic Size: Nodes allocate on demand on the heap without declaring fixed capacity.\n"
        "• Instant O(1) Head Insertion: Rewiring the HEAD pointer takes constant time with zero shifting!\n"
        "• Efficient Deletion: Deleting a node simply redirects the previous node's pointer."
    )
    draw_wrapped_text_in_box(draw, adv_text, (90, 405, 600, 575), font_path=FONT_REG_PATH, initial_size=14, fill=(203, 213, 225), line_spacing=6)

    # Right: Limitations
    draw.rounded_rectangle([(660, 345), (1210, 595)], radius=12, fill=(30, 41, 59), outline=(244, 114, 182), width=1)
    draw_wrapped_text_in_box(draw, "LINKED LIST LIMITATIONS", (680, 365, 1190, 395), font_path=FONT_BOLD_PATH, initial_size=16, fill=(244, 114, 182))
    lim_text = (
        "• No Random Access: Accessing the Nth node requires traversing from HEAD in O(N) sequential steps.\n"
        "• Memory Pointer Overhead: Every single node consumes extra bytes to store memory pointer addresses.\n"
        "• Cache Inefficiency: Nodes scattered across heap cause frequent CPU cache misses."
    )
    draw_wrapped_text_in_box(draw, lim_text, (680, 405, 1190, 575), font_path=FONT_REG_PATH, initial_size=14, fill=(203, 213, 225), line_spacing=6)

    draw_footer_caption(draw, "Linked lists store elements in separate memory nodes linked by pointers, providing dynamic resizing and fast O(1) head insertion.")
    img.save(f"{SLIDES_DIR}/v2_s3.png")

def build_v2_s4():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "04. Linear Structures: Stacks (LIFO Protocol)", "Linear: Stacks")
    
    draw_card(draw, 40, 85, 1240, 620, title="Last-In, First-Out (LIFO) Discipline & Operations", badge="STACKS")
    
    # Left: Vertical Stack Cylinder
    draw.rounded_rectangle([(70, 145), (480, 595)], radius=12, fill=(15, 23, 42), outline=(244, 114, 182), width=2)
    draw_wrapped_text_in_box(draw, "VERTICAL STACK (LIFO)", (90, 165, 460, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(244, 114, 182), align="center")
    
    # Cylinder frame
    draw.line([(140, 220), (140, 520)], fill=(71, 85, 105), width=3)
    draw.line([(410, 220), (410, 520)], fill=(71, 85, 105), width=3)
    draw.line([(140, 520), (410, 520)], fill=(71, 85, 105), width=3)
    
    # Stack items
    s_items = [
        ("30", "TOP (Last In / First Out)", (244, 114, 182), 260),
        ("20", "Index 1", (99, 102, 241), 350),
        ("10", "Index 0 (Base)", (52, 211, 153), 440)
    ]
    for val, label, col, sy in s_items:
        draw.rounded_rectangle([(155, sy), (395, sy + 65)], radius=8, fill=(30, 41, 59), outline=col, width=2)
        draw.text((175, sy + 18), f"VAL: {val}", fill=(244, 244, 245), font=get_font(FONT_BOLD_PATH, 18))
        draw.text((275, sy + 24), label, fill=col, font=get_font(FONT_BOLD_PATH, 11))
        
    # Top pointer indicator
    draw.polygon([(85, 285), (130, 292), (85, 300)], fill=(244, 114, 182))
    draw.text((50, 265), "TOP PTR", fill=(244, 114, 182), font=get_font(FONT_BOLD_PATH, 11))

    # Right: Stack Operations & Real-World Uses
    draw.rounded_rectangle([(510, 145), (1210, 595)], radius=12, fill=(15, 23, 42), outline=(99, 102, 241), width=2)
    draw_wrapped_text_in_box(draw, "CORE STACK OPERATIONS & USE CASES", (530, 165, 1190, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(129, 140, 248))
    
    stack_ops = [
        ("PUSH(element)", "O(1) Constant", "Places a new item directly onto the top of the stack.", (52, 211, 153)),
        ("POP()", "O(1) Constant", "Removes and returns the topmost item from the stack.", (244, 114, 182)),
        ("PEEK()", "O(1) Constant", "Inspects the top item without modifying stack state.", (251, 191, 36))
    ]
    oy = 215
    for oname, obigo, odesc, ocol in stack_ops:
        draw.rounded_rectangle([(530, oy), (1190, oy + 70)], radius=8, fill=(30, 41, 59), outline=ocol, width=1)
        draw.text((545, oy + 12), oname, fill=ocol, font=get_font(FONT_BOLD_PATH, 15))
        draw.rounded_rectangle([(720, oy + 10), (830, oy + 32)], radius=4, fill=(15, 23, 42), outline=ocol, width=1)
        draw.text((732, oy + 14), obigo, fill=ocol, font=get_font(FONT_BOLD_PATH, 10))
        draw_wrapped_text_in_box(draw, odesc, (545, oy + 38, 1175, oy + 62), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225))
        oy += 82

    # Real World Box
    draw.rounded_rectangle([(530, 470), (1190, 575)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    draw.text((545, 480), "REAL WORLD APPLICATIONS:", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
    rw_text = (
        "• CPU Function Call Stack: Saves return addresses and local variables during nested function calls.\n"
        "• Undo / Redo Buffers: Text editors push keystroke snapshots onto an undo stack.\n"
        "• Expression Evaluation: Parsing parenthesis balancing and postfix mathematical equations."
    )
    draw_wrapped_text_in_box(draw, rw_text, (545, 502, 1175, 565), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)

    draw_footer_caption(draw, "Stacks operate on Last-In, First-Out order: elements push and pop strictly from the top with instant O(1) time.")
    img.save(f"{SLIDES_DIR}/v2_s4.png")

def build_v2_s5():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "05. Linear Structures: Queues (FIFO Protocol)", "Linear: Queues")
    
    draw_card(draw, 40, 85, 1240, 620, title="First-In, First-Out (FIFO) Discipline & Pipeline Architecture", badge="QUEUES")
    
    # Horizontal Queue Conveyor
    draw.rounded_rectangle([(70, 145), (1210, 315)], radius=12, fill=(15, 23, 42), outline=(251, 191, 36), width=2)
    draw_wrapped_text_in_box(draw, "HORIZONTAL QUEUE BUFFER (Items Enter at REAR and Exit from FRONT)", (90, 160, 1190, 185), font_path=FONT_BOLD_PATH, initial_size=14, fill=(251, 191, 36))
    
    # Conveyor track
    draw.line([(120, 205), (1160, 205)], fill=(71, 85, 105), width=2)
    draw.line([(120, 285), (1160, 285)], fill=(71, 85, 105), width=2)
    
    # Items
    q_items = [
        ("REAR", "Enter ->", 140, (99, 102, 241)),
        ("Slot 3", "40", 370, (203, 213, 225)),
        ("Slot 2", "30", 570, (203, 213, 225)),
        ("Slot 1", "20", 770, (203, 213, 225)),
        ("FRONT", "10 (Exit)", 970, (52, 211, 153))
    ]
    for tag, val, qx, col in q_items:
        draw.rounded_rectangle([(qx, 215), (qx + 160, 275)], radius=8, fill=(30, 41, 59), outline=col, width=2)
        draw.text((qx + 15, 225), tag, fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 10))
        draw.text((qx + 15, 245), val, fill=col, font=get_font(FONT_BOLD_PATH, 16))

    # Left: Operations
    draw.rounded_rectangle([(70, 335), (620, 595)], radius=12, fill=(30, 41, 59), outline=(99, 102, 241), width=1)
    draw_wrapped_text_in_box(draw, "QUEUE INVARIANTS & OPERATIONS", (90, 355, 600, 385), font_path=FONT_BOLD_PATH, initial_size=16, fill=(129, 140, 248))
    q_ops_text = (
        "• ENQUEUE(x): Appends an element to the REAR in O(1) time.\n"
        "• DEQUEUE(): Removes and returns the item at FRONT in O(1) time.\n"
        "• FRONT(): Inspects the next item to be serviced without removal.\n\n"
        "CIRCULAR QUEUE VARIANT:\n"
        "Wraps REAR pointer around to index 0 using modulo arithmetic ((rear + 1) % size) to prevent memory waste in fixed arrays."
    )
    draw_wrapped_text_in_box(draw, q_ops_text, (90, 395, 600, 575), font_path=FONT_REG_PATH, initial_size=13, fill=(203, 213, 225), line_spacing=5)

    # Right: Real-World Applications
    draw.rounded_rectangle([(660, 335), (1210, 595)], radius=12, fill=(30, 41, 59), outline=(52, 211, 153), width=1)
    draw_wrapped_text_in_box(draw, "CRITICAL SYSTEM USE CASES", (680, 355, 1190, 385), font_path=FONT_BOLD_PATH, initial_size=16, fill=(52, 211, 153))
    q_use_text = (
        "• Operating System Task Scheduling: Round-Robin CPU scheduling feeds running threads from a ready queue.\n"
        "• Hardware Asynchronous Buffers: Keyboard stroke buffers, disk I/O controllers, and network packet routers.\n"
        "• Printer Spoolers: Print jobs process in exact chronological arrival order.\n"
        "• Breadth-First Search (BFS): Graph exploration traverses level-by-level using a FIFO traversal queue."
    )
    draw_wrapped_text_in_box(draw, q_use_text, (680, 395, 1190, 575), font_path=FONT_REG_PATH, initial_size=13, fill=(203, 213, 225), line_spacing=5)

    draw_footer_caption(draw, "Queues operate on First-In, First-Out order: items enter at the rear and exit from the front, ideal for process scheduling.")
    img.save(f"{SLIDES_DIR}/v2_s5.png")

def build_v2_s6():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "06. Non-Linear Structures: Trees & Binary Search Trees", "Non-Linear: Trees")
    
    draw_card(draw, 40, 85, 1240, 620, title="Hierarchical Parent-Child Branching & O(log N) Search Power", badge="TREES & BST")
    
    # Left: Binary Search Tree Diagram
    draw.rounded_rectangle([(70, 145), (600, 595)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw_wrapped_text_in_box(draw, "BINARY SEARCH TREE (Left < Root < Right)", (90, 165, 580, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(52, 211, 153), align="center")
    
    # Root: 50
    draw.ellipse([(310, 215), (360, 265)], fill=(49, 46, 129), outline=(129, 140, 248), width=2)
    draw.text((323, 232), "50", fill=(255, 255, 255), font=get_font(FONT_BOLD_PATH, 16))
    
    # Branch lines
    draw.line([(320, 260), (215, 310)], fill=(129, 140, 248), width=2)
    draw.line([(350, 260), (455, 310)], fill=(129, 140, 248), width=2)
    
    # Left Child: 30
    draw.ellipse([(190, 310), (240, 360)], fill=(30, 41, 59), outline=(52, 211, 153), width=2)
    draw.text((203, 327), "30", fill=(110, 231, 183), font=get_font(FONT_BOLD_PATH, 16))
    
    # Right Child: 70
    draw.ellipse([(430, 310), (480, 360)], fill=(30, 41, 59), outline=(52, 211, 153), width=2)
    draw.text((443, 327), "70", fill=(110, 231, 183), font=get_font(FONT_BOLD_PATH, 16))
    
    # Leaves
    draw.line([(200, 355), (150, 400)], fill=(52, 211, 153), width=2)
    draw.line([(230, 355), (275, 400)], fill=(52, 211, 153), width=2)
    draw.line([(440, 355), (395, 400)], fill=(52, 211, 153), width=2)
    draw.line([(470, 355), (515, 400)], fill=(52, 211, 153), width=2)
    
    for lx, lval in [(130, "20"), (260, "40"), (375, "60"), (500, "80")]:
        draw.ellipse([(lx, 400), (lx + 45, 445)], fill=(15, 23, 42), outline=(71, 85, 105), width=2)
        draw.text((lx + 12, 415), lval, fill=(203, 213, 225), font=get_font(FONT_BOLD_PATH, 13))

    # BST Search Box
    draw.rounded_rectangle([(90, 475), (580, 575)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    bst_rule = (
        "BST INVARIANT:\n"
        "For every node: All keys in left subtree < Node Key < All keys in right subtree.\n"
        "Searching for key 40 prunes the entire right half of the tree in a single step!"
    )
    draw_wrapped_text_in_box(draw, bst_rule, (105, 488, 565, 565), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)

    # Right: Tree Characteristics & Applications
    draw.rounded_rectangle([(630, 145), (1210, 595)], radius=12, fill=(15, 23, 42), outline=(99, 102, 241), width=2)
    draw_wrapped_text_in_box(draw, "TREE TOPOLOGY & SYSTEM APPLICATIONS", (650, 165, 1190, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(129, 140, 248))
    
    t_points = [
        ("Hierarchical Nodes", "Root node connects to parent and child nodes with no cycles allowed."),
        ("Blazing O(log N) Efficiency", "Balanced BSTs (AVL, Red-Black) search 1,000,000 items in just ~20 comparisons!"),
        ("Database B-Trees", "Database indexes (PostgreSQL, MySQL) use balanced B+ Trees to read disk blocks rapidly."),
        ("HTML DOM & File Systems", "Web browsers render documents as HTML DOM trees; operating systems store files as directory trees.")
    ]
    ty = 215
    for t_head, t_body in t_points:
        draw.rounded_rectangle([(650, ty), (1190, ty + 78)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
        draw.text((665, ty + 10), t_head, fill=(165, 180, 252), font=get_font(FONT_BOLD_PATH, 14))
        draw_wrapped_text_in_box(draw, t_body, (665, ty + 32, 1170, ty + 70), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)
        ty += 90

    draw_footer_caption(draw, "Trees organize data hierarchically into root, parent, and child nodes; Binary Search Trees allow blazing O(log N) search.")
    img.save(f"{SLIDES_DIR}/v2_s6.png")

def build_v2_s7():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    draw_header(draw, "ALGOLEARN STUDIO", "07. Non-Linear Structures: Graphs & Decision Matrix", "Graphs & Summary")
    
    draw_card(draw, 40, 85, 1240, 620, title="Network Topologies & Complete Architecture Decision Matrix", badge="DECISION MATRIX")
    
    # Left: Graph Network
    draw.rounded_rectangle([(65, 145), (550, 595)], radius=12, fill=(15, 23, 42), outline=(96, 165, 250), width=2)
    draw_wrapped_text_in_box(draw, "GRAPHS: VERTICES & EDGES", (85, 165, 530, 195), font_path=FONT_BOLD_PATH, initial_size=16, fill=(96, 165, 250), align="center")
    
    # Graph nodes
    g_nodes = [(170, 260, "Router A"), (430, 260, "Server B"), (230, 380, "Client C"), (430, 420, "Database D")]
    draw.line([(170, 260), (430, 260)], fill=(96, 165, 250), width=2)
    draw.line([(170, 260), (230, 380)], fill=(96, 165, 250), width=2)
    draw.line([(430, 260), (230, 380)], fill=(96, 165, 250), width=2)
    draw.line([(230, 380), (430, 420)], fill=(96, 165, 250), width=2)
    
    for gx, gy, gval in g_nodes:
        draw.ellipse([(gx - 28, gy - 28), (gx + 28, gy + 28)], fill=(30, 41, 59), outline=(96, 165, 250), width=2)
        draw.text((gx - 20, gy - 8), gval.split()[0], fill=(255, 255, 255), font=get_font(FONT_BOLD_PATH, 11))
        draw.text((gx - 18, gy + 8), gval.split()[1], fill=(147, 197, 253), font=get_font(FONT_REG_PATH, 9))
        
    draw.rounded_rectangle([(85, 475), (530, 575)], radius=8, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    g_text = (
        "GRAPH TOPOLOGY:\n"
        "Vertices (V) connected by directed or undirected Edges (E).\n"
        "Powers GPS navigation (Dijkstra), social followers, and neural network models."
    )
    draw_wrapped_text_in_box(draw, g_text, (100, 488, 515, 565), font_path=FONT_REG_PATH, initial_size=12, fill=(203, 213, 225), line_spacing=4)

    # Right: The Ultimate Decision Matrix
    draw.rounded_rectangle([(575, 145), (1215, 595)], radius=12, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw_wrapped_text_in_box(draw, "THE ULTIMATE ARCHITECTURE DECISION MATRIX", (595, 165, 1195, 195), font_path=FONT_BOLD_PATH, initial_size=15, fill=(52, 211, 153))
    
    # Table Header
    draw.rounded_rectangle([(595, 205), (1195, 235)], radius=6, fill=(30, 41, 59), outline=(71, 85, 105), width=1)
    draw.text((610, 212), "STRUCTURE", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
    draw.text((740, 212), "INDEX ACCESS", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
    draw.text((870, 212), "INSERTION", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
    draw.text((990, 212), "BEST SUITED FOR", fill=(148, 163, 184), font=get_font(FONT_BOLD_PATH, 11))
    
    matrix_rows = [
        ("Array", "O(1) Instant", "O(N) Shift", "Known size, fast lookups", (52, 211, 153)),
        ("Linked List", "O(N) Scan", "O(1) Head", "Frequent insertions / growth", (96, 165, 250)),
        ("Stack", "O(1) Top", "O(1) Push", "LIFO execution, undo buffers", (244, 114, 182)),
        ("Queue", "O(1) Front", "O(1) Rear", "FIFO buffers, CPU scheduling", (251, 191, 36)),
        ("BST (Tree)", "O(log N)", "O(log N)", "Hierarchical search & sort", (52, 211, 153)),
        ("Graph", "O(V + E)", "O(1) Edge", "Networks, maps, routing", (96, 165, 250))
    ]
    my = 245
    for mstruct, maccess, mins, muse, mcol in matrix_rows:
        draw.rounded_rectangle([(595, my), (1195, my + 50)], radius=6, fill=(30, 41, 59), outline=(51, 65, 85), width=1)
        draw.text((610, my + 16), mstruct, fill=mcol, font=get_font(FONT_BOLD_PATH, 13))
        draw.text((740, my + 16), maccess, fill=(244, 244, 245), font=get_font(FONT_MONO_PATH, 12))
        draw.text((870, my + 16), mins, fill=(244, 244, 245), font=get_font(FONT_MONO_PATH, 12))
        draw.text((990, my + 16), muse, fill=(203, 213, 225), font=get_font(FONT_REG_PATH, 11))
        my += 58

    draw_footer_caption(draw, "Choose Arrays for fast indexed lookup, Linked Lists for flexible inserts, Stacks and Queues for sequential order, and Trees for hierarchical search.")
    img.save(f"{SLIDES_DIR}/v2_s7.png")

print("Rendering all updated slides...")
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
build_v2_s4()
build_v2_s5()
build_v2_s6()
build_v2_s7()
print("All 14 comprehensive slides rendered with unified studio aesthetics!")
