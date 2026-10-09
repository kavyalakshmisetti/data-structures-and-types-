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
  duration: number; // in seconds
  scenes: EducationalScene[];
}

export const LESSONS_DATA: LessonData[] = [
  {
    id: 1,
    lessonNumber: 'LESSON 01',
    title: 'DATA STRUCTURES AND TYPES',
    description: 'Explore what data is, why organized data enables high performance, and how data structures are categorized into Primitive (Integer, Float, Char, Bool) and Non-Primitive types.',
    chips: ['What is Data', 'Organized Data', 'Primitive Types', 'Non-Primitive Structures'],
    filename: 'Data Structures and Types.mp4',
    videoSrc: VIDEO_1_SRC,
    duration: 57,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 10,
        title: 'What is Data?',
        badge: 'RAW FACTS & INFO',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Data means raw facts and information, such as numbers, characters, words, or symbols.',
        keyConcept: 'Raw data elements (e.g. 42, 3.14, "DSA", True) serve as the fundamental unorganized building blocks of all computational logic.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 10,
        timeEnd: 20,
        title: 'Why Organize Data?',
        badge: 'ORGANIZATION & ACCESS',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration: 'When data is organized properly, it becomes easier to access, manage, search, and process.',
        keyConcept: 'Organized structures provide O(1) instant lookup, optimal L1/L2 CPU cache locality, and rapid algorithmic execution.',
        type: 'concept',
      },
      {
        id: 3,
        timeStart: 20,
        timeEnd: 29,
        title: 'Definition of a Data Structure',
        badge: 'FORMULA & ARCHITECTURE',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration: 'Data structures are ways of organizing and storing data, so that we can use it efficiently.',
        keyConcept: 'Data Structure = Data Organization (Memory + Pointers) + Permitted Algorithmic Operations (Access, Insert, Delete, Search).',
        type: 'concept',
      },
      {
        id: 4,
        timeStart: 29,
        timeEnd: 37,
        title: 'Classification of Data Structures',
        badge: 'TAXONOMY HIERARCHY',
        badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-600/70',
        narration: 'Data structures can be broadly classified into Primitive and Non-Primitive data structures.',
        keyConcept: 'Master taxonomy: Primitive types (hardware-native stack values) vs Non-Primitive composite types (heap-allocated reference structures).',
        type: 'concept',
      },
      {
        id: 5,
        timeStart: 37,
        timeEnd: 47,
        title: 'Primitive Data Types',
        badge: 'STACK-ALLOCATED PRIMITIVES',
        badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-600/70',
        narration: 'Primitive data structures are basic data types that directly store simple values: Integer, Float, Character, and Boolean.',
        keyConcept: 'Hardware registers: Integer (32-bit two\'s complement), Float (32-bit IEEE 754), Char (8-bit ASCII), Boolean (1-bit flag).',
        type: 'concept',
      },
      {
        id: 6,
        timeStart: 47,
        timeEnd: 57,
        title: 'Non-Primitive Data Structures',
        badge: 'HEAP REFERENCE STORAGE',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration: 'Non-primitive data structures are created using primitive types to store multiple or complex values: Arrays, Lists, and Files.',
        keyConcept: 'Heap-allocated composite collections managed via memory pointers: Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.',
        type: 'array',
      },
    ],
  },
  {
    id: 2,
    lessonNumber: 'LESSON 02',
    title: 'LINEAR AND NON-LINEAR DATA STRUCTURES',
    description: 'Learn how to choose the right data structure for your program, and master the core differences between sequential linear order and branching non-linear hierarchies.',
    chips: ['Choosing Structures', 'Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Graphs'],
    filename: 'Linear and Non-Linear Data Structures.mp4',
    videoSrc: VIDEO_2_SRC,
    duration: 49,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 9,
        title: 'Choosing the Right Data Structure',
        badge: 'SELECTION STRATEGY',
        badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-600/70',
        narration: 'Choosing the right data structure helps a program store, access, and process data more effectively.',
        keyConcept: 'Selection radar: Match access patterns (Sequential, Hierarchical, Network, or Tabular) to the optimal algorithmic invariant.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 9,
        timeEnd: 17,
        title: 'Linear Structures: Arrays',
        badge: 'CONTIGUOUS RAM CELLS',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration: 'Arrays store elements in contiguous memory blocks, granting instant O(1) index access with expensive insertion.',
        keyConcept: 'Direct index arithmetic: arr[i] = Base + (i * 4) yields instant O(1) random lookup, with O(N) shift penalty for middle inserts.',
        type: 'array',
      },
      {
        id: 3,
        timeStart: 17,
        timeEnd: 25,
        title: 'Linear Structures: Linked Lists',
        badge: 'DYNAMIC NODE POINTERS',
        badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-600/70',
        narration: 'Linked lists store elements in separate memory nodes linked by pointers, providing dynamic resizing and fast O(1) head insertion.',
        keyConcept: 'Pointer chains: Node [Data | Next*] enables instant O(1) head prepending and dynamic growth without memory reallocations.',
        type: 'linkedlist',
      },
      {
        id: 4,
        timeStart: 25,
        timeEnd: 33,
        title: 'Linear Structures: Stacks (LIFO)',
        badge: 'LAST-IN, FIRST-OUT (LIFO)',
        badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-600/70',
        narration: 'Stacks operate on Last-In, First-Out order: elements push and pop strictly from the top with instant O(1) time.',
        keyConcept: 'Single access point (TOP pointer); Push and Pop in O(1); powers function call stacks, recursion, and undo history.',
        type: 'stack-lifo',
      },
      {
        id: 5,
        timeStart: 33,
        timeEnd: 41,
        title: 'Linear Structures: Queues (FIFO)',
        badge: 'FIRST-IN, FIRST-OUT (FIFO)',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration: 'Queues operate on First-In, First-Out order: items enter at the rear and exit from the front, ideal for process scheduling.',
        keyConcept: 'Two access points (FRONT and REAR); Enqueue and Dequeue in O(1); powers OS CPU task scheduling and printer spoolers.',
        type: 'stack-queue',
      },
      {
        id: 6,
        timeStart: 41,
        timeEnd: 49,
        title: 'Non-Linear Structures: Trees & Graphs',
        badge: 'HIERARCHIES & NETWORKS',
        badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-600/70',
        narration: 'Trees organize data hierarchically with roots and children, while Graphs model complex network connections.',
        keyConcept: 'Trees provide O(log N) hierarchical traversal; Graphs connect multi-node relationship networks for routing and dependencies.',
        type: 'tree-bst',
      },
    ],
  },
];
