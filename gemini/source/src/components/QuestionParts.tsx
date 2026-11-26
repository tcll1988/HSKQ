import React, { useState } from 'react';
import {
  Check,
  X,
  Flag,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Volume2,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import type {
  AudioSegment,
  HskQuestion,
  ListeningPart1Question,
  ListeningPart2Question,
  ListeningPart3Question,
  ListeningPart4Question,
  PartId,
  ReadingPart1Question,
  ReadingPart2Question,
  ReadingPart3Question,
  ReadingPart4Question,
} from '../types';
import {
  L3_IMAGES,
  PART_EXAMPLES,
  PARTS_META,
  R2_IMAGES,
  R3_RESPONSES,
  R4_WORD_BANK,
} from '../data/h11004';
import { RubyText } from './RubyText';
import { ClipPlayButton } from './AudioControls';

export interface PartRendererProps {
  partId: PartId;
  questions: HskQuestion[];
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  submitted: boolean;
  showPinyin: boolean;
  onlyWrong: boolean;
  activeTimelineQuestionId?: number;
  activeClipKey: string | null;
  isPlaying: boolean;
  clipProgress: number;
  onSelectAnswer: (qId: number, value: string) => void;
  onToggleFlag: (qId: number) => void;
  onToggleClip: (key: string, seg: AudioSegment) => void;
  onZoomImage: (src: string, alt: string) => void;
}

const LETTERS_AF = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

function formatAnsJa(q: HskQuestion, val?: string): string {
  if (!val) return '未解答';
  if (q.part === 'L1' || q.part === 'R1') {
    if (val === 'T') return '◯ 正しい';
    if (val === 'F') return '× 誤り';
  }
  if (q.part === 'R4') {
    const w = R4_WORD_BANK.find((item) => item.label === val);
    return w ? `${val}（${w.hanzi}）` : val;
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
}

const ExamFeedbackBox: React.FC<{
  q: HskQuestion;
  userAns?: string;
  showPinyin: boolean;
}> = ({ q, userAns, showPinyin }) => {
  const isCorrect = userAns === q.answer;
  const isListening = q.section === 'listening';

  return (
    <div className="mt-4 space-y-2.5 border-t border-[#F0EAE0] pt-3.5">
      {isListening && q.transcript && (
        <div className="rounded-xl border border-[#E5ECF4] bg-[#F7FAFD] px-4 py-3">
          <div className="mb-1.5 flex items-center gap-1 text-[11px] font-bold text-[#1E3A5F]">
            <Volume2 className="h-3.5 w-3.5" />
            リスニング原文（中国語スクリプト）
          </div>
          <div className="space-y-2">
            {q.transcript.map((line, idx) => (
              <div key={idx} className="flex items-end gap-2 text-base text-[#1F2328]">
                {line.speaker && (
                  <span className="mb-0.5 shrink-0 rounded bg-[#1E3A5F]/10 px-1.5 py-0.5 text-xs font-bold text-[#1E3A5F]">
                    {line.speaker}
                  </span>
                )}
                <RubyText tokens={line.tokens} showPinyin={showPinyin} />
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-[#E5ECF4] pt-1.5 text-xs text-[#455568]">
            日本語訳：{q.translationJa}
          </div>
        </div>
      )}

      <div
        className={`rounded-xl border px-4 py-3 ${
          !userAns
            ? 'border-[#E6D5B8] bg-[#FDF9F0]'
            : isCorrect
            ? 'border-[#B8DEC9] bg-[#F2FAF5]'
            : 'border-[#F0C2BC] bg-[#FEF5F4]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold">
            {!userAns ? (
              <span className="text-[#9A6324]">未解答</span>
            ) : isCorrect ? (
              <span className="inline-flex items-center gap-1 text-[#2E7D5B]">
                <CheckCircle2 className="h-4 w-4" />
                正解
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#C83E2B]">
                <XCircle className="h-4 w-4" />
                不正解（あなたの解答：{formatAnsJa(q, userAns)}）
              </span>
            )}
          </div>
          <span className="rounded-md bg-white px-2.5 py-0.5 text-xs font-bold text-[#1F2328] ring-1 ring-black/5">
            正解：{formatAnsJa(q, q.answer)}
          </span>
        </div>

        {!isListening && (
          <p className="mt-2 text-xs font-semibold text-[#555E6B]">
            日本語訳：{q.translationJa}
          </p>
        )}
        <div className="mt-2 text-xs font-bold text-[#1E3A5F]">
          なぜこれが正解？（詳しい日本語解説）
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[#2D333B]">{q.explanationJa}</p>
        {q.tipJa && (
          <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-white/80 px-3 py-2 text-xs text-[#6B4E1B] ring-1 ring-[#EFE2C0]">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C4820E]" />
            <span>{q.tipJa}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const QuestionParts: React.FC<PartRendererProps> = ({
  partId,
  questions,
  answers,
  flagged,
  submitted,
  showPinyin,
  onlyWrong,
  activeTimelineQuestionId,
  activeClipKey,
  isPlaying,
  clipProgress,
  onSelectAnswer,
  onToggleFlag,
  onToggleClip,
  onZoomImage,
}) => {
  const [showExample, setShowExample] = useState(true);

  const visibleQuestions =
    onlyWrong && submitted
      ? questions.filter((q) => answers[q.id] !== q.answer)
      : questions;

  const usedLettersMap: Record<string, number[]> = {};
  if (partId === 'L3' || partId === 'R2' || partId === 'R3' || partId === 'R4') {
    for (const q of questions) {
      const a = answers[q.id];
      if (a) {
        if (!usedLettersMap[a]) usedLettersMap[a] = [];
        usedLettersMap[a].push(q.id);
      }
    }
  }

  const renderQuestionHeader = (q: HskQuestion) => {
    const isLive = activeTimelineQuestionId === q.id && isPlaying;
    const isFlagged = !!flagged[q.id];
    return (
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-bold tabular-nums transition ${
              isLive
                ? 'bg-[#C83E2B] text-white ring-4 ring-[#C83E2B]/20'
                : 'bg-[#F4EFE6] text-[#1F2328]'
            }`}
          >
            {q.id}
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F0] px-2.5 py-0.5 text-xs font-semibold text-[#C83E2B]">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#C83E2B]" />
              再生中の問題
            </span>
          )}
          {q.audio && (
            <ClipPlayButton
              clipKey={`exam-q-${q.id}`}
              segment={q.audio}
              activeClipKey={activeClipKey}
              isPlaying={isPlaying}
              clipProgress={clipProgress}
              onToggle={onToggleClip}
              label={`第${q.id}問を再生`}
              compact
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleFlag(q.id)}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
            isFlagged
              ? 'bg-[#FEF3DC] text-[#B56A00]'
              : 'text-[#8C8476] hover:bg-[#F5F1E9] hover:text-[#4B5563]'
          }`}
          title="後で見直すためにフラグを付ける"
        >
          <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'fill-current' : ''}`} />
          <span>{isFlagged ? '見直し中' : '見直し'}</span>
        </button>
      </div>
    );
  };

  const renderExampleAccordion = (content: React.ReactNode) => (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#E6DFD1] bg-[#FCFBF8]">
      <button
        type="button"
        onClick={() => setShowExample((s) => !s)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition hover:bg-[#F6F2EA]"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#555E6B]">
          <BookOpenCheck className="h-4 w-4 text-[#9A6324]" />
          <span>公式例題（例えば）</span>
        </div>
        {showExample ? (
          <ChevronUp className="h-4 w-4 text-[#847B6D]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#847B6D]" />
        )}
      </button>
      {showExample && (
        <div className="border-t border-[#EFEAE0] bg-white px-4 py-4">{content}</div>
      )}
    </div>
  );

  if (onlyWrong && submitted && visibleQuestions.length === 0) {
    return (
      <div className="rounded-2xl border border-[#B8DEC9] bg-[#F2FAF5] p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#2E7D5B]" />
        <h4 className="mt-3 text-lg font-bold text-[#1F5D42]">このパートは全問正解です！</h4>
        <p className="mt-1 text-sm text-[#3F6F58]">
          間違いはありませんでした。他のパートも確認してみましょう。
        </p>
      </div>
    );
  }

  // ==================== PART L1 ====================
  if (partId === 'L1') {
    const qs = visibleQuestions as ListeningPart1Question[];
    return (
      <div>
        {renderExampleAccordion(
          <div className="grid gap-3 sm:grid-cols-2">
            {PART_EXAMPLES.L1.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#EFEAE0] bg-[#FCFBF8] p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ex.image}
                    alt={ex.alt}
                    className="h-16 w-16 rounded-lg border border-[#EAE4D9] bg-white object-contain p-1"
                  />
                  <div>
                    <div lang="zh-CN" className="font-zh text-sm font-bold text-[#1F2328]">
                      音声：「{ex.transcript}」
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {ex.pinyin}（{ex.translationJa}）
                    </div>
                    <div className="mt-1.5">
                      <ClipPlayButton
                        clipKey={`ex-L1-${i}`}
                        segment={ex.audio}
                        activeClipKey={activeClipKey}
                        isPlaying={isPlaying}
                        clipProgress={clipProgress}
                        onToggle={onToggleClip}
                        label="例題を聞く"
                        compact
                      />
                    </div>
                  </div>
                </div>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    ex.answer === 'T'
                      ? 'bg-[#E9F6EF] text-[#2E7D5B]'
                      : 'bg-[#FDF0EE] text-[#C83E2B]'
                  }`}
                >
                  {ex.answer === 'T' ? '◯' : '×'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {qs.map((q) => {
            const selected = answers[q.id];
            const isLive = activeTimelineQuestionId === q.id && isPlaying;
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className={`scroll-mt-28 rounded-2xl border bg-white p-5 shadow-xs transition ${
                  isLive
                    ? 'border-[#C83E2B] ring-2 ring-[#C83E2B]/15'
                    : 'border-[#E6DFD1]'
                }`}
              >
                {renderQuestionHeader(q)}
                <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onZoomImage(q.image, `第${q.id}問イラスト`)}
                    className="group relative flex h-40 w-48 cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-[#ECE6DA] bg-white p-2 transition hover:border-[#C83E2B]/40"
                    title="クリックして拡大"
                  >
                    <img
                      src={q.image}
                      alt={`第${q.id}問のイラスト`}
                      className="max-h-full max-w-full object-contain"
                    />
                    <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/55 p-1 text-white opacity-0 transition group-hover:opacity-100">
                      <ZoomIn className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <div className="flex w-full flex-1 justify-center gap-3 sm:justify-end">
                    {(['T', 'F'] as const).map((val) => {
                      const isPicked = selected === val;
                      const isRightChoice = submitted && q.answer === val;
                      const isWrongPicked = submitted && isPicked && q.answer !== val;

                      let btnStyle =
                        'border-[#DFD8CA] bg-[#FCFBF8] text-[#2B303A] hover:border-[#1E3A5F] hover:bg-white';
                      if (isRightChoice) {
                        btnStyle = 'border-[#2E7D5B] bg-[#2E7D5B] text-white shadow-sm';
                      } else if (isWrongPicked) {
                        btnStyle = 'border-[#C83E2B] bg-[#C83E2B] text-white shadow-sm';
                      } else if (isPicked) {
                        btnStyle = 'border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-sm';
                      }

                      return (
                        <button
                          key={val}
                          type="button"
                          disabled={submitted}
                          onClick={() => onSelectAnswer(q.id, val)}
                          className={`flex h-16 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 text-base font-bold transition sm:max-w-[155px] disabled:cursor-default ${btnStyle}`}
                        >
                          {val === 'T' ? (
                            <>
                              <Check className="h-5 w-5 stroke-[2.5]" />
                              <span>正しい</span>
                            </>
                          ) : (
                            <>
                              <X className="h-5 w-5 stroke-[2.5]" />
                              <span>誤り</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART L2 ====================
  if (partId === 'L2') {
    const qs = visibleQuestions as ListeningPart2Question[];
    return (
      <div>
        {renderExampleAccordion(
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-[#1F2328]">
                <span lang="zh-CN" className="font-zh font-bold">
                  音声：「{PART_EXAMPLES.L2.transcript}」
                </span>{' '}
                <span className="text-xs text-[#6B7280]">
                  ({PART_EXAMPLES.L2.pinyin} / {PART_EXAMPLES.L2.translationJa})
                </span>
                <span className="ml-2 rounded bg-[#E9F6EF] px-2 py-0.5 text-xs font-bold text-[#2E7D5B]">
                  正解：A
                </span>
              </div>
              <ClipPlayButton
                clipKey="ex-L2"
                segment={PART_EXAMPLES.L2.audio}
                activeClipKey={activeClipKey}
                isPlaying={isPlaying}
                clipProgress={clipProgress}
                onToggle={onToggleClip}
                label="例題を聞く"
                compact
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PART_EXAMPLES.L2.options.map((opt) => (
                <div
                  key={opt.label}
                  className={`flex flex-col items-center rounded-xl border p-2.5 ${
                    opt.label === PART_EXAMPLES.L2.answer
                      ? 'border-[#2E7D5B] bg-[#F2FAF5]'
                      : 'border-[#EFEAE0] bg-[#FCFBF8]'
                  }`}
                >
                  <img src={opt.image} alt={opt.alt} className="h-24 object-contain" />
                  <span className="mt-1.5 text-xs font-bold text-[#1F2328]">
                    {opt.label} {opt.label === 'A' ? '◯' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {qs.map((q) => {
            const selected = answers[q.id];
            const isLive = activeTimelineQuestionId === q.id && isPlaying;
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className={`scroll-mt-28 rounded-2xl border bg-white p-5 shadow-xs transition ${
                  isLive
                    ? 'border-[#C83E2B] ring-2 ring-[#C83E2B]/15'
                    : 'border-[#E6DFD1]'
                }`}
              >
                {renderQuestionHeader(q)}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {q.options.map((opt) => {
                    const isPicked = selected === opt.label;
                    const isRightChoice = submitted && q.answer === opt.label;
                    const isWrongPicked = submitted && isPicked && q.answer !== opt.label;

                    let cardCls =
                      'border-[#E6DFD1] bg-[#FCFBF8] hover:border-[#1E3A5F]/60 hover:bg-white';
                    let badgeCls = 'bg-[#EFEAE0] text-[#4B5563]';

                    if (isRightChoice) {
                      cardCls = 'border-[#2E7D5B] bg-[#F2FAF5] ring-2 ring-[#2E7D5B]/20';
                      badgeCls = 'bg-[#2E7D5B] text-white';
                    } else if (isWrongPicked) {
                      cardCls = 'border-[#C83E2B] bg-[#FEF5F4] ring-2 ring-[#C83E2B]/20';
                      badgeCls = 'bg-[#C83E2B] text-white';
                    } else if (isPicked) {
                      cardCls = 'border-[#1E3A5F] bg-[#F0F5FA] ring-2 ring-[#1E3A5F]/20';
                      badgeCls = 'bg-[#1E3A5F] text-white';
                    }

                    return (
                      <div
                        key={opt.label}
                        className={`relative flex flex-col overflow-hidden rounded-xl border-2 transition ${cardCls}`}
                      >
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => onSelectAnswer(q.id, opt.label)}
                          className="flex flex-1 cursor-pointer flex-col items-center p-3 disabled:cursor-default"
                        >
                          <div className="flex h-36 w-full items-center justify-center rounded-lg bg-white p-2">
                            <img
                              src={opt.image}
                              alt={opt.alt}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="mt-2.5 flex items-center gap-2">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition ${badgeCls}`}
                            >
                              {opt.label}
                            </span>
                            {isRightChoice && (
                              <span className="text-xs font-bold text-[#2E7D5B]">正解</span>
                            )}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => onZoomImage(opt.image, `第${q.id}問 選択肢 ${opt.label}`)}
                          className="absolute right-2 top-2 cursor-zoom-in rounded-md bg-white/90 p-1.5 text-[#555E6B] shadow-xs ring-1 ring-black/10 hover:text-[#1F2328]"
                          title="拡大表示"
                        >
                          <ZoomIn className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART L3 ====================
  if (partId === 'L3') {
    const qs = visibleQuestions as ListeningPart3Question[];
    return (
      <div>
        <div className="mb-6 rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#1F2328]">
              共通イラスト選択肢（A〜F・クリックで拡大）
            </h4>
            <span className="text-xs text-[#847B6D]">
              例題で C を使用済み／残り5枚が第11〜15問に対応
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {L3_IMAGES.map((item) => {
              const usedBy = usedLettersMap[item.label] || [];
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onZoomImage(item.image, `聴力第3部 イラスト ${item.label}`)}
                  className={`relative flex cursor-zoom-in flex-col items-center rounded-xl border p-2.5 transition ${
                    item.isExample
                      ? 'border-dashed border-[#D8CEBC] bg-[#FAF8F4] opacity-75'
                      : usedBy.length > 0
                      ? 'border-[#1E3A5F]/40 bg-[#F7FAFD]'
                      : 'border-[#ECE6DA] bg-white hover:border-[#C83E2B]/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between pb-1">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                        item.isExample
                          ? 'bg-[#E6DFD1] text-[#6B7280]'
                          : 'bg-[#1E3A5F] text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.isExample ? (
                      <span className="rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-semibold text-[#736B5E]">
                        例題済
                      </span>
                    ) : usedBy.length > 0 ? (
                      <span className="rounded bg-[#EEF4FA] px-1.5 py-0.5 text-[10px] font-semibold text-[#1E3A5F]">
                        選択中：第{usedBy.join(',')}問
                      </span>
                    ) : null}
                  </div>
                  <div className="flex h-28 w-full items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {renderExampleAccordion(
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1.5">
              {PART_EXAMPLES.L3.lines.map((l, idx) => (
                <div key={idx} className="flex items-end gap-2 text-sm">
                  <span className="rounded bg-[#F4EFE6] px-1.5 py-0.5 text-xs font-bold text-[#555E6B]">
                    {l.speaker}
                  </span>
                  <RubyText tokens={l.tokens} showPinyin={showPinyin} />
                </div>
              ))}
              <div className="text-xs text-[#6B7280]">{PART_EXAMPLES.L3.translationJa}</div>
            </div>
            <div className="flex items-center gap-3">
              <ClipPlayButton
                clipKey="ex-L3"
                segment={PART_EXAMPLES.L3.audio}
                activeClipKey={activeClipKey}
                isPlaying={isPlaying}
                clipProgress={clipProgress}
                onToggle={onToggleClip}
                label="例題を聞く"
                compact
              />
              <span className="rounded-lg bg-[#E9F6EF] px-3 py-1.5 text-sm font-bold text-[#2E7D5B]">
                正解：C
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {qs.map((q) => {
            const selected = answers[q.id];
            const isLive = activeTimelineQuestionId === q.id && isPlaying;
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className={`scroll-mt-28 rounded-2xl border bg-white p-5 shadow-xs transition ${
                  isLive
                    ? 'border-[#C83E2B] ring-2 ring-[#C83E2B]/15'
                    : 'border-[#E6DFD1]'
                }`}
              >
                {renderQuestionHeader(q)}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[#6B7280]">
                    第{q.id}問の会話を聞き、合うイラストの記号を選んでください：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {LETTERS_AF.map((letter) => {
                      const isEx = letter === 'C';
                      const isPicked = selected === letter;
                      const isRightChoice = submitted && q.answer === letter;
                      const isWrongPicked = submitted && isPicked && q.answer !== letter;
                      const usedElsewhere = (usedLettersMap[letter] || []).some(
                        (id) => id !== q.id
                      );

                      let cls =
                        'border-[#DFD8CA] bg-[#FCFBF8] text-[#1F2328] hover:border-[#1E3A5F]';
                      if (isEx) {
                        cls = 'border-dashed border-[#E2DACB] bg-[#F7F4EE] text-[#B0A899]';
                      }
                      if (isRightChoice) {
                        cls = 'border-[#2E7D5B] bg-[#2E7D5B] text-white';
                      } else if (isWrongPicked) {
                        cls = 'border-[#C83E2B] bg-[#C83E2B] text-white';
                      } else if (isPicked) {
                        cls = 'border-[#1E3A5F] bg-[#1E3A5F] text-white';
                      } else if (usedElsewhere && !isEx) {
                        cls =
                          'border-[#DCE4EE] bg-[#F5F8FC] text-[#8396AE] hover:border-[#1E3A5F] hover:text-[#1E3A5F]';
                      }

                      return (
                        <button
                          key={letter}
                          type="button"
                          disabled={submitted || isEx}
                          onClick={() => onSelectAnswer(q.id, letter)}
                          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-2 text-sm font-bold transition disabled:cursor-default ${cls}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART L4 ====================
  if (partId === 'L4') {
    const qs = visibleQuestions as ListeningPart4Question[];
    return (
      <div>
        {renderExampleAccordion(
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1.5 text-sm">
                <div>
                  <RubyText tokens={PART_EXAMPLES.L4.statement} showPinyin={showPinyin} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="rounded bg-[#FDF2F0] px-1.5 py-0.5 text-xs font-bold text-[#C83E2B]">
                    問
                  </span>
                  <RubyText tokens={PART_EXAMPLES.L4.question} showPinyin={showPinyin} />
                </div>
                <div className="text-xs text-[#6B7280]">{PART_EXAMPLES.L4.translationJa}</div>
              </div>
              <ClipPlayButton
                clipKey="ex-L4"
                segment={PART_EXAMPLES.L4.audio}
                activeClipKey={activeClipKey}
                isPlaying={isPlaying}
                clipProgress={clipProgress}
                onToggle={onToggleClip}
                label="例題を聞く"
                compact
              />
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {PART_EXAMPLES.L4.options.map((opt) => (
                <div
                  key={opt.label}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                    opt.label === PART_EXAMPLES.L4.answer
                      ? 'border-[#2E7D5B] bg-[#F2FAF5]'
                      : 'border-[#EFEAE0] bg-[#FCFBF8]'
                  }`}
                >
                  <span className="font-bold text-[#1F2328]">{opt.label}</span>
                  <RubyText tokens={opt.tokens} showPinyin={showPinyin} className="text-sm" />
                  {opt.label === PART_EXAMPLES.L4.answer && (
                    <span className="ml-auto font-bold text-[#2E7D5B]">◯</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {qs.map((q) => {
            const selected = answers[q.id];
            const isLive = activeTimelineQuestionId === q.id && isPlaying;
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className={`scroll-mt-28 rounded-2xl border bg-white p-5 shadow-xs transition ${
                  isLive
                    ? 'border-[#C83E2B] ring-2 ring-[#C83E2B]/15'
                    : 'border-[#E6DFD1]'
                }`}
              >
                {renderQuestionHeader(q)}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {q.options.map((opt) => {
                    const isPicked = selected === opt.label;
                    const isRightChoice = submitted && q.answer === opt.label;
                    const isWrongPicked = submitted && isPicked && q.answer !== opt.label;

                    let cls =
                      'border-[#E4DDD0] bg-[#FCFBF8] hover:border-[#1E3A5F] hover:bg-white';
                    let badge = 'bg-[#EFEAE0] text-[#4B5563]';
                    if (isRightChoice) {
                      cls = 'border-[#2E7D5B] bg-[#F2FAF5] ring-2 ring-[#2E7D5B]/15';
                      badge = 'bg-[#2E7D5B] text-white';
                    } else if (isWrongPicked) {
                      cls = 'border-[#C83E2B] bg-[#FEF5F4] ring-2 ring-[#C83E2B]/15';
                      badge = 'bg-[#C83E2B] text-white';
                    } else if (isPicked) {
                      cls = 'border-[#1E3A5F] bg-[#F0F5FA] ring-2 ring-[#1E3A5F]/15';
                      badge = 'bg-[#1E3A5F] text-white';
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={submitted}
                        onClick={() => onSelectAnswer(q.id, opt.label)}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition disabled:cursor-default ${cls}`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badge}`}
                        >
                          {opt.label}
                        </span>
                        <div>
                          <RubyText
                            tokens={opt.tokens}
                            showPinyin={showPinyin}
                            className="text-lg font-medium text-[#1F2328]"
                          />
                          {submitted && (
                            <div className="text-[11px] text-[#6B7280]">{opt.meaningJa}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART R1 ====================
  if (partId === 'R1') {
    const qs = visibleQuestions as ReadingPart1Question[];
    return (
      <div>
        {renderExampleAccordion(
          <div className="grid gap-3 sm:grid-cols-2">
            {PART_EXAMPLES.R1.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#EFEAE0] bg-[#FCFBF8] p-3"
              >
                <img
                  src={ex.image}
                  alt={ex.alt}
                  className="h-16 w-20 rounded-lg border border-[#EAE4D9] bg-white object-contain p-1"
                />
                <div className="text-center">
                  <RubyText
                    tokens={ex.wordTokens}
                    showPinyin={showPinyin}
                    className="text-xl font-bold text-[#1F2328]"
                  />
                  <div className="mt-0.5 text-[11px] text-[#736B5E]">{ex.noteJa}</div>
                </div>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    ex.answer === 'T'
                      ? 'bg-[#E9F6EF] text-[#2E7D5B]'
                      : 'bg-[#FDF0EE] text-[#C83E2B]'
                  }`}
                >
                  {ex.answer === 'T' ? '◯' : '×'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {qs.map((q) => {
            const selected = answers[q.id];
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className="scroll-mt-28 rounded-2xl border border-[#E6DFD1] bg-white p-5 shadow-xs"
              >
                {renderQuestionHeader(q)}
                <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-12">
                  <div className="flex justify-center sm:col-span-4">
                    <button
                      type="button"
                      onClick={() => onZoomImage(q.image, `第${q.id}問イラスト`)}
                      className="group relative flex h-36 w-44 cursor-zoom-in items-center justify-center rounded-xl border border-[#ECE6DA] bg-white p-2 hover:border-[#1E3A5F]/50"
                    >
                      <img
                        src={q.image}
                        alt={`第${q.id}問イラスト`}
                        className="max-h-full max-w-full object-contain"
                      />
                      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/55 p-1 text-white opacity-0 transition group-hover:opacity-100">
                        <ZoomIn className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </div>

                  <div className="flex justify-center sm:col-span-4">
                    <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] px-8 py-4 text-center">
                      <RubyText
                        tokens={q.wordTokens}
                        showPinyin={showPinyin}
                        className="text-3xl font-bold text-[#1F2328]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 sm:col-span-4 sm:justify-end">
                    {(['T', 'F'] as const).map((val) => {
                      const isPicked = selected === val;
                      const isRightChoice = submitted && q.answer === val;
                      const isWrongPicked = submitted && isPicked && q.answer !== val;

                      let btnStyle =
                        'border-[#DFD8CA] bg-[#FCFBF8] text-[#2B303A] hover:border-[#1E3A5F] hover:bg-white';
                      if (isRightChoice) {
                        btnStyle = 'border-[#2E7D5B] bg-[#2E7D5B] text-white';
                      } else if (isWrongPicked) {
                        btnStyle = 'border-[#C83E2B] bg-[#C83E2B] text-white';
                      } else if (isPicked) {
                        btnStyle = 'border-[#1E3A5F] bg-[#1E3A5F] text-white';
                      }

                      return (
                        <button
                          key={val}
                          type="button"
                          disabled={submitted}
                          onClick={() => onSelectAnswer(q.id, val)}
                          className={`flex h-14 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 text-sm font-bold transition sm:max-w-[115px] disabled:cursor-default ${btnStyle}`}
                        >
                          {val === 'T' ? (
                            <>
                              <Check className="h-4 w-4 stroke-[2.5]" />
                              <span>正しい</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 stroke-[2.5]" />
                              <span>誤り</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART R2 ====================
  if (partId === 'R2') {
    const qs = visibleQuestions as ReadingPart2Question[];
    return (
      <div>
        <div className="mb-6 rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#1F2328]">
              共通イラスト選択肢（A〜F・クリックで拡大）
            </h4>
            <span className="text-xs text-[#847B6D]">
              例題で E を使用済み／残り5枚が第26〜30問に対応
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {R2_IMAGES.map((item) => {
              const usedBy = usedLettersMap[item.label] || [];
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onZoomImage(item.image, `読解第2部 イラスト ${item.label}`)}
                  className={`relative flex cursor-zoom-in flex-col items-center rounded-xl border p-2.5 transition ${
                    item.isExample
                      ? 'border-dashed border-[#D8CEBC] bg-[#FAF8F4] opacity-75'
                      : usedBy.length > 0
                      ? 'border-[#1E3A5F]/40 bg-[#F7FAFD]'
                      : 'border-[#ECE6DA] bg-white hover:border-[#1E3A5F]/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between pb-1">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                        item.isExample
                          ? 'bg-[#E6DFD1] text-[#6B7280]'
                          : 'bg-[#1E3A5F] text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.isExample ? (
                      <span className="rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-semibold text-[#736B5E]">
                        例題済
                      </span>
                    ) : usedBy.length > 0 ? (
                      <span className="rounded bg-[#EEF4FA] px-1.5 py-0.5 text-[10px] font-semibold text-[#1E3A5F]">
                        選択中：第{usedBy.join(',')}問
                      </span>
                    ) : null}
                  </div>
                  <div className="flex h-28 w-full items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {renderExampleAccordion(
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <RubyText
                tokens={PART_EXAMPLES.R2.tokens}
                showPinyin={showPinyin}
                className="text-lg font-medium text-[#1F2328]"
              />
              <div className="mt-1 text-xs text-[#6B7280]">{PART_EXAMPLES.R2.translationJa}</div>
            </div>
            <span className="rounded-lg bg-[#E9F6EF] px-3 py-1 text-sm font-bold text-[#2E7D5B]">
              正解：E
            </span>
          </div>
        )}

        <div className="space-y-4">
          {qs.map((q) => {
            const selected = answers[q.id];
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className="scroll-mt-28 rounded-2xl border border-[#E6DFD1] bg-white p-5 shadow-xs"
              >
                {renderQuestionHeader(q)}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <RubyText
                    tokens={q.tokens}
                    showPinyin={showPinyin}
                    className="text-xl font-medium text-[#1F2328]"
                  />
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {LETTERS_AF.map((letter) => {
                      const isEx = letter === 'E';
                      const isPicked = selected === letter;
                      const isRightChoice = submitted && q.answer === letter;
                      const isWrongPicked = submitted && isPicked && q.answer !== letter;
                      const usedElsewhere = (usedLettersMap[letter] || []).some(
                        (id) => id !== q.id
                      );

                      let cls =
                        'border-[#DFD8CA] bg-[#FCFBF8] text-[#1F2328] hover:border-[#1E3A5F]';
                      if (isEx) {
                        cls = 'border-dashed border-[#E2DACB] bg-[#F7F4EE] text-[#B0A899]';
                      }
                      if (isRightChoice) {
                        cls = 'border-[#2E7D5B] bg-[#2E7D5B] text-white';
                      } else if (isWrongPicked) {
                        cls = 'border-[#C83E2B] bg-[#C83E2B] text-white';
                      } else if (isPicked) {
                        cls = 'border-[#1E3A5F] bg-[#1E3A5F] text-white';
                      } else if (usedElsewhere && !isEx) {
                        cls =
                          'border-[#DCE4EE] bg-[#F5F8FC] text-[#8396AE] hover:border-[#1E3A5F] hover:text-[#1E3A5F]';
                      }

                      return (
                        <button
                          key={letter}
                          type="button"
                          disabled={submitted || isEx}
                          onClick={() => onSelectAnswer(q.id, letter)}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-2 text-sm font-bold transition disabled:cursor-default ${cls}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART R3 ====================
  if (partId === 'R3') {
    const qs = visibleQuestions as ReadingPart3Question[];
    return (
      <div>
        <div className="mb-6 rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#1F2328]">返答文の選択肢（A〜F）</h4>
            <span className="text-xs text-[#847B6D]">
              例題で F を使用済み／残り5文が第31〜35問に対応
            </span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {R3_RESPONSES.map((resp) => {
              const usedBy = usedLettersMap[resp.label] || [];
              return (
                <div
                  key={resp.label}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 ${
                    resp.isExample
                      ? 'border-dashed border-[#D8CEBC] bg-[#FAF8F4] opacity-75'
                      : usedBy.length > 0
                      ? 'border-[#1E3A5F]/40 bg-[#F7FAFD]'
                      : 'border-[#ECE6DA] bg-[#FCFBF8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        resp.isExample
                          ? 'bg-[#E6DFD1] text-[#6B7280]'
                          : 'bg-[#1E3A5F] text-white'
                      }`}
                    >
                      {resp.label}
                    </span>
                    <div>
                      <RubyText
                        tokens={resp.tokens}
                        showPinyin={showPinyin}
                        className="text-base font-medium text-[#1F2328]"
                      />
                      {submitted && (
                        <div className="text-[11px] text-[#6B7280]">{resp.translationJa}</div>
                      )}
                    </div>
                  </div>
                  {resp.isExample ? (
                    <span className="shrink-0 rounded bg-[#EFEAE0] px-1.5 py-0.5 text-[10px] font-semibold text-[#736B5E]">
                      例
                    </span>
                  ) : usedBy.length > 0 ? (
                    <span className="shrink-0 rounded bg-[#EEF4FA] px-1.5 py-0.5 text-[10px] font-semibold text-[#1E3A5F]">
                      #{usedBy.join(',')}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {renderExampleAccordion(
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <RubyText
                tokens={PART_EXAMPLES.R3.tokens}
                showPinyin={showPinyin}
                className="text-lg font-medium text-[#1F2328]"
              />
              <div className="mt-1 text-xs text-[#6B7280]">{PART_EXAMPLES.R3.translationJa}</div>
            </div>
            <span className="rounded-lg bg-[#E9F6EF] px-3 py-1 text-sm font-bold text-[#2E7D5B]">
              正解：F（好的，谢谢！）
            </span>
          </div>
        )}

        <div className="space-y-4">
          {qs.map((q) => {
            const selected = answers[q.id];
            const selectedResp = R3_RESPONSES.find((r) => r.label === selected);
            return (
              <article
                key={q.id}
                id={`q-${q.id}`}
                className="scroll-mt-28 rounded-2xl border border-[#E6DFD1] bg-white p-5 shadow-xs"
              >
                {renderQuestionHeader(q)}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <RubyText
                      tokens={q.tokens}
                      showPinyin={showPinyin}
                      className="text-xl font-medium text-[#1F2328]"
                    />
                    {selectedResp && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#F4F7FB] px-3 py-1 text-sm text-[#1E3A5F]">
                        <span className="font-bold">→ {selectedResp.label}.</span>
                        <span lang="zh-CN" className="font-zh">{selectedResp.text}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {LETTERS_AF.map((letter) => {
                      const isEx = letter === 'F';
                      const isPicked = selected === letter;
                      const isRightChoice = submitted && q.answer === letter;
                      const isWrongPicked = submitted && isPicked && q.answer !== letter;
                      const usedElsewhere = (usedLettersMap[letter] || []).some(
                        (id) => id !== q.id
                      );

                      let cls =
                        'border-[#DFD8CA] bg-[#FCFBF8] text-[#1F2328] hover:border-[#1E3A5F]';
                      if (isEx) {
                        cls = 'border-dashed border-[#E2DACB] bg-[#F7F4EE] text-[#B0A899]';
                      }
                      if (isRightChoice) {
                        cls = 'border-[#2E7D5B] bg-[#2E7D5B] text-white';
                      } else if (isWrongPicked) {
                        cls = 'border-[#C83E2B] bg-[#C83E2B] text-white';
                      } else if (isPicked) {
                        cls = 'border-[#1E3A5F] bg-[#1E3A5F] text-white';
                      } else if (usedElsewhere && !isEx) {
                        cls =
                          'border-[#DCE4EE] bg-[#F5F8FC] text-[#8396AE] hover:border-[#1E3A5F] hover:text-[#1E3A5F]';
                      }

                      return (
                        <button
                          key={letter}
                          type="button"
                          disabled={submitted || isEx}
                          onClick={() => onSelectAnswer(q.id, letter)}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-2 text-sm font-bold transition disabled:cursor-default ${cls}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {submitted && (
                  <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== PART R4 ====================
  const qs = visibleQuestions as ReadingPart4Question[];
  return (
    <div>
      <div className="mb-6 rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[#1F2328]">語群（A〜F）</h4>
          <span className="text-xs text-[#847B6D]">
            例題で D（名字）を使用済み／残り5語を第36〜40問へ補充
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {R4_WORD_BANK.map((w) => {
            const usedBy = usedLettersMap[w.label] || [];
            return (
              <div
                key={w.label}
                className={`flex flex-col items-center rounded-xl border px-3 py-2.5 text-center ${
                  w.isExample
                    ? 'border-dashed border-[#D8CEBC] bg-[#FAF8F4] opacity-75'
                    : usedBy.length > 0
                    ? 'border-[#1E3A5F]/40 bg-[#F7FAFD]'
                    : 'border-[#ECE6DA] bg-[#FCFBF8]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${
                      w.isExample ? 'bg-[#E6DFD1] text-[#6B7280]' : 'bg-[#1E3A5F] text-white'
                    }`}
                  >
                    {w.label}
                  </span>
                  {w.isExample ? (
                    <span className="text-[10px] font-semibold text-[#847B6D]">例</span>
                  ) : usedBy.length > 0 ? (
                    <span className="text-[10px] font-semibold text-[#1E3A5F]">
                      #{usedBy.join(',')}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1">
                  <RubyText
                    tokens={[{ hanzi: w.hanzi, pinyin: w.pinyin }]}
                    showPinyin={showPinyin}
                    className="text-lg font-bold text-[#1F2328]"
                  />
                </div>
                {submitted && (
                  <div className="mt-0.5 text-[11px] text-[#6B7280]">{w.meaningJa}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {renderExampleAccordion(
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <RubyText
              tokens={PART_EXAMPLES.R4.tokens}
              showPinyin={showPinyin}
              className="text-lg font-medium text-[#1F2328]"
              filledBlank={{ hanzi: '名字', pinyin: 'míngzi', status: 'correct' }}
            />
            <div className="mt-1 text-xs text-[#6B7280]">{PART_EXAMPLES.R4.translationJa}</div>
          </div>
          <span className="rounded-lg bg-[#E9F6EF] px-3 py-1 text-sm font-bold text-[#2E7D5B]">
            正解：D（名字）
          </span>
        </div>
      )}

      <div className="space-y-4">
        {qs.map((q) => {
          const selected = answers[q.id];
          const pickedWord = R4_WORD_BANK.find((w) => w.label === selected);
          const blankStatus: 'neutral' | 'correct' | 'wrong' = !submitted
            ? 'neutral'
            : selected === q.answer
            ? 'correct'
            : 'wrong';

          return (
            <article
              key={q.id}
              id={`q-${q.id}`}
              className="scroll-mt-28 rounded-2xl border border-[#E6DFD1] bg-white p-5 shadow-xs"
            >
              {renderQuestionHeader(q)}
              <div className="space-y-3">
                <div className="space-y-2.5">
                  {q.lines.map((line, idx) => (
                    <div key={idx} className="flex items-end gap-2.5">
                      {line.speaker && (
                        <span className="mb-1 shrink-0 rounded-md bg-[#F4EFE6] px-2 py-0.5 text-xs font-bold text-[#555E6B]">
                          {line.speaker}：
                        </span>
                      )}
                      <RubyText
                        tokens={line.tokens}
                        showPinyin={showPinyin}
                        className="text-xl font-medium text-[#1F2328]"
                        filledBlank={
                          pickedWord
                            ? {
                                hanzi: pickedWord.hanzi,
                                pinyin: pickedWord.pinyin,
                                status: blankStatus,
                              }
                            : null
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {R4_WORD_BANK.map((w) => {
                    const isEx = !!w.isExample;
                    const isPicked = selected === w.label;
                    const isRightChoice = submitted && q.answer === w.label;
                    const isWrongPicked = submitted && isPicked && q.answer !== w.label;
                    const usedElsewhere = (usedLettersMap[w.label] || []).some(
                      (id) => id !== q.id
                    );

                    let cls =
                      'border-[#DFD8CA] bg-[#FCFBF8] text-[#1F2328] hover:border-[#1E3A5F]';
                    if (isEx) {
                      cls = 'border-dashed border-[#E2DACB] bg-[#F7F4EE] text-[#B0A899]';
                    }
                    if (isRightChoice) {
                      cls = 'border-[#2E7D5B] bg-[#2E7D5B] text-white';
                    } else if (isWrongPicked) {
                      cls = 'border-[#C83E2B] bg-[#C83E2B] text-white';
                    } else if (isPicked) {
                      cls = 'border-[#1E3A5F] bg-[#1E3A5F] text-white';
                    } else if (usedElsewhere && !isEx) {
                      cls =
                        'border-[#DCE4EE] bg-[#F5F8FC] text-[#8396AE] hover:border-[#1E3A5F] hover:text-[#1E3A5F]';
                    }

                    return (
                      <button
                        key={w.label}
                        type="button"
                        disabled={submitted || isEx}
                        onClick={() => onSelectAnswer(q.id, w.label)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-bold transition disabled:cursor-default ${cls}`}
                      >
                        <span className="opacity-75">{w.label}</span>
                        <span lang="zh-CN" className="font-zh">{w.hanzi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {submitted && (
                <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

// ==================== RANDOM-ORDER EXAM RENDERER (SELF-CONTAINED CARDS) ====================
interface RandomExamListProps {
  questions: HskQuestion[];
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  submitted: boolean;
  showPinyin: boolean;
  onlyWrong: boolean;
  activeClipKey: string | null;
  isPlaying: boolean;
  clipProgress: number;
  onSelectAnswer: (qId: number, value: string) => void;
  onToggleFlag: (qId: number) => void;
  onToggleClip: (key: string, seg: AudioSegment) => void;
  onZoomImage: (src: string, alt: string) => void;
}

export const RandomExamList: React.FC<RandomExamListProps> = ({
  questions,
  answers,
  flagged,
  submitted,
  showPinyin,
  onlyWrong,
  activeClipKey,
  isPlaying,
  clipProgress,
  onSelectAnswer,
  onToggleFlag,
  onToggleClip,
  onZoomImage,
}) => {
  const visible =
    onlyWrong && submitted
      ? questions.filter((q) => answers[q.id] !== q.answer)
      : questions;

  if (visible.length === 0) {
    return (
      <div className="rounded-2xl border border-[#B8DEC9] bg-[#F2FAF5] p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#2E7D5B]" />
        <h4 className="mt-3 text-lg font-bold text-[#1F5D42]">このセクションは全問正解です！</h4>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {visible.map((q, idx) => {
        const selected = answers[q.id];
        const partMeta = PARTS_META.find((p) => p.id === q.part)!;
        const isFlagged = !!flagged[q.id];

        const btnChoiceCls = (val: string, isExample = false) => {
          const isPicked = selected === val;
          const isRight = submitted && q.answer === val;
          const isWrong = submitted && isPicked && q.answer !== val;
          if (isExample) return 'border-dashed border-[#E2DACB] bg-[#F7F4EE] opacity-60 cursor-not-allowed';
          if (isRight) return 'border-[#2E7D5B] bg-[#EBF7F0] text-[#1F5D42] ring-2 ring-[#2E7D5B]/20';
          if (isWrong) return 'border-[#C83E2B] bg-[#FEF2F1] text-[#A82E1E] ring-2 ring-[#C83E2B]/20';
          if (isPicked) return 'border-[#1E3A5F] bg-[#EEF4FA] text-[#1E3A5F] ring-2 ring-[#1E3A5F]/20';
          return 'border-[#E4DDD0] bg-[#FCFBF8] hover:border-[#1E3A5F] hover:bg-white cursor-pointer';
        };

        return (
          <article
            key={q.id}
            id={`q-${q.id}`}
            className="scroll-mt-28 rounded-2xl border border-[#E6DFD1] bg-white p-5 shadow-xs"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#1E3A5F] px-2 text-xs font-bold text-white">
                  問 {idx + 1}
                </span>
                <span className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-[11px] font-semibold text-[#555E6B] ring-1 ring-[#E6DFD1]">
                  {partMeta.shortLabelJa}・元番号 第{q.id}問
                </span>
                {q.audio && (
                  <ClipPlayButton
                    clipKey={`rand-q-${q.id}`}
                    segment={q.audio}
                    activeClipKey={activeClipKey}
                    isPlaying={isPlaying}
                    clipProgress={clipProgress}
                    onToggle={onToggleClip}
                    label="音声を再生"
                    compact
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => onToggleFlag(q.id)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
                  isFlagged ? 'bg-[#FEF3DC] text-[#B56A00]' : 'text-[#8C8476] hover:bg-[#F5F1E9]'
                }`}
              >
                <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                {isFlagged ? '見直し中' : '見直し'}
              </button>
            </div>

            <p className="mb-3 text-xs text-[#6B7280]">{partMeta.instructionJa}</p>

            {/* Render self-contained question content */}
            {q.part === 'L1' && (
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onZoomImage(q.image, `第${q.id}問`)}
                  className="flex h-36 w-48 cursor-zoom-in items-center justify-center rounded-xl border border-[#ECE6DA] bg-white p-2"
                >
                  <img src={q.image} alt="" className="max-h-full max-w-full object-contain" />
                </button>
                <div className="flex w-full flex-1 justify-end gap-3">
                  {(['T', 'F'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={submitted}
                      onClick={() => onSelectAnswer(q.id, v)}
                      className={`flex h-14 flex-1 items-center justify-center rounded-xl border-2 text-sm font-bold sm:max-w-[140px] ${btnChoiceCls(v)}`}
                    >
                      {v === 'T' ? '◯ 正しい' : '× 誤り'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q.part === 'L2' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={submitted}
                    onClick={() => onSelectAnswer(q.id, opt.label)}
                    className={`flex flex-col items-center rounded-xl border-2 p-3 transition ${btnChoiceCls(opt.label)}`}
                  >
                    <div className="flex h-32 w-full items-center justify-center rounded-lg bg-white p-1.5">
                      <img src={opt.image} alt={opt.alt} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="mt-2 text-sm font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {q.part === 'L3' && (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {L3_IMAGES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled={submitted || item.isExample}
                    onClick={() => onSelectAnswer(q.id, item.label)}
                    className={`flex flex-col items-center rounded-xl border-2 p-2.5 transition ${btnChoiceCls(item.label, item.isExample)}`}
                  >
                    <div className="flex w-full items-center justify-between pb-1 text-xs font-bold">
                      <span>{item.label}</span>
                      {item.isExample && <span className="text-[10px]">例題</span>}
                    </div>
                    <div className="flex h-24 w-full items-center justify-center rounded bg-white p-1">
                      <img src={item.image} alt={item.alt} className="max-h-full max-w-full object-contain" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {q.part === 'L4' && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={submitted}
                    onClick={() => onSelectAnswer(q.id, opt.label)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${btnChoiceCls(opt.label)}`}
                  >
                    <span className="text-sm font-bold">{opt.label}</span>
                    <RubyText tokens={opt.tokens} showPinyin={showPinyin} className="text-lg font-medium" />
                  </button>
                ))}
              </div>
            )}

            {q.part === 'R1' && (
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-12">
                <div className="flex justify-center sm:col-span-4">
                  <img src={q.image} alt="" className="h-32 w-40 rounded-xl border border-[#ECE6DA] bg-white object-contain p-2" />
                </div>
                <div className="flex justify-center sm:col-span-4">
                  <div className="rounded-xl bg-[#FAF8F4] px-7 py-3">
                    <RubyText tokens={q.wordTokens} showPinyin={showPinyin} className="text-3xl font-bold" />
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 sm:col-span-4">
                  {(['T', 'F'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={submitted}
                      onClick={() => onSelectAnswer(q.id, v)}
                      className={`flex h-12 flex-1 items-center justify-center rounded-xl border-2 text-sm font-bold ${btnChoiceCls(v)}`}
                    >
                      {v === 'T' ? '◯ 正しい' : '× 誤り'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q.part === 'R2' && (
              <div className="space-y-3">
                <div className="rounded-xl bg-[#FAF8F4] px-4 py-3">
                  <RubyText tokens={q.tokens} showPinyin={showPinyin} className="text-xl font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {R2_IMAGES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      disabled={submitted || item.isExample}
                      onClick={() => onSelectAnswer(q.id, item.label)}
                      className={`flex flex-col items-center rounded-xl border-2 p-2.5 transition ${btnChoiceCls(item.label, item.isExample)}`}
                    >
                      <div className="flex w-full items-center justify-between pb-1 text-xs font-bold">
                        <span>{item.label}</span>
                        {item.isExample && <span className="text-[10px]">例題</span>}
                      </div>
                      <div className="flex h-24 w-full items-center justify-center rounded bg-white p-1">
                        <img src={item.image} alt={item.alt} className="max-h-full max-w-full object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q.part === 'R3' && (
              <div className="space-y-3">
                <div className="rounded-xl bg-[#FAF8F4] px-4 py-3">
                  <RubyText tokens={q.tokens} showPinyin={showPinyin} className="text-xl font-medium" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {R3_RESPONSES.map((resp) => (
                    <button
                      key={resp.label}
                      type="button"
                      disabled={submitted || resp.isExample}
                      onClick={() => onSelectAnswer(q.id, resp.label)}
                      className={`flex items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-left transition ${btnChoiceCls(resp.label, resp.isExample)}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold">{resp.label}</span>
                        <RubyText tokens={resp.tokens} showPinyin={showPinyin} className="text-base font-medium" />
                      </div>
                      {resp.isExample && <span className="text-[10px]">例題</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q.part === 'R4' && (
              <div className="space-y-3">
                <div className="space-y-2 rounded-xl bg-[#FAF8F4] px-4 py-3">
                  {q.lines.map((line, lIdx) => {
                    const pickedW = R4_WORD_BANK.find((w) => w.label === selected);
                    return (
                      <div key={lIdx} className="flex items-end gap-2">
                        {line.speaker && (
                          <span className="mb-1 rounded bg-white px-1.5 py-0.5 text-xs font-bold text-[#555E6B]">
                            {line.speaker}：
                          </span>
                        )}
                        <RubyText
                          tokens={line.tokens}
                          showPinyin={showPinyin}
                          className="text-xl font-medium"
                          filledBlank={
                            pickedW
                              ? {
                                  hanzi: pickedW.hanzi,
                                  pinyin: pickedW.pinyin,
                                  status: !submitted
                                    ? 'neutral'
                                    : selected === q.answer
                                    ? 'correct'
                                    : 'wrong',
                                }
                              : null
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {R4_WORD_BANK.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      disabled={submitted || w.isExample}
                      onClick={() => onSelectAnswer(q.id, w.label)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${btnChoiceCls(w.label, w.isExample)}`}
                    >
                      <span>{w.label}</span>
                      <span lang="zh-CN" className="font-zh">{w.hanzi}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {submitted && (
              <ExamFeedbackBox q={q} userAns={selected} showPinyin={showPinyin} />
            )}
          </article>
        );
      })}
    </div>
  );
};
