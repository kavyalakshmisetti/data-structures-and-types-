import dataStructuresAndTypesVideo from '../Videos/Data Structures and Types.mp4';
import linearAndNonLinearVideo from '../Videos/Linear and Non-Linear Data Structures.mp4';

const VIDEO_1_SRC = dataStructuresAndTypesVideo || '/Videos/Data%20Structures%20and%20Types.mp4';
const VIDEO_2_SRC = linearAndNonLinearVideo || '/Videos/Linear%20and%20Non-Linear%20Data%20Structures.mp4';

export interface EducationalScene {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  badge: string;
  badgeColor: string;
  narration: string;
  keyConcept: string;
  type: 'concept' | 'array' | 'linkedlist' | 'stack-lifo' | 'stack-queue' | 'tree-bst' | 'graph' | 'complexity';
}

export interface LessonData {
  id: number;
  lessonNumber: string;
  title: string;
  description: string;
  chips: string[];
  filename: string;
  videoSrc?: string;
  audioSrc?: string;
  duration: number; // in seconds
  scenes: EducationalScene[];
}

export const LESSONS_DATA: LessonData[] = [
  {
    id: 1,
    lessonNumber: 'LESSON 01',
    title: 'DATA STRUCTURES AND TYPES',
    description: 'Explore what data is, why organized data enables high performance, and how data structures are categorized into Primitive (Integer, Float, Char, Bool) and Non-Primitive types.',
    chips: ['What is Data', 'Organized Data', 'Primitive Types', 'Non-Primitive Structures', 'Trade-offs'],
    filename: 'Data Structures and Types.mp4',
    videoSrc: VIDEO_1_SRC,
    audioSrc: '/Videos/lesson1-audio.mp3',
    duration: 57,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 9.2,
        title: 'Step 1: What is Data?',
        badge: 'RAW FACTS & INFO',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Data means raw facts and information, such as numbers, characters, words, or boolean symbols stored in physical memory cells.',
        keyConcept: 'Raw data elements (e.g. 42, 3.14, "DSA", True) serve as the fundamental unorganized building blocks of all computational logic.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 9.2,
        timeEnd: 18.3,
        title: 'Step 2: Why Organize Data?',
        badge: 'ORGANIZATION & ACCESS',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration: 'When data is organized properly into structured formats, accessing, searching, and processing changes from slow linear scanning to instant constant time.',
        keyConcept: 'Organized structures provide O(1) instant lookup, optimal L1/L2 CPU cache locality, and rapid algorithmic execution.',
        type: 'concept',
      },
      {
        id: 3,
        timeStart: 18.3,
        timeEnd: 27.6,
        title: 'Step 3: Definition of a Data Structure',
        badge: 'FORMULA & ARCHITECTURE',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration: 'A data structure is defined as the combination of physical memory layout and permitted algorithmic operations like insertion, deletion, and lookup.',
        keyConcept: 'Data Structure = Data Organization (Memory + Pointers) + Permitted Algorithmic Operations (Access, Insert, Delete, Search).',
        type: 'concept',
      },
      {
        id: 4,
        timeStart: 27.6,
        timeEnd: 34.6,
        title: 'Step 4: Classification of Data Structures',
        badge: 'TAXONOMY HIERARCHY',
        badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-600/70',
        narration: 'Data structures are classified into two main branches: Primitive data types stored directly on the stack, and Non-Primitive reference types.',
        keyConcept: 'Master taxonomy: Primitive types (hardware-native stack values) vs Non-Primitive composite types (heap-allocated reference structures).',
        type: 'concept',
      },
      {
        id: 5,
        timeStart: 34.6,
        timeEnd: 43.3,
        title: 'Step 5: Primitive Data Types',
        badge: 'STACK-ALLOCATED PRIMITIVES',
        badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-600/70',
        narration: 'Primitive data structures directly store simple values manipulated by CPU registers: 32-bit Integer, Float, Character, and 1-bit Boolean.',
        keyConcept: 'Hardware registers: Integer (32-bit two\'s complement), Float (32-bit IEEE 754), Char (8-bit ASCII), Boolean (1-bit flag).',
        type: 'concept',
      },
      {
        id: 6,
        timeStart: 43.3,
        timeEnd: 53.2,
        title: 'Step 6: Non-Primitive Data Structures',
        badge: 'HEAP REFERENCE STORAGE',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Non-primitive data structures are composite collections stored in dynamic heap memory and referenced by pointers, including Arrays, Linked Lists, Stacks, and Trees.',
        keyConcept: 'Heap-allocated composite collections managed via memory pointers: Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.',
        type: 'array',
      },
      {
        id: 7,
        timeStart: 53.2,
        timeEnd: 57,
        title: 'Final Result: Summary & Trade-Offs',
        badge: 'CONCLUSION & MASTERY',
        badgeColor: 'text-teal-400 bg-teal-950/80 border-teal-600/70',
        narration: 'In conclusion, selecting the optimal data structure eliminates CPU bottlenecks and balances time complexity with memory layout.',
        keyConcept: 'Architectural Principle: Every data structure represents a deliberate trade-off between lookup speed, insertion overhead, and memory efficiency.',
        type: 'complexity',
      },
    ],
  },
  {
    id: 2,
    lessonNumber: 'LESSON 02',
    title: 'LINEAR AND NON-LINEAR DATA STRUCTURES',
    description: 'Learn how to choose the right data structure for your program, and master the core differences between sequential linear order and branching non-linear hierarchies.',
    chips: ['Choosing Structures', 'Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Decision Matrix'],
    filename: 'Linear and Non-Linear Data Structures.mp4',
    videoSrc: VIDEO_2_SRC,
    audioSrc: '/Videos/lesson2-audio.mp3',
    duration: 49,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 7.5,
        title: 'Step 1: Choosing the Right Data Structure',
        badge: 'SELECTION STRATEGY',
        badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-600/70',
        narration: 'Choosing the right data structure helps a program store, access, and process data effectively based on the required access patterns.',
        keyConcept: 'Selection radar: Match access patterns (Sequential, Hierarchical, Network, or Tabular) to the optimal algorithmic invariant.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 7.5,
        timeEnd: 15.6,
        title: 'Step 2: Linear Structures: Arrays',
        badge: 'CONTIGUOUS RAM CELLS',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration: 'Arrays store elements sequentially in contiguous memory blocks, granting instant O of 1 index access using direct address arithmetic.',
        keyConcept: 'Direct index arithmetic: arr[i] = Base + (i * 4) yields instant O(1) random lookup, with O(N) shift penalty for middle inserts.',
        type: 'array',
      },
      {
        id: 3,
        timeStart: 15.6,
        timeEnd: 23.1,
        title: 'Step 3: Linear Structures: Linked Lists',
        badge: 'DYNAMIC NODE POINTERS',
        badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-600/70',
        narration: 'Linked lists store elements in separate memory nodes connected by pointers, providing dynamic resizing and fast O of 1 head insertion.',
        keyConcept: 'Pointer chains: Node [Data | Next*] enables instant O(1) head prepending and dynamic growth without memory reallocations.',
        type: 'linkedlist',
      },
      {
        id: 4,
        timeStart: 23.1,
        timeEnd: 30.1,
        title: 'Step 4: Linear Structures: Stacks (LIFO)',
        badge: 'LAST-IN, FIRST-OUT (LIFO)',
        badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-600/70',
        narration: 'Stacks operate strictly on Last-In, First-Out order. All push and pop operations occur at the top in constant O of 1 time.',
        keyConcept: 'Single access point (TOP pointer); Push and Pop in O(1); powers function call stacks, recursion, and undo history.',
        type: 'stack-lifo',
      },
      {
        id: 5,
        timeStart: 30.1,
        timeEnd: 37.0,
        title: 'Step 5: Linear Structures: Queues (FIFO)',
        badge: 'FIRST-IN, FIRST-OUT (FIFO)',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration: 'Queues operate on First-In, First-Out order. Items enqueue at the rear and dequeue from the front, ideal for process scheduling.',
        keyConcept: 'Two access points (FRONT and REAR); Enqueue and Dequeue in O(1); powers OS CPU task scheduling and printer spoolers.',
        type: 'stack-queue',
      },
      {
        id: 6,
        timeStart: 37.0,
        timeEnd: 45.4,
        title: 'Step 6: Non-Linear Structures: Trees & Graphs',
        badge: 'HIERARCHIES & NETWORKS',
        badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-600/70',
        narration: 'Non-linear structures organize data hierarchically. Binary search trees achieve O of log N lookup, while Graphs model complex networks.',
        keyConcept: 'Trees provide O(log N) hierarchical traversal; Graphs connect multi-node relationship networks for routing and dependencies.',
        type: 'tree-bst',
      },
      {
        id: 7,
        timeStart: 45.4,
        timeEnd: 49,
        title: 'Final Result: Decision Matrix & Synthesis',
        badge: 'DECISION MATRIX',
        badgeColor: 'text-teal-400 bg-teal-950/80 border-teal-600/70',
        narration: 'To summarize, choose linear structures for sequential data sequences, and non-linear trees or graphs for hierarchical branching and network relationships.',
        keyConcept: 'Decision Rule: Pick linear for sequential streaming; pick non-linear trees or graphs for hierarchical branching or graph routing.',
        type: 'complexity',
      },
    ],
  },
];
