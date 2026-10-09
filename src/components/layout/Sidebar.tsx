import React, { useState, useEffect, forwardRef } from 'react';
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  HelpCircle,
  TrendingUp,
  X,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({
  currentTab,
  onSelectTab,
  progress,
  isOpen,
  onClose,
}, ref) => {
  const [isMenuHovered, setIsMenuHovered] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset hover state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setIsMenuHovered(false);
    }
  }, [isOpen]);

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'home',
      label: 'Overview',
      icon: LayoutGrid,
    },
    {
      id: 'theory',
      label: 'Learn',
      icon: BookOpen,
    },
    {
      id: 'lab',
      label: 'Visualize',
      icon: Sparkles,
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: HelpCircle,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
    },
  ];

  const getPerformanceRepresentation = (tabId: TabType): string => {
    const topicData = progress.topicData;
    const completedChapters = Math.min(8, (progress.completedTheoryChapters || []).length);
    const completedVideos = topicData?.completedVideosCount ?? 0;
    const completedQuiz = topicData?.answeredOrTimedOutQuizCount ?? 0;

    switch (tabId) {
      case 'home': {
        const totalCompleted = completedChapters + completedVideos + completedQuiz;
        return `${totalCompleted}/20`;
      }
      case 'theory': {
        return `${completedChapters}/8`;
      }
      case 'lab': {
        return `${completedVideos}/2`;
      }
      case 'quiz': {
        return `${completedQuiz}/10`;
      }
      case 'progress': {
        return `${topicData?.completionPercentage ?? 0}%`;
      }
      default:
        return '';
    }
  };

  const handleItemClick = (tab: TabType) => {
    soundEffects.playClick();
    onSelectTab(tab);
  };

  return (
    <aside
      ref={ref}
      id="main-sidebar-navigation"
      role="navigation"
      aria-label="Sidebar Navigation"
      onMouseEnter={() => setIsMenuHovered(true)}
      onMouseLeave={() => setIsMenuHovered(false)}
      className={`group/menu h-full shrink-0 overflow-hidden bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between select-none transition-all duration-300 ease-out z-30 ${
        isOpen ? 'w-[280px] sm:w-[300px] opacity-100' : 'w-0 opacity-0 border-r-0 pointer-events-none'
      }`}
    >
      <div className="w-[280px] sm:w-[300px] h-full flex flex-col justify-between shrink-0 bg-white dark:bg-slate-900">
        {/* Drawer Header: Category Header Text with #64748B and Bold Uppercase */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-white dark:bg-slate-900">
          <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            NAVIGATION MENU
          </h3>

          {/* Close button (upper-right) */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            title="Close navigation (Esc)"
            aria-label="Close navigation"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3.5 flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`group w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Section icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span
                      className={`text-sm tracking-tight truncate transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Performance Representation badge - appears simultaneously for all topics when menu is hovered */}
                  <span
                    className={`text-xs font-mono font-bold tracking-wider shrink-0 ml-2 select-none px-2 py-0.5 rounded-lg transition-all duration-200 ease-out ${
                      isMenuHovered
                        ? 'opacity-100 scale-100 translate-x-0'
                        : 'opacity-0 scale-95 translate-x-1 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:scale-100 group-hover/menu:translate-x-0 group-hover/menu:pointer-events-auto'
                    } ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {getPerformanceRepresentation(item.id)}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
