import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Film,
} from 'lucide-react';
import { LessonData, EducationalScene } from '../../data/labVideoData';

export type { LessonData, EducationalScene };

interface EducationalVideoPlayerProps {
  activeLesson: LessonData;
  customVideoUrl: string | null;
  customVideoName: string | null;
  autoPlayTrigger?: number;
  onSelectLesson?: (lessonId: number) => void;
  onUploadClick: () => void;
  onLessonComplete?: (lessonId: number) => void;
}

export const EducationalVideoPlayer: React.FC<EducationalVideoPlayerProps> = ({
  activeLesson,
  customVideoUrl,
  customVideoName,
  autoPlayTrigger,
  onLessonComplete,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(activeLesson.duration || 0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevVolumeRef = useRef<number>(1);
  const maxWatchedTimeRef = useRef<number>(0);
  const watchedSecondsSetRef = useRef<Set<number>>(new Set());

  // Time formatter helper: converts seconds to 00:00 format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const padMins = mins < 10 ? `0${mins}` : `${mins}`;
    const padSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return `${padMins}:${padSecs}`;
  };

  // Video source URLs
  const videoSourceUrl = customVideoUrl || activeLesson.videoSrc || `/Videos/${activeLesson.filename}`;
  const publicVideoUrl = `/Videos/${activeLesson.filename}`;
  const encodedPublicVideoUrl = `/Videos/${encodeURIComponent(activeLesson.filename)}`;

  // Synchronize when activeLesson changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(activeLesson.duration || 0);
    maxWatchedTimeRef.current = 0;
    watchedSecondsSetRef.current = new Set();

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = Math.min(1, playbackSpeed);
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
      try {
        videoRef.current.load();
      } catch {}
    }
  }, [activeLesson.id, activeLesson.filename, activeLesson.duration]);

  // Handle external autoPlayTrigger
  useEffect(() => {
    if (autoPlayTrigger && autoPlayTrigger > 0 && videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [autoPlayTrigger]);

  // Auto-hide controls timer
  const showAndScheduleHide = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (isPlaying && !isDragging) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  }, [isPlaying, isDragging]);

  const handleUserActivity = () => {
    showAndScheduleHide();
  };

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    } else {
      showAndScheduleHide();
    }
  }, [isPlaying, showAndScheduleHide]);

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (currentTime >= duration - 0.3) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    showAndScheduleHide();
  };

  // Restart video from 00:00
  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    videoRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});
    showAndScheduleHide();
  };

  // Speed change: fast-forwarding disabled, max 1x speed
  const handleSpeedChange = (speed: number) => {
    const safeSpeed = Math.min(1, Math.max(0.5, speed));
    setPlaybackSpeed(safeSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = safeSpeed;
    }
    showAndScheduleHide();
  };

  // Volume & Mute
  const handleToggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      const restoredVol = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.8;
      videoRef.current.muted = false;
      videoRef.current.volume = restoredVol;
      setVolume(restoredVol);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      videoRef.current.muted = true;
      setIsMuted(true);
    }
    showAndScheduleHide();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
    showAndScheduleHide();
  };

  // Interactive seeking along progress bar: BACKWARD NAVIGATION ONLY
  const seekToClientX = (clientX: number) => {
    if (!progressTrackRef.current || !videoRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = ratio * (duration || activeLesson.duration || 1);
    
    // Strict restriction: Prevent forward seeking. Only backward navigation is permitted.
    if (targetTime > currentTime + 0.1) {
      return;
    }
    
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!progressTrackRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * (duration || activeLesson.duration || 1);

    // Only allow starting drag / seek if navigating backwards
    if (targetTime <= currentTime + 0.1) {
      setIsDragging(true);
      seekToClientX(e.clientX);
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      seekToClientX(e.clientX);
    } else if (progressTrackRef.current) {
      const rect = progressTrackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverPosition(ratio * 100);
      setHoverTime(ratio * (duration || activeLesson.duration || 1));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
    }
  };

  // Video element events
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const vTime = videoRef.current.currentTime;
      setCurrentTime(vTime);
      if (!videoRef.current.paused) {
        watchedSecondsSetRef.current.add(Math.floor(vTime));
        maxWatchedTimeRef.current = Math.max(maxWatchedTimeRef.current, vTime);
      }
    }
  };

  // Block native forward seeking attempts
  const handleSeeking = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime > maxWatchedTimeRef.current + 0.3) {
        videoRef.current.currentTime = maxWatchedTimeRef.current;
        setCurrentTime(maxWatchedTimeRef.current);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
        setDuration(dur);
      }
      videoRef.current.playbackRate = Math.min(1, playbackSpeed);
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
        setDuration(dur);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setControlsVisible(true);
    const targetDuration = duration || activeLesson.duration || 60;
    const requiredSeconds = Math.floor(targetDuration * 0.9);
    const watchedCount = watchedSecondsSetRef.current.size;

    // Verified playback: Award points only after entire video has legitimately been played to completion
    if (watchedCount >= requiredSeconds && onLessonComplete) {
      onLessonComplete(activeLesson.id);
    }
  };

  // Fullscreen Management
  const enterFullscreen = () => {
    const el = containerRef.current as any;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => setIsFullscreen(true));
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else {
      setIsFullscreen(true);
    }
    showAndScheduleHide();
  };

  const exitFullscreen = () => {
    const doc = document as any;
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
    setIsFullscreen(false);
    showAndScheduleHide();
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any;
      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowLeft') {
        // Backward navigation only
        e.preventDefault();
        if (videoRef.current) {
          const target = Math.max(0, videoRef.current.currentTime - 5);
          videoRef.current.currentTime = target;
          setCurrentTime(target);
          showAndScheduleHide();
        }
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, isPlaying, isMuted, isFullscreen, showAndScheduleHide]);

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const videoTitle = customVideoName || activeLesson.title;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
      className={`relative w-full overflow-hidden bg-black select-none font-sans transition-all duration-200 group ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-0 rounded-none'
          : 'aspect-video min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-center'
      }`}
    >
      {/* ─── 1. FULL-SCREEN VIDEO ELEMENT (Preserves exact aspect ratio, no stretch or crop) ─── */}
      <video
        ref={videoRef}
        key={videoSourceUrl}
        preload="auto"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onClick={handleTogglePlay}
        className="w-full h-full object-contain bg-black cursor-pointer"
      >
        <source src={videoSourceUrl} type="video/mp4" />
        {publicVideoUrl !== videoSourceUrl && <source src={publicVideoUrl} type="video/mp4" />}
        {encodedPublicVideoUrl !== videoSourceUrl && (
          <source src={encodedPublicVideoUrl} type="video/mp4" />
        )}
        Your browser does not support HTML5 video.
      </video>

      {/* ─── 2 & 3. TOP-LEFT VIDEO TITLE & TOP-LEFT TIMER ─── */}
      <div
        className={`absolute top-4 left-4 sm:top-5 sm:left-6 z-30 flex items-center gap-2 sm:gap-2.5 transition-opacity duration-300 pointer-events-auto ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* TOP-LEFT VIDEO TITLE: Modern rounded dark badge */}
        <div className="px-3 sm:px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold tracking-wide uppercase shadow-lg flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate max-w-[180px] sm:max-w-[320px]">{videoTitle}</span>
        </div>

        {/* TOP-LEFT TIMER: Elapsed time / total duration (e.g. 00:02 / 00:40) */}
        <div className="px-2.5 sm:px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 text-[11px] sm:text-xs font-mono font-semibold shadow-lg shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* ─── 4. TOP-RIGHT FULLSCREEN CONTROL ─── */}
      <div
        className={`absolute top-4 right-4 sm:top-5 sm:right-6 z-30 transition-opacity duration-300 pointer-events-auto ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {isFullscreen ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              exitFullscreen();
            }}
            className="px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md text-white border border-white/20 text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Exit Fullscreen (Esc)"
            aria-label="Exit Fullscreen"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              enterFullscreen();
            }}
            className="px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md text-white border border-white/20 text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Fullscreen (F)"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        )}
      </div>

      {/* ─── 6. BIG CENTER PLAY OVERLAY WHEN PAUSED OR ENDED ─── */}
      {!isPlaying && (
        <div
          onClick={handleTogglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer transition-opacity"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.7)] transition-transform transform hover:scale-110 active:scale-95 cursor-pointer">
            {currentTime >= duration - 0.5 ? (
              <RotateCcw className="w-8 h-8 sm:w-9 sm:h-9" />
            ) : (
              <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
            )}
          </div>
        </div>
      )}

      {/* ─── 5. BOTTOM VIDEO CONTROL BAR: Modern Floating Control Panel ─── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-40 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 shadow-2xl text-white space-y-3 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 10. PROGRESS / SEEK BAR (Fully Interactive) */}
        <div className="relative w-full group/seek select-none">
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-white font-mono text-[10px] font-bold pointer-events-none shadow-md"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          <div
            ref={progressTrackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            className="relative w-full h-5 flex items-center cursor-pointer touch-none"
            role="slider"
            aria-label="Seek Video Timeline"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
          >
            {/* Background Track */}
            <div className="w-full h-1.5 group-hover/seek:h-2 rounded-full bg-white/20 overflow-hidden transition-all relative">
              {/* Active Filled Gradient */}
              <div
                className="h-full bg-linear-to-r from-indigo-500 to-indigo-400 rounded-full transition-[width] duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scrubber Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-transform duration-75 pointer-events-none ${
                isDragging ? 'scale-125 ring-4 ring-indigo-500/40' : 'group-hover/seek:scale-125'
              }`}
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>
        </div>

        {/* CONTROLS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          {/* LEFT CONTROLS: Play/Pause, Restart, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* 6. PLAY / PAUSE BUTTON */}
            <button
              onClick={handleTogglePlay}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95 transition-all cursor-pointer tracking-wider"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>PLAY</span>
                </>
              )}
            </button>

            {/* 7. RESTART BUTTON */}
            <button
              onClick={handleRestart}
              className="p-2 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center border border-white/10"
              title="Restart video (00:00)"
              aria-label="Restart video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* 9. VOLUME & MUTE CONTROL */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-white">
              <button
                onClick={handleToggleMute}
                className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center justify-center"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1.5 rounded-full accent-indigo-500 bg-white/20 cursor-pointer"
                aria-label="Volume Slider"
              />
            </div>

            {/* Time Indicator */}
            <span className="font-mono text-xs text-slate-300 font-semibold hidden md:inline ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* RIGHT CONTROLS: Playback Speed & Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 8. PLAYBACK SPEED (0.5x, 1x - Fast-forwarding disabled) */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/10 border border-white/10 text-xs font-mono font-bold">
              {[0.5, 1].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(99,102,241,0.6)] font-bold ring-1 ring-indigo-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={`Playback speed ${spd}x`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* FULLSCREEN BUTTON */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center border border-white/10"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
