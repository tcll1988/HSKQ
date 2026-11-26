import { useEffect, useMemo, useRef, useState } from "react";
import {
  AUDIO_SRC,
  PARTS,
  QUESTIONS,
  questionsIn,
  type PartId,
  type Question,
  type Seg,
} from "@/data/h11004";

type Mode = "practice" | "exam";
type Order = "fixed" | "random";
type Scope = "all" | "listen" | "read" | PartId;
type Phase = "home" | "run" | "result";

type RunState = {
  mode: Mode;
  order: Order;
  scope: Scope;
  ids: number[];
  index: number;
  picks: Record<number, string>;
  revealed: Record<number, boolean>;
  firstOk: Record<number, boolean>;
  started: number;
};

const SCOPES: { id: Scope; label: string }[] = [
  { id: "all", label: "全部 40問" },
  { id: "listen", label: "リスニング" },
  { id: "read", label: "読解" },
  { id: "L1", label: "聞き 1" },
  { id: "L2", label: "聞き 2" },
  { id: "L3", label: "聞き 3" },
  { id: "L4", label: "聞き 4" },
  { id: "R1", label: "読み 1" },
  { id: "R2", label: "読み 2" },
  { id: "R3", label: "読み 3" },
  { id: "R4", label: "読み 4" },
];

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j]!;
    a[j] = t!;
  }
  return a;
}

function byId(id: number): Question {
  const q = QUESTIONS.find((item) => item.id === id);
  if (!q) throw new Error("missing question");
  return q;
}

function RubyLine({ parts, py }: { parts: Seg[]; py: boolean }) {
  return (
    <span className="inline leading-relaxed">
      {parts.map((p, i) =>
        py && p.py ? (
          <ruby key={i}>
            {p.hz}
            <rt>{p.py}</rt>
          </ruby>
        ) : (
          <span key={i}>{p.hz}</span>
        ),
      )}
    </span>
  );
}

