import React from 'react';
import type { RubyToken } from '../types';

interface RubyTextProps {
  tokens: RubyToken[];
  showPinyin: boolean;
  className?: string;
  filledBlank?: {
    hanzi: string;
    pinyin: string;
    status?: 'neutral' | 'correct' | 'wrong';
  } | null;
}

export const RubyText: React.FC<RubyTextProps> = ({
  tokens,
  showPinyin,
  className = '',
  filledBlank = null,
}) => {
  return (
    <span
      lang="zh-CN"
      className={`font-zh inline-flex flex-wrap items-end gap-x-1 gap-y-2 leading-relaxed ${className}`}
    >
      {tokens.map((tok, idx) => {
        if (tok.isBlank) {
          const statusClasses =
            filledBlank?.status === 'correct'
              ? 'border-[#2E7D5B] bg-[#2E7D5B]/10 text-[#1F5D42]'
              : filledBlank?.status === 'wrong'
              ? 'border-[#C83E2B] bg-[#C83E2B]/10 text-[#A82E1E]'
              : filledBlank
              ? 'border-[#1E3A5F] bg-[#1E3A5F]/10 text-[#1E3A5F]'
              : 'border-[#B9B0A0] bg-[#FAF8F4] text-[#8A8172]';

          return (
            <span
              key={idx}
              className={`mx-1 inline-flex min-w-[3.2em] items-end justify-center rounded-md border-b-2 px-2 pb-0.5 pt-1 font-semibold transition-colors ${statusClasses}`}
            >
              {filledBlank ? (
                showPinyin ? (
                  <ruby>
                    {filledBlank.hanzi}
                    <rt>{filledBlank.pinyin}</rt>
                  </ruby>
                ) : (
                  <span>{filledBlank.hanzi}</span>
                )
              ) : (
                <span className="text-sm tracking-widest opacity-60">（　）</span>
              )}
            </span>
          );
        }

        if (!tok.pinyin || !showPinyin) {
          return (
            <span key={idx} className="inline-block">
              {tok.hanzi}
            </span>
          );
        }

        return (
          <ruby key={idx} className="mx-[1px]">
            {tok.hanzi}
            <rt>{tok.pinyin}</rt>
          </ruby>
        );
      })}
    </span>
  );
};
