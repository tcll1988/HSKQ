import React, { useMemo, useState } from 'react';
import {
  Home,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
  XCircle,
  ZoomIn,
  Volume2,
  Shuffle,
  ListOrdered,
  RotateCcw,
  Lightbulb,
  Trophy,
  BookOpen,
  Headphones,
  Clock,
} from 'lucide-react';
import type {
  AudioSegment,
  HskQuestion,
  PracticeScope,
  QuestionOrder,
} from '../types';
import {
  L3_IMAGES,
  PARTS_META,
  R2_IMAGES,
  R3_RESPONSES,
  R4_WORD_BANK,
} from '../data/h11004';
import { RubyText } from './RubyText';
import { ClipPlayButton } from './AudioControls';

interface PracticeSessionProps {
  questions: HskQuestion[];
  order: QuestionOrder;
  scope: PracticeScope;
  showPinyin: boolean;
  onTogglePinyin: () => void;
  activeClipKey: string | null;
  isPlaying: boolean;
  clipProgress: number;
  playbackRate: number;
  audioError?: string | null;
  onToggleClip: (key: string, seg: AudioSegment) => void;
  onChangeRate: (rate: number) => void;
  onStopAudio: () => void;
  onZoomImage: (src: string, alt: string) => void;
  onRestartPractice: (order: QuestionOrder, scope: PracticeScope, customIds?: number[]) => void;
  onGoExam: () => void;
  onGoHome: () => void;
}

interface AttemptRecord {
  solved: boolean;
  wrongChoices: string[];
  firstTryCorrect: boolean | null;
}

