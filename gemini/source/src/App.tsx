import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Headphones,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  X,
  Layers,
  Send,
  AlertTriangle,
  Filter,
  Shuffle,
  ListOrdered,
} from 'lucide-react';
import {
  EXAM_INFO,
  PARTS_META,
  QUESTIONS,
  getTimelineAt,
} from './data/h11004';
import type {
  AppView,
  HskQuestion,
  PartId,
  PracticeScope,
  QuestionOrder,
  SectionId,
  StudyMode,
} from './types';
import { formatTime, useAudioController } from './hooks/useAudioController';
import { HomeView } from './components/HomeView';
import { FullAudioBar } from './components/AudioControls';
import { QuestionParts, RandomExamList } from './components/QuestionParts';
import { PracticeSession } from './components/PracticeSession';
import { AnswerSheet } from './components/AnswerSheet';
import { ScoreReport } from './components/ScoreReport';
import { VocabView } from './components/VocabView';

const STORAGE_KEY = 'hsk1_h11004_ja_exam_v2';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface PersistedExamState {
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  submitted: boolean;
  elapsedSeconds: number;
  examOrder: QuestionOrder;
}

function loadExamState(): PersistedExamState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('empty');
    const parsed = JSON.parse(raw);
    return {
      answers: parsed.answers || {},
      flagged: parsed.flagged || {},
      submitted: Boolean(parsed.submitted),
      elapsedSeconds: Number(parsed.elapsedSeconds) || 0,
      examOrder: parsed.examOrder === 'random' ? 'random' : 'sequential',
    };
  } catch {
    return {
      answers: {},
      flagged: {},
      submitted: false,
      elapsedSeconds: 0,
      examOrder: 'sequential',
    };
  }
}

