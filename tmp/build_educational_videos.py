#!/usr/bin/env python3
import subprocess
import math
import os
import shutil
import time

WIDTH = 1280
HEIGHT = 720
FPS = 24

def clamp(v, low, high):
    return max(low, min(high, v))

def ease(t):
    t = clamp(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

def format_time(seconds):
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"

# ==========================================
# VIDEO 1: DATA STRUCTURES AND TYPES
# ==========================================
def render_frame_v1(frame_idx, total_frames, duration):
    t = frame_idx / FPS
    progress_pct = (t / duration) * 100.0

    if t < 10.0:
        scene_name = "01 / 07: WHAT IS DATA? (RAW VS ORGANIZED)"
        sub_text = "Data means raw facts and information, such as numbers, characters, words, or symbols."
        badge_text = "RAW UNORGANIZED STATE"
        scene_num = 1
    elif t < 20.0:
        scene_name = "02 / 07: WHY ORGANIZE DATA? (O(1) MEMORY ACCESS)"
        sub_text = "When data is organized properly, it becomes easier to access, manage, search, and process."
        badge_text = "MEMORY INDEXING & CACHE HIT"
        scene_num = 2
    elif t < 29.0:
        scene_name = "03 / 07: DEFINITION OF A DATA STRUCTURE"
        sub_text = "Data structures are ways of organizing and storing data, so that we can use it efficiently."
        badge_text = "MEMORY MODEL + PERMITTED OPS"
        scene_num = 3
    elif t < 37.0:
        scene_name = "04 / 07: CLASSIFICATION TAXONOMY"
        sub_text = "Data structures can be broadly classified into Primitive and Non-Primitive data structures."
        badge_text = "PRIMITIVE VS NON-PRIMITIVE"
        scene_num = 4
    elif t < 47.0:
        scene_name = "05 / 07: PRIMITIVE DATA TYPES IN ACTION"
        sub_text = "Primitive data structures are basic data types that directly store simple values: Integer, Float, Char, and Bool."
        badge_text = "HARDWARE REGISTER STORAGE"
        scene_num = 5
    elif t < 57.0:
        scene_name = "06 / 07: NON-PRIMITIVE DATA STRUCTURES"
        sub_text = "Non-primitive data structures are created using primitive types to store multiple or complex values: Arrays, Lists, Files."
        badge_text = "HEAP COMPOSITE REFERENCES"
        scene_num = 6
    else:
        scene_name = "07 / 07: OPERATIONS & COMPLEXITY TRADEOFFS"
        sub_text = "Data structures organize data efficiently and can be classified into different types based on how they store information."
        badge_text = "BIG-O EFFICIENCY SUMMARY"
        scene_num = 7

    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">',
        '<defs>',
        '  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">',
        '    <stop offset="0%" stop-color="#080c18"/>',
        '    <stop offset="50%" stop-color="#0f172a"/>',
        '    <stop offset="100%" stop-color="#09101f"/>',
        '  </linearGradient>',
        '  <linearGradient id="indigoGrad" x1="0" y1="0" x2="1" y2="0">',
        '    <stop offset="0%" stop-color="#6366f1"/>',
        '    <stop offset="100%" stop-color="#a855f7"/>',
        '  </linearGradient>',
        '  <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="0">',
        '    <stop offset="0%" stop-color="#06b6d4"/>',
        '    <stop offset="100%" stop-color="#3b82f6"/>',
        '  </linearGradient>',
        '</defs>',
        f'<rect width="{WIDTH}" height="{HEIGHT}" fill="url(#bgGrad)"/>',
    ]

    # Grid lines
    for gx in range(0, WIDTH, 80):
        svg.append(f'<line x1="{gx}" y1="0" x2="{gx}" y2="{HEIGHT}" stroke="#1e293b" stroke-width="1" stroke-opacity="0.35"/>')
    for gy in range(0, HEIGHT, 80):
        svg.append(f'<line x1="0" y1="{gy}" x2="{WIDTH}" y2="{gy}" stroke="#1e293b" stroke-width="1" stroke-opacity="0.35"/>')

    # Top Header Bar
    svg.append(f'<rect x="24" y="20" width="{WIDTH - 48}" height="64" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
    svg.append(f'<rect x="36" y="32" width="10" height="40" rx="5" fill="url(#indigoGrad)"/>')
    svg.append(f'<text x="58" y="52" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" letter-spacing="1">LESSON 01: DATA STRUCTURES AND TYPES</text>')
    svg.append(f'<text x="58" y="70" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="600">{scene_name}</text>')

    svg.append(f'<rect x="{WIDTH - 360}" y="34" width="210" height="36" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.2"/>')
    svg.append(f'<text x="{WIDTH - 255}" y="57" text-anchor="middle" fill="#c7d2fe" font-family="monospace" font-size="12" font-weight="bold">{badge_text}</text>')
    svg.append(f'<rect x="{WIDTH - 135}" y="34" width="100" height="36" rx="10" fill="#090d16" stroke="#475569" stroke-width="1.2"/>')
    svg.append(f'<text x="{WIDTH - 85}" y="57" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">{format_time(t)} / {format_time(duration)}</text>')

    # MAIN STAGE
    svg.append(f'<rect x="24" y="96" width="{WIDTH - 48}" height="490" rx="20" fill="#0a0f1d" stroke="#1e293b" stroke-width="1.5"/>')

    if scene_num == 1:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 1: Raw Unorganized Facts vs Structured Memory</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Unstructured elements lack index mapping, forcing costly O(N) linear scans.</text>')

        items = [
            ("42", "Integer", "#ec4899", 200, 260),
            ('"DSA"', "String", "#38bdf8", 420, 340),
            ("3.14", "Float", "#10b981", 640, 240),
            ("true", "Boolean", "#f59e0b", 860, 350),
            ("'A'", "Char", "#a855f7", 1040, 270),
        ]

        scan_x = 100 + int((t % 4.0) / 4.0 * 1080)
        svg.append(f'<line x1="{scan_x}" y1="180" x2="{scan_x}" y2="460" stroke="#f43f5e" stroke-width="3"/>')
        svg.append(f'<rect x="{scan_x - 70}" y="190" width="140" height="26" rx="6" fill="#be123c"/>')
        svg.append(f'<text x="{scan_x}" y="208" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold">Linear Scan: O(N)</text>')

        for val, kind, color, bx, by in items:
            float_y = by + math.sin(t * 3.0 + bx) * 12.0
            float_x = bx + math.cos(t * 2.0 + by) * 8.0
            svg.append(f'<g transform="translate({float_x},{float_y})">')
            svg.append(f'<circle cx="0" cy="0" r="54" fill="#0f172a" stroke="{color}" stroke-width="2.5"/>')
            svg.append(f'<text x="0" y="6" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">{val}</text>')
            svg.append(f'<text x="0" y="28" text-anchor="middle" fill="{color}" font-family="sans-serif" font-size="11" font-weight="bold">{kind}</text>')
            svg.append('</g>')

        svg.append(f'<rect x="240" y="475" width="800" height="85" rx="14" fill="#0f172a" stroke="#334155" stroke-width="1"/>')
        svg.append(f'<text x="265" y="505" fill="#f43f5e" font-family="monospace" font-size="14" font-weight="bold">UNORGANIZED STATE:</text>')
        svg.append(f'<text x="445" y="505" fill="#cbd5e1" font-family="sans-serif" font-size="13">Must examine every memory address one by one (Linear Scan O(N))</text>')
        svg.append(f'<text x="265" y="535" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">ORGANIZED SOLUTION:</text>')
        svg.append(f'<text x="445" y="535" fill="#cbd5e1" font-family="sans-serif" font-size="13">Impose deliberate data structure rules to unlock instant O(1) or O(log N) operations!</text>')

    elif scene_num == 2:
        rel_t = t - 10.0
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 2: Instant O(1) Address Arithmetic in Organized Memory</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Contiguous arrangement allows the CPU memory bus to compute exact addresses instantaneously.</text>')

        elements = [("42", "0x1000", "0"), ("89", "0x1004", "1"), ("15", "0x1008", "2"), ("99", "0x100C", "3"), ("77", "0x1010", "4")]
        base_x = 260
        target_idx = 2

        for i, (val, addr, idx_s) in enumerate(elements):
            cx = base_x + i * 150
            cy = 280
            is_target = (i == target_idx)
            border_col = "#10b981" if is_target else "#475569"
            bg_col = "#064e3b" if is_target else "#0f172a"

            svg.append(f'<rect x="{cx}" y="{cy}" width="130" height="90" rx="14" fill="{bg_col}" stroke="{border_col}" stroke-width="{3 if is_target else 1.5}"/>')
            svg.append(f'<text x="{cx + 65}" y="{cy + 42}" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="26" font-weight="bold">{val}</text>')
            svg.append(f'<text x="{cx + 65}" y="{cy + 70}" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="12">{addr}</text>')
            svg.append(f'<rect x="{cx + 35}" y="{cy - 30}" width="60" height="22" rx="6" fill="#1e293b"/>')
            svg.append(f'<text x="{cx + 65}" y="{cy - 15}" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">index [{idx_s}]</text>')

        svg.append(f'<line x1="640" y1="210" x2="625" y2="275" stroke="#10b981" stroke-width="4"/>')
        svg.append(f'<circle cx="625" cy="275" r="7" fill="#10b981"/>')

        svg.append(f'<rect x="220" y="415" width="840" height="135" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="1.8"/>')
        svg.append(f'<text x="640" y="448" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="18" font-weight="bold">TARGET ADDRESS = BASE + (INDEX × SIZE)</text>')
        svg.append(f'<text x="640" y="482" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="20" font-weight="bold">0x1008 = 0x1000 + (2 × 4 bytes)</text>')
        svg.append(f'<text x="640" y="518" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="15" font-weight="bold">Access Time: 0.1 nanoseconds (O(1) Instant Cache Hit — No scanning required!)</text>')

    elif scene_num == 3:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 3: The Architecture of a Data Structure</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">A Data Structure pairs memory layout rules with supported algorithmic operations.</text>')

        svg.append(f'<rect x="180" y="195" width="920" height="80" rx="16" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>')
        svg.append(f'<text x="640" y="244" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="900" letter-spacing="1">DATA STRUCTURE = MEMORY LAYOUT + PERMITTED OPERATIONS</text>')

        ops = [
            ("ACCESS", "arr[i]", "Direct O(1) Read", "#38bdf8", 120),
            ("INSERT", "push(val)", "Allocate & Link", "#10b981", 400),
            ("DELETE", "pop()", "Remove & Free RAM", "#f43f5e", 680),
            ("SEARCH", "find(key)", "Binary / Scan O(log N)", "#fbbf24", 960),
        ]
        active_op = int((t * 4.0) % 4.0)

        for i, (op_name, code_snip, desc, col, ox) in enumerate(ops):
            is_active = (i == active_op)
            bcol = col if is_active else "#334155"
            bg = "#1e293b" if is_active else "#0f172a"

            svg.append(f'<rect x="{ox}" y="305" width="220" height="210" rx="16" fill="{bg}" stroke="{bcol}" stroke-width="{3 if is_active else 1.5}"/>')
            svg.append(f'<rect x="{ox + 20}" y="325" width="180" height="34" rx="8" fill="{col}" fill-opacity="0.2"/>')
            svg.append(f'<text x="{ox + 110}" y="348" text-anchor="middle" fill="{col}" font-family="monospace" font-size="16" font-weight="bold">{op_name}</text>')
            svg.append(f'<rect x="{ox + 20}" y="375" width="180" height="42" rx="8" fill="#090d16" stroke="#475569" stroke-width="1"/>')
            svg.append(f'<text x="{ox + 110}" y="402" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="14">{code_snip}</text>')
            svg.append(f'<text x="{ox + 110}" y="455" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="600">{desc}</text>')
            if is_active:
                svg.append(f'<circle cx="{ox + 110}" cy="490" r="6" fill="{col}"/>')

    elif scene_num == 4:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 4: Classification of Data Structures</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Data structures branch into hardware-level Primitive and composite Non-Primitive types.</text>')

        svg.append(f'<rect x="490" y="195" width="300" height="60" rx="14" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>')
        svg.append(f'<text x="640" y="232" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">DATA STRUCTURES</text>')

        svg.append(f'<path d="M 540 255 L 340 330" stroke="#f43f5e" stroke-width="3"/>')
        svg.append(f'<path d="M 740 255 L 940 330" stroke="#38bdf8" stroke-width="3"/>')

        svg.append(f'<rect x="180" y="330" width="320" height="200" rx="16" fill="#1f1322" stroke="#f43f5e" stroke-width="2"/>')
        svg.append(f'<text x="340" y="365" text-anchor="middle" fill="#f43f5e" font-family="sans-serif" font-size="18" font-weight="bold">PRIMITIVE TYPES</text>')
        svg.append(f'<text x="340" y="390" text-anchor="middle" fill="#fda4af" font-family="monospace" font-size="12">Direct Hardware / Stack Registers</text>')
        svg.append(f'<line x1="200" y1="405" x2="480" y2="405" stroke="#4c0519" stroke-width="1.5"/>')
        prim_items = ["• Integer (int, 4 bytes)", "• Float (float/double, 4-8 bytes)", "• Character (char, 1-2 bytes)", "• Boolean (bool, 1 bit flag)"]
        for pi, item in enumerate(prim_items):
            svg.append(f'<text x="215" y="{435 + pi * 24}" fill="#ffffff" font-family="sans-serif" font-size="13">{item}</text>')

        svg.append(f'<rect x="780" y="330" width="320" height="200" rx="16" fill="#082f49" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<text x="940" y="365" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="bold">NON-PRIMITIVE TYPES</text>')
        svg.append(f'<text x="940" y="390" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="12">Composite Collections / Heap Pointers</text>')
        svg.append(f'<line x1="800" y1="405" x2="1080" y2="405" stroke="#0369a1" stroke-width="1.5"/>')
        non_prim_items = ["• Linear: Arrays & Linked Lists", "• Sequential: Stacks & Queues", "• Non-Linear: Trees & BST", "• Network: Graphs & Hash Tables"]
        for npi, item in enumerate(non_prim_items):
            svg.append(f'<text x="815" y="{435 + npi * 24}" fill="#ffffff" font-family="sans-serif" font-size="13">{item}</text>')

    elif scene_num == 5:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 5: Primitive Types Stored in Native CPU Registers</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Each primitive maps directly to machine word instructions without pointer indirection.</text>')

        primitives = [
            ("INTEGER", "int count = 42;", "32-bit Two's Complement", "00000000 00000000 00000000 00101010", "#38bdf8", 90),
            ("FLOAT", "float pi = 3.14f;", "IEEE-754 32-bit Single Prec.", "Sign[0] Exp[10000000] Mant[1001000...]", "#10b981", 370),
            ("CHARACTER", "char ch = 'A';", "8-bit ASCII Encoding", "Decimal: 65 -> Binary: 01000001", "#f59e0b", 650),
            ("BOOLEAN", "bool active = true;", "1-bit Logical State Flag", "Voltage High (1) / Low (0)", "#ec4899", 930),
        ]

        for title, code, spec, bits, col, px in primitives:
            svg.append(f'<rect x="{px}" y="205" width="260" height="320" rx="16" fill="#0f172a" stroke="{col}" stroke-width="2"/>')
            svg.append(f'<rect x="{px + 15}" y="220" width="230" height="36" rx="8" fill="{col}" fill-opacity="0.2"/>')
            svg.append(f'<text x="{px + 130}" y="244" text-anchor="middle" fill="{col}" font-family="monospace" font-size="16" font-weight="bold">{title}</text>')
            svg.append(f'<rect x="{px + 15}" y="270" width="230" height="42" rx="8" fill="#090d16" stroke="#334155" stroke-width="1"/>')
            svg.append(f'<text x="{px + 130}" y="296" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="13" font-weight="bold">{code}</text>')
            svg.append(f'<text x="{px + 130}" y="340" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">{spec}</text>')

            svg.append(f'<rect x="{px + 15}" y="365" width="230" height="135" rx="10" fill="#020617" stroke="#1e293b" stroke-width="1.5"/>')
            svg.append(f'<text x="{px + 25}" y="390" fill="{col}" font-family="monospace" font-size="11" font-weight="bold">REGISTER BITS:</text>')
            svg.append(f'<text x="{px + 25}" y="420" fill="#ffffff" font-family="monospace" font-size="11">{bits[:20]}</text>')
            if len(bits) > 20:
                svg.append(f'<text x="{px + 25}" y="442" fill="#cbd5e1" font-family="monospace" font-size="11">{bits[20:]}</text>')
            svg.append(f'<text x="{px + 25}" y="480" fill="#34d399" font-family="monospace" font-size="11">CPU Direct Execution</text>')

    elif scene_num == 6:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 6: Non-Primitive Structures Built from Primitives</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Arrays, Linked Lists, and File Buffers combine primitives with memory pointers.</text>')

        svg.append(f'<rect x="80" y="200" width="520" height="330" rx="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<text x="340" y="235" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="bold">1. ARRAY (Contiguous Memory)</text>')
        svg.append(f'<text x="340" y="260" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="12">int scores[4] = {{10, 20, 30, 40}};</text>')

        arr_vals = [("10", "[0]"), ("20", "[1]"), ("30", "[2]"), ("40", "[3]")]
        for ai, (av, aidx) in enumerate(arr_vals):
            ax = 110 + ai * 115
            svg.append(f'<rect x="{ax}" y="290" width="100" height="70" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>')
            svg.append(f'<text x="{ax + 50}" y="332" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">{av}</text>')
            svg.append(f'<text x="{ax + 50}" y="385" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12">index {aidx}</text>')
        svg.append(f'<text x="340" y="440" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="13">Fixed capacity, instant O(1) random lookup via index offset.</text>')
        svg.append(f'<text x="340" y="485" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">Lookup: O(1) | Insertion: O(N)</text>')

        svg.append(f'<rect x="680" y="200" width="520" height="330" rx="18" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>')
        svg.append(f'<text x="940" y="235" text-anchor="middle" fill="#a855f7" font-family="sans-serif" font-size="18" font-weight="bold">2. LINKED LIST (Node Pointers)</text>')
        svg.append(f'<text x="940" y="260" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="12">struct Node {{ int data; Node* next; }};</text>')

        nodes = [("10", "•"), ("20", "•"), ("30", "null")]
        for ni, (nv, np) in enumerate(nodes):
            nx = 710 + ni * 140
            svg.append(f'<rect x="{nx}" y="290" width="105" height="70" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>')
            svg.append(f'<line x1="{nx + 60}" y1="290" x2="{nx + 60}" y2="360" stroke="#475569" stroke-width="1.5"/>')
            svg.append(f'<text x="{nx + 30}" y="332" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="20" font-weight="bold">{nv}</text>')
            svg.append(f'<text x="{nx + 82}" y="332" text-anchor="middle" fill="#a855f7" font-family="monospace" font-size="14" font-weight="bold">{np}</text>')
            if ni < 2:
                svg.append(f'<line x1="{nx + 105}" y1="325" x2="{nx + 135}" y2="325" stroke="#c084fc" stroke-width="3"/>')
                svg.append(f'<polygon points="{nx + 135},321 {nx + 143},325 {nx + 135},329" fill="#c084fc"/>')
        svg.append(f'<text x="940" y="440" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="13">Dynamic size, nodes scattered across RAM connected by pointers.</text>')
        svg.append(f'<text x="940" y="485" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">Lookup: O(N) | Insertion: O(1)</text>')

    else:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 7: Big-O Computational Efficiency Matrix</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Mastering algorithmic complexity dictates production architecture decisions.</text>')

        complexities = [
            ("O(1) CONSTANT TIME", "Instant Direct Index / Stack Push", 96, "#10b981", 195),
            ("O(log N) LOGARITHMIC", "Binary Search / Tree Bisection", 82, "#38bdf8", 270),
            ("O(N) LINEAR TIME", "Sequential Scan / List Traversal", 58, "#f59e0b", 345),
            ("O(N²) QUADRATIC", "Nested Loops / Bubble Sort", 28, "#f43f5e", 420),
        ]
        anim_growth = min(1.0, (t - 57.0) / 4.0)

        for label, usage, bar_pct, bcol, by in complexities:
            cur_width = (bar_pct / 100.0) * 580 * anim_growth
            svg.append(f'<rect x="140" y="{by}" width="1000" height="60" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>')
            svg.append(f'<text x="165" y="{by + 36}" fill="{bcol}" font-family="monospace" font-size="15" font-weight="bold">{label}</text>')
            svg.append(f'<rect x="420" y="{by + 16}" width="580" height="28" rx="7" fill="#1e293b"/>')
            svg.append(f'<rect x="420" y="{by + 16}" width="{cur_width}" height="28" rx="7" fill="{bcol}"/>')
            svg.append(f'<text x="1020" y="{by + 36}" text-anchor="end" fill="#cbd5e1" font-family="sans-serif" font-size="12">{usage}</text>')

        svg.append(f'<rect x="340" y="495" width="600" height="50" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="1.8"/>')
        svg.append(f'<text x="640" y="527" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="16" font-weight="bold">Lesson 01 Completed: Earned +25 Visualization Points!</text>')

    # Bottom Subtitle & Narration Bar
    svg.append(f'<rect x="24" y="596" width="{WIDTH - 48}" height="104" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
    svg.append(f'<rect x="44" y="610" width="{WIDTH - 88}" height="6" rx="3" fill="#1e293b"/>')
    svg.append(f'<rect x="44" y="610" width="{(WIDTH - 88) * (progress_pct / 100.0)}" height="6" rx="3" fill="url(#indigoGrad)"/>')
    svg.append(f'<text x="640" y="648" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="17" font-weight="bold">"{sub_text}"</text>')
    svg.append(f'<text x="640" y="682" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">DATA STRUCTURES &amp; TYPES • WORKING EXPLANATION ANIMATION</text>')

    svg.append('</svg>')
    return '\n'.join(svg)


# ==========================================
# VIDEO 2: LINEAR AND NON-LINEAR DATA STRUCTURES
# ==========================================
def render_frame_v2(frame_idx, total_frames, duration):
    t = frame_idx / FPS
    progress_pct = (t / duration) * 100.0

    if t < 9.0:
        scene_name = "01 / 07: CHOOSING THE RIGHT STRUCTURE"
        sub_text = "Choosing the right data structure helps a program store, access, and process data more effectively."
        badge_text = "SELECTION STRATEGY"
        scene_num = 1
    elif t < 19.0:
        scene_name = "02 / 07: LINEAR: CONTIGUOUS ARRAYS"
        sub_text = "Arrays store elements in contiguous memory blocks, granting instant O(1) index access with expensive insertion."
        badge_text = "INDEX ACCESS VS SHIFTING"
        scene_num = 2
    elif t < 29.0:
        scene_name = "03 / 07: LINEAR: LINKED LISTS & POINTERS"
        sub_text = "Linked lists store elements in separate memory nodes linked by pointers, providing dynamic resizing and fast O(1) head insertion."
        badge_text = "POINTER REWIRING (NO SHIFTING)"
        scene_num = 3
    elif t < 39.0:
        scene_name = "04 / 07: LINEAR: STACKS (LIFO)"
        sub_text = "Stacks operate on Last-In, First-Out order: elements push and pop strictly from the top with instant O(1) time."
        badge_text = "LAST-IN, FIRST-OUT (LIFO)"
        scene_num = 4
    elif t < 49.0:
        scene_name = "05 / 07: LINEAR: QUEUES (FIFO)"
        sub_text = "Queues operate on First-In, First-Out order: items enter at the rear and exit from the front, ideal for process scheduling."
        badge_text = "FIRST-IN, FIRST-OUT (FIFO)"
        scene_num = 5
    elif t < 59.0:
        scene_name = "06 / 07: NON-LINEAR: TREES & BST (O(log N))"
        sub_text = "Trees organize data hierarchically into root, parent, and child nodes; Binary Search Trees allow blazing O(log N) search."
        badge_text = "BINARY SEARCH BISECTION"
        scene_num = 6
    else:
        scene_name = "07 / 07: GRAPHS & ARCHITECTURE DECISION MATRIX"
        sub_text = "Choose Arrays for fast indexed lookup, Linked Lists for flexible inserts, Stacks and Queues for sequential order, and Trees for hierarchy."
        badge_text = "NETWORKS & DECISION MATRIX"
        scene_num = 7

    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">',
        '<defs>',
        '  <linearGradient id="bgGrad2" x1="0" y1="0" x2="1" y2="1">',
        '    <stop offset="0%" stop-color="#080c18"/>',
        '    <stop offset="50%" stop-color="#0f172a"/>',
        '    <stop offset="100%" stop-color="#09101f"/>',
        '  </linearGradient>',
        '  <linearGradient id="cyanGrad2" x1="0" y1="0" x2="1" y2="0">',
        '    <stop offset="0%" stop-color="#0ea5e9"/>',
        '    <stop offset="100%" stop-color="#2563eb"/>',
        '  </linearGradient>',
        '</defs>',
        f'<rect width="{WIDTH}" height="{HEIGHT}" fill="url(#bgGrad2)"/>',
    ]

    for gx in range(0, WIDTH, 80):
        svg.append(f'<line x1="{gx}" y1="0" x2="{gx}" y2="{HEIGHT}" stroke="#1e293b" stroke-width="1" stroke-opacity="0.35"/>')
    for gy in range(0, HEIGHT, 80):
        svg.append(f'<line x1="0" y1="{gy}" x2="{WIDTH}" y2="{gy}" stroke="#1e293b" stroke-width="1" stroke-opacity="0.35"/>')

    svg.append(f'<rect x="24" y="20" width="{WIDTH - 48}" height="64" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
    svg.append(f'<rect x="36" y="32" width="10" height="40" rx="5" fill="url(#cyanGrad2)"/>')
    svg.append(f'<text x="58" y="52" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" letter-spacing="1">LESSON 02: LINEAR AND NON-LINEAR STRUCTURES</text>')
    svg.append(f'<text x="58" y="70" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="600">{scene_name}</text>')

    svg.append(f'<rect x="{WIDTH - 380}" y="34" width="230" height="36" rx="10" fill="#082f49" stroke="#0ea5e9" stroke-width="1.2"/>')
    svg.append(f'<text x="{WIDTH - 265}" y="57" text-anchor="middle" fill="#7dd3fc" font-family="monospace" font-size="12" font-weight="bold">{badge_text}</text>')
    svg.append(f'<rect x="{WIDTH - 135}" y="34" width="100" height="36" rx="10" fill="#090d16" stroke="#475569" stroke-width="1.2"/>')
    svg.append(f'<text x="{WIDTH - 85}" y="57" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">{format_time(t)} / {format_time(duration)}</text>')

    svg.append(f'<rect x="24" y="96" width="{WIDTH - 48}" height="490" rx="20" fill="#0a0f1d" stroke="#1e293b" stroke-width="1.5"/>')

    if scene_num == 1:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 1: The Core Distinction — Linear vs Non-Linear</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Linear structures organize data sequentially; Non-Linear structures branch into hierarchies and networks.</text>')

        svg.append(f'<rect x="120" y="205" width="480" height="320" rx="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<text x="360" y="245" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="20" font-weight="bold">LINEAR (Sequential / 1-to-1)</text>')
        svg.append(f'<text x="360" y="270" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Each element has an unambiguous predecessor and successor.</text>')

        lin_examples = [
            ("Arrays", "Contiguous index memory", "O(1) Access"),
            ("Linked Lists", "Chain of dynamic pointer nodes", "O(1) Insert"),
            ("Stacks", "Vertical LIFO container", "O(1) Push/Pop"),
            ("Queues", "Horizontal FIFO conveyor", "O(1) Enqueue"),
        ]
        for li, (name, dsc, comp) in enumerate(lin_examples):
            ly = 295 + li * 52
            svg.append(f'<rect x="145" y="{ly}" width="430" height="42" rx="8" fill="#1e293b"/>')
            svg.append(f'<text x="165" y="{ly + 26}" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">{name}</text>')
            svg.append(f'<text x="270" y="{ly + 26}" fill="#94a3b8" font-family="sans-serif" font-size="12">{dsc}</text>')
            svg.append(f'<text x="555" y="{ly + 26}" text-anchor="end" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">{comp}</text>')

        svg.append(f'<rect x="680" y="205" width="480" height="320" rx="18" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>')
        svg.append(f'<text x="920" y="245" text-anchor="middle" fill="#a855f7" font-family="sans-serif" font-size="20" font-weight="bold">NON-LINEAR (Branching / 1-to-Many)</text>')
        svg.append(f'<text x="920" y="270" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">Elements connect to multiple child nodes or arbitrary neighbors.</text>')

        nonlin_examples = [
            ("Binary Trees", "Hierarchical root / child split", "O(log N) Search"),
            ("BST Trees", "Left &lt; Parent &lt; Right sorted invariant", "Logarithmic"),
            ("Graphs", "Vertices + Weighted Edges", "Routing / Maps"),
            ("Hash Tables", "Key-to-Bucket hash functions", "O(1) Average"),
        ]
        for nli, (name, dsc, comp) in enumerate(nonlin_examples):
            nly = 295 + nli * 52
            svg.append(f'<rect x="705" y="{nly}" width="430" height="42" rx="8" fill="#1e293b"/>')
            svg.append(f'<text x="725" y="{nly + 26}" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">{name}</text>')
            svg.append(f'<text x="835" y="{nly + 26}" fill="#94a3b8" font-family="sans-serif" font-size="12">{dsc}</text>')
            svg.append(f'<text x="1115" y="{nly + 26}" text-anchor="end" fill="#c084fc" font-family="monospace" font-size="12" font-weight="bold">{comp}</text>')

    elif scene_num == 2:
        rel_t = t - 9.0
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 2: Array Mechanics — Fast O(1) Read vs Costly O(N) Shift</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Watch how inserting element 33 into index 1 forces all subsequent elements to shift right.</text>')

        shift_progress = ease(clamp((rel_t - 3.0) / 2.5, 0.0, 1.0))
        shift_px = shift_progress * 130.0

        svg.append(f'<text x="240" y="215" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">CONTIGUOUS RAM SLOTS:</text>')

        # Index 0: 15
        svg.append(f'<rect x="240" y="235" width="115" height="85" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<text x="297" y="280" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="24" font-weight="bold">15</text>')
        svg.append(f'<text x="297" y="340" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12">[0]</text>')

        drop_y = 120 + shift_progress * 115.0 if shift_progress > 0 else -100
        if shift_progress > 0.05:
            svg.append(f'<rect x="370" y="{drop_y}" width="115" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>')
            svg.append(f'<text x="427" y="{drop_y + 45}" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="24" font-weight="bold">33</text>')
            svg.append(f'<text x="427" y="{drop_y + 105}" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="12">NEW [1]</text>')

        x_42 = 370 + shift_px
        svg.append(f'<rect x="{x_42}" y="235" width="115" height="85" rx="12" fill="#0f172a" stroke="#f43f5e" stroke-width="{2.5 if shift_progress > 0 else 1.5}"/>')
        svg.append(f'<text x="{x_42 + 57}" y="280" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="24" font-weight="bold">42</text>')
        svg.append(f'<text x="{x_42 + 57}" y="340" text-anchor="middle" fill="#f43f5e" font-family="monospace" font-size="12">shifted</text>')

        x_89 = 500 + shift_px
        svg.append(f'<rect x="{x_89}" y="235" width="115" height="85" rx="12" fill="#0f172a" stroke="#f43f5e" stroke-width="{2.5 if shift_progress > 0 else 1.5}"/>')
        svg.append(f'<text x="{x_89 + 57}" y="280" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="24" font-weight="bold">89</text>')
        svg.append(f'<text x="{x_89 + 57}" y="340" text-anchor="middle" fill="#f43f5e" font-family="monospace" font-size="12">shifted</text>')

        x_99 = 630 + shift_px
        svg.append(f'<rect x="{x_99}" y="235" width="115" height="85" rx="12" fill="#0f172a" stroke="#f43f5e" stroke-width="{2.5 if shift_progress > 0 else 1.5}"/>')
        svg.append(f'<text x="{x_99 + 57}" y="280" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="24" font-weight="bold">99</text>')
        svg.append(f'<text x="{x_99 + 57}" y="340" text-anchor="middle" fill="#f43f5e" font-family="monospace" font-size="12">shifted</text>')

        svg.append(f'<rect x="220" y="380" width="840" height="170" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<text x="250" y="415" fill="#38bdf8" font-family="monospace" font-size="15" font-weight="bold">ADVANTAGE: INSTANT LOOKUP O(1)</text>')
        svg.append(f'<text x="250" y="440" fill="#cbd5e1" font-family="sans-serif" font-size="13">Direct Index Formula: arr[i] = Base + (i * 4). Accessing arr[2] takes 0.1ns without scanning.</text>')
        svg.append(f'<text x="250" y="485" fill="#f43f5e" font-family="monospace" font-size="15" font-weight="bold">DRAWBACK: EXPENSIVE INSERTION O(N)</text>')
        svg.append(f'<text x="250" y="510" fill="#cbd5e1" font-family="sans-serif" font-size="13">Inserting at index 1 required copying 42, 89, 99 one slot to the right (O(N) shift cost).</text>')

    elif scene_num == 3:
        rel_t = t - 19.0
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 3: Linked List Mechanics — Dynamic Pointer Rewiring</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Unlike arrays, inserting Node 18 requires ZERO element shifts — just rewire two pointer arrows!</text>')

        rewire_prog = ease(clamp((rel_t - 2.5) / 3.0, 0.0, 1.0))

        svg.append(f'<rect x="160" y="260" width="120" height="75" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<line x1="240" y1="260" x2="240" y2="335" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<text x="200" y="305" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">10</text>')
        svg.append(f'<circle cx="260" cy="297" r="6" fill="#38bdf8"/>')
        svg.append(f'<text x="220" y="360" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11">HEAD (0x10)</text>')

        new_y = 175 + rewire_prog * 85.0
        svg.append(f'<rect x="420" y="{new_y}" width="120" height="75" rx="12" fill="#1e1b4b" stroke="#a855f7" stroke-width="2.5"/>')
        svg.append(f'<line x1="500" y1="{new_y}" x2="500" y2="{new_y + 75}" stroke="#475569" stroke-width="1.5"/>')
        svg.append(f'<text x="460" y="{new_y + 45}" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">18</text>')
        svg.append(f'<circle cx="520" cy="{new_y + 37}" r="6" fill="#c084fc"/>')
        svg.append(f'<text x="480" y="{new_y - 12}" text-anchor="middle" fill="#c084fc" font-family="monospace" font-size="12" font-weight="bold">NEW NODE (0x48)</text>')

        svg.append(f'<rect x="680" y="260" width="120" height="75" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<line x1="760" y1="260" x2="760" y2="335" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<text x="720" y="305" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">25</text>')
        svg.append(f'<circle cx="780" cy="297" r="6" fill="#38bdf8"/>')
        svg.append(f'<text x="740" y="360" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11">(0x28)</text>')

        svg.append(f'<rect x="940" y="260" width="120" height="75" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>')
        svg.append(f'<line x1="1020" y1="260" x2="1020" y2="335" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<text x="980" y="305" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">40</text>')
        svg.append(f'<text x="1038" y="304" text-anchor="middle" fill="#f43f5e" font-family="monospace" font-size="11">null</text>')

        if rewire_prog < 0.5:
            svg.append(f'<line x1="280" y1="297" x2="670" y2="297" stroke="#38bdf8" stroke-width="3"/>')
            svg.append(f'<polygon points="670,292 680,297 670,302" fill="#38bdf8"/>')
        else:
            svg.append(f'<line x1="540" y1="{new_y + 37}" x2="670" y2="297" stroke="#10b981" stroke-width="3.5"/>')
            svg.append(f'<polygon points="665,292 678,297 667,304" fill="#10b981"/>')
            svg.append(f'<line x1="280" y1="297" x2="410" y2="{new_y + 37}" stroke="#10b981" stroke-width="3.5"/>')
            svg.append(f'<polygon points="405,{new_y+32} 418,{new_y+37} 407,{new_y+44}" fill="#10b981"/>')

        svg.append(f'<line x1="800" y1="297" x2="930" y2="297" stroke="#38bdf8" stroke-width="3"/>')
        svg.append(f'<polygon points="930,292 940,297 930,302" fill="#38bdf8"/>')

        svg.append(f'<rect x="220" y="420" width="840" height="130" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="1.8"/>')
        svg.append(f'<text x="640" y="455" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="16" font-weight="bold">POINTER REWIRING PROCEDURE COMPLETED (O(1) EFFICIENCY)</text>')
        svg.append(f'<text x="640" y="488" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14">1. NewNode-&gt;next = Node(25) | 2. Node(10)-&gt;next = NewNode</text>')
        svg.append(f'<text x="640" y="522" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="13">Zero memory copies. Node 40 remains untouched at its exact RAM address.</text>')

    elif scene_num == 4:
        rel_t = t - 29.0
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 4: Stack Mechanics — Last-In, First-Out (LIFO)</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Items can only be pushed and popped from the single TOP pointer in O(1) time.</text>')

        svg.append(f'<rect x="340" y="210" width="220" height="320" rx="12" fill="#020617" stroke="#6366f1" stroke-width="3"/>')
        svg.append(f'<line x1="330" y1="210" x2="570" y2="210" stroke="#020617" stroke-width="8"/>')

        svg.append(f'<rect x="360" y="450" width="180" height="60" rx="10" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>')
        svg.append(f'<text x="450" y="487" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="20" font-weight="bold">[10] (Base)</text>')

        svg.append(f'<rect x="360" y="375" width="180" height="60" rx="10" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>')
        svg.append(f'<text x="450" y="412" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="20" font-weight="bold">[20]</text>')

        pop_anim = math.sin(rel_t * 2.5) * 45.0
        svg.append(f'<rect x="360" y="{300 - pop_anim}" width="180" height="60" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>')
        svg.append(f'<text x="450" y="{337 - pop_anim}" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="20" font-weight="bold">[30] TOP</text>')

        svg.append(f'<line x1="620" y1="{330 - pop_anim}" x2="555" y2="{330 - pop_anim}" stroke="#10b981" stroke-width="3"/>')
        svg.append(f'<polygon points="555,{325 - pop_anim} 545,{330 - pop_anim} 555,{335 - pop_anim}" fill="#10b981"/>')
        svg.append(f'<text x="635" y="{335 - pop_anim}" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">TOP POINTER</text>')

        svg.append(f'<rect x="680" y="210" width="460" height="320" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<text x="910" y="245" text-anchor="middle" fill="#818cf8" font-family="sans-serif" font-size="16" font-weight="bold">CPU CALL STACK TRACE</text>')
        call_frames = [
            ("3. computeMetrics()", "Active Frame (Top of Stack)", "#10b981"),
            ("2. processData()", "Waiting for child return", "#94a3b8"),
            ("1. main()", "Entry Point Frame", "#64748b"),
        ]
        for cfi, (cf_name, cf_status, cf_col) in enumerate(call_frames):
            cfy = 270 + cfi * 75
            svg.append(f'<rect x="705" y="{cfy}" width="410" height="60" rx="10" fill="#1e293b" stroke="{cf_col}" stroke-width="1.5"/>')
            svg.append(f'<text x="725" y="{cfy + 28}" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">{cf_name}</text>')
            svg.append(f'<text x="725" y="{cfy + 48}" fill="{cf_col}" font-family="sans-serif" font-size="11">{cf_status}</text>')

    elif scene_num == 5:
        rel_t = t - 39.0
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 5: Queue Mechanics — First-In, First-Out (FIFO)</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Items enqueue strictly at the REAR and dequeue strictly from the FRONT.</text>')

        conveyor_offset = (rel_t * 60.0) % 180.0
        svg.append(f'<rect x="200" y="240" width="880" height="120" rx="14" fill="#020617" stroke="#0ea5e9" stroke-width="2.5"/>')
        svg.append(f'<text x="235" y="225" fill="#10b981" font-family="monospace" font-size="14" font-weight="bold">FRONT ➔ DEQUEUE (O(1))</text>')
        svg.append(f'<text x="1045" y="225" text-anchor="end" fill="#f59e0b" font-family="monospace" font-size="14" font-weight="bold">REAR ➔ ENQUEUE (O(1))</text>')

        q_items = [
            ("TASK A", "#10b981", 300),
            ("TASK B", "#38bdf8", 480),
            ("TASK C", "#a855f7", 660),
            ("TASK D", "#f59e0b", 840),
        ]
        for q_name, q_col, q_bx in q_items:
            q_x = q_bx - conveyor_offset * 0.4
            svg.append(f'<rect x="{q_x}" y="260" width="140" height="80" rx="12" fill="#0f172a" stroke="{q_col}" stroke-width="2"/>')
            svg.append(f'<text x="{q_x + 70}" y="307" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="18" font-weight="bold">{q_name}</text>')

        svg.append(f'<rect x="60" y="235" width="115" height="130" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="2"/>')
        svg.append(f'<text x="117" y="295" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">CPU</text>')
        svg.append(f'<text x="117" y="320" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">EXEC</text>')

        svg.append(f'<rect x="200" y="400" width="880" height="150" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<text x="230" y="435" fill="#38bdf8" font-family="sans-serif" font-size="16" font-weight="bold">REAL-WORLD APPLICATIONS OF QUEUES:</text>')
        svg.append(f'<text x="230" y="468" fill="#cbd5e1" font-family="sans-serif" font-size="13">• Operating System Task Scheduling (Round-Robin CPU process queues)</text>')
        svg.append(f'<text x="230" y="495" fill="#cbd5e1" font-family="sans-serif" font-size="13">• Network Packet Buffering (Router queues handling incoming network frames)</text>')
        svg.append(f'<text x="230" y="522" fill="#cbd5e1" font-family="sans-serif" font-size="13">• Printer Spoolers &amp; Web Server Request Pipelines</text>')

    elif scene_num == 6:
        rel_t = t - 49.0
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 6: Binary Search Tree (BST) — Blazing O(log N) Search</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Invariant: Left &lt; Root &lt; Right. Searching for key 40 prunes 50% of the entire dataset per comparison!</text>')

        svg.append(f'<rect x="120" y="200" width="220" height="55" rx="12" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5"/>')
        svg.append(f'<text x="230" y="235" text-anchor="middle" fill="#c7d2fe" font-family="monospace" font-size="16" font-weight="bold">SEARCH TARGET: [40]</text>')

        svg.append(f'<line x1="640" y1="240" x2="820" y2="340" stroke="#334155" stroke-width="2" stroke-dasharray="4"/>')
        svg.append(f'<line x1="820" y1="340" x2="740" y2="440" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4"/>')
        svg.append(f'<line x1="820" y1="340" x2="900" y2="440" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4"/>')

        svg.append(f'<line x1="640" y1="240" x2="460" y2="340" stroke="#10b981" stroke-width="3.5"/>')
        svg.append(f'<line x1="460" y1="340" x2="380" y2="440" stroke="#334155" stroke-width="1.5" stroke-dasharray="4"/>')
        svg.append(f'<line x1="460" y1="340" x2="540" y2="440" stroke="#10b981" stroke-width="3.5"/>')

        tree_nodes = [
            (640, 240, "50", "#38bdf8", True),
            (460, 340, "30", "#38bdf8", True),
            (820, 340, "70", "#475569", False),
            (380, 440, "20", "#475569", False),
            (540, 440, "40", "#10b981", True),
            (740, 440, "60", "#334155", False),
            (900, 440, "80", "#334155", False),
        ]

        for nx, ny, val, col, is_active in tree_nodes:
            r = 30
            svg.append(f'<circle cx="{nx}" cy="{ny}" r="{r}" fill="#0f172a" stroke="{col}" stroke-width="{3 if is_active else 1}"/>')
            svg.append(f'<text x="{nx}" y="{ny + 7}" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="18" font-weight="bold">{val}</text>')

        svg.append(f'<rect x="120" y="505" width="1040" height="60" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="1.8"/>')
        svg.append(f'<text x="640" y="542" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="16" font-weight="bold">TARGET 40 FOUND IN JUST 3 COMPARISONS! O(log₂ 1,000,000) = Only ~20 steps!</text>')

    else:
        svg.append(f'<text x="640" y="140" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="24" font-weight="bold">Step 7: Master Architecture Decision Matrix</text>')
        svg.append(f'<text x="640" y="165" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">Choose the exact data structure matched to your algorithm\'s access patterns.</text>')

        rows = [
            ("Array", "Contiguous RAM", "O(1) Instant", "O(N) Shift", "Fast random lookup, fixed buffers"),
            ("Linked List", "Pointer nodes", "O(N) Traversal", "O(1) Head Insert", "Dynamic size, frequent insertions"),
            ("Stack", "LIFO container", "O(1) Top", "O(1) Push/Pop", "Undo engines, recursion, call stacks"),
            ("Queue", "FIFO conveyor", "O(1) Front", "O(1) Enqueue", "Job scheduling, message streaming"),
            ("BST Tree", "Hierarchical", "O(log N) Bisect", "O(log N)", "Sorted databases, file systems"),
        ]

        svg.append(f'<rect x="100" y="195" width="1080" height="280" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
        svg.append(f'<rect x="100" y="195" width="1080" height="45" rx="16" fill="#1e293b"/>')
        headers = [("STRUCTURE", 130), ("MEMORY", 300), ("LOOKUP", 480), ("INSERTION", 640), ("OPTIMAL USE CASE", 800)]
        for htitle, hx in headers:
            svg.append(f'<text x="{hx}" y="224" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">{htitle}</text>')

        for ri, (st, mem, lk, ins, uc) in enumerate(rows):
            ry = 248 + ri * 44
            svg.append(f'<line x1="100" y1="{ry - 8}" x2="1180" y2="{ry - 8}" stroke="#1e293b" stroke-width="1"/>')
            svg.append(f'<text x="130" y="{ry + 18}" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">{st}</text>')
            svg.append(f'<text x="300" y="{ry + 18}" fill="#94a3b8" font-family="sans-serif" font-size="12">{mem}</text>')
            svg.append(f'<text x="480" y="{ry + 18}" fill="#10b981" font-family="monospace" font-size="13" font-weight="bold">{lk}</text>')
            svg.append(f'<text x="640" y="{ry + 18}" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">{ins}</text>')
            svg.append(f'<text x="800" y="{ry + 18}" fill="#cbd5e1" font-family="sans-serif" font-size="12">{uc}</text>')

        svg.append(f'<rect x="340" y="495" width="600" height="50" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="1.8"/>')
        svg.append(f'<text x="640" y="527" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="16" font-weight="bold">Lesson 02 Completed: Earned +25 Visualization Points!</text>')

    svg.append(f'<rect x="24" y="596" width="{WIDTH - 48}" height="104" rx="16" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>')
    svg.append(f'<rect x="44" y="610" width="{WIDTH - 88}" height="6" rx="3" fill="#1e293b"/>')
    svg.append(f'<rect x="44" y="610" width="{(WIDTH - 88) * (progress_pct / 100.0)}" height="6" rx="3" fill="url(#cyanGrad2)"/>')
    svg.append(f'<text x="640" y="648" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="17" font-weight="bold">"{sub_text}"</text>')
    svg.append(f'<text x="640" y="682" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">LINEAR &amp; NON-LINEAR DATA STRUCTURES • WORKING EXPLANATION ANIMATION</text>')

    svg.append('</svg>')
    return '\n'.join(svg)


def generate_video(render_fn, duration, audio_path, output_mp4, temp_dir):
    total_frames = int(duration * FPS)
    print(f"Generating SVG frames in {temp_dir} ({total_frames} frames)...")
    os.makedirs(temp_dir, exist_ok=True)

    start = time.time()
    for i in range(total_frames):
        svg_content = render_fn(i, total_frames, duration)
        with open(f"{temp_dir}/frame_{i:05d}.svg", "w") as f:
            f.write(svg_content)
    print(f"Wrote {total_frames} SVG frames in {time.time() - start:.2f}s")

    print(f"Encoding MP4: {output_mp4} with audio: {audio_path}...")
    enc_start = time.time()
    cmd = [
        'ffmpeg', '-y',
        '-framerate', str(FPS),
        '-i', f'{temp_dir}/frame_%05d.svg',
        '-i', audio_path,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-shortest',
        output_mp4
    ]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        print("FFmpeg error:", res.stderr.decode()[-800:])
        raise RuntimeError(f"FFmpeg failed for {output_mp4}")
    print(f"Finished {output_mp4} in {time.time() - enc_start:.2f}s")

    # Cleanup temp frames
    shutil.rmtree(temp_dir)


def main():
    os.makedirs('/tmp/out', exist_ok=True)

    # 1. Video 1: Data Structures and Types
    v1_out = '/tmp/out/Data Structures and Types.mp4'
    generate_video(render_frame_v1, 68.52, '/tmp/audio/video1_audio.aac', v1_out, '/tmp/v1_frames')

    # 2. Video 2: Linear and Non-Linear Data Structures
    v2_out = '/tmp/out/Linear and Non-Linear Data Structures.mp4'
    generate_video(render_frame_v2, 60.05, '/tmp/audio/video2_audio.aac', v2_out, '/tmp/v2_frames')

    # Deploy to both public/Videos and src/Videos
    for fn in ['Data Structures and Types.mp4', 'Linear and Non-Linear Data Structures.mp4']:
        src = f'/tmp/out/{fn}'
        dst_public = f'public/Videos/{fn}'
        dst_src = f'src/Videos/{fn}'
        shutil.copy2(src, dst_public)
        shutil.copy2(src, dst_src)
        print(f"SUCCESS: Deployed {fn} to {dst_public} and {dst_src}")


if __name__ == '__main__':
    main()
