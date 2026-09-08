import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Topic 1: What are Data Structures?
  {
    id: 1,
    type: 'multiple-choice',
    question: 'Which of the following best defines a Data Structure in computer science?',
    options: [
      'A hardware circuit board inside the CPU',
      'A specialized mathematical and logical format for organizing, storing, and manipulating data efficiently in memory',
      'A proprietary file format for compressing images',
      'A compiler syntax error indicating missing semicolons',
    ],
    correctAnswer: 'A specialized mathematical and logical format for organizing, storing, and manipulating data efficiently in memory',
    explanation: 'A data structure is an organized layout in memory with specific governing rules and operations designed to achieve algorithmic time and space efficiency.',
    hints: [
      'Think about how data is structured in RAM.',
      'It combines memory organization with algorithms for operations like search and insertion.',
      'It is not a physical hardware part.',
    ],
  },
  // Topic 2: Classification
  {
    id: 2,
    type: 'true-false',
    question: 'True or False: In a Linear data structure, elements are organized sequentially such that each element has at most one direct predecessor and one direct successor.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'True! Linear structures (Arrays, Linked Lists, Stacks, Queues) enforce a 1-to-1 sequential arrangement, unlike Non-Linear structures (Trees, Graphs) which support multi-branching or network connections.',
    hints: [
      'Think about the word "Linear" meaning a single line.',
      'In an array or linked list, elements follow one another sequentially.',
      'Trees branch into multiple children, which makes them non-linear.',
    ],
  },
  // Topic 3: Primitive Data Structures
  {
    id: 3,
    type: 'multiple-choice',
    question: 'What is stored inside a Pointer / Reference primitive variable on a 64-bit operating system?',
    options: [
      'A 64-bit raw memory address pointing to where another variable resides in RAM',
      'The entire copy of the operating system kernel',
      'A floating point number representing CPU temperature',
      'An encrypted password string',
    ],
    correctAnswer: 'A 64-bit raw memory address pointing to where another variable resides in RAM',
    explanation: 'A pointer variable holds the memory address (virtual RAM address) of another data element, enabling dynamic structures like Linked Lists and Trees.',
    hints: [
      'Pointers "point" to locations in computer memory.',
      'On a 64-bit architecture, memory addresses are 8 bytes (64 bits) wide.',
      'The pointer value is typically displayed in hexadecimal format (e.g., 0x7FFE4A90).',
    ],
  },
  // Topic 4: Non-Primitive Data Structures
  {
    id: 4,
    type: 'scenario',
    question: 'Why does a standard Homogeneous Array provide instant O(1) random access by index A[i], whereas a Linked List requires O(N) traversal?',
    options: [
      'Arrays use hardware lasers to read data',
      'Arrays have contiguous memory with uniform element sizes, allowing the CPU to calculate Address = Base + (i * Size) with a single arithmetic step',
      'Linked Lists cannot be stored in RAM',
      'Arrays are limited to only 10 elements',
    ],
    correctAnswer: 'Arrays have contiguous memory with uniform element sizes, allowing the CPU to calculate Address = Base + (i * Size) with a single arithmetic step',
    explanation: 'Contiguous memory and uniform byte size per item allow direct mathematical offset calculation in a single CPU instruction, achieving O(1) random access.',
    hints: [
      'Think about how uniform slots in contiguous memory can be calculated by multiplication.',
      'Address(A[i]) = Base_Address + (i * sizeof(element)).',
      'Linked lists scatter nodes in heap memory and must traverse pointer by pointer.',
    ],
  },
  // Topic 5: Linear Data Structures
  {
    id: 5,
    type: 'multiple-choice',
    question: 'Which access discipline governs Stacks and Queues respectively?',
    options: [
      'Stack: LIFO (Last-In, First-Out) | Queue: FIFO (First-In, First-Out)',
      'Stack: FIFO (First-In, First-Out) | Queue: LIFO (Last-In, First-Out)',
      'Stack: Random Access | Queue: Hierarchical Branching',
      'Both use LILO (Last-In, Last-Out) exclusively',
    ],
    correctAnswer: 'Stack: LIFO (Last-In, First-Out) | Queue: FIFO (First-In, First-Out)',
    explanation: 'A Stack strictly enforces LIFO (newest element added is popped first). A Queue enforces FIFO (earliest element inserted is dequeued first).',
    hints: [
      'Think of a stack of plates (take top first = LIFO).',
      'Think of a line at a ticket counter (first person served first = FIFO).',
      'Stack uses LIFO, whereas Queue strictly uses FIFO.',
    ],
  },
  // Topic 6: Non-Linear Data Structures
  {
    id: 6,
    type: 'predict-output',
    question: 'In a Binary Search Tree (BST), what is the resulting traversal order if you perform an INORDER traversal (Left -> Root -> Right) on a valid BST containing nodes [50, 30, 70, 20, 40, 60, 80]?',
    options: [
      '20, 30, 40, 50, 60, 70, 80 (Ascending sorted order)',
      '80, 70, 60, 50, 40, 30, 20 (Descending sorted order)',
      '50, 30, 20, 40, 70, 60, 80 (Preorder)',
      '20, 40, 30, 60, 80, 70, 50 (Postorder)',
    ],
    correctAnswer: '20, 30, 40, 50, 60, 70, 80 (Ascending sorted order)',
    explanation: 'Inorder traversal of any valid Binary Search Tree visits Left Subtree (< Root), then Root, then Right Subtree (> Root), producing elements in strictly ascending sorted order.',
    hints: [
      'Remember: Left < Root < Right.',
      'Visiting Left -> Root -> Right naturally visits the smallest numbers first, then middle, then largest.',
      'Inorder traversal on a BST always produces sorted output.',
    ],
  },
  // Topic 7: Operations
  {
    id: 7,
    type: 'scenario',
    question: 'You have a sorted array of 1,048,576 elements. How many comparisons will Binary Search take in the absolute worst case to locate any element?',
    options: ['20 comparisons', '524,288 comparisons', '1,048,576 comparisons', '1 comparison'],
    correctAnswer: '20 comparisons',
    explanation: 'Binary Search runs in O(log2 N) time. Since log2(1,048,576) = 20, binary search guarantees finding the target (or proving absence) in at most 20 comparisons!',
    hints: [
      'Binary Search cuts the remaining search space in half at every comparison.',
      'Calculate log2(1,048,576) or 2^20 = 1,048,576.',
      'It is logarithmic: 20 steps.',
    ],
  },
  // Topic 8: Why Need Different Types
  {
    id: 8,
    type: 'scenario',
    question: 'A software engineer needs to implement the browser Back & Forward button navigation history. Which data structure is the optimal choice and why?',
    options: [
      'Two Stacks: Back Stack & Forward Stack (LIFO temporal recovery in O(1) time)',
      'A Hash Table with 1,000,000 buckets',
      'A Min-Heap Priority Queue',
      'A Circular Singly Linked List without tail pointer',
    ],
    correctAnswer: 'Two Stacks: Back Stack & Forward Stack (LIFO temporal recovery in O(1) time)',
    explanation: 'Browser navigation requires Last-In, First-Out recovery of recently visited pages. Using two stacks allows instant O(1) push and pop between back and forward histories.',
    hints: [
      'When you click Back, you expect the most recently visited page to appear first.',
      'Last visited = First recovered (LIFO principle).',
      'Two stacks handle Back and Forward seamlessly.',
    ],
  },
  // Topic 2 & 4: Taxonomy Drag-Order
  {
    id: 9,
    type: 'drag-order',
    question: 'Arrange the following data representations in hierarchical order from lowest level (hardware) to highest level (abstract structures):',
    options: [
      '1. Raw Transistor Bits & Machine Bytes (0 & 1)',
      '2. Primitive Types (int, float, char, bool)',
      '3. Linear Composite Structures (Arrays, Linked Lists, Stacks)',
      '4. Non-Linear Advanced Structures (BST, Graphs, B+ Trees)',
    ],
    correctAnswer: [
      '1. Raw Transistor Bits & Machine Bytes (0 & 1)',
      '2. Primitive Types (int, float, char, bool)',
      '3. Linear Composite Structures (Arrays, Linked Lists, Stacks)',
      '4. Non-Linear Advanced Structures (BST, Graphs, B+ Trees)',
    ],
    explanation: 'Computation builds hierarchically: Raw hardware bits form primitive types, which aggregate into linear structures, which extend into complex non-linear networks.',
    hints: [
      'Start with raw hardware bits at the bottom and primitives right above.',
      'Linear arrays and lists build on top of primitive data types.',
      'Non-linear trees and graphs represent the highest structural abstraction.',
    ],
  },
  // Topic 8: Database indexing trade-off
  {
    id: 10,
    type: 'multiple-choice',
    question: 'Why do relational database engines (like PostgreSQL and MySQL) use B+ Trees instead of Hash Tables for indexing table columns?',
    options: [
      'B+ Trees support fast sorted range queries (e.g., WHERE age BETWEEN 20 AND 30) and disk block prefetching, whereas Hash Tables cannot perform range scans without full table scans',
      'Hash Tables cannot store numbers',
      'B+ Trees use less than 1 byte of memory',
      'Hash Tables are illegal under database SQL standards',
    ],
    correctAnswer: 'B+ Trees support fast sorted range queries (e.g., WHERE age BETWEEN 20 AND 30) and disk block prefetching, whereas Hash Tables cannot perform range scans without full table scans',
    explanation: 'Hash tables offer O(1) single-key lookups but destroy ordering, making range queries (BETWEEN, >, <) impossible without scanning every item. B+ Trees maintain sorted leaf chains for fast range scanning and high disk fanout.',
    hints: [
      'Consider SQL queries like "WHERE salary BETWEEN 50000 AND 80000".',
      'Hash tables scatter keys randomly across hash buckets.',
      'B+ Trees keep leaves in sorted linked order for sequential range retrieval.',
    ],
  },
];
