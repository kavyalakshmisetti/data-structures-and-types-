import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  MapPin,
  Globe,
  Database,
  Users,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveTradeoffEngine: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scenarios = [
    {
      title: 'Web Browser Back/Forward Buttons',
      domain: 'Browser Engine',
      icon: Globe,
      problem: 'User clicks back 5 times, then forward 2 times. Needs immediate O(1) page recovery in reverse chronological order.',
      bestStructure: 'Two Stacks (Back Stack & Forward Stack)',
      whyBest: 'LIFO principle matches human navigation: Last page visited is first page to return to. O(1) push and pop with zero search overhead.',
      badChoice: 'Binary Search Tree / Sorted Array',
      whyBad: 'Unnecessary sorting overhead; destroys temporal order.',
      complexity: 'Time: O(1) Push/Pop | Space: O(N) where N is history count',
    },
    {
      title: 'GPS Navigation & Shortest Route (Google Maps)',
      domain: 'Geospatial Routing',
      icon: MapPin,
      problem: 'Calculate fastest route between 2 cities across 50,000 intersections and toll roads.',
      bestStructure: 'Weighted Graph + Priority Queue (Min-Heap)',
      whyBest: 'Intersections are Vertices; roads are weighted Edges. Dijkstra/A* algorithm uses Min-Heap to extract closest node in O(log V) time.',
      badChoice: 'Linear Linked List / 1D Array',
      whyBad: 'Cannot represent multidirectional road networks or branching intersections.',
      complexity: 'Time: O((V + E) log V) via Min-Heap Dijkstra',
    },
    {
      title: 'Operating System File Explorer',
      domain: 'OS File Systems',
      icon: HardDrive,
      problem: 'Folders contain subfolders, which contain files. Needs hierarchical nesting and path resolution (/usr/local/bin).',
      bestStructure: 'N-ary Tree (Directory Hierarchy)',
      whyBest: 'Root folder is the tree root; folders are internal nodes; files are leaf nodes. Natural 1-to-many relationship.',
      badChoice: 'Queue (FIFO)',
      whyBad: 'Flat sequential ordering cannot model nested directory hierarchies.',
      complexity: 'Time: O(Depth) path resolution | Space: O(Total Files)',
    },
    {
      title: 'Social Network Connections (LinkedIn / Facebook)',
      domain: 'Social Graph',
      icon: Users,
      problem: 'Find "2nd-degree connections" and mutual friends among 1 billion users.',
      bestStructure: 'Undirected Graph with Adjacency List + Hash Set',
      whyBest: 'Users are vertices; friendships are bidirectional edges. BFS traversal computes degrees of separation in O(V + E) time.',
      badChoice: 'Binary Search Tree',
      whyBad: 'Friendship networks have multiple cycles and cross-links; trees forbid cycles.',
      complexity: 'Time: O(Degree of connection) | Space: O(V + E)',
    },
    {
      title: 'Database B+ Tree Indexing (PostgreSQL / MySQL)',
      domain: 'Database Engines',
      icon: Database,
      problem: 'Perform fast range queries (e.g., SELECT * WHERE age BETWEEN 20 AND 30) across 100M rows on NVMe disk.',
      bestStructure: 'B+ Tree (Multi-way Balanced Tree)',
      whyBest: 'High branching factor minimizes disk block reads. All data resides in leaf nodes linked as a doubly linked list for blazing fast range scans.',
      badChoice: 'Hash Table',
      whyBad: 'Hash tables cannot do range queries (e.g. BETWEEN 20 AND 30) without full O(N) table scans.',
      complexity: 'Time: O(log_B N) Disk I/O reads + O(K) Range Scan',
    },
  ];

  const current = scenarios[selectedScenario];
  const Icon = current.icon;

  return (
    <div className="space-y-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-inner text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Interactive Trade-Off Engine: Scenario &amp; Architecture Matcher
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/80 mt-0.5">
            Discover why different computer science problems require specialized data structures.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-white border border-indigo-200 dark:border-slate-700 shrink-0">
          "No Silver Bullet" Rule
        </span>
      </div>

      {/* Scenario Selector Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {scenarios.map((sc, idx) => {
          const SIcon = sc.icon;
          const isSelected = selectedScenario === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playClick();
                setSelectedScenario(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-950 text-indigo-950 dark:text-white ring-2 ring-indigo-200 dark:ring-slate-700'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-white hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <SIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-xs font-bold truncate text-slate-900 dark:text-white">{sc.domain}</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-white/70 line-clamp-1">{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Scenario Analysis Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedScenario}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">{current.title}</h5>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{current.domain}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800">
              {current.complexity}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed font-medium">
            <strong>The Problem: </strong>{current.problem}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 text-emerald-950 dark:text-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Optimal Choice: {current.bestStructure}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-white/90">{current.whyBest}</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-slate-950 border border-rose-200 dark:border-slate-800 text-rose-950 dark:text-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Inefficient Choice: {current.badChoice}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-white/90">{current.whyBad}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
