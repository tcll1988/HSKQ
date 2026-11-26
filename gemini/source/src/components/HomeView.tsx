import React, { useState } from 'react';
import {
  Headphones,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  FileCheck2,
  Layers,
  ArrowRight,
  RotateCcw,
  ListOrdered,
  Shuffle,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { EXAM_INFO, PARTS_META } from '../data/h11004';
import type { PracticeScope, QuestionOrder } from '../types';

interface HomeViewProps {
  examAnsweredCount: number;
  examSubmitted: boolean;
  lastExamScore: number | null;
  onStartPractice: (order: QuestionOrder, scope: PracticeScope) => void;
  onStartExam: (order: QuestionOrder) => void;
  onOpenVocab: () => void;
  onViewExamReport: () => void;
  onResetExam: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  examAnsweredCount,
  examSubmitted,
  lastExamScore,
  onStartPractice,
  onStartExam,
  onOpenVocab,
  onViewExamReport,
  onResetExam,
}) => {
  const [practiceOrder, setPracticeOrder] = useState<QuestionOrder>('sequential');
  const [practiceScope, setPracticeScope] = useState<PracticeScope>('all');
  const [examOrder, setExamOrder] = useState<QuestionOrder>('sequential');

  return (
    <div className="paper-grain min-h-screen pb-20">
      {/* Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#C83E2B] via-[#D96B43] to-[#1E3A5F]" />

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Hero Cover Card */}
        <section className="relative overflow-hidden rounded-3xl border border-[#E6DFD1] bg-white p-6 shadow-xs sm:p-9">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#C83E2B]/[0.04]" />
          <div className="pointer-events-none absolute -bottom-10 right-16 h-32 w-32 rounded-full bg-[#1E3A5F]/[0.04]" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3.5 flex flex-wrap items-center gap-2">
                <span className="seal-stamp inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold tracking-widest text-[#C83E2B]">
                  HSK 1級
                </span>
                <span className="rounded-full border border-[#E6DFD1] bg-[#FAF8F4] px-3 py-0.5 text-xs font-semibold text-[#555E6B]">
                  公式過去問：{EXAM_INFO.code}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF4FA] px-3 py-0.5 text-xs font-semibold text-[#1E3A5F]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  大学生向け中国語対策
                </span>
              </div>

              <h1 className="font-serif-ja text-2xl font-bold tracking-tight text-[#1F2328] sm:text-4xl">
                HSK（1級）過去問演習サイト
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-[#57606A] sm:text-base">
                公式過去問 <strong className="font-semibold text-[#1F2328]">H11004</strong> の全40問（リスニング20問・リーディング20問）と公式音声・イラストを完全収録。
                <strong className="font-semibold text-[#C83E2B]">「練習モード」</strong>と
                <strong className="font-semibold text-[#1E3A5F]">「試験モード」</strong>の切り替え、
                <strong className="font-semibold text-[#1F2328]">原題順／ランダム順</strong>の選択、全問の丁寧な日本語解説に対応しています。
              </p>

              {/* 4 Key Stats */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#736B5E]">
                    <Headphones className="h-3.5 w-3.5 text-[#C83E2B]" />
                    リスニング
                  </div>
                  <div className="mt-1 whitespace-nowrap text-sm font-bold text-[#1F2328]">
                    20問・約15分
                  </div>
                </div>
                <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#736B5E]">
                    <BookOpen className="h-3.5 w-3.5 text-[#1E3A5F]" />
                    リーディング
                  </div>
                  <div className="mt-1 whitespace-nowrap text-sm font-bold text-[#1F2328]">
                    20問・17分
                  </div>
                </div>
                <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#736B5E]">
                    <Award className="h-3.5 w-3.5 text-[#2E7D5B]" />
                    合格基準
                  </div>
                  <div className="mt-1 whitespace-nowrap text-sm font-bold text-[#1F2328]">
                    120点 / 200点
                  </div>
                </div>
                <div className="rounded-xl border border-[#EFEAE0] bg-[#FAF8F4] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#736B5E]">
                    <Clock className="h-3.5 w-3.5 text-[#9A6324]" />
                    公式音声
                  </div>
                  <div className="mt-1 whitespace-nowrap text-sm font-bold text-[#1F2328]">
                    14:37 高音質
                  </div>
                </div>
              </div>
            </div>

            {/* Paper Cover Badge */}
            <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8CEBC] bg-[#FCFBF8] px-6 py-5 text-center lg:w-52">
              <div className="font-serif-ja text-3xl font-bold tracking-wider text-[#C83E2B]">
                H11004
              </div>
              <div className="mt-1 text-[11px] font-semibold tracking-widest text-[#847B6D]">
                LEVEL 1 · OFFICIAL
              </div>
              <div className="my-2.5 h-px w-20 bg-[#E6DFD1]" />
              <div className="text-[11px] leading-5 text-[#6B7280]">
                Chrome / Safari / Edge
                <br />
                Firefox・スマホ完全対応
              </div>
            </div>
          </div>

          {/* Saved Exam Progress Banner */}
          {(examAnsweredCount > 0 || examSubmitted) && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E7D8BE] bg-[#FDF9F0] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[#6B4E1B]">
                <FileCheck2 className="h-4 w-4 shrink-0 text-[#B57614]" />
                {examSubmitted && lastExamScore !== null ? (
                  <span>
                    前回の試験モード結果：
                    <strong className="font-bold text-[#1F2328]">{lastExamScore} / 200 点</strong>
                    （{lastExamScore >= 120 ? '合格ライン達成！' : '合格ライン 120点まであと少し'}）
                  </span>
                ) : (
                  <span>
                    試験モードの途中データがあります（解答済み{' '}
                    <strong className="font-bold text-[#1F2328]">{examAnsweredCount} / 40 問</strong>）。
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {examSubmitted && (
                  <button
                    type="button"
                    onClick={onViewExamReport}
                    className="cursor-pointer rounded-lg bg-[#1E3A5F] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#162C49]"
                  >
                    成績レポートを見る
                  </button>
                )}
                <button
                  type="button"
                  onClick={onResetExam}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#DECFA9] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B4E1B] transition hover:bg-[#FAF2E1]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  履歴をリセット
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Two Main Interactive Mode Cards (Practice + Exam) */}
        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          {/* PRACTICE MODE CARD */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-[#C83E2B]/30 bg-white p-6 shadow-xs transition hover:border-[#C83E2B]/70">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDF2F0] text-[#C83E2B]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-[#1F2328]">練習モード</h2>
                    <p className="text-xs font-medium text-[#C83E2B]">1問ずつ確実に定着・正解必須ステップ方式</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#C83E2B] px-2.5 py-0.5 text-[11px] font-bold text-white">
                  おすすめ
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-[#F5DDD9] bg-[#FEF8F7] px-3.5 py-2.5 text-xs leading-relaxed text-[#7A2A1E]">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C83E2B]" />
                  <span>
                    <strong>間違えると即座に「正解」と詳しい日本語解説を表示！</strong>
                    正しい答えを選び直して理解するまで次の問題へ進めないため、苦手問題がしっかり身につきます。
                  </span>
                </div>
              </div>

              {/* Order Selector */}
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-bold text-[#555E6B]">
                  出題順序を選択
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPracticeOrder('sequential')}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${
                      practiceOrder === 'sequential'
                        ? 'border-[#C83E2B] bg-[#FDF2F0] text-[#C83E2B]'
                        : 'border-[#E6DFD1] bg-[#FAF8F4] text-[#555E6B] hover:border-[#C83E2B]/40'
                    }`}
                  >
                    <ListOrdered className="h-4 w-4" />
                    原題どおり（出題順）
                  </button>
                  <button
                    type="button"
                    onClick={() => setPracticeOrder('random')}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${
                      practiceOrder === 'random'
                        ? 'border-[#C83E2B] bg-[#FDF2F0] text-[#C83E2B]'
                        : 'border-[#E6DFD1] bg-[#FAF8F4] text-[#555E6B] hover:border-[#C83E2B]/40'
                    }`}
                  >
                    <Shuffle className="h-4 w-4" />
                    ランダム順（シャッフル）
                  </button>
                </div>
              </div>

              {/* Scope Selector */}
              <div className="mt-3.5">
                <label className="mb-1.5 block text-xs font-bold text-[#555E6B]">
                  練習範囲を選択
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'all', label: '全40問' },
                      { id: 'listening', label: '聴力のみ (20問)' },
                      { id: 'reading', label: '読解のみ (20問)' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPracticeScope(item.id)}
                      className={`cursor-pointer rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                        practiceScope === item.id
                          ? 'border-[#1F2328] bg-[#1F2328] text-white'
                          : 'border-[#E6DFD1] bg-[#FAF8F4] text-[#555E6B] hover:bg-[#F2ECE2]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartPractice(practiceOrder, practiceScope)}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C83E2B] py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#AE3221] active:scale-[0.99]"
            >
              <span>
                練習モードを始める（{practiceOrder === 'random' ? 'ランダム順' : '原題順'}）
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* EXAM MODE CARD */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-[#1E3A5F]/25 bg-white p-6 shadow-xs transition hover:border-[#1E3A5F]/70">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FA] text-[#1E3A5F]">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-[#1F2328]">試験モード（模擬試験）</h2>
                    <p className="text-xs font-medium text-[#1E3A5F]">本番さながらの35分タイマー・自動採点</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#EEF4FA] px-2.5 py-0.5 text-[11px] font-bold text-[#1E3A5F]">
                  全40問・200点満点
                </span>
              </div>

              <div className="mt-4 rounded-xl border border-[#DCE6F2] bg-[#F5F9FD] px-3.5 py-2.5 text-xs leading-relaxed text-[#26466D]">
                試験中は解答・解説を非表示にし、実戦形式で実力を測定します。採点ボタンを押すと公式基準（120点合格）のスコアレポートと全問の日本語解説を確認できます。
              </div>

              {/* Exam Order Selector */}
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-bold text-[#555E6B]">
                  出題順序を選択
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExamOrder('sequential')}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${
                      examOrder === 'sequential'
                        ? 'border-[#1E3A5F] bg-[#EEF4FA] text-[#1E3A5F]'
                        : 'border-[#E6DFD1] bg-[#FAF8F4] text-[#555E6B] hover:border-[#1E3A5F]/40'
                    }`}
                  >
                    <ListOrdered className="h-4 w-4" />
                    本番どおり（出題順）
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamOrder('random')}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${
                      examOrder === 'random'
                        ? 'border-[#1E3A5F] bg-[#EEF4FA] text-[#1E3A5F]'
                        : 'border-[#E6DFD1] bg-[#FAF8F4] text-[#555E6B] hover:border-[#1E3A5F]/40'
                    }`}
                  >
                    <Shuffle className="h-4 w-4" />
                    ランダム順（シャッフル）
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-[#6B7280]">
                  {examOrder === 'sequential'
                    ? '※ 本番どおり順：14:37 の公式通し音声プレイヤー＋問題自動追従機能が使えます。'
                    : '※ ランダム順：聴力20問・読解20問をシャッフル出題し、各問ごとの音声再生ボタンで受験します。'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartExam(examOrder)}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#162C49] active:scale-[0.99]"
            >
              <span>
                試験モードを開始する（{examOrder === 'random' ? 'ランダム順' : '本番どおり'}）
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Vocabulary Flashcards Compact Feature Banner */}
        <section className="mt-5">
          <button
            type="button"
            onClick={onOpenVocab}
            className="group flex w-full cursor-pointer flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D4E7DD] bg-white px-6 py-4 text-left shadow-xs transition hover:border-[#2E7D5B] hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF7F2] text-[#2E7D5B]">
                <Layers className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1F2328]">
                    H11004 頻出単語フラッシュカード（重要30語）
                  </h3>
                  <span className="rounded-full bg-[#EDF7F2] px-2 py-0.5 text-[11px] font-bold text-[#2E7D5B]">
                    音声読み上げ付
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#57606A]">
                  「先生＝〜さん」「饭店＝レストラン」など日本人学習者がつまずきやすい重要語彙を、ピンイン・例文・出題番号付きで復習できます。
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#2E7D5B]">
              単語カードを開く
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </section>

        {/* Blueprint of H11004 */}
        <section className="mt-8 rounded-3xl border border-[#E6DFD1] bg-white p-6 shadow-xs sm:p-7">
          <h3 className="font-serif-ja text-lg font-bold text-[#1F2328]">
            試験構成一覧（HSK 1級・H11004）
          </h3>
          <p className="mt-1 text-xs text-[#6B7280]">
            リスニング4部（20問・100点）＋リーディング4部（20問・100点）＝全40問・200点満点（120点以上で合格）
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#EFEAE0] bg-[#FCFBF8] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#C83E2B]">
                  <Headphones className="h-4 w-4" />
                  リスニング（第1〜20問）
                </div>
                <span className="text-xs font-medium text-[#847B6D]">100点・約15分</span>
              </div>
              <div className="space-y-2">
                {PARTS_META.filter((p) => p.section === 'listening').map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-[#EFEAE0]"
                  >
                    <div>
                      <div className="font-bold text-[#1F2328]">
                        {p.titleJa}：{p.subtitleJa}
                      </div>
                    </div>
                    <span className="shrink-0 rounded bg-[#FDF2F0] px-2 py-0.5 font-bold text-[#C83E2B]">
                      5問
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#EFEAE0] bg-[#FCFBF8] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1E3A5F]">
                  <BookOpen className="h-4 w-4" />
                  リーディング（第21〜40問）
                </div>
                <span className="text-xs font-medium text-[#847B6D]">100点・17分</span>
              </div>
              <div className="space-y-2">
                {PARTS_META.filter((p) => p.section === 'reading').map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-[#EFEAE0]"
                  >
                    <div>
                      <div className="font-bold text-[#1F2328]">
                        {p.titleJa}：{p.subtitleJa}
                      </div>
                    </div>
                    <span className="shrink-0 rounded bg-[#EEF4FA] px-2 py-0.5 font-bold text-[#1E3A5F]">
                      5問
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