function playClip(audio: HTMLAudioElement, start: number, end: number) {
  const stop = () => {
    if (audio.currentTime >= end - 0.08) {
      audio.pause();
      audio.removeEventListener("timeupdate", stop);
    }
  };
  audio.pause();
  audio.removeEventListener("timeupdate", stop);
  const begin = () => {
    audio.addEventListener("timeupdate", stop);
    void audio.play().catch(() => {});
  };
  const onSeeked = () => {
    audio.removeEventListener("seeked", onSeeked);
    begin();
  };
  if (Math.abs(audio.currentTime - start) < 0.08) begin();
  else {
    audio.addEventListener("seeked", onSeeked);
    audio.currentTime = start;
  }
}

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function HskApp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<Phase>("home");
  const [mode, setMode] = useState<Mode>("practice");
  const [order, setOrder] = useState<Order>("fixed");
  const [scope, setScope] = useState<Scope>("all");
  const [py, setPy] = useState(true);
  const [run, setRun] = useState<RunState | null>(null);
  const [now, setNow] = useState(Date.now());
  const [onlyWrong, setOnlyWrong] = useState(false);

  useEffect(() => {
    if (phase !== "run" || !run) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [phase, run]);

  useEffect(() => {
    audioRef.current?.pause();
  }, [run?.index, phase]);

  const q = run ? byId(run.ids[run.index] ?? 1) : null;
  const picked = q && run ? run.picks[q.id] : undefined;
  const revealed = q && run ? Boolean(run.revealed[q.id]) : false;
  const correctNow = Boolean(q && picked && picked === q.answer);
  const canNext = run?.mode === "exam" ? true : correctNow;

  const score = useMemo(() => {
    if (!run) return null;
    const ids = run.ids;
    const ok = ids.filter((id) =>
      run.mode === "practice" ? run.firstOk[id] : run.picks[id] === byId(id).answer,
    );
    const listenIds = ids.filter((id) => PARTS[byId(id).part].group === "listen");
    const readIds = ids.filter((id) => PARTS[byId(id).part].group === "read");
    const count = (list: number[]) =>
      list.filter((id) =>
        run.mode === "practice" ? run.firstOk[id] : run.picks[id] === byId(id).answer,
      ).length;
    return {
      ok: ok.length,
      total: ids.length,
      points: ok.length * 5,
      max: ids.length * 5,
      listen: count(listenIds),
      listenN: listenIds.length,
      read: count(readIds),
      readN: readIds.length,
      wrong: ids.filter((id) =>
        run.mode === "practice" ? !run.firstOk[id] : run.picks[id] !== byId(id).answer,
      ),
    };
  }, [run]);

  function start(nextMode = mode) {
    const base = questionsIn(scope).map((item) => item.id);
    const ids = order === "random" ? shuffle(base) : base;
    setRun({
      mode: nextMode,
      order,
      scope,
      ids,
      index: 0,
      picks: {},
      revealed: {},
      firstOk: {},
      started: Date.now(),
    });
    setNow(Date.now());
    setPhase("run");
    setOnlyWrong(false);
  }

  function choose(key: string) {
    if (!run || !q) return;
    if (run.mode === "exam") {
      setRun({ ...run, picks: { ...run.picks, [q.id]: key } });
      return;
    }
    if (run.firstOk[q.id]) return;
    const right = key === q.answer;
    const first = run.revealed[q.id] ? run.firstOk[q.id] : right;
    setRun({
      ...run,
      picks: { ...run.picks, [q.id]: key },
      revealed: { ...run.revealed, [q.id]: run.revealed[q.id] || !right },
      firstOk: { ...run.firstOk, [q.id]: Boolean(first) },
    });
  }

  function go(delta: number) {
    if (!run) return;
    const next = run.index + delta;
    if (next < 0 || next >= run.ids.length) return;
    if (delta > 0 && run.mode === "practice" && !canNext) return;
    setRun({ ...run, index: next });
  }

  function finish() {
    if (!run) return;
    if (run.mode === "practice" && q && !canNext) return;
    setPhase("result");
  }

  function retryWrong() {
    if (!run || !score || score.wrong.length === 0) return;
    const ids = run.order === "random" ? shuffle(score.wrong) : [...score.wrong];
    setRun({
      mode: "practice",
      order: run.order,
      scope: run.scope,
      ids,
      index: 0,
      picks: {},
      revealed: {},
      firstOk: {},
      started: Date.now(),
    });
    setPhase("run");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />
      {phase === "home" && (
        <Home
          mode={mode}
          order={order}
          scope={scope}
          py={py}
          onMode={setMode}
          onOrder={setOrder}
          onScope={setScope}
          onPy={setPy}
          onStart={() => start(mode)}
        />
      )}
      {phase === "run" && run && q && (
        <QuestionView
          run={run}
          q={q}
          py={py}
          onPy={setPy}
          picked={picked}
          revealed={revealed}
          canNext={canNext}
          now={now}
          onChoose={choose}
          onPlay={() => {
            const a = audioRef.current;
            if (a && q.audio) playClip(a, q.audio[0], q.audio[1]);
          }}
          onPrev={() => go(-1)}
          onNext={() => {
            if (run.index >= run.ids.length - 1) finish();
            else go(1);
          }}
          onQuit={() => setPhase("home")}
        />
      )}
      {phase === "result" && run && score && (
        <Result
          run={run}
          score={score}
          py={py}
          onlyWrong={onlyWrong}
          onOnlyWrong={setOnlyWrong}
          onHome={() => setPhase("home")}
          onAgain={() => start(run.mode)}
          onWrong={retryWrong}
        />
      )}
    </div>
  );
}

