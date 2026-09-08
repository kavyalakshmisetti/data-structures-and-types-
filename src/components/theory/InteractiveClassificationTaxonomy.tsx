import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Network,
  Cpu,
  Boxes,
  Database,
  Info,
  CheckCircle2,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

type CategoryFilter = 'all' | 'primitive' | 'non-primitive' | 'linear' | 'non-linear' | 'static' | 'dynamic';

export const InteractiveClassificationTaxonomy: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedNode, setSelectedNode] = useState<string>('all');

  const nodes = [
    {
      id: 'primitive',
      label: 'Primitive Data Structures',
      type: 'primitive',
      classification: ['primitive', 'static'],
      items: ['int (Integer)', 'float / double (Real Numbers)', 'char (Characters)', 'bool (Booleans)', 'pointers / references'],
      memory: 'Fixed size (1, 2, 4, 8 bytes). Directly handled by CPU ALU.',
      speed: 'Instant O(1) CPU machine instructions',
      color: 'border-blue-500 bg-blue-50/70 dark:bg-slate-950 text-blue-900 dark:text-white',
    },
    {
      id: 'linear-static',
      label: 'Linear: Static (Arrays)',
      type: 'linear',
      classification: ['non-primitive', 'linear', 'static'],
      items: ['1D Arrays', '2D Multi-dimensional Arrays', 'Static Strings'],
      memory: 'Contiguous memory block. Fixed size at compile/allocation time.',
      speed: 'O(1) random index access, O(N) insertion/deletion due to shifting',
      color: 'border-indigo-500 bg-indigo-50/70 dark:bg-slate-950 text-indigo-900 dark:text-white',
    },
    {
      id: 'linear-dynamic',
      label: 'Linear: Dynamic (Lists, Stacks, Queues)',
      type: 'linear',
      classification: ['non-primitive', 'linear', 'dynamic'],
      items: ['Singly / Doubly Linked Lists', 'Stacks (LIFO)', 'Queues (FIFO)', 'Deques'],
      memory: 'Dynamic heap allocation with node pointers. Expandable at runtime.',
      speed: 'O(1) push/pop/enqueue at head/tail, O(N) sequential search',
      color: 'border-emerald-500 bg-emerald-50/70 dark:bg-slate-950 text-emerald-900 dark:text-white',
    },
    {
      id: 'non-linear-trees',
      label: 'Non-Linear: Hierarchical (Trees)',
      type: 'non-linear',
      classification: ['non-primitive', 'non-linear', 'dynamic'],
      items: ['Binary Trees', 'Binary Search Trees (BST)', 'AVL / Red-Black Trees', 'Heaps (Min/Max)', 'B-Trees / B+ Trees'],
      memory: 'Multi-branching pointer hierarchies with parent-child relationships.',
      speed: 'O(log N) search, insertion, and deletion in balanced trees',
      color: 'border-amber-500 bg-amber-50/70 dark:bg-slate-950 text-amber-900 dark:text-white',
    },
    {
      id: 'non-linear-graphs',
      label: 'Non-Linear: Interconnected (Graphs)',
      type: 'non-linear',
      classification: ['non-primitive', 'non-linear', 'dynamic'],
      items: ['Directed / Undirected Graphs', 'Weighted Road Networks', 'Adjacency Lists & Matrices', 'Social Graphs'],
      memory: 'Arbitrary network connections (Vertices V and Edges E).',
      speed: 'O(V + E) BFS / DFS traversal, Dijkstra shortest path',
      color: 'border-rose-500 bg-rose-50/70 dark:bg-slate-950 text-rose-900 dark:text-white',
    },
    {
      id: 'hash-tables',
      label: 'Associative / Key-Value (Hash Tables)',
      type: 'non-linear',
      classification: ['non-primitive', 'dynamic'],
      items: ['Hash Maps', 'Hash Sets', 'Direct Address Tables'],
      memory: 'Array buckets + Hash Function + Collision resolution (Chaining/Probing).',
      speed: 'O(1) average time search, insertion, and deletion',
      color: 'border-purple-500 bg-purple-50/70 dark:bg-slate-950 text-purple-900 dark:text-white',
    },
  ];

  const filteredNodes = nodes.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.classification.includes(selectedCategory);
  });

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Header & Filter Pill Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Data Structure Taxonomy Navigator
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Filter by classification dimension to inspect memory models, operation speeds, and data types.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {[
            { id: 'all' as const, label: 'All (Complete Map)' },
            { id: 'primitive' as const, label: 'Primitive' },
            { id: 'non-primitive' as const, label: 'Non-Primitive' },
            { id: 'linear' as const, label: 'Linear' },
            { id: 'non-linear' as const, label: 'Non-Linear' },
            { id: 'static' as const, label: 'Static' },
            { id: 'dynamic' as const, label: 'Dynamic' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Hierarchy Diagram / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filteredNodes.map((node) => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                soundEffects.playClick();
                setSelectedNode(node.id);
              }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${node.color} ${
                selectedNode === node.id ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-900 dark:text-white">{node.label}</h5>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900 border border-current text-slate-900 dark:text-white">
                  {node.type}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-white/80 block mb-1">
                    Examples:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {node.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-white"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-current/20 space-y-1 text-[11px]">
                  <div>
                    <strong className="font-semibold text-slate-900 dark:text-white">Memory: </strong>
                    <span className="text-slate-800 dark:text-white">{node.memory}</span>
                  </div>
                  <div>
                    <strong className="font-semibold text-slate-900 dark:text-white">Speed: </strong>
                    <span className="font-mono text-indigo-700 dark:text-white font-bold">{node.speed}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Structural Dimension Overview Pill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-indigo-600 dark:text-white block mb-1 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5" /> Static vs. Dynamic
          </span>
          <p className="text-slate-600 dark:text-white text-[11px] leading-relaxed">
            <strong>Static</strong> structures (Arrays) reserve fixed memory at creation. <strong>Dynamic</strong> structures (Linked Lists, BSTs) allocate and free heap nodes on the fly.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-indigo-600 dark:text-white block mb-1 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5" /> Homogeneous vs. Heterogeneous
          </span>
          <p className="text-slate-600 dark:text-white text-[11px] leading-relaxed">
            <strong>Homogeneous</strong> structures store identical types (e.g. `int[]`). <strong>Heterogeneous</strong> structures store mixed fields (e.g. `struct Employee`).
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-indigo-600 dark:text-white block mb-1 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5" /> Linear vs. Non-Linear
          </span>
          <p className="text-slate-600 dark:text-white text-[11px] leading-relaxed">
            <strong>Linear</strong> has 1 predecessor and 1 successor in sequential order. <strong>Non-Linear</strong> connects 1-to-many (Trees) or many-to-many (Graphs).
          </p>
        </div>
      </div>
    </div>
  );
};
