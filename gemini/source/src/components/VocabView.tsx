import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  RotateCw,
  CheckCircle2,
  LayoutGrid,
  Layers,
  ChevronLeft,
  ChevronRight,
  Search,
  Lightbulb,
} from 'lucide-react';
import { H11004_VOCAB } from '../data/vocab';
import type { VocabItem } from '../types';

interface VocabViewProps {
  onBack: () => void;
  onPracticeQuestion: (qId: number) => void;
}

const CATEGORIES: ('すべて' | VocabItem['category'])[] = [
  'すべて',
  '人・関係',
  '時間・数字',
  '日常動作',
  '場所・モノ',
  '表現・形容',
];

export const VocabView: React.FC<VocabViewProps> = ({
  onBack,
  onPracticeQuestion,
}) => {
  const [category, setCategory] = useState<'すべて' | VocabItem['category']>('すべて');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return H11004_VOCAB.filter((item) => {
      if (category !== 'すべて' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.hanzi.includes(q) ||
        item.pinyin.toLowerCase().includes(q) ||
        item.meaningJa.includes(q)
      );
    });
  }, [category, query]);

  const safeIndex = Math.min(cardIndex, Math.max(0, filtered.length - 1));
  const currentCard = filtered[safeIndex];

  const speakZh = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, '，'));
      utter.lang = 'zh-CN';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore TTS unavailability in strict browsers
    }
  };

  const masteredCount = Object.values(mastered).filter(Boolean).length;

  return (
    <div className="paper-grain min-h-screen pb-16 pt-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E4DDD0] bg-white px-3.5 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#FAF8F4]"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </button>
            <div>
              <h1 className="font-serif-ja text-2xl font-bold text-[#1F2328]">
                H11004 頻出単語フラッシュカード
              </h1>
              <p className="text-xs text-[#6B7280]">
                過去問に出題された重要 {H11004_VOCAB.length} 語・習得済み {masteredCount} 語
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-xl border border-[#E4DDD0] bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-[#2E7D5B] text-white'
                  : 'text-[#555E6B] hover:text-[#1F2328]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              単語カード
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-[#2E7D5B] text-white'
                  : 'text-[#555E6B] hover:text-[#1F2328]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              単語一覧
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E6DFD1] bg-white p-3.5 shadow-xs">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setCardIndex(0);
                  setFlipped(false);
                }}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  category === cat
                    ? 'bg-[#1E3A5F] text-white'
                    : 'bg-[#FAF8F4] text-[#555E6B] hover:bg-[#EFEAE0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#847B6D]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCardIndex(0);
              }}
              placeholder="漢字・ピンイン・日本語で検索…"
              className="w-full rounded-xl border border-[#E4DDD0] bg-[#FAF8F4] py-1.5 pl-8 pr-3 text-xs text-[#1F2328] outline-none focus:border-[#2E7D5B] focus:bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#E6DFD1] bg-white p-10 text-center text-sm text-[#6B7280]">
            一致する単語が見つかりませんでした。検索条件を変更してみてください。
          </div>
        ) : viewMode === 'cards' && currentCard ? (
          <div className="mx-auto mt-8 max-w-xl">
            <div className="mb-3 flex items-center justify-between text-xs font-medium text-[#6B7280]">
              <span>
                {safeIndex + 1} / {filtered.length} 枚目・{currentCard.category}
              </span>
              <button
                type="button"
                onClick={() =>
                  setMastered((prev) => ({
                    ...prev,
                    [currentCard.id]: !prev[currentCard.id],
                  }))
                }
                className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 font-semibold transition ${
                  mastered[currentCard.id]
                    ? 'bg-[#E9F6EF] text-[#2E7D5B]'
                    : 'bg-white text-[#6B7280] ring-1 ring-[#E4DDD0] hover:text-[#2E7D5B]'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {mastered[currentCard.id] ? '覚えた！' : '覚えたマーク'}
              </button>
            </div>

            <div
              onClick={() => setFlipped((f) => !f)}
              className="flex min-h-[340px] cursor-pointer flex-col justify-between rounded-3xl border-2 border-[#E6DFD1] bg-white p-7 shadow-xs transition hover:border-[#2E7D5B]/50 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#FAF8F4] px-2.5 py-1 text-xs font-semibold text-[#736B5E]">
                  {currentCard.posJa}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakZh(currentCard.hanzi);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#EDF7F2] px-3 py-1.5 text-xs font-semibold text-[#2E7D5B] hover:bg-[#DCF0E6]"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  発音を聞く
                </button>
              </div>

              {!flipped ? (
                <div className="my-8 text-center">
                  <div
                    lang="zh-CN"
                    className="font-zh text-5xl font-bold tracking-wide text-[#1F2328]"
                  >
                    {currentCard.hanzi}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#847B6D]">
                    <RotateCw className="h-3.5 w-3.5" />
                    カードをクリックしてピンイン・日本語訳・例文を確認
                  </div>
                </div>
              ) : (
                <div className="my-3 space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#C83E2B]">
                      {currentCard.pinyin}
                    </div>
                    <div lang="zh-CN" className="font-zh mt-1 text-xl font-bold text-[#1F2328]">
                      {currentCard.hanzi}
                    </div>
                    <div className="mt-2 text-base font-bold text-[#2D333B]">
                      {currentCard.meaningJa}
                    </div>
                  </div>

                  {currentCard.noteJa && (
                    <div className="flex items-start gap-1.5 rounded-xl bg-[#FDF9EE] px-3 py-2 text-xs text-[#6B4E1B] ring-1 ring-[#EFE2C0]">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C4820E]" />
                      <span>{currentCard.noteJa}</span>
                    </div>
                  )}

                  <div className="rounded-2xl bg-[#FAF8F4] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#847B6D]">
                        H11004 過去問例文
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakZh(currentCard.exampleZh);
                        }}
                        className="cursor-pointer text-xs font-semibold text-[#2E7D5B] hover:underline"
                      >
                        例文を読む
                      </button>
                    </div>
                    <div lang="zh-CN" className="font-zh mt-1.5 text-base font-semibold text-[#1F2328]">
                      {currentCard.exampleZh}
                    </div>
                    <div className="text-xs text-[#555E6B]">{currentCard.examplePinyin}</div>
                    <div className="mt-1 text-xs text-[#736B5E]">{currentCard.exampleJa}</div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EAE0] pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-[#847B6D]">出題箇所：</span>
                  {currentCard.questionIds.map((qId) => (
                    <button
                      key={qId}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPracticeQuestion(qId);
                      }}
                      className="cursor-pointer rounded bg-[#EEF4FA] px-2 py-0.5 text-xs font-semibold text-[#1E3A5F] hover:bg-[#DCE9F7]"
                    >
                      第{qId}問を練習 →
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-[#847B6D]">
                  {flipped ? 'クリックで表面へ' : 'クリックで裏面へ'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => {
                  setCardIndex((i) => Math.max(0, i - 1));
                  setFlipped(false);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E4DDD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2328] transition hover:bg-[#FAF8F4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                前へ
              </button>

              <button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#162C49]"
              >
                <RotateCw className="h-4 w-4" />
                カードをめくる
              </button>

              <button
                type="button"
                disabled={safeIndex >= filtered.length - 1}
                onClick={() => {
                  setCardIndex((i) => Math.min(filtered.length - 1, i + 1));
                  setFlipped(false);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E4DDD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2328] transition hover:bg-[#FAF8F4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                次へ
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-[#C83E2B]">
                        {item.pinyin}
                      </div>
                      <div lang="zh-CN" className="font-zh mt-0.5 text-2xl font-bold text-[#1F2328]">
                        {item.hanzi}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakZh(item.hanzi)}
                      className="cursor-pointer rounded-lg bg-[#EDF7F2] p-2 text-[#2E7D5B] hover:bg-[#DCF0E6]"
                      title="発音を聞く"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#374151]">
                    {item.meaningJa}
                  </div>
                  {item.noteJa && (
                    <div className="mt-1 text-[11px] text-[#8A5A10]">{item.noteJa}</div>
                  )}
                  <div className="mt-3 rounded-xl bg-[#FAF8F4] px-3 py-2 text-xs text-[#4B5563]">
                    <div lang="zh-CN" className="font-zh font-medium text-[#1F2328]">
                      {item.exampleZh}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#6B7280]">{item.exampleJa}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#F0EAE0] pt-2.5">
                  <div className="flex flex-wrap gap-1">
                    {item.questionIds.map((qId) => (
                      <button
                        key={qId}
                        type="button"
                        onClick={() => onPracticeQuestion(qId)}
                        className="cursor-pointer rounded bg-[#EEF4FA] px-2 py-0.5 text-[11px] font-semibold text-[#1E3A5F] hover:bg-[#DCE9F7]"
                      >
                        第{qId}問
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMastered((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    className={`cursor-pointer text-xs font-semibold ${
                      mastered[item.id] ? 'text-[#2E7D5B]' : 'text-[#9CA3AF] hover:text-[#2E7D5B]'
                    }`}
                  >
                    {mastered[item.id] ? '✓ 覚えた' : '覚えた'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