function Home(props: {
  mode: Mode;
  order: Order;
  scope: Scope;
  py: boolean;
  onMode: (m: Mode) => void;
  onOrder: (o: Order) => void;
  onScope: (s: Scope) => void;
  onPy: (v: boolean) => void;
  onStart: () => void;
}) {
  const n = questionsIn(props.scope).length;
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-12">
      <p className="font-serif text-sm tracking-widest text-seal">新汉语水平考试 · 一级</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        HSK 1級
        <span className="mt-1 block text-2xl font-medium text-muted sm:text-3xl">過去問 H11004</span>
      </h1>
      <p className="mt-4 max-w-xl text-base text-ink">
        日本の大学の授業用です。中国語の問題に、なぜその答えになるかを日本語で説明します。リスニング20問、読解20問。1問5点、200点満点、120点で合格です。
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <ModeCard
          on={props.mode === "practice"}
          title="練習モード"
          body="間違えると、正解と「なぜそうなるか」が出ます。正しい答えを選び直さないと、次の問題には進めません。"
          onClick={() => props.onMode("practice")}
        />
        <ModeCard
          on={props.mode === "exam"}
          title="試験モード"
          body="途中では答えを出しません。最後にまとめて採点し、一問ずつなぜその答えかを見られます。"
          onClick={() => props.onMode("exam")}
        />
      </section>

      <section className="mt-6 rounded-xl border border-line bg-card p-4 sm:p-5">
        <h2 className="text-sm font-medium text-muted">出題範囲</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => props.onScope(s.id)}
              className={
                "min-h-11 rounded-lg border px-3 text-sm " +
                (props.scope === s.id
                  ? "border-seal bg-seal text-card"
                  : "border-line bg-paper text-ink")
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        <h2 className="mt-5 text-sm font-medium text-muted">出題の順番</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <OrderBtn
            on={props.order === "fixed"}
            title="原題の順番"
            body="本試験と同じ、第1問から。"
            onClick={() => props.onOrder("fixed")}
          />
          <OrderBtn
            on={props.order === "random"}
            title="ランダム"
            body="選んだ範囲を毎回シャッフルします。"
            onClick={() => props.onOrder("random")}
          />
        </div>
        <label className="mt-5 flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={props.py}
            onChange={(e) => props.onPy(e.target.checked)}
            className="size-4 accent-seal"
          />
          ピンインを表示する
        </label>
      </section>

      <button
        type="button"
        onClick={props.onStart}
        className="mt-6 min-h-12 rounded-xl bg-seal px-6 text-base font-medium text-card"
      >
        {props.mode === "practice" ? "練習をはじめる" : "試験をはじめる"}（{n}問）
      </button>
      <p className="mt-4 text-sm text-muted">
        音声は本試験の録音です。再生ボタンを押すと、その問題が2回流ます。イヤホンがあると聞き取りやすいです。
      </p>
    </main>
  );
}

function ModeCard(props: { on: boolean; title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        "rounded-xl border p-4 text-left " +
        (props.on ? "border-seal bg-seal-soft" : "border-line bg-card")
      }
    >
      <span className="block font-serif text-xl">{props.title}</span>
      <span className="mt-2 block text-sm leading-relaxed text-muted">{props.body}</span>
    </button>
  );
}

function OrderBtn(props: { on: boolean; title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        "min-h-11 rounded-lg border px-3 py-2 text-left " +
        (props.on ? "border-seal bg-seal-soft" : "border-line bg-paper")
      }
    >
      <span className="block text-sm font-medium">{props.title}</span>
      <span className="block text-sm text-muted">{props.body}</span>
    </button>
  );
}