const LETTERS_AF = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  questions,
  order,
  scope,
  showPinyin,
  onTogglePinyin,
  activeClipKey,
  isPlaying,
  clipProgress,
  playbackRate,
  audioError,
  onToggleClip,
  onChangeRate,
  onStopAudio,
  onZoomImage,
  onRestartPractice,
  onGoExam,
  onGoHome,
}) => {
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<Record<number, AttemptRecord>>({});
  const [finished, setFinished] = useState(false);

  const currentQ = questions[index];
  const partMeta = useMemo(
    () => PARTS_META.find((p) => p.id === currentQ?.part),
    [currentQ]
  );

  const currentRec: AttemptRecord = currentQ
    ? records[currentQ.id] || {
        solved: false,
        wrongChoices: [],
        firstTryCorrect: null,
      }
    : { solved: false, wrongChoices: [], firstTryCorrect: null };

  const hasWrongAttempt = currentRec.wrongChoices.length > 0;
  const isSolved = currentRec.solved;
  const showExplanation = isSolved || hasWrongAttempt;

  const solvedCount = useMemo(
    () => questions.filter((q) => records[q.id]?.solved).length,
    [questions, records]
  );
  const firstTryCorrectCount = useMemo(
    () => questions.filter((q) => records[q.id]?.firstTryCorrect === true).length,
    [questions, records]
  );
  const missedQuestions = useMemo(
    () => questions.filter((q) => records[q.id]?.firstTryCorrect === false),
    [questions, records]
  );

  const handleChoose = (choice: string) => {
    if (!currentQ || isSolved) return;
    const isCorrect = choice === currentQ.answer;

    setRecords((prev) => {
      const existing = prev[currentQ.id] || {
        solved: false,
        wrongChoices: [],
        firstTryCorrect: null,
      };
      if (isCorrect) {
        return {
          ...prev,
          [currentQ.id]: {
            solved: true,
            wrongChoices: existing.wrongChoices,
            firstTryCorrect:
              existing.firstTryCorrect === null ? true : existing.firstTryCorrect,
          },
        };
      }
      const nextWrong = existing.wrongChoices.includes(choice)
        ? existing.wrongChoices
        : [...existing.wrongChoices, choice];
      return {
        ...prev,
        [currentQ.id]: {
          solved: false,
          wrongChoices: nextWrong,
          firstTryCorrect: false,
        },
      };
    });
  };

  const handleNext = () => {
    if (!isSolved) return;
    onStopAudio();
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (index === 0) return;
    onStopAudio();
    setIndex((i) => i - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatAnswerLabel = (q: HskQuestion, val: string) => {
    if (q.part === 'L1' || q.part === 'R1') {
      if (val === 'T') return '◯ 正しい';
      if (val === 'F') return '× 誤り';
    }
    if (q.part === 'R4') {
      const w = R4_WORD_BANK.find((item) => item.label === val);
      return w ? `${val}（${w.hanzi} / ${w.pinyin}）` : val;
    }
    if (q.part === 'R3') {
      const r = R3_RESPONSES.find((item) => item.label === val);
      return r ? `${val}（${r.text}）` : val;
    }
    if (q.part === 'L4') {
      const opt = q.options.find((o) => o.label === val);
      return opt ? `${val}（${opt.text}）` : val;
    }
    return val;
  };

  // ==================== COMPLETION SUMMARY SCREEN ====================
  if (finished) {
    const rate =
      questions.length > 0
        ? Math.round((firstTryCorrectCount / questions.length) * 100)
        : 0;
    return (
      <div className="paper-grain min-h-screen pb-16 pt-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl border border-[#E6DFD1] bg-white p-7 shadow-xs sm:p-10">
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF7F2] text-[#2E7D5B]">
                <Trophy className="h-9 w-9" />
              </span>
              <h1 className="font-serif-ja mt-4 text-2xl font-bold text-[#1F2328] sm:text-3xl">
                練習モード 全{questions.length}問クリア！
              </h1>
              <p className="mt-2 text-sm text-[#57606A]">
                お疲れさまでした！すべての問題で正解に到達しました。
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] p-4 text-center">
                <div className="text-xs font-semibold text-[#736B5E]">完了問題数</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums text-[#2E7D5B]">
                  {questions.length} / {questions.length}
                </div>
              </div>
              <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] p-4 text-center">
                <div className="text-xs font-semibold text-[#736B5E]">一発正解率</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums text-[#1E3A5F]">
                  {rate}%
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  初回正解 {firstTryCorrectCount} 問
                </div>
              </div>
              <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] p-4 text-center">
                <div className="text-xs font-semibold text-[#736B5E]">つまずいた問題</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums text-[#C83E2B]">
                  {missedQuestions.length} 問
                </div>
              </div>
            </div>

            {missedQuestions.length > 0 && (
              <div className="mt-6 rounded-2xl border border-[#F2E2DF] bg-[#FEF8F7] p-4">
                <div className="text-xs font-bold text-[#C83E2B]">
                  初回で間違えた問題（復習おすすめ）：
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {missedQuestions.map((q) => (
                    <span
                      key={q.id}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#1F2328] ring-1 ring-[#F0C2BC]"
                    >
                      第{q.id}問（正解：{formatAnswerLabel(q, q.answer)}）
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {missedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onRestartPractice(
                      'random',
                      scope,
                      missedQuestions.map((q) => q.id)
                    )
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#C83E2B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#AE3221]"
                >
                  <RotateCcw className="h-4 w-4" />
                  間違えた{missedQuestions.length}問だけ再練習
                </button>
              )}
              <button
                type="button"
                onClick={() => onRestartPractice('random', scope)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#162C49]"
              >
                <Shuffle className="h-4 w-4" />
                ランダム順でもう一度
              </button>
              <button
                type="button"
                onClick={onGoExam}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#1E3A5F] bg-white px-5 py-2.5 text-sm font-bold text-[#1E3A5F] transition hover:bg-[#EEF4FA]"
              >
                <Clock className="h-4 w-4" />
                試験モードに挑戦
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#DFD8CA] bg-[#FAF8F4] px-4 py-2.5 text-sm font-semibold text-[#555E6B] transition hover:bg-[#F2ECE2]"
              >
                <Home className="h-4 w-4" />
                トップへ戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ || !partMeta) return null;

  const progressPct = Math.round(((index + (isSolved ? 1 : 0)) / questions.length) * 100);
  const isListening = currentQ.section === 'listening';

  // Helper to determine option visual state
  const getChoiceStyle = (val: string, isExample = false) => {
    const isCorrectVal = val === currentQ.answer;
    const isTriedWrong = currentRec.wrongChoices.includes(val);

    if (isExample) {
      return {
        card: 'border-dashed border-[#E2DACB] bg-[#F7F4EE] opacity-60 cursor-not-allowed',
        badge: 'bg-[#E6DFD1] text-[#6B7280]',
      };
    }
    if (isSolved && isCorrectVal) {
      return {
        card: 'border-[#2E7D5B] bg-[#EBF7F0] ring-2 ring-[#2E7D5B]/25',
        badge: 'bg-[#2E7D5B] text-white',
      };
    }
    if (hasWrongAttempt && isCorrectVal) {
      // Reveal the correct answer clearly so user knows to click it!
      return {
        card: 'border-[#2E7D5B] border-dashed bg-[#F2FAF5] ring-2 ring-[#2E7D5B]/30 animate-pulse',
        badge: 'bg-[#2E7D5B] text-white',
      };
    }
    if (isTriedWrong) {
      return {
        card: 'border-[#C83E2B] bg-[#FEF2F1] opacity-85',
        badge: 'bg-[#C83E2B] text-white',
      };
    }
    return {
      card: 'border-[#E4DDD0] bg-[#FCFBF8] hover:border-[#1E3A5F] hover:bg-white cursor-pointer',
      badge: 'bg-[#EFEAE0] text-[#374151]',
    };
  };

  return (
    <div className="paper-grain min-h-screen pb-20">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#E6DFD1] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onStopAudio();
                onGoHome();
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E6DFD1] bg-[#FAF8F4] px-2.5 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F2ECE2]"
            >
              <Home className="h-3.5 w-3.5" />
              トップ
            </button>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-[#C83E2B] px-2 py-0.5 text-xs font-bold text-white">
                練習モード
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs font-semibold text-[#555E6B] ring-1 ring-[#E6DFD1]">
                {order === 'random' ? (
                  <>
                    <Shuffle className="h-3 w-3 text-[#C83E2B]" />
                    ランダム順
                  </>
                ) : (
                  <>
                    <ListOrdered className="h-3 w-3 text-[#1E3A5F]" />
                    原題どおり
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pinyin Toggle */}
            <button
              type="button"
              onClick={onTogglePinyin}
              className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                showPinyin
                  ? 'border-[#1E3A5F]/40 bg-[#EEF4FA] text-[#1E3A5F]'
                  : 'border-[#E4DDD0] bg-white text-[#6B7280]'
              }`}
            >
              ピンイン：{showPinyin ? '表示' : '非表示'}
            </button>

            {/* Quick Order Switch */}
            <button
              type="button"
              onClick={() =>
                onRestartPractice(order === 'random' ? 'sequential' : 'random', scope)
              }
              className="hidden cursor-pointer items-center gap-1 rounded-lg border border-[#E4DDD0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#555E6B] hover:bg-[#FAF8F4] sm:inline-flex"
              title="出題順を切り替えて最初から練習する"
            >
              {order === 'random' ? (
                <>
                  <ListOrdered className="h-3.5 w-3.5" />
                  原題順に切替
                </>
              ) : (
                <>
                  <Shuffle className="h-3.5 w-3.5" />
                  シャッフルに切替
                </>
              )}
            </button>

            <span className="rounded-lg bg-[#FAF8F4] px-2.5 py-1.5 text-xs font-bold tabular-nums text-[#1F2328] ring-1 ring-[#E6DFD1]">
              {index + 1} / {questions.length} 問
            </span>
          </div>
        </div>

        {/* Thin progress bar */}
        <div className="h-1 w-full bg-[#EFEAE0]">
          <div
            className="h-full bg-[#C83E2B] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Focused Single-Question Workspace */}
      <main className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        {/* Progress & Meta Info Row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-white ${
                isListening ? 'bg-[#C83E2B]' : 'bg-[#1E3A5F]'
              }`}
            >
              {isListening ? (
                <Headphones className="h-3 w-3" />
              ) : (
                <BookOpen className="h-3 w-3" />
              )}
              {isListening ? 'リスニング' : 'リーディング'} {partMeta.titleJa}
            </span>
            <span className="font-semibold text-[#1F2328]">
              元の問題番号：第{currentQ.id}問
            </span>
            <span className="hidden text-[#847B6D] sm:inline">
              （{partMeta.subtitleJa.split('・')[1]}）
            </span>
          </div>
          <div className="tabular-nums font-medium">
            クリア済み：{solvedCount} / {questions.length}・一発正解：{firstTryCorrectCount}
          </div>
        </div>

        {/* Main Question Card */}
        <section className="rounded-3xl border border-[#E6DFD1] bg-white p-5 shadow-xs sm:p-7">
          {/* Instruction strip */}
          <p className="mb-4 rounded-xl bg-[#FAF8F4] px-3.5 py-2.5 text-xs leading-relaxed text-[#555E6B]">
            {partMeta.instructionJa}
          </p>

          {/* Audio Player Controls for Listening Questions */}
          {currentQ.audio && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F2E2DF] bg-[#FEF8F7] px-4 py-3">
              <ClipPlayButton
                clipKey={`practice-q-${currentQ.id}`}
                segment={currentQ.audio}
                activeClipKey={activeClipKey}
                isPlaying={isPlaying}
                clipProgress={clipProgress}
                onToggle={onToggleClip}
                label={`第${currentQ.id}問の音声を再生（2回流れます）`}
              />

              <div className="inline-flex items-center rounded-lg border border-[#E6DFD1] bg-white p-0.5 text-xs">
                {[0.75, 1.0, 1.25].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onChangeRate(r)}
                    className={`cursor-pointer rounded-md px-2 py-1 font-semibold transition ${
                      playbackRate === r
                        ? 'bg-[#C83E2B] text-white'
                        : 'text-[#6B7280] hover:text-[#1F2328]'
                    }`}
                  >
                    {r}倍速
                  </button>
                ))}
              </div>
            </div>
          )}

          {audioError && isListening && (
            <div className="mb-4 rounded-xl bg-[#FEF2F1] px-3.5 py-2 text-xs text-[#C83E2B]">
              {audioError}
            </div>
          )}

          {/* ==================== QUESTION BODY BY PART ==================== */}

          {/* L1: Listen + Picture -> True / False */}
          {currentQ.part === 'L1' && (
            <div className="flex flex-col items-center gap-6 py-2">
              <button
                type="button"
                onClick={() => onZoomImage(currentQ.image, `第${currentQ.id}問のイラスト`)}
                className="group relative flex h-48 w-64 cursor-zoom-in items-center justify-center rounded-2xl border border-[#ECE6DA] bg-white p-3 transition hover:border-[#C83E2B]/50"
                title="クリックして拡大"
              >
                <img
                  src={currentQ.image}
                  alt={`第${currentQ.id}問のイラスト`}
                  className="max-h-full max-w-full object-contain"
                />
                <span className="absolute bottom-2 right-2 rounded-md bg-black/55 p-1 text-white opacity-0 transition group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" />
                </span>
              </button>

              <div className="grid w-full max-w-md grid-cols-2 gap-3.5">
                {(['T', 'F'] as const).map((val) => {
                  const st = getChoiceStyle(val);
                  const isRevealTarget = hasWrongAttempt && !isSolved && val === currentQ.answer;
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={isSolved}
                      onClick={() => handleChoose(val)}
                      className={`relative flex h-16 items-center justify-center gap-2 rounded-2xl border-2 text-lg font-bold transition ${st.card}`}
                    >
                      {val === 'T' ? (
                        <>
                          <Check className="h-6 w-6 stroke-[2.5] text-[#2E7D5B]" />
                          <span>正しい</span>
                        </>
                      ) : (
                        <>
                          <X className="h-6 w-6 stroke-[2.5] text-[#C83E2B]" />
                          <span>誤り</span>
                        </>
                      )}
                      {isRevealTarget && (
                        <span className="absolute -top-2.5 right-2 rounded-full bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          ここが正解！
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* L2: Listen + Choose Picture A/B/C */}
          {currentQ.part === 'L2' && (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {currentQ.options.map((opt) => {
                const st = getChoiceStyle(opt.label);
                const isRevealTarget =
                  hasWrongAttempt && !isSolved && opt.label === currentQ.answer;
                return (
                  <div
                    key={opt.label}
                    className={`relative flex flex-col overflow-hidden rounded-2xl border-2 transition ${st.card}`}
                  >
                    <button
                      type="button"
                      disabled={isSolved}
                      onClick={() => handleChoose(opt.label)}
                      className="flex flex-1 cursor-pointer flex-col items-center p-3.5 disabled:cursor-default"
                    >
                      <div className="flex h-36 w-full items-center justify-center rounded-xl bg-white p-2">
                        <img
                          src={opt.image}
                          alt={opt.alt}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${st.badge}`}
                        >
                          {opt.label}
                        </span>
                        {isRevealTarget && (
                          <span className="rounded-full bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                            正解を選択！
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onZoomImage(opt.image, `第${currentQ.id}問 選択肢 ${opt.label}`)
                      }
                      className="absolute right-2 top-2 cursor-zoom-in rounded-md bg-white/90 p-1.5 text-[#555E6B] shadow-xs ring-1 ring-black/10"
                      title="拡大表示"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* L3: Listen Dialogue + Choose Picture A-F (Self-contained for Random Mode!) */}
          {currentQ.part === 'L3' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {L3_IMAGES.map((item) => {
                const st = getChoiceStyle(item.label, item.isExample);
                const isRevealTarget =
                  hasWrongAttempt && !isSolved && item.label === currentQ.answer;
                return (
                  <div
                    key={item.label}
                    className={`relative flex flex-col overflow-hidden rounded-2xl border-2 transition ${st.card}`}
                  >
                    <button
                      type="button"
                      disabled={isSolved || item.isExample}
                      onClick={() => handleChoose(item.label)}
                      className="flex flex-1 flex-col items-center p-3 text-left"
                    >
                      <div className="flex w-full items-center justify-between pb-1.5">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${st.badge}`}
                        >
                          {item.label}
                        </span>
                        {item.isExample ? (
                          <span className="rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-bold text-[#736B5E]">
                            例題
                          </span>
                        ) : isRevealTarget ? (
                          <span className="rounded bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                            正解！
                          </span>
                        ) : null}
                      </div>
                      <div className="flex h-28 w-full items-center justify-center rounded-lg bg-white p-1.5">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onZoomImage(item.image, `イラスト ${item.label}`)}
                      className="absolute bottom-2 right-2 cursor-zoom-in rounded-md bg-white/90 p-1 text-[#555E6B] ring-1 ring-black/10"
                      title="拡大表示"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* L4: Listen Statement + Question -> Choose Text A/B/C */}
          {currentQ.part === 'L4' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {currentQ.options.map((opt) => {
                const st = getChoiceStyle(opt.label);
                const isRevealTarget =
                  hasWrongAttempt && !isSolved && opt.label === currentQ.answer;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isSolved}
                    onClick={() => handleChoose(opt.label)}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition ${st.card}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${st.badge}`}
                    >
                      {opt.label}
                    </span>
                    <div>
                      <RubyText
                        tokens={opt.tokens}
                        showPinyin={showPinyin}
                        className="text-xl font-semibold text-[#1F2328]"
                      />
                      {showExplanation && (
                        <div className="mt-0.5 text-xs text-[#6B7280]">{opt.meaningJa}</div>
                      )}
                    </div>
                    {isRevealTarget && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                        正解を選択！
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* R1: Picture + Word -> True / False */}
          {currentQ.part === 'R1' && (
            <div className="flex flex-col items-center gap-6 py-2">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
                <button
                  type="button"
                  onClick={() => onZoomImage(currentQ.image, `第${currentQ.id}問のイラスト`)}
                  className="group relative flex h-44 w-52 cursor-zoom-in items-center justify-center rounded-2xl border border-[#ECE6DA] bg-white p-3"
                >
                  <img
                    src={currentQ.image}
                    alt={`第${currentQ.id}問のイラスト`}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/55 p-1 text-white opacity-0 transition group-hover:opacity-100">
                    <ZoomIn className="h-3.5 w-3.5" />
                  </span>
                </button>

                <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] px-10 py-6 text-center">
                  <RubyText
                    tokens={currentQ.wordTokens}
                    showPinyin={showPinyin}
                    className="text-4xl font-bold text-[#1F2328]"
                  />
                </div>
              </div>

              <div className="grid w-full max-w-md grid-cols-2 gap-3.5">
                {(['T', 'F'] as const).map((val) => {
                  const st = getChoiceStyle(val);
                  const isRevealTarget = hasWrongAttempt && !isSolved && val === currentQ.answer;
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={isSolved}
                      onClick={() => handleChoose(val)}
                      className={`relative flex h-16 items-center justify-center gap-2 rounded-2xl border-2 text-lg font-bold transition ${st.card}`}
                    >
                      {val === 'T' ? (
                        <>
                          <Check className="h-6 w-6 stroke-[2.5] text-[#2E7D5B]" />
                          <span>正しい</span>
                        </>
                      ) : (
                        <>
                          <X className="h-6 w-6 stroke-[2.5] text-[#C83E2B]" />
                          <span>誤り</span>
                        </>
                      )}
                      {isRevealTarget && (
                        <span className="absolute -top-2.5 right-2 rounded-full bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                          ここが正解！
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* R2: Sentence + Choose Picture A-F */}
          {currentQ.part === 'R2' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] px-5 py-4 text-center">
                <RubyText
                  tokens={currentQ.tokens}
                  showPinyin={showPinyin}
                  className="text-2xl font-semibold text-[#1F2328]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {R2_IMAGES.map((item) => {
                  const st = getChoiceStyle(item.label, item.isExample);
                  const isRevealTarget =
                    hasWrongAttempt && !isSolved && item.label === currentQ.answer;
                  return (
                    <div
                      key={item.label}
                      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 transition ${st.card}`}
                    >
                      <button
                        type="button"
                        disabled={isSolved || item.isExample}
                        onClick={() => handleChoose(item.label)}
                        className="flex flex-1 flex-col items-center p-3"
                      >
                        <div className="flex w-full items-center justify-between pb-1.5">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${st.badge}`}
                          >
                            {item.label}
                          </span>
                          {item.isExample ? (
                            <span className="rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-bold text-[#736B5E]">
                              例題
                            </span>
                          ) : isRevealTarget ? (
                            <span className="rounded bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                              正解！
                            </span>
                          ) : null}
                        </div>
                        <div className="flex h-28 w-full items-center justify-center rounded-lg bg-white p-1.5">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => onZoomImage(item.image, `イラスト ${item.label}`)}
                        className="absolute bottom-2 right-2 cursor-zoom-in rounded-md bg-white/90 p-1 text-[#555E6B] ring-1 ring-black/10"
                        title="拡大表示"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* R3: Prompt Sentence + Choose Response A-F */}
          {currentQ.part === 'R3' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] px-5 py-4 text-center">
                <RubyText
                  tokens={currentQ.tokens}
                  showPinyin={showPinyin}
                  className="text-2xl font-semibold text-[#1F2328]"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {R3_RESPONSES.map((resp) => {
                  const st = getChoiceStyle(resp.label, resp.isExample);
                  const isRevealTarget =
                    hasWrongAttempt && !isSolved && resp.label === currentQ.answer;
                  return (
                    <button
                      key={resp.label}
                      type="button"
                      disabled={isSolved || resp.isExample}
                      onClick={() => handleChoose(resp.label)}
                      className={`relative flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition ${st.card}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${st.badge}`}
                        >
                          {resp.label}
                        </span>
                        <div>
                          <RubyText
                            tokens={resp.tokens}
                            showPinyin={showPinyin}
                            className="text-lg font-medium text-[#1F2328]"
                          />
                          {showExplanation && (
                            <div className="text-xs text-[#6B7280]">{resp.translationJa}</div>
                          )}
                        </div>
                      </div>
                      {resp.isExample ? (
                        <span className="shrink-0 rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-bold text-[#736B5E]">
                          例題
                        </span>
                      ) : isRevealTarget ? (
                        <span className="shrink-0 rounded bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                          正解！
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* R4: Fill in the Blank A-F */}
          {currentQ.part === 'R4' && (
            <div className="space-y-5">
              <div className="space-y-3 rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] px-5 py-5">
                {currentQ.lines.map((line, idx) => {
                  const answerWord = R4_WORD_BANK.find((w) => w.label === currentQ.answer);
                  const lastWrong = currentRec.wrongChoices[currentRec.wrongChoices.length - 1];
                  const wrongWord = R4_WORD_BANK.find((w) => w.label === lastWrong);

                  const filledBlank = isSolved && answerWord
                    ? { hanzi: answerWord.hanzi, pinyin: answerWord.pinyin, status: 'correct' as const }
                    : hasWrongAttempt && wrongWord
                    ? { hanzi: wrongWord.hanzi, pinyin: wrongWord.pinyin, status: 'wrong' as const }
                    : null;

                  return (
                    <div key={idx} className="flex items-end gap-2.5">
                      {line.speaker && (
                        <span className="mb-1 shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-[#555E6B] ring-1 ring-[#E6DFD1]">
                          {line.speaker}：
                        </span>
                      )}
                      <RubyText
                        tokens={line.tokens}
                        showPinyin={showPinyin}
                        className="text-2xl font-medium text-[#1F2328]"
                        filledBlank={filledBlank}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {R4_WORD_BANK.map((w) => {
                  const st = getChoiceStyle(w.label, w.isExample);
                  const isRevealTarget =
                    hasWrongAttempt && !isSolved && w.label === currentQ.answer;
                  return (
                    <button
                      key={w.label}
                      type="button"
                      disabled={isSolved || w.isExample}
                      onClick={() => handleChoose(w.label)}
                      className={`relative flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left transition ${st.card}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${st.badge}`}
                        >
                          {w.label}
                        </span>
                        <div>
                          <RubyText
                            tokens={[{ hanzi: w.hanzi, pinyin: w.pinyin }]}
                            showPinyin={showPinyin}
                            className="text-lg font-bold text-[#1F2328]"
                          />
                          {showExplanation && (
                            <div className="text-[11px] text-[#6B7280]">{w.meaningJa}</div>
                          )}
                        </div>
                      </div>
                      {w.isExample ? (
                        <span className="rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-bold text-[#736B5E]">
                          例題
                        </span>
                      ) : isRevealTarget ? (
                        <span className="rounded bg-[#2E7D5B] px-2 py-0.5 text-[10px] font-bold text-white">
                          正解！
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== FEEDBACK & JAPANESE EXPLANATION PANEL ==================== */}
          {showExplanation && (
            <div className="mt-6 space-y-3 border-t border-[#F0EAE0] pt-5">
              {/* Status Alert */}
              {isSolved ? (
                <div className="rounded-2xl border border-[#B8DEC9] bg-[#F2FAF5] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-base font-bold text-[#2E7D5B]">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>
                        {currentRec.firstTryCorrect
                          ? '正解！素晴らしいです！'
                          : '正解を選び直しました！次の問題へ進めます。'}
                      </span>
                    </div>
                    <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-[#1F5D42] ring-1 ring-[#B8DEC9]">
                      正解：{formatAnswerLabel(currentQ, currentQ.answer)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-[#F0C2BC] bg-[#FEF5F4] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-base font-bold text-[#C83E2B]">
                      <XCircle className="h-5 w-5" />
                      <span>不正解です。正解を確認してから選び直しましょう！</span>
                    </div>
                    <span className="rounded-lg bg-[#2E7D5B] px-3 py-1 text-xs font-bold text-white shadow-xs">
                      正解：{formatAnswerLabel(currentQ, currentQ.answer)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-[#9C2F20]">
                    ※ 正しい選択肢（{formatAnswerLabel(currentQ, currentQ.answer)}）をクリックすると「次の問題へ」ボタンが解除されます。
                  </p>
                </div>
              )}

              {/* Listening Transcript */}
              {isListening && currentQ.transcript && (
                <div className="rounded-2xl border border-[#DCE6F2] bg-[#F7FAFD] p-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F]">
                    <Volume2 className="h-3.5 w-3.5" />
                    リスニング原文（中国語スクリプト）
                  </div>
                  <div className="space-y-2">
                    {currentQ.transcript.map((line, idx) => (
                      <div key={idx} className="flex items-end gap-2 text-lg text-[#1F2328]">
                        {line.speaker && (
                          <span className="mb-0.5 shrink-0 rounded bg-[#1E3A5F]/10 px-1.5 py-0.5 text-xs font-bold text-[#1E3A5F]">
                            {line.speaker}
                          </span>
                        )}
                        <RubyText tokens={line.tokens} showPinyin={showPinyin} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Japanese Translation & Detailed Explanation */}
              <div className="rounded-2xl border border-[#EFEAE0] bg-[#FCFBF8] p-4">
                <div className="text-xs font-bold text-[#736B5E]">日本語訳</div>
                <p className="mt-1 text-sm font-semibold text-[#1F2328]">
                  {currentQ.translationJa}
                </p>

                <div className="mt-3 border-t border-[#EFEAE0] pt-3">
                  <div className="text-xs font-bold text-[#1E3A5F]">
                    なぜこれが正解？（詳しい日本語解説）
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#2D333B]">
                    {currentQ.explanationJa}
                  </p>
                </div>

                {currentQ.tipJa && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FDF9EE] px-3.5 py-2.5 text-xs leading-relaxed text-[#6B4E1B] ring-1 ring-[#EFE2C0]">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#C4820E]" />
                    <span>
                      <strong>学習ポイント：</strong>
                      {currentQ.tipJa}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== NAVIGATION FOOTER WITH MASTERY GATE ==================== */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EAE0] pt-5">
            <button
              type="button"
              disabled={index === 0}
              onClick={handlePrev}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E4DDD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#FAF8F4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              前の問題
            </button>

            <button
              type="button"
              disabled={!isSolved}
              onClick={handleNext}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition ${
                isSolved
                  ? 'cursor-pointer bg-[#2E7D5B] text-white shadow-sm hover:bg-[#236348]'
                  : 'cursor-not-allowed bg-[#EAE4D9] text-[#847B6D]'
              }`}
            >
              {isSolved ? (
                <>
                  <span>
                    {index === questions.length - 1
                      ? '練習結果を見る'
                      : '次の問題へ進む'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>正解を選ぶと次へ進めます</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Mini Question Progress Dots */}
        <div className="mt-5 rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-bold text-[#1F2328]">進捗マップ（クリア済みの問題には戻れます）</span>
            <span>全 {questions.length} 問</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const r = records[q.id];
              const isCurrent = idx === index;
              // Allow clicking already-solved questions or the furthest unlocked index
              const canJump = idx <= index || Boolean(r?.solved);
              let dotCls = 'border-[#E6DFD1] bg-[#FAF8F4] text-[#9CA3AF]';
              if (r?.solved && r.firstTryCorrect) {
                dotCls = 'border-[#2E7D5B] bg-[#E9F6EF] text-[#1F5D42]';
              } else if (r?.solved) {
                dotCls = 'border-[#D9820B] bg-[#FEF6E6] text-[#9A5B00]';
              }
              if (isCurrent) {
                dotCls = 'border-[#C83E2B] bg-[#C83E2B] text-white ring-2 ring-[#C83E2B]/25';
              }
              return (
                <button
                  key={q.id}
                  type="button"
                  disabled={!canJump}
                  onClick={() => {
                    if (!canJump) return;
                    onStopAudio();
                    setIndex(idx);
                  }}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-bold tabular-nums transition ${dotCls} ${
                    canJump ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                  title={`問${idx + 1}（元の問題番号：第${q.id}問）`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
