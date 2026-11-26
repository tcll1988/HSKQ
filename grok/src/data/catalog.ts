import { AUDIO_SRC, PARTS, QUESTIONS, type Question } from "./h11004";

export type Paper = {
  id: string;
  level: number;
  title: string;
  blurb: string;
  audio?: string;
  fullScore: number;
  pass: number;
  questions: Question[];
};

type JsonMod = { default: Paper };

const extraMods = import.meta.glob("./papers/*.json", { eager: true }) as Record<string, JsonMod>;

const base: Paper = {
  id: "H11004",
  level: 1,
  title: "H11004",
  blurb: "1級 · 聞き20 · 読み20",
  audio: AUDIO_SRC,
  fullScore: 200,
  pass: 120,
  questions: QUESTIONS,
};

export const PAPERS: Paper[] = [
  base,
  ...Object.values(extraMods).map((mod) => mod.default),
].sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));

export function paperById(id: string): Paper {
  return PAPERS.find((p) => p.id === id) ?? PAPERS[0]!;
}

export function partMeta(q: Question) {
  const known = PARTS[q.part];
  const group = q.group ?? known?.group ?? (q.part.startsWith("W") ? "write" : q.part.startsWith("L") ? "listen" : "read");
  return {
    ja: q.partJa || known?.ja || q.part,
    zh: q.partZh || known?.zh || "",
    hint: q.hint || known?.hint || "",
    group: group as "listen" | "read" | "write",
  };
}
