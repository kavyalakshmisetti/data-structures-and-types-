import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Play,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  Film,
  Award,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import { EducationalVideoPlayer } from '../lab/EducationalVideoPlayer';
import { LESSONS_DATA, LessonData } from '../../data/labVideoData';

interface LabViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
}

interface CustomVideoState {
  file: File | null;
  url: string | null;
  name: string;
}

export const LabView: React.FC<LabViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  // Active selected lesson (1 for DATA STRUCTURE, 2 for STACK OPERATIONS)
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState<number>(0);

  // Custom uploaded videos per card (optional user upload override)
  const [video1, setVideo1] = useState<CustomVideoState>({
    file: null,
    url: null,
    name: '',
  });

  const [video2, setVideo2] = useState<CustomVideoState>({
    file: null,
    url: null,
    name: '',
  });

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (video1.url) URL.revokeObjectURL(video1.url);
      if (video2.url) URL.revokeObjectURL(video2.url);
    };
  }, [video1.url, video2.url]);

  // Handle Video 1 Upload
  const handleUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (video1.url) URL.revokeObjectURL(video1.url);
      const url = URL.createObjectURL(file);
      setVideo1({
        file,
        url,
        name: file.name,
      });
      setSelectedLessonId(1);
      soundEffects.playSuccess();

      if (!progress.completedLabs?.includes(1)) {
        onUpdateProgress((prev) => ({
          ...prev,
          completedLabs: [...(prev.completedLabs || []), 1],
          xp: prev.xp + 50,
        }));
      }
    }
  };

  // Handle Video 2 Upload
  const handleUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (video2.url) URL.revokeObjectURL(video2.url);
      const url = URL.createObjectURL(file);
      setVideo2({
        file,
        url,
        name: file.name,
      });
      setSelectedLessonId(2);
      soundEffects.playSuccess();

      if (!progress.completedLabs?.includes(2)) {
        onUpdateProgress((prev) => ({
          ...prev,
          completedLabs: [...(prev.completedLabs || []), 2],
          xp: prev.xp + 50,
        }));
      }
    }
  };

  const handleLessonWatch = (lessonId: number) => {
    soundEffects.playClick();
    setSelectedLessonId(lessonId);
    setAutoPlayTrigger(Date.now());

    // Smooth scroll to video player if not visible
    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Award lab completion upon watching
    if (!progress.completedLabs?.includes(lessonId)) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedLabs: [...(prev.completedLabs || []), lessonId],
        xp: prev.xp + 50,
      }));
    }
  };

  // Selected Lesson object
  const activeLesson: LessonData =
    LESSONS_DATA.find((l) => l.id === selectedLessonId) || LESSONS_DATA[0];

  const currentCustomUrl = selectedLessonId === 1 ? video1.url : video2.url;
  const currentCustomName = selectedLessonId === 1 ? video1.name : video2.name;

  const isLesson1Completed = progress.completedLabs?.includes(1);
  const isLesson2Completed = progress.completedLabs?.includes(2);

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Hidden File Inputs for Custom Video Uploads */}
      <input
        type="file"
        ref={fileInputRef1}
        onChange={handleUpload1}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        className="hidden"
        aria-label={`Upload video for Lesson 01 ${LESSONS_DATA[0].title}`}
      />
      <input
        type="file"
        ref={fileInputRef2}
        onChange={handleUpload2}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        className="hidden"
        aria-label={`Upload video for Lesson 02 ${LESSONS_DATA[1].title}`}
      />

      {/* ─── VISUALIZE SECTION HEADING ─── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          VISUALIZE
        </h1>
      </div>

      {/* ─── TWO LESSON CARDS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* ─── LESSON CARD 01 ─── */}
        <div
          onClick={() => handleLessonWatch(1)}
          className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
            selectedLessonId === 1
              ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/25 shadow-lg shadow-indigo-500/10'
              : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            {/* Top Row: Lesson label + Video Icon Container */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                  LESSON 01
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/60">
                  {LESSONS_DATA[0].filename}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                  <Film className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Lesson Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                {LESSONS_DATA[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                {LESSONS_DATA[0].description}
              </p>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {LESSONS_DATA[0].chips.map((chip, cIdx) => (
                <span
                  key={cIdx}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Area: CLICK TO WATCH */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLessonWatch(1);
              }}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
                selectedLessonId === 1
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                  : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60'
              }`}
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>WATCH LESSON 01 VIDEO</span>
            </button>
          </div>
        </div>

        {/* ─── LESSON CARD 02: OPERATIONS ─── */}
        <div
          onClick={() => handleLessonWatch(2)}
          className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
            selectedLessonId === 2
              ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/25 shadow-lg shadow-indigo-500/10'
              : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            {/* Top Row: Lesson label + Video Icon Container */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                  LESSON 02
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/60">
                  {LESSONS_DATA[1].filename}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                  <Film className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Lesson Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                {LESSONS_DATA[1].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                {LESSONS_DATA[1].description}
              </p>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {LESSONS_DATA[1].chips.map((chip, cIdx) => (
                <span
                  key={cIdx}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Area: CLICK TO WATCH */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLessonWatch(2);
              }}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
                selectedLessonId === 2
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                  : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60'
              }`}
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>WATCH LESSON 02 VIDEO</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── REUSABLE INTERACTIVE VIDEO PLAYER SECTION ─── */}
      <div ref={playerContainerRef} className="space-y-4 pt-2">
        <EducationalVideoPlayer
          activeLesson={activeLesson}
          customVideoUrl={currentCustomUrl}
          customVideoName={currentCustomName}
          autoPlayTrigger={autoPlayTrigger}
          onSelectLesson={handleLessonWatch}
          onUploadClick={() => {
            if (selectedLessonId === 1) {
              fileInputRef1.current?.click();
            } else {
              fileInputRef2.current?.click();
            }
          }}
          onLessonComplete={(completedId) => {
            if (!progress.completedLabs?.includes(completedId)) {
              onUpdateProgress((prev) => ({
                ...prev,
                completedLabs: [...(prev.completedLabs || []), completedId],
                xp: prev.xp + 50,
              }));
            }
          }}
        />
      </div>
    </div>
  );
};