export default function App() {
  const initial = useMemo(() => loadExamState(), []);

  const [view, setView] = useState<AppView>('home');
  const [mode, setMode] = useState<StudyMode>('practice');

  // Practice session state
  const [practiceOrder, setPracticeOrder] = useState<QuestionOrder>('sequential');
  const [practiceScope, setPracticeScope] = useState<PracticeScope>('all');
  const [practiceQuestions, setPracticeQuestions] = useState<HskQuestion[]>(QUESTIONS);
  const [practiceSessionKey, setPracticeSessionKey] = useState(1);

  // Exam session state
  const [examOrder, setExamOrder] = useState<QuestionOrder>(initial.examOrder);
  const [examListeningQs, setExamListeningQs] = useState<HskQuestion[]>(() =>
    QUESTIONS.filter((q) => q.section === 'listening')
  );
  const [examReadingQs, setExamReadingQs] = useState<HskQuestion[]>(() =>
    QUESTIONS.filter((q) => q.section === 'reading')
  );
  const [activePart, setActivePart] = useState<PartId>('L1');
  const [randomExamSection, setRandomExamSection] = useState<SectionId>('listening');
  const [answers, setAnswers] = useState<Record<number, string>>(initial.answers);
  const [flagged, setFlagged] = useState<Record<number, boolean>>(initial.flagged);
  const [submitted, setSubmitted] = useState<boolean>(initial.submitted);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(initial.elapsedSeconds);

  // Preferences
  const [showPinyin, setShowPinyin] = useState(true);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [autoFollowAudio, setAutoFollowAudio] = useState(true);

  // Overlays
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  const audio = useAudioController();
  const lastAutoQuestionRef = useRef<number | undefined>(undefined);

  // Persist exam state
  useEffect(() => {
    try {
      const payload: PersistedExamState = {
        answers,
        flagged,
        submitted,
        elapsedSeconds,
        examOrder,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore private browsing / quota errors
    }
  }, [answers, flagged, submitted, elapsedSeconds, examOrder]);

  // Exam timer tick
  useEffect(() => {
    if (view !== 'workspace' || mode !== 'exam' || submitted) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [view, mode, submitted]);

  // Stop audio on view change
  useEffect(() => {
    if (view !== 'workspace') {
      audio.stop();
    }
  }, [view, audio.stop]);

  // Live audio sync for sequential Exam Mode
  const timelineItem = useMemo(
    () => (audio.activeClipKey === 'full' ? getTimelineAt(audio.currentTime) : null),
    [audio.activeClipKey, audio.currentTime]
  );

  useEffect(() => {
    if (
      view !== 'workspace' ||
      mode !== 'exam' ||
      examOrder !== 'sequential' ||
      !autoFollowAudio ||
      audio.activeClipKey !== 'full' ||
      !audio.isPlaying ||
      !timelineItem
    ) {
      return;
    }

    if (
      timelineItem.part !== 'INTRO' &&
      timelineItem.part !== 'END' &&
      timelineItem.part !== activePart
    ) {
      setActivePart(timelineItem.part);
    }

    if (
      timelineItem.questionId &&
      timelineItem.questionId !== lastAutoQuestionRef.current
    ) {
      lastAutoQuestionRef.current = timelineItem.questionId;
      window.setTimeout(() => {
        const el = document.getElementById(`q-${timelineItem.questionId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 80);
    }
  }, [
    view,
    mode,
    examOrder,
    autoFollowAudio,
    audio.activeClipKey,
    audio.isPlaying,
    timelineItem,
    activePart,
  ]);

  // ESC closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
        setConfirmSubmitOpen(false);
        setMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const currentPartMeta = PARTS_META.find((p) => p.id === activePart)!;
  const currentPartIndex = PARTS_META.findIndex((p) => p.id === activePart);
  const currentPartQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.part === activePart),
    [activePart]
  );

  const examAnsweredCount = Object.keys(answers).length;
  const lastExamScore = useMemo(() => {
    if (!submitted) return null;
    const correct = QUESTIONS.filter((q) => answers[q.id] === q.answer).length;
    return correct * 5;
  }, [submitted, answers]);

  const examRemainingSeconds = Math.max(
    0,
    EXAM_INFO.examMinutes * 60 - elapsedSeconds
  );

  // Start Practice Mode (Sequential or Random, optional scope or specific IDs)
  const startPractice = (
    order: QuestionOrder,
    scope: PracticeScope,
    customIds?: number[]
  ) => {
    audio.stop();
    let pool = QUESTIONS;
    if (customIds && customIds.length > 0) {
      pool = QUESTIONS.filter((q) => customIds.includes(q.id));
    } else if (scope === 'listening') {
      pool = QUESTIONS.filter((q) => q.section === 'listening');
    } else if (scope === 'reading') {
      pool = QUESTIONS.filter((q) => q.section === 'reading');
    }

    const ordered = order === 'random' ? shuffleArray(pool) : [...pool];
    setPracticeOrder(order);
    setPracticeScope(scope);
    setPracticeQuestions(ordered);
    setPracticeSessionKey((k) => k + 1);
    setMode('practice');
    setView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Exam Mode (Sequential or Random)
  const startExam = (order: QuestionOrder, forceFresh = false) => {
    audio.stop();
    setOnlyWrong(false);
    setMode('exam');

    const baseListening = QUESTIONS.filter((q) => q.section === 'listening');
    const baseReading = QUESTIONS.filter((q) => q.section === 'reading');

    if (forceFresh || submitted || order !== examOrder) {
      setAnswers({});
      setFlagged({});
      setSubmitted(false);
      setElapsedSeconds(0);
      setActivePart('L1');
      setRandomExamSection('listening');
    }

    setExamOrder(order);
    if (order === 'random') {
      setExamListeningQs(shuffleArray(baseListening));
      setExamReadingQs(shuffleArray(baseReading));
    } else {
      setExamListeningQs(baseListening);
      setExamReadingQs(baseReading);
    }

    setView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (qId: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleToggleFlag = (qId: number) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleJumpToQuestion = (qId: number, part: PartId) => {
    const targetQ = QUESTIONS.find((q) => q.id === qId);
    if (examOrder === 'random' && targetQ) {
      setRandomExamSection(targetQ.section);
    } else {
      setActivePart(part);
    }
    setMobileSheetOpen(false);
    window.setTimeout(() => {
      const el = document.getElementById(`q-${qId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 90);
  };

  const handleRequestSubmit = () => {
    if (examAnsweredCount < QUESTIONS.length) {
      setConfirmSubmitOpen(true);
    } else {
      handleFinalizeSubmit();
    }
  };

  const handleFinalizeSubmit = () => {
    audio.stop();
    setSubmitted(true);
    setConfirmSubmitOpen(false);
    setMobileSheetOpen(false);
    setView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetExam = () => {
    audio.stop();
    setAnswers({});
    setFlagged({});
    setSubmitted(false);
    setElapsedSeconds(0);
    setOnlyWrong(false);
    setActivePart('L1');
    setRandomExamSection('listening');
  };

  // ==================== LIGHTBOX (SHARED ACROSS VIEWS) ====================
  const renderLightbox = () =>
    zoomedImage ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
        onClick={() => setZoomedImage(null)}
      >
        <div
          className="relative max-h-[85vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#1F2328]">{zoomedImage.alt}</span>
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="cursor-pointer rounded-lg p-1 text-[#555E6B] hover:bg-[#F3EFE8]"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center justify-center rounded-xl bg-[#FAF8F4] p-4">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="max-h-[70vh] w-auto min-w-[260px] object-contain"
            />
          </div>
        </div>
      </div>
    ) : null;

  // ==================== HOME VIEW ====================
  if (view === 'home') {
    return (
      <HomeView
        examAnsweredCount={examAnsweredCount}
        examSubmitted={submitted}
        lastExamScore={lastExamScore}
        onStartPractice={(ord, sc) => startPractice(ord, sc)}
        onStartExam={(ord) => startExam(ord)}
        onOpenVocab={() => setView('vocab')}
        onViewExamReport={() => setView('report')}
        onResetExam={handleResetExam}
      />
    );
  }

  // ==================== VOCAB VIEW ====================
  if (view === 'vocab') {
    return (
      <VocabView
        onBack={() => setView('home')}
        onPracticeQuestion={(qId) => startPractice('sequential', 'all', [qId])}
      />
    );
  }

  // ==================== SCORE REPORT VIEW ====================
  if (view === 'report') {
    return (
      <ScoreReport
        answers={answers}
        elapsedSeconds={elapsedSeconds}
        onReviewAll={() => {
          setOnlyWrong(false);
          setMode('exam');
          setActivePart('L1');
          setRandomExamSection('listening');
          setView('workspace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReviewWrong={() => {
          setOnlyWrong(true);
          setMode('exam');
          const firstWrong = QUESTIONS.find((q) => answers[q.id] !== q.answer);
          if (firstWrong) {
            setActivePart(firstWrong.part);
            setRandomExamSection(firstWrong.section);
          }
          setView('workspace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPracticeWrong={(wrongIds) => startPractice('random', 'all', wrongIds)}
        onRestartAll={() => startExam(examOrder, true)}
        onGoHome={() => setView('home')}
      />
    );
  }

  // ==================== PRACTICE MODE VIEW ====================
  if (mode === 'practice') {
    return (
      <>
        <PracticeSession
          key={practiceSessionKey}
          questions={practiceQuestions}
          order={practiceOrder}
          scope={practiceScope}
          showPinyin={showPinyin}
          onTogglePinyin={() => setShowPinyin((v) => !v)}
          activeClipKey={audio.activeClipKey}
          isPlaying={audio.isPlaying}
          clipProgress={audio.clipProgress}
          playbackRate={audio.playbackRate}
          audioError={audio.audioError}
          onToggleClip={audio.toggleClip}
          onChangeRate={audio.changeRate}
          onStopAudio={audio.stop}
          onZoomImage={(src, alt) => setZoomedImage({ src, alt })}
          onRestartPractice={(ord, sc, customIds) =>
            startPractice(ord, sc, customIds)
          }
          onGoExam={() => startExam('sequential', true)}
          onGoHome={() => setView('home')}
        />
        {renderLightbox()}
      </>
    );
  }

  // ==================== EXAM MODE VIEW ====================
  const isListeningSection =
    examOrder === 'sequential'
      ? currentPartMeta.section === 'listening'
      : randomExamSection === 'listening';

  return (
    <div className="paper-grain min-h-screen pb-20">
      {/* Sticky Top Control Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E6DFD1] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setView('home')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E6DFD1] bg-[#FAF8F4] px-2.5 py-1.5 text-xs font-semibold text-[#374151] transition hover:bg-[#F2ECE2]"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">トップ</span>
            </button>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-serif-ja text-base font-bold text-[#1F2328]">
                HSK 1級・H11004
              </span>
              <span className="rounded-md bg-[#1E3A5F] px-2 py-0.5 text-[11px] font-bold text-white">
                {submitted ? `解説確認・${lastExamScore}/200点` : '試験モード'}
              </span>
              <span className="hidden items-center gap-1 rounded-md bg-[#FAF8F4] px-2 py-0.5 text-[11px] font-semibold text-[#555E6B] ring-1 ring-[#E6DFD1] sm:inline-flex">
                {examOrder === 'random' ? (
                  <>
                    <Shuffle className="h-3 w-3 text-[#C83E2B]" />
                    ランダム順
                  </>
                ) : (
                  <>
                    <ListOrdered className="h-3 w-3 text-[#1E3A5F]" />
                    本番どおり順
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Pinyin Toggle */}
            <button
              type="button"
              onClick={() => setShowPinyin((v) => !v)}
              className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                showPinyin
                  ? 'border-[#1E3A5F]/40 bg-[#EEF4FA] text-[#1E3A5F]'
                  : 'border-[#E4DDD0] bg-white text-[#6B7280] hover:bg-[#FAF8F4]'
              }`}
            >
              ピンイン：{showPinyin ? '表示' : '非表示'}
            </button>

            {submitted && (
              <button
                type="button"
                onClick={() => setOnlyWrong((v) => !v)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  onlyWrong
                    ? 'border-[#C83E2B] bg-[#C83E2B] text-white'
                    : 'border-[#E4DDD0] bg-white text-[#555E6B] hover:bg-[#FAF8F4]'
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                不正解のみ
              </button>
            )}

            {/* Timer */}
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold tabular-nums ${
                !submitted && examRemainingSeconds <= 300
                  ? 'border-[#C83E2B]/40 bg-[#FDF2F0] text-[#C83E2B]'
                  : 'border-[#E6DFD1] bg-[#FAF8F4] text-[#374151]'
              }`}
              title="模擬試験残り時間（35分）"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>
                {!submitted
                  ? `残り ${formatTime(examRemainingSeconds)}`
                  : formatTime(elapsedSeconds)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setView('vocab')}
              className="hidden cursor-pointer items-center gap-1 rounded-lg border border-[#E4DDD0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#2E7D5B] hover:bg-[#EDF7F2] lg:inline-flex"
            >
              <Layers className="h-3.5 w-3.5" />
              単語カード
            </button>

            <button
              type="button"
              onClick={() => setMobileSheetOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#E4DDD0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1F2328] xl:hidden"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              {examAnsweredCount}/40
            </button>

            {submitted ? (
              <button
                type="button"
                onClick={() => setView('report')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1E3A5F] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#162C49]"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                成績レポート
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequestSubmit}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#C83E2B] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#AE3221]"
              >
                <Send className="h-3.5 w-3.5" />
                採点・提出
              </button>
            )}
          </div>
        </div>

        {/* Navigation Strip: 8 parts (Sequential) OR 2 sections (Random) */}
        <div className="border-t border-[#F0EAE0] bg-[#FCFBF8]">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-2 sm:px-6">
            {examOrder === 'sequential' ? (
              PARTS_META.map((p) => {
                const pQs = QUESTIONS.filter((q) => q.part === p.id);
                const pDone = pQs.filter((q) => Boolean(answers[q.id])).length;
                const isActive = p.id === activePart;
                const isList = p.section === 'listening';

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePart(p.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? isList
                          ? 'border-[#C83E2B] bg-[#C83E2B] text-white shadow-xs'
                          : 'border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-xs'
                        : 'border-[#E6DFD1] bg-white text-[#4B5563] hover:border-[#C8C0B2] hover:text-[#1F2328]'
                    }`}
                  >
                    {isList ? (
                      <Headphones className="h-3.5 w-3.5 opacity-80" />
                    ) : (
                      <BookOpen className="h-3.5 w-3.5 opacity-80" />
                    )}
                    <span>{p.shortLabelJa}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : pDone === pQs.length
                          ? 'bg-[#E9F6EF] text-[#2E7D5B]'
                          : 'bg-[#F4EFE6] text-[#736B5E]'
                      }`}
                    >
                      {pDone}/{pQs.length}
                    </span>
                  </button>
                );
              })
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setRandomExamSection('listening');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-bold transition ${
                    randomExamSection === 'listening'
                      ? 'border-[#C83E2B] bg-[#C83E2B] text-white'
                      : 'border-[#E6DFD1] bg-white text-[#4B5563]'
                  }`}
                >
                  <Headphones className="h-3.5 w-3.5" />
                  リスニング（ランダム20問）
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRandomExamSection('reading');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-bold transition ${
                    randomExamSection === 'reading'
                      ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                      : 'border-[#E6DFD1] bg-white text-[#4B5563]'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  リーディング（ランダム20問）
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Exam Body + Sticky Right Answer Sheet */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-9">
            {/* Full Continuous Audio Bar (Sequential Listening) */}
            {examOrder === 'sequential' && isListeningSection && (
              <FullAudioBar
                isPlaying={audio.isPlaying && audio.activeClipKey === 'full'}
                currentTime={audio.currentTime}
                duration={audio.duration}
                playbackRate={audio.playbackRate}
                autoFollow={autoFollowAudio}
                audioError={audio.audioError}
                onToggleAutoFollow={() => setAutoFollowAudio((v) => !v)}
                onToggleFull={audio.toggleFull}
                onPlayFrom={audio.playFullFrom}
                onSeek={audio.seekFull}
                onChangeRate={audio.changeRate}
                onJumpPart={(p) => setActivePart(p)}
              />
            )}

            {examOrder === 'sequential' ? (
              <>
                <div className="rounded-2xl border border-[#E6DFD1] bg-white px-5 py-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-white ${
                          isListeningSection ? 'bg-[#C83E2B]' : 'bg-[#1E3A5F]'
                        }`}
                      >
                        {currentPartMeta.section === 'listening' ? 'リスニング' : 'リーディング'}
                      </span>
                      <h2 className="font-serif-ja text-lg font-bold text-[#1F2328] sm:text-xl">
                        {currentPartMeta.titleJa}：{currentPartMeta.subtitleJa}
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-[#847B6D]">
                      各5点・計25点
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#4B5563]">
                    {currentPartMeta.instructionJa}
                  </p>
                </div>

                <QuestionParts
                  partId={activePart}
                  questions={currentPartQuestions}
                  answers={answers}
                  flagged={flagged}
                  submitted={submitted}
                  showPinyin={showPinyin}
                  onlyWrong={onlyWrong}
                  activeTimelineQuestionId={timelineItem?.questionId}
                  activeClipKey={audio.activeClipKey}
                  isPlaying={audio.isPlaying}
                  clipProgress={audio.clipProgress}
                  onSelectAnswer={handleSelectAnswer}
                  onToggleFlag={handleToggleFlag}
                  onToggleClip={audio.toggleClip}
                  onZoomImage={(src, alt) => setZoomedImage({ src, alt })}
                />

                {/* Bottom Part Navigation */}
                <div className="flex items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    disabled={currentPartIndex === 0}
                    onClick={() => {
                      const prev = PARTS_META[currentPartIndex - 1];
                      if (prev) {
                        setActivePart(prev.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E4DDD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2328] shadow-xs transition hover:bg-[#FAF8F4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    前のパート
                  </button>

                  {currentPartIndex < PARTS_META.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const next = PARTS_META[currentPartIndex + 1];
                        if (next) {
                          setActivePart(next.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#162C49]"
                    >
                      <span>
                        次のパート（{PARTS_META[currentPartIndex + 1].shortLabelJa}）
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : submitted ? (
                    <button
                      type="button"
                      onClick={() => setView('report')}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#2E7D5B] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#236348]"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      成績レポートを見る
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestSubmit}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#C83E2B] px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#AE3221]"
                    >
                      <Send className="h-4 w-4" />
                      完了して採点する
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* RANDOM-ORDER EXAM SECTION */
              <>
                <div className="rounded-2xl border border-[#E6DFD1] bg-white px-5 py-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-serif-ja text-lg font-bold text-[#1F2328]">
                      {randomExamSection === 'listening'
                        ? 'リスニング試験（ランダム出題・全20問）'
                        : 'リーディング試験（ランダム出題・全20問）'}
                    </h2>
                    {randomExamSection === 'listening' && (
                      <div className="inline-flex items-center rounded-lg border border-[#E4DDD0] bg-[#FAF8F4] p-0.5 text-xs">
                        {[0.75, 1.0, 1.25].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => audio.changeRate(r)}
                            className={`cursor-pointer rounded-md px-2 py-1 font-semibold ${
                              audio.playbackRate === r
                                ? 'bg-white text-[#C83E2B] shadow-xs'
                                : 'text-[#6B7280]'
                            }`}
                          >
                            {r}倍速
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-[#6B7280]">
                    {randomExamSection === 'listening'
                      ? '各問題の「音声を再生」ボタンを押してリスニングし、解答を選択してください。提出後に採点と日本語解説が表示されます。'
                      : 'すべての問題に解答し終わったら、右の「採点・提出する」ボタンを押してください。'}
                  </p>
                </div>

                <RandomExamList
                  questions={
                    randomExamSection === 'listening'
                      ? examListeningQs
                      : examReadingQs
                  }
                  answers={answers}
                  flagged={flagged}
                  submitted={submitted}
                  showPinyin={showPinyin}
                  onlyWrong={onlyWrong}
                  activeClipKey={audio.activeClipKey}
                  isPlaying={audio.isPlaying}
                  clipProgress={audio.clipProgress}
                  onSelectAnswer={handleSelectAnswer}
                  onToggleFlag={handleToggleFlag}
                  onToggleClip={audio.toggleClip}
                  onZoomImage={(src, alt) => setZoomedImage({ src, alt })}
                />

                <div className="flex justify-end pt-3">
                  {randomExamSection === 'listening' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setRandomExamSection('reading');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#162C49]"
                    >
                      リーディング問題へ進む
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : !submitted ? (
                    <button
                      type="button"
                      onClick={handleRequestSubmit}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#C83E2B] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#AE3221]"
                    >
                      <Send className="h-4 w-4" />
                      完了して採点する
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {/* Right Sticky Answer Sheet */}
          <div className="hidden xl:col-span-3 xl:block">
            <div className="sticky top-32">
              <AnswerSheet
                listeningQuestions={examListeningQs}
                readingQuestions={examReadingQs}
                answers={answers}
                flagged={flagged}
                submitted={submitted}
                examOrder={examOrder}
                activePart={activePart}
                activeTimelineQuestionId={timelineItem?.questionId}
                onJumpToQuestion={handleJumpToQuestion}
                onSubmit={handleRequestSubmit}
                onViewReport={() => setView('report')}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Answer Sheet Drawer */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs xl:hidden">
          <div className="relative h-full w-full max-w-xs overflow-y-auto bg-[#FAF8F4] p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-[#1F2328]">解答シート</span>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-[#555E6B] hover:bg-[#EAE4D9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AnswerSheet
              listeningQuestions={examListeningQs}
              readingQuestions={examReadingQs}
              answers={answers}
              flagged={flagged}
              submitted={submitted}
              examOrder={examOrder}
              activePart={activePart}
              activeTimelineQuestionId={timelineItem?.questionId}
              onJumpToQuestion={handleJumpToQuestion}
              onSubmit={handleRequestSubmit}
              onViewReport={() => {
                setMobileSheetOpen(false);
                setView('report');
              }}
            />
          </div>
        </div>
      )}

      {/* Confirm Submit Modal */}
      {confirmSubmitOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs"
          onClick={() => setConfirmSubmitOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E6DFD1] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FEF3DC] text-[#B56A00]">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1F2328]">採点して提出しますか？</h3>
                <p className="mt-1 text-sm text-[#57606A]">
                  現在 <strong className="text-[#1F2328]">{examAnsweredCount}</strong> / 40 問解答済みです（未解答{' '}
                  <strong className="text-[#C83E2B]">{40 - examAnsweredCount}</strong> 問）。提出するとすぐに採点結果と全問の日本語解説が表示されます。
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="cursor-pointer rounded-xl border border-[#DFD8CA] bg-white px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#FAF8F4]"
              >
                解答を続ける
              </button>
              <button
                type="button"
                onClick={handleFinalizeSubmit}
                className="cursor-pointer rounded-xl bg-[#C83E2B] px-5 py-2 text-sm font-bold text-white hover:bg-[#AE3221]"
              >
                採点・提出する
              </button>
            </div>
          </div>
        </div>
      )}

      {renderLightbox()}
    </div>
  );
}
