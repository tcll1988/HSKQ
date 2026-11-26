import { useCallback, useEffect, useRef, useState } from 'react';
import { EXAM_INFO } from '../data/h11004';
import type { AudioSegment } from '../types';

export interface ActiveClip {
  key: string; // e.g. 'q-1', 'ex-L1-0', 'full'
  start: number;
  end: number;
}

export function useAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeClipRef = useRef<ActiveClip | null>(null);
  const pendingSeekRef = useRef<{ time: number; autoPlay: boolean; rate: number } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(EXAM_INFO.audioDurationSeconds);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeClipKey, setActiveClipKey] = useState<string | null>(null);
  const [clipProgress, setClipProgress] = useState(0); // 0..1
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = EXAM_INFO.audioUrl;
    audio.setAttribute('playsinline', 'true');
    audioRef.current = audio;

    const applyPendingSeek = () => {
      const pending = pendingSeekRef.current;
      if (!pending) return;
      pendingSeekRef.current = null;
      try {
        audio.currentTime = pending.time;
        audio.playbackRate = pending.rate;
      } catch {
        // Fallback for strict Safari states
      }
      if (pending.autoPlay) {
        audio
          .play()
          .then(() => setAudioError(null))
          .catch(() => {
            setAudioError('音声の自動再生がブロックされました。もう一度再生ボタンを押してください。');
          });
      }
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      applyPendingSeek();
    };

    const onCanPlay = () => {
      applyPendingSeek();
    };

    const onTimeUpdate = () => {
      const t = audio.currentTime;
      setCurrentTime(t);

      const clip = activeClipRef.current;
      if (clip && clip.key !== 'full') {
        const len = Math.max(0.1, clip.end - clip.start);
        const pct = Math.min(1, Math.max(0, (t - clip.start) / len));
        setClipProgress(pct);
        if (t >= clip.end) {
          audio.pause();
          setIsPlaying(false);
          setActiveClipKey(null);
          setClipProgress(0);
          activeClipRef.current = null;
        }
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setActiveClipKey(null);
      setClipProgress(0);
      activeClipRef.current = null;
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setAudioError(null);
    };

    const onError = () => {
      setIsPlaying(false);
      setAudioError('音声ファイルの読み込みに失敗しました。ページを再読み込みしてお試しください。');
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('error', onError);
      audio.src = '';
    };
  }, []);

  // Safari-safe seek & play helper (avoids InvalidStateError when readyState === 0)
  const safeSeekAndPlay = useCallback(
    (targetTime: number, autoPlay: boolean, rate: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const clamped = Math.max(0, Math.min(duration, targetTime));

      if (audio.readyState >= 1) {
        try {
          audio.currentTime = clamped;
        } catch {
          pendingSeekRef.current = { time: clamped, autoPlay, rate };
          audio.load();
          return;
        }
        audio.playbackRate = rate;
        setCurrentTime(clamped);
        if (autoPlay) {
          audio
            .play()
            .then(() => setAudioError(null))
            .catch(() => {
              setAudioError('ブラウザの制限により再生を開始できませんでした。もう一度ボタンを押してください。');
            });
        }
      } else {
        pendingSeekRef.current = { time: clamped, autoPlay, rate };
        audio.load();
      }
    },
    [duration]
  );

  const changeRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    pendingSeekRef.current = null;
    if (!audio) return;
    audio.pause();
    activeClipRef.current = null;
    setActiveClipKey(null);
    setClipProgress(0);
    setIsPlaying(false);
  }, []);

  const toggleClip = useCallback(
    (key: string, segment: AudioSegment) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (activeClipRef.current?.key === key && !audio.paused) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      if (
        activeClipRef.current?.key === key &&
        audio.paused &&
        audio.readyState >= 1 &&
        audio.currentTime >= segment.start &&
        audio.currentTime < segment.end - 0.3
      ) {
        audio.playbackRate = playbackRate;
        audio.play().catch(() => {});
        return;
      }

      activeClipRef.current = { key, start: segment.start, end: segment.end };
      setActiveClipKey(key);
      setClipProgress(0);
      safeSeekAndPlay(segment.start, true, playbackRate);
    },
    [playbackRate, safeSeekAndPlay]
  );

  const playFullFrom = useCallback(
    (seconds?: number) => {
      activeClipRef.current = { key: 'full', start: 0, end: duration };
      setActiveClipKey('full');
      setClipProgress(0);
      if (typeof seconds === 'number') {
        safeSeekAndPlay(seconds, true, playbackRate);
      } else if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().catch(() => {});
      }
    },
    [duration, playbackRate, safeSeekAndPlay]
  );

  const toggleFull = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeClipRef.current?.key === 'full' && !audio.paused) {
      audio.pause();
      return;
    }
    if (activeClipRef.current?.key !== 'full') {
      activeClipRef.current = { key: 'full', start: 0, end: duration };
      setActiveClipKey('full');
    }
    audio.playbackRate = playbackRate;
    audio
      .play()
      .then(() => setAudioError(null))
      .catch(() => {
        setAudioError('音声を再生できませんでした。もう一度再生ボタンを押してください。');
      });
  }, [duration, playbackRate]);

  const seekFull = useCallback(
    (seconds: number) => {
      safeSeekAndPlay(seconds, false, playbackRate);
    },
    [playbackRate, safeSeekAndPlay]
  );

  return {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    activeClipKey,
    clipProgress,
    audioError,
    changeRate,
    stop,
    toggleClip,
    playFullFrom,
    toggleFull,
    seekFull,
  };
}

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