function QuestionView(props: {
  run: RunState;
  q: Question;
  py: boolean;
  onPy: (v: boolean) => void;
  picked?: string;
  revealed: boolean;
  canNext: boolean;
  now: number;
  onChoose: (k: string) => void;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onQuit: () => void;
}) {
  const { q, run } = props;
  const part = PARTS[q.part];
  const last = run.index === run.ids.length - 1;
  const showWhy = run.mode === "practice" && (props.revealed || props.picked === q.answer);
  const pics = q.choices.some((c) => c.image);
  const judge = q.choices.length === 2 && !pics && q.choices.every((c) => c.key === "T" || c.key === "F");

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={props.onQuit} className="min-h-11 rounded-lg px-2 text-sm text-muted">
          やめる
        </button>
        <span className="rounded-lg bg-seal-soft px-2 py-1 text-sm text-seal">
          {run.mode === "practice" ? "練習" : "試験"}
        </span>
        <span className="text-sm text-muted">
          {run.index + 1} / {run.ids.length}
        </span>
        <span className="ml-auto text-sm tabular-nums text-muted">{clock(props.now - run.started)}</span>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.py}
            onChange={(e) => props.onPy(e.target.checked)}
            className="size-4 accent-seal"
          />
          拼音
        </label>
      </header>

      <p className="mt-3 font-serif text-lg">{part.ja}</p>
      <p className="text-sm text-muted">
        第{q.id}問 · {part.zh}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{part.hint}</p>

      {q.audio && (
        <button
          type="button"
          onClick={props.onPlay}
          className="mt-4 min-h-12 w-full rounded-xl bg-ink px-4 text-base font-medium text-card sm:w-auto"
        >
          音声を再生する
        </button>
      )}

      {q.image && (
        <img
          src={q.image}
          alt=""
          className="mx-auto mt-4 max-h-56 w-auto max-w-full rounded-lg border border-line bg-card object-contain p-2"
        />
      )}

      {q.stem && (
        <p className="mt-4 rounded-xl border border-line bg-card px-4 py-3 text-lg">
          <RubyLine parts={q.stem} py={props.py} />
        </p>
      )}

      <div
        className={
          pics
            ? "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
            : judge
              ? "mt-4 grid gap-2 sm:grid-cols-2"
              : "mt-4 grid gap-2"
        }
      >
        {q.choices.map((c) => {
          const on = props.picked === c.key;
          const isAns = c.key === q.answer;
          const showMark = run.mode === "practice" && props.revealed;
          let cls = "border-line bg-card";
          if (showMark && isAns) cls = "border-ok bg-ok-soft";
          else if (showMark && on && !isAns) cls = "border-seal bg-bad-soft";
          else if (on) cls = "border-seal bg-seal-soft";
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => props.onChoose(c.key)}
              disabled={run.mode === "practice" && Boolean(run.firstOk[q.id])}
              className={"min-h-12 rounded-xl border p-3 text-left " + cls}
            >
              <span className="mr-2 font-serif text-seal">{c.key === "T" ? "○" : c.key === "F" ? "×" : c.key}</span>
              {c.image ? (
                <img src={c.image} alt="" className="mt-2 max-h-36 w-full object-contain" />
              ) : (
                c.segs && <RubyLine parts={c.segs} py={props.py} />
              )}
            </button>
          );
        })}
      </div>

      {showWhy && (
        <section className="mt-4 rounded-xl border border-ok bg-ok-soft p-4">
          <h2 className="font-serif text-lg text-ok">
            {props.revealed && props.picked !== q.answer
              ? "違います。なぜこの答えか"
              : "正解です。なぜこの答えか"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            正解は {q.answer === "T" ? "合っている（○）" : q.answer === "F" ? "違う（×）" : q.answer}
          </p>
          {q.transcript && (
            <p className="mt-2 text-base">
              聞こえた内容：
              <RubyLine parts={q.transcript} py={props.py} />
            </p>
          )}
          <p className="mt-2 text-base leading-relaxed">{q.explain}</p>
          {run.mode === "practice" && !props.canNext && (
            <p className="mt-3 text-sm font-medium text-seal">
              正しい答えを押し直すと、次の問題へ進めます。
            </p>
          )}
        </section>
      )}

      <footer className="mt-6 flex gap-2 pb-8">
        {run.mode === "exam" && (
          <button
            type="button"
            onClick={props.onPrev}
            disabled={run.index === 0}
            className="min-h-12 flex-1 rounded-xl border border-line bg-card text-sm disabled:opacity-40"
          >
            前の問題
          </button>
        )}
        <button
          type="button"
          onClick={props.onNext}
          disabled={!props.canNext}
          className="min-h-12 flex-1 rounded-xl bg-seal text-base font-medium text-card disabled:opacity-40"
        >
          {last ? (run.mode === "exam" ? "提出して採点する" : "結果を見る") : "次の問題"}
        </button>
      </footer>
    </main>
  );
}

