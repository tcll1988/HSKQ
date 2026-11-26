import React from 'react';
import { CheckCircle2, Flag, Send } from 'lucide-react';
import type { HskQuestion, PartId, QuestionOrder } from '../types';

interface AnswerSheetProps {
  listeningQuestions: HskQuestion[];
  readingQuestions: HskQuestion[];
  answers: Record<number, string>;
  flagged: Record<number, boolean>;
  submitted: boolean;
  examOrder: QuestionOrder;
  activePart: PartId;
  activeTimelineQuestionId?: number;
  onJumpToQuestion: (qId: number, part: PartId) => void;
  onSubmit: () => void;
  onViewReport: () => void;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({
  listeningQuestions,
  readingQuestions,
  answers,
  flagged,
  submitted,
  examOrder,
  activePart,
  activeTimelineQuestionId,
  onJumpToQuestion,
  onSubmit,
  onViewReport,
}) => {
  const answeredTotal = Object.keys(answers).length;

  const renderGroup = (
    title: string,
    qs: HskQuestion[],
    accent: string,
    offsetIndex: number
  ) => (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#555E6B]">
        <span className={accent}>{title}</span>
        <span className="tabular-nums text-[#847B6D]">
          {qs.filter((q) => Boolean(answers[q.id])).length} / {qs.length}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {qs.map((q, idx) => {
          const ans = answers[q.id];
          const isFlag = !!flagged[q.id];
          const isCurrentPart = examOrder === 'sequential' && q.part === activePart;
          const isLive = activeTimelineQuestionId === q.id;
          const displayNum = examOrder === 'random' ? offsetIndex + idx + 1 : q.id;

          let cls =
            'border-[#E4DDD0] bg-[#FAF8F4] text-[#555E6B] hover:border-[#1E3A5F]';
          if (submitted) {
            if (ans === q.answer) {
              cls = 'border-[#2E7D5B] bg-[#E9F6EF] text-[#1F5D42]';
            } else {
              cls = 'border-[#C83E2B] bg-[#FDF0EE] text-[#A82E1E]';
            }
          } else if (ans) {
            cls = 'border-[#1E3A5F] bg-[#1E3A5F] text-white';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpToQuestion(q.id, q.part)}
              className={`relative flex h-9 cursor-pointer items-center justify-center rounded-lg border text-xs font-bold tabular-nums transition ${cls} ${
                isLive
                  ? 'ring-2 ring-[#C83E2B] ring-offset-1'
                  : isCurrentPart
                  ? 'ring-1 ring-[#1E3A5F]/25'
                  : ''
              }`}
              title={`第${displayNum}問（元問題 第${q.id}問）`}
            >
              {displayNum}
              {isFlag && (
                <Flag className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 fill-[#D9820B] text-[#D9820B]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="rounded-2xl border border-[#E6DFD1] bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between border-b border-[#F0EAE0] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1F2328]">解答シート</h3>
          <p className="text-[11px] text-[#847B6D]">番号クリックで移動</p>
        </div>
        <span className="rounded-full bg-[#FAF8F4] px-2.5 py-1 text-xs font-bold tabular-nums text-[#1F2328] ring-1 ring-[#E6DFD1]">
          {answeredTotal} / 40
        </span>
      </div>

      <div className="space-y-4">
        {renderGroup('リスニング（1〜20）', listeningQuestions, 'text-[#C83E2B]', 0)}
        {renderGroup('リーディング（21〜40）', readingQuestions, 'text-[#1E3A5F]', 20)}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[#F0EAE0] pt-3 text-[11px] text-[#736B5E]">
        {submitted ? (
          <>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#2E7D5B]" />
              正解
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#C83E2B]" />
              不正解・未解答
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#1E3A5F]" />
              解答済み
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-xs border border-[#D4CCBD] bg-[#FAF8F4]" />
              未解答
            </span>
          </>
        )}
        <span className="flex items-center gap-1">
          <Flag className="h-2.5 w-2.5 fill-[#D9820B] text-[#D9820B]" />
          見直し
        </span>
      </div>

      <div className="mt-4">
        {submitted ? (
          <button
            type="button"
            onClick={onViewReport}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#162D4A]"
          >
            <CheckCircle2 className="h-4 w-4" />
            成績レポートを見る
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C83E2B] py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#AE3221]"
          >
            <Send className="h-4 w-4" />
            採点・提出する
          </button>
        )}
      </div>
    </aside>
  );
};
