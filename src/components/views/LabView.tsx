import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  Film,
  Sparkles,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import { recordVideoCompletion, getInitialTopicData } from '../../services/storage';
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
  // Authoritative topic scoring data
  const topicData = progress.topicData || getInitialTopicData(progress.completedLabs || []);
  const isLesson1Completed = Boolean(topicData.videos[1]?.completed);
  const isLesson2Completed = Boolean(topicData.videos[2]?.completed);
  const lesson1Points = topicData.videos[1]?.pointsEarned || 0;
  const lesson2Points = topicData.videos[2]?.pointsEarned || 0;

  // Active selected lesson (1 for DATA STRUCTURE, 2 for LINEAR & NON-LINEAR)
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
  };

  const handleLessonComplete = (completedId: number) => {
    const { updated, awarded } = recordVideoCompletion(progress, completedId);
    if (awarded) {
      soundEffects.playSuccess();
      onUpdateProgress(updated);
    }
  };

  // Selected Lesson object
  const activeLesson: LessonData =
    LESSONS_DATA.find((l) => l.id === selectedLessonId) || LESSONS_DATA[0];

  const currentCustomUrl = selectedLessonId === 1 ? video1.url : video2.url;
  const currentCustomName = selectedLessonId === 1 ? video1.name : video2.name;

  return (
    <div className="space-y-8 pb-16 w-full max-w-[96vw] lg:max-w-[1400px] xl:max-w-[1520px] mx-auto px-2 sm:px-4">
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
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              VISUALIZE
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Watch both interactive lesson videos in full to earn +25 points each (max 50 points).
          </p>
        </div>
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
            {/* Top Row: Lesson label + Available Points Prominent Display */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                  LESSON 01
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/60">
                  {LESSONS_DATA[0].filename}
                </span>
              </div>

              {/* Prominent Available Points Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-indigo-600 text-white shadow-xs">
                  +25 pts
                </span>
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                  <Film className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Completion Status & Earned Points Display */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                {isLesson1Completed ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Incomplete
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1.5">Earned:</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  isLesson1Completed
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {lesson1Points}/25 pts
                </span>
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
            {/* Top Row: Lesson label + Available Points Prominent Display */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                  LESSON 02
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/60">
                  {LESSONS_DATA[1].filename}
                </span>
              </div>

              {/* Prominent Available Points Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-indigo-600 text-white shadow-xs">
                  +25 pts
                </span>
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                  <Film className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Completion Status & Earned Points Display */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                {isLesson2Completed ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Incomplete
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1.5">Earned:</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  isLesson2Completed
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {lesson2Points}/25 pts
                </span>
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
          onLessonComplete={handleLessonComplete}
        />
      </div>
    </div>
  );
};