function Result(props: {
  run: RunState;
  score: {
    ok: number;
    total: number;
    points: number;
    max: number;
    listen: number;
    listenN: number;
    read: number;
    readN: number;
    wrong: number[];
  };
  py: boolean;
  onlyWrong: boolean;
  onOnlyWrong: (v: boolean) => void;
  onHome: () => void;
  onAgain: () => void;
  onWrong: () => void;
}) {
  const passLine = Math.ceil(props.score.max * 0.6);
  const passed = props.score.points >= passLine;
  const list = props.onlyWrong ? props.score.wrong : props.run.ids;
  const label = props.run.mode === "practice" ? "最初の回答が正解だった数" : "正解数";
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted">{props.run.mode === "practice" ? "練習の結果" : "試験の結果"}</p>
      <p className="mt-2 font-serif text-6xl font-semibold leading-none text-seal">{props.score.points}</p>
      <p className="mt-1 text-lg">
        / {props.score.max}点
        <span className={"ml-3 font-medium " + (passed ? "text-ok" : "text-seal")}>
          {passed ? "合格ライン以上" : "合格ライン未達"}
        </span>
      </p>
      <p className="mt-2 text-sm text-muted">
        {label} {props.score.ok} / {props.score.total}
        {props.score.listenN > 0 && `　聞き ${props.score.listen * 5} / ${props.score.listenN * 5}点`}
        {props.score.readN > 0 && `　読み ${props.score.read * 5} / ${props.score.readN * 5}点`}
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        この範囲の合格目安は {passLine}点（6割）です。本試験全体なら120点 / 200点です。下は、なぜその答えになるかの解説です。
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={props.onHome} className="min-h-11 rounded-lg border border-line bg-card px-3 text-sm">
          最初の画面
        </button>
        <button type="button" onClick={props.onAgain} className="min-h-11 rounded-lg bg-seal px-3 text-sm text-card">
          同じ設定でもう一度
        </button>
        {props.score.wrong.length > 0 && (
          <button type="button" onClick={props.onWrong} className="min-h-11 rounded-lg border border-seal px-3 text-sm text-seal">
            間違えた{props.score.wrong.length}問だけ練習
          </button>
        )}
      </div>
      <label className="mt-4 flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.onlyWrong}
          onChange={(e) => props.onOnlyWrong(e.target.checked)}
          className="size-4 accent-seal"
        />
        間違えた問題の解説だけ見る
      </label>
      <ol className="mt-2 space-y-3 pb-10">
        {list.map((id) => {
          const q = byId(id);
          const pick = props.run.picks[id];
          const ok = props.run.mode === "practice" ? props.run.firstOk[id] : pick === q.answer;
          return (
            <li key={id} className="rounded-xl border border-line bg-card p-4">
              <p className="text-sm text-muted">
                第{q.id}問 · {PARTS[q.part].ja}
                <span className={"ml-2 font-medium " + (ok ? "text-ok" : "text-seal")}>
                  {ok ? "正解" : "不正解"}
                </span>
              </p>
              {q.stem && (
                <p className="mt-1">
                  <RubyLine parts={q.stem} py={props.py} />
                </p>
              )}
              <p className="mt-2 text-sm">
                正解は {q.answer === "T" ? "合っている" : q.answer === "F" ? "違う" : q.answer}
                {!ok && pick && (
                  <>
                    {" "}
                    / あなたの答え{" "}
                    {pick === "T" ? "合っている" : pick === "F" ? "違う" : pick}
                  </>
                )}
              </p>
              <p className="mt-2 text-sm font-medium text-ok">なぜこの答えか</p>
              <p className="mt-1 text-sm leading-relaxed">{q.explain}</p>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
