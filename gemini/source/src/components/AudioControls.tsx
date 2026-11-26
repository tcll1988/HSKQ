import React from 'react';
import {
  Pause,
  Play,
  Volume2,
  FastForward,
  RotateCcw,
  Radio,
  AlertCircle,
} from 'lucide-react';
import type { AudioSegment, PartId } from '../types';
import { formatTime } from '../hooks/useAudioController';
import { getTimelineAt } from '../data/h11004';

interface ClipPlayButtonProps {
  clipKey: string;
  segment: AudioSegment;
  activeClipKey: string | null;
  isPlaying: boolean;
  clipProgress: number;
  onToggle: (key: string, segment: AudioSegment) => void;
  label?: string;
  compact?: boolean;
}

export const ClipPlayButton: React.FC<ClipPlayButtonProps> = ({
  clipKey,
  segment,
  activeClipKey,
  isPlaying,
  clipProgress,
  onToggle,
  label = 'この問題の音声を再生',
  compact = false,
}) => {
  const isThisActive = activeClipKey === clipKey;
  const isThisPlaying = isThisActive && isPlaying;
  const dur = Math.round(segment.end - segment.start);

  return (
    <button
      type="button"
      onClick={() => onToggle(clipKey, segment)}
      className={`group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border transition-all ${
        compact ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
      } font-semibold ${
        isThisPlaying
          ? 'border-[#C83E2B] bg-[#C83E2B] text-white shadow-sm'
          : isThisActive
          ? 'border-[#C83E2B] bg-[#C83E2B]/10 text-[#C83E2B]'
          : 'border-[#DDD5C7] bg-white text-[#2B303A] hover:border-[#C83E2B]/60 hover:text-[#C83E2B]'
      }`}
    >
      {isThisActive && (
        <span
          className={`pointer-events-none absolute inset-y-0 left-0 transition-all duration-150 ${
            isThisPlaying ? 'bg-white/20' : 'bg-[#C83E2B]/10'
          }`}
          style={{ width: `${Math.round(clipProgress * 100)}%` }}
        />
      )}
      <span className="relative flex items-center gap-1.5">
        {isThisPlaying ? (
          <Pause className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        ) : (
          <Play className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} fill-current`} />
        )}
        <span>{isThisPlaying ? '再生中…' : label}</span>
        <span
          className={`text-[11px] tabular-nums ${
            isThisPlaying ? 'text-white/85' : 'text-[#847B6D]'
          }`}
        >
          ({dur}秒)
        </span>
      </span>
    </button>
  );
};

interface FullAudioBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  autoFollow: boolean;
  audioError?: string | null;
  onToggleAutoFollow: () => void;
  onToggleFull: () => void;
  onPlayFrom: (seconds: number) => void;
  onSeek: (seconds: number) => void;
  onChangeRate: (rate: number) => void;
  onJumpPart?: (part: PartId) => void;
}

const QUICK_JUMPS: { label: string; seconds: number; part?: PartId }[] = [
  { label: '音楽スキップ (0:30)', seconds: 30 },
  { label: '第1部', seconds: 63.6, part: 'L1' },
  { label: '第2部', seconds: 195.8, part: 'L2' },
  { label: '第3部', seconds: 365.5, part: 'L3' },
  { label: '第4部', seconds: 599.6, part: 'L4' },
];

export const FullAudioBar: React.FC<FullAudioBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  autoFollow,
  audioError,
  onToggleAutoFollow,
  onToggleFull,
  onPlayFrom,
  onSeek,
  onChangeRate,
  onJumpPart,
}) => {
  const timelineItem = getTimelineAt(currentTime);
  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="rounded-2xl border border-[#E4DDD0] bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleFull}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#C83E2B] text-white shadow-sm transition hover:bg-[#AE3322] active:scale-95"
            aria-label={isPlaying ? 'リスニング音声を一時停止' : 'リスニング通し音声を再生'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-[1px] fill-current" />
            )}
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-[#C83E2B]">
                <Volume2 className="h-3.5 w-3.5" />
                H11004 公式通し音声（本番形式）
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-xs font-medium text-[#7C4D12]">
                <Radio className={`h-3 w-3 ${isPlaying ? 'animate-pulse text-[#C83E2B]' : ''}`} />
                {timelineItem.labelJa}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              全 {formatTime(duration)} ・192kbps 高音質公式音源（各問2回読み上げ）
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleAutoFollow}
            className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
              autoFollow
                ? 'border-[#1E3A5F] bg-[#1E3A5F]/10 text-[#1E3A5F]'
                : 'border-[#E4DDD0] bg-[#FAF8F4] text-[#6B7280] hover:border-[#C8C0B2]'
            }`}
            title="音声の進行に合わせて自動で問題位置をハイライト・移動します"
          >
            問題自動追従：{autoFollow ? 'ON' : 'OFF'}
          </button>

          <div
            className="inline-flex items-center rounded-lg border border-[#E4DDD0] bg-[#FAF8F4] p-0.5 text-xs"
            role="group"
            aria-label="再生速度"
          >
            {[0.75, 1.0, 1.25].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChangeRate(r)}
                className={`cursor-pointer rounded-md px-2 py-1 font-semibold transition ${
                  playbackRate === r
                    ? 'bg-white text-[#C83E2B] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2328]'
                }`}
              >
                {r}倍速
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onPlayFrom(0)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#E4DDD0] bg-[#FAF8F4] px-2.5 py-1.5 text-xs font-medium text-[#555E6B] hover:bg-[#F2ECE2]"
            title="最初から再生"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            最初へ
          </button>
        </div>
      </div>

      {audioError && (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#FEF5F4] px-3 py-1.5 text-xs text-[#C83E2B]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{audioError}</span>
        </div>
      )}

      {/* Cross-browser Scrubber */}
      <div className="mt-3 flex items-center gap-3">
        <span className="w-11 text-right text-xs font-medium tabular-nums text-[#555E6B]">
          {formatTime(currentTime)}
        </span>
        <div className="relative flex flex-1 items-center">
          <input
            type="range"
            min={0}
            max={Math.floor(duration)}
            step={0.5}
            value={Math.min(duration, currentTime)}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label="リスニング再生位置"
            className="hsk-slider w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C83E2B ${progressPct}%, #ECE6DA ${progressPct}%)`,
            }}
          />
        </div>
        <span className="w-11 text-xs font-medium tabular-nums text-[#847B6D]">
          {formatTime(duration)}
        </span>
      </div>

      {/* Quick jump chips */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#847B6D]">
          <FastForward className="h-3 w-3" />
          頭出し：
        </span>
        {QUICK_JUMPS.map((j) => (
          <button
            key={j.label}
            type="button"
            onClick={() => {
              onPlayFrom(j.seconds);
              if (j.part && onJumpPart) onJumpPart(j.part);
            }}
            className="cursor-pointer rounded-full border border-[#E4DDD0] bg-[#FAF8F4] px-2.5 py-0.5 text-[11px] font-medium text-[#4B5563] transition hover:border-[#C83E2B]/50 hover:bg-[#FDF3F1] hover:text-[#C83E2B]"
          >
            {j.label}
          </button>
        ))}
      </div>
    </div>
  );
};
