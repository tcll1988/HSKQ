export type AppView = 'home' | 'workspace' | 'report' | 'vocab';
export type StudyMode = 'practice' | 'exam';
export type QuestionOrder = 'sequential' | 'random';
export type PracticeScope = 'all' | 'listening' | 'reading';
export type SectionId = 'listening' | 'reading';

export type PartId =
  | 'L1'
  | 'L2'
  | 'L3'
  | 'L4'
  | 'R1'
  | 'R2'
  | 'R3'
  | 'R4';

export interface RubyToken {
  hanzi: string;
  pinyin?: string;
  isBlank?: boolean;
}

export interface AudioSegment {
  start: number;
  end: number;
}

export interface DialogueLine {
  speaker?: '男' | '女' | '問';
  tokens: RubyToken[];
  text: string;
  pinyin: string;
}

export interface QuestionBase {
  id: number; // 1..40
  section: SectionId;
  part: PartId;
  answer: string; // 'T' | 'F' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  audio?: AudioSegment;
  transcript?: DialogueLine[];
  translationJa: string;
  explanationJa: string;
  tipJa?: string; // Extra Japanese learner point / grammar note
}

export interface ListeningPart1Question extends QuestionBase {
  part: 'L1';
  image: string;
  answer: 'T' | 'F';
}

export interface ListeningPart2Question extends QuestionBase {
  part: 'L2';
  options: { label: 'A' | 'B' | 'C'; image: string; alt: string }[];
  answer: 'A' | 'B' | 'C';
}

export interface ListeningPart3Question extends QuestionBase {
  part: 'L3';
  answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface ListeningPart4Question extends QuestionBase {
  part: 'L4';
  options: {
    label: 'A' | 'B' | 'C';
    tokens: RubyToken[];
    text: string;
    meaningJa: string;
  }[];
  answer: 'A' | 'B' | 'C';
}

export interface ReadingPart1Question extends QuestionBase {
  part: 'R1';
  image: string;
  wordTokens: RubyToken[];
  wordText: string;
  answer: 'T' | 'F';
}

export interface ReadingPart2Question extends QuestionBase {
  part: 'R2';
  tokens: RubyToken[];
  text: string;
  answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface ReadingPart3Question extends QuestionBase {
  part: 'R3';
  tokens: RubyToken[];
  text: string;
  answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface ReadingPart4Question extends QuestionBase {
  part: 'R4';
  lines: {
    speaker?: '男' | '女';
    tokens: RubyToken[];
  }[];
  answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export type HskQuestion =
  | ListeningPart1Question
  | ListeningPart2Question
  | ListeningPart3Question
  | ListeningPart4Question
  | ReadingPart1Question
  | ReadingPart2Question
  | ReadingPart3Question
  | ReadingPart4Question;

export interface PartMeta {
  id: PartId;
  section: SectionId;
  sectionTitleJa: string;
  titleJa: string;
  shortLabelJa: string;
  subtitleJa: string;
  questionRange: [number, number];
  instructionJa: string;
  audioIntro?: AudioSegment;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  posJa: string;
  meaningJa: string;
  noteJa?: string;
  questionIds: number[];
  exampleZh: string;
  examplePinyin: string;
  exampleJa: string;
  category: '人・関係' | '時間・数字' | '日常動作' | '場所・モノ' | '表現・形容';
}
