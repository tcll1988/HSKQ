import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  AlertCircle,
  Home,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { EXAM_INFO, PARTS_META, QUESTIONS, R3_RESPONSES, R4_WORD_BANK } from '../data/h11004';
import { formatTime } from '../hooks/useAudioController';
import type { HskQuestion } from '../types';

interface ScoreReportProps {
  answers: Record<number, string>;
  elapsedSeconds: number;
  onReviewAll: () => void;
  onReviewWrong: () => void;
  onPracticeWrong: (wrongIds: number[]) => void;
  onRestartAll: () => void;
  onGoHome: () => void;
}

function formatAnswerDetail(q: HskQuestion, val?: string): string {
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

export const ScoreReport: React.FC<ScoreReportProps> = ({
  answers,
  elapsedSeconds,
  onReviewAll,
  onReviewWrong,
  onPracticeWrong,
  onRestartAll,
  onGoHome,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'wrong'>('all');

  const listeningQs = QUESTIONS.filter((q) => q.section === 'listening');
  const readingQs = QUESTIONS.filter((q) => q.section === 'reading');

  const listeningCorrect = listeningQs.filter((q) => answers[q.id] === q.answer).length;
  const readingCorrect = readingQs.filter((q) => answers[q.id] === q.answer).length;
  const wrongIds = QUESTIONS.filter((q) => answers[q.id] !== q.answer).map((q) => q.id);

  const listeningScore = listeningCorrect * 5;
  const readingScore = readingCorrect * 5;
  const totalScore = listeningScore + readingScore;
  const totalCorrect = listeningCorrect + readingCorrect;
  const wrongCount = wrongIds.length;
  const passed = totalScore >= EXAM_INFO.passScore;

  const listedQuestions =
    filterMode === 'wrong'
      ? QUESTIONS.filter((q) => answers[q.id] !== q.answer)
      : QUESTIONS;

  return (
    <div className="paper-grain min-h-screen pb-16 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <button
          type="button"
          onClick={onGoHome}
          className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#57606A] transition hover:text-[#1F2328]"
        >
          <Home className="h-4 w-4" />
          トップページへ戻る
        </button>

        {/* Score Summary Certificate */}
        <section className="relative overflow-hidden rounded-3xl border border-[#E6DFD1] bg-white p-7 shadow-xs sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#EFEAE0] pb-7">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#847B6D]">
                <Award className="h-4 w-4 text-[#C83E2B]" />
                HSK SCORE REPORT · {EXAM_INFO.code}
              </div>
              <h1 className="font-serif-ja mt-2 text-2xl font-bold text-[#1F2328] sm:text-3xl">
                HSK（1級）模擬試験 成績レポート
              </h1>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                200点満点（120点以上で合格）・各問5点配点
              </p>
            </div>

            <div
              className={`seal-stamp flex flex-col items-center rounded-xl px-5 py-2.5 text-center ${
                passed ? 'text-[#2E7D5B]' : 'text-[#C83E2B]'
              }`}
            >
              <span className="font-serif-ja text-xl font-bold tracking-widest">
                {passed ? '合 格' : '不合格'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {passed ? 'PASSED' : 'KEEP GOING'}
              </span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#EFEAE0] bg-[#FAF8F4] p-5 text-center sm:col-span-2">
              <div className="text-xs font-semibold text-[#736B5E]">合計スコア</div>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span
                  className={`text-5xl font-extrabold tabular-nums ${
                    passed ? 'text-[#2E7D5B]' : 'text-[#C83E2B]'
                  }`}
                >
                  {totalScore}
                </span>
                <span className="text-lg font-semibold text-[#847B6D]">/ 200点</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-[#555E6B]">
                <span className="inline-flex items-center gap-1 text-[#2E7D5B]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  正解 {totalCorrect}問
                </span>
                <span className="inline-flex items-center gap-1 text-[#C83E2B]">
                  <XCircle className="h-3.5 w-3.5" />
                  不正解 {wrongCount}問
                </span>
                <span className="inline-flex items-center gap-1 text-[#6B7280]">
                  <Clock className="h-3.5 w-3.5" />
                  所要時間 {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#F2E2DF] bg-[#FEF8F7] p-5 text-center">
              <div className="text-xs font-semibold text-[#C83E2B]">リスニング</div>
              <div className="mt-2 text-4xl font-extrabold tabular-nums text-[#1F2328]">
                {listeningScore}
              </div>
              <div className="mt-1 text-xs text-[#6B7280]">
                正答 {listeningCorrect} / 20問
              </div>
            </div>

            <div className="rounded-2xl border border-[#DCE6F2] bg-[#F5F9FD] p-5 text-center">
              <div className="text-xs font-semibold text-[#1E3A5F]">リーディング</div>
              <div className="mt-2 text-4xl font-extrabold tabular-nums text-[#1F2328]">
                {readingScore}
              </div>
              <div className="mt-1 text-xs text-[#6B7280]">
                正答 {readingCorrect} / 20問
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-bold text-[#1F2328]">パート別 正答率（全8パート）</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PARTS_META.map((part) => {
                const pQs = QUESTIONS.filter((q) => q.part === part.id);
                const pCorrect = pQs.filter((q) => answers[q.id] === q.answer).length;
                const pct = Math.round((pCorrect / pQs.length) * 100);
                const barColor =
                  pct >= 80
                    ? 'bg-[#2E7D5B]'
                    : pct >= 60
                    ? 'bg-[#D9820B]'
                    : 'bg-[#C83E2B]';

                return (
                  <div
                    key={part.id}
                    className="rounded-xl border border-[#EFEAE0] bg-[#FCFBF8] px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1F2328]">
                        {part.section === 'listening' ? '聴力' : '読解'}・{part.titleJa}（
                        {part.subtitleJa.split('・')[1]}）
                      </span>
                      <span className="font-bold tabular-nums text-[#555E6B]">
                        {pCorrect} / {pQs.length} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EAE4D9]">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#EFEAE0] pt-6">
            <button
              type="button"
              onClick={onReviewAll}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#162C49]"
            >
              <BookOpen className="h-4 w-4" />
              問題画面で音声・イラスト付き解説を見る
            </button>

            {wrongCount > 0 && (
              <>
                <button
                  type="button"
                  onClick={onReviewWrong}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#C83E2B] bg-[#FEF5F4] px-4 py-2.5 text-sm font-bold text-[#C83E2B] transition hover:bg-[#FCE8E6]"
                >
                  <AlertCircle className="h-4 w-4" />
                  不正解だけ問題画面で確認
                </button>
                <button
                  type="button"
                  onClick={() => onPracticeWrong(wrongIds)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#C83E2B] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#AE3221]"
                >
                  <Sparkles className="h-4 w-4" />
                  間違えた{wrongCount}問を練習モードで克服
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onRestartAll}
              className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#DFD8CA] bg-[#FAF8F4] px-4 py-2.5 text-sm font-medium text-[#57606A] transition hover:bg-[#F2ECE2]"
            >
              <RotateCcw className="h-4 w-4" />
              もう一度受験する
            </button>
          </div>
        </section>

        {/* Full Per-Question Japanese Explanations Right on the Report Page */}
        <section className="mt-8 rounded-3xl border border-[#E6DFD1] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEAE0] pb-4">
            <div>
              <h2 className="font-serif-ja text-xl font-bold text-[#1F2328]">
                全問 詳しい日本語解説（なぜこれが正解？）
              </h2>
              <p className="mt-0.5 text-xs text-[#6B7280]">
                1問ずつ正解の根拠・日本語訳・中国語学習ポイントを確認できます
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-[#E4DDD0] bg-[#FAF8F4] p-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`cursor-pointer rounded-lg px-3 py-1 font-bold transition ${
                  filterMode === 'all'
                    ? 'bg-white text-[#1F2328] shadow-xs'
                    : 'text-[#6B7280]'
                }`}
              >
                全40問
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('wrong')}
                className={`cursor-pointer rounded-lg px-3 py-1 font-bold transition ${
                  filterMode === 'wrong'
                    ? 'bg-[#C83E2B] text-white shadow-xs'
                    : 'text-[#6B7280]'
                }`}
              >
                不正解のみ ({wrongCount})
              </button>
            </div>
          </div>

          {listedQuestions.length === 0 ? (
            <div className="py-10 text-center text-sm font-semibold text-[#2E7D5B]">
              全問正解です！素晴らしい成績です！
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {listedQuestions.map((q) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.answer;
                const pMeta = PARTS_META.find((p) => p.id === q.part);

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4 ${
                      isCorrect
                        ? 'border-[#D1E8DC] bg-[#FBFDFC]'
                        : 'border-[#F2D1CC] bg-[#FFFBFB]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-bold text-white ${
                            isCorrect ? 'bg-[#2E7D5B]' : 'bg-[#C83E2B]'
                          }`}
                        >
                          第{q.id}問
                        </span>
                        <span className="rounded bg-[#FAF8F4] px-2 py-0.5 text-[11px] font-semibold text-[#555E6B] ring-1 ring-[#E6DFD1]">
                          {pMeta?.shortLabelJa}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isCorrect ? 'text-[#2E7D5B]' : 'text-[#C83E2B]'
                          }`}
                        >
                          {isCorrect ? '◯ 正解' : `× 不正解（あなた：${formatAnswerDetail(q, userAns)}）`}
                        </span>
                      </div>

                      <span className="rounded-md bg-[#E9F6EF] px-2.5 py-0.5 text-xs font-bold text-[#1F5D42]">
                        正解：{formatAnswerDetail(q, q.answer)}
                      </span>
                    </div>

                    {/* Source Chinese text / transcript */}
                    {q.transcript && (
                      <div className="mt-2.5 rounded-xl bg-[#F5F9FD] px-3.5 py-2 text-sm">
                        {q.transcript.map((line, i) => (
                          <div key={i} className="flex flex-wrap items-baseline gap-1.5">
                            {line.speaker && (
                              <span className="text-xs font-bold text-[#1E3A5F]">
                                {line.speaker}：
                              </span>
                            )}
                            <span lang="zh-CN" className="font-zh font-semibold text-[#1F2328]">
                              {line.text}
                            </span>
                            <span className="text-xs text-[#6B7280]">({line.pinyin})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 text-xs font-semibold text-[#555E6B]">
                      日本語訳：{q.translationJa}
                    </div>
                    <div className="mt-1.5 text-xs font-bold text-[#1E3A5F]">
                      なぜこれが正解？
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#2D333B]">
                      {q.explanationJa}
                    </p>
                    {q.tipJa && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[#FDF9EE] px-3 py-1.5 text-xs text-[#6B4E1B]">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C4820E]" />
                        <span>{q.tipJa}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
