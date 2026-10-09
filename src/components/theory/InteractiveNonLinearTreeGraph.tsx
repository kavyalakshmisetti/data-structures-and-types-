import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GitBranch,
  Network,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveNonLinearTreeGraph: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tree' | 'graph'>('tree');
  const [searchKey, setSearchKey] = useState<number>(30);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [activeGraphNode, setActiveGraphNode] = useState<string>('A');

  // BST Tree Nodes representation
  //        50
  //      /    \
  //    30      70
  //   /  \    /  \
  //  20  40  60  80
  const bstNodes = [
    { val: 50, x: 50, y: 15, left: 30, right: 70 },
    { val: 30, x: 25, y: 45, left: 20, right: 40 },
    { val: 70, x: 75, y: 45, left: 60, right: 80 },
    { val: 20, x: 12, y: 80, left: null, right: null },
    { val: 40, x: 38, y: 80, left: null, right: null },
    { val: 60, x: 62, y: 80, left: null, right: null },
    { val: 80, x: 88, y: 80, left: null, right: null },
  ];

  const handleBSTSearch = (target: number) => {
    soundEffects.playClick();
    const path: number[] = [];
    let current: number | null = 50;
    while (current !== null) {
      path.push(current);
      if (target === current) break;
      if (target < current) {
        const found = bstNodes.find((n) => n.val === current);
        current = found?.left || null;
      } else {
        const found = bstNodes.find((n) => n.val === current);
        current = found?.right || null;
      }
    }
    setTraversalPath(path);
  };

  // Graph Adjacency representation
  const graphVertices = [
    { id: 'A', label: 'Node A', neighbors: ['B', 'C'], x: 25, y: 30 },
    { id: 'B', label: 'Node B', neighbors: ['A', 'D', 'E'], x: 75, y: 30 },
    { id: 'C', label: 'Node C', neighbors: ['A', 'F'], x: 25, y: 75 },
    { id: 'D', label: 'Node D', neighbors: ['B'], x: 75, y: 75 },
    { id: 'E', label: 'Node E', neighbors: ['B', 'F'], x: 50, y: 55 },
    { id: 'F', label: 'Node F', neighbors: ['C', 'E'], x: 45, y: 90 },
  ];

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Hierarchical &amp; Network Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Explore hierarchical Binary Search Trees and interconnected network Graphs.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('tree');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
            }`}
          >
            Trees (Hierarchical)
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('graph');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'graph'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-white hover:text-slate-900 dark:hover:text-indigo-300'
            }`}
          >
            Graphs (Networks)
          </button>
        </div>
      </div>

      {/* Tree Mode */}
      {viewMode === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
                Binary Search Tree (BST: Left &lt; Root &lt; Right)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-white/80">Test Search:</span>
                {[20, 30, 40, 60, 70, 80].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleBSTSearch(num)}
                    className="px-2 py-1 text-xs font-mono font-bold rounded bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-white border border-indigo-200 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Tree Canvas */}
            <div className="relative h-[220px] bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden">
              {/* Render SVG branches */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700 stroke-2">
                <line x1="50%" y1="15%" x2="25%" y2="45%" />
                <line x1="50%" y1="15%" x2="75%" y2="45%" />
                <line x1="25%" y1="45%" x2="12%" y2="80%" />
                <line x1="25%" y1="45%" x2="38%" y2="80%" />
                <line x1="75%" y1="45%" x2="62%" y2="80%" />
                <line x1="75%" y1="45%" x2="88%" y2="80%" />
              </svg>

              {/* Render Nodes */}
              {bstNodes.map((n) => {
                const isVisited = traversalPath.includes(n.val);
                return (
                  <motion.div
                    key={n.val}
                    style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%, -50%)' }}
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-md border-2 transition-all ${
                      isVisited
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900 scale-110'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-indigo-500'
                    }`}
                  >
                    {n.val}
                  </motion.div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg shadow-inner flex items-center justify-between border border-slate-800">
              <span>Search Complexity: <strong>O(log N)</strong> Steps Taken: {traversalPath.length || 1}</span>
              <span className="text-slate-400 dark:text-slate-300">Path: {traversalPath.join(' ➔ ') || '50'}</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-mono font-bold text-slate-700 dark:text-white block">
              Tree Architecture Properties
            </span>
            <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800 text-indigo-900 dark:text-white">
              <strong className="text-indigo-600 dark:text-white">• Root Node:</strong> Topmost starting element (50).
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 text-emerald-900 dark:text-white">
              <strong className="text-emerald-600 dark:text-white">• Leaf Nodes:</strong> Nodes with 0 children (20, 40, 60, 80).
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white">
              <strong className="text-slate-900 dark:text-white">• Traversals:</strong> Inorder (Sorted output: 20, 30, 40, 50, 60, 70, 80), Preorder, Postorder.
            </div>
          </div>
        </div>
      )}

      {/* Graph Mode */}
      {viewMode === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-white">
                Network Graph (G = &#123;V, E&#125;)
              </span>
              <span className="text-xs text-slate-500 dark:text-white/80">Click a vertex to inspect connections</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {graphVertices.map((vertex) => (
                <button
                  key={vertex.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveGraphNode(vertex.id);
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    activeGraphNode === vertex.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-950 text-indigo-900 dark:text-white ring-2 ring-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">{vertex.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-white border border-slate-200 dark:border-slate-800">
                      Deg: {vertex.neighbors.length}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-white/70 block mt-1">
                    Connected to: {vertex.neighbors.join(', ')}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg shadow-inner flex items-center justify-between border border-slate-800">
              <span>Selected Vertex: <strong>{activeGraphNode}</strong></span>
              <span className="text-indigo-300">Adjacency List: G[{activeGraphNode}] ➔ [{graphVertices.find(v => v.id === activeGraphNode)?.neighbors.join(', ')}]</span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-mono font-bold text-slate-700 dark:text-white block">
              Graph Representations
            </span>
            <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800 text-indigo-900 dark:text-white">
              <strong className="text-indigo-600 dark:text-white">• Adjacency Matrix:</strong> V×V 2D Array. O(1) edge lookup, O(V²) space.
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 text-emerald-900 dark:text-white">
              <strong className="text-emerald-600 dark:text-white">• Adjacency List:</strong> Array of Linked Lists. O(V + E) space, ideal for sparse networks.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white">
              <strong className="text-slate-900 dark:text-white">• Traversals:</strong> BFS (Queue / Shortest Path) &amp; DFS (Stack / Cycle Detection).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
