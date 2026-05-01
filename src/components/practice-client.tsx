"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flame, Infinity as InfinityIcon, RotateCcw, Trophy } from "lucide-react";
import { McqCard } from "@/components/mcq-card";
import { QUESTIONS, type Question } from "@/lib/questions";
import { UNITS } from "@/lib/curriculum";
import { GENERATORS, generateOne } from "@/lib/generators";
import { cn } from "@/lib/utils";

type Stats = {
  trapMisses: Record<string, number>; // tag -> # misses
  seen: Record<string, number>;
  correctFirstTry: number;
  correctEventually: number;
};

const empty: Stats = {
  trapMisses: {},
  seen: {},
  correctFirstTry: 0,
  correctEventually: 0,
};

const STORAGE_KEY = "harker-apcsa.stats.v1";

function loadStats(): Stats {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function saveStats(s: Stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

// Adaptive ordering: weight questions by trap-tags the student has missed.
function rankQuestions(pool: Question[], stats: Stats, history: string[]): Question[] {
  return [...pool].sort((a, b) => {
    const score = (q: Question) => {
      const trapWeight = q.trapTags.reduce(
        (acc, t) => acc + (stats.trapMisses[t] || 0) * 3,
        0
      );
      const seen = stats.seen[q.id] || 0;
      const recencyPenalty = history.indexOf(q.id) >= 0 ? 6 : 0;
      // Higher = surface earlier. Ties broken randomly.
      return trapWeight - seen * 1.2 - recencyPenalty + Math.random() * 0.5;
    };
    return score(b) - score(a);
  });
}

export function PracticeClient() {
  const searchParams = useSearchParams();
  const unitFilter = searchParams.get("unit") || undefined;
  const tagFilter = searchParams.get("tag") || undefined;
  // "endless" = mix in procedurally-generated questions (default ON).
  // ?mode=curated turns this off and only uses hand-written questions.
  const endless = (searchParams.get("mode") || "endless") !== "curated";

  const pool = useMemo(() => {
    let p = QUESTIONS;
    if (unitFilter) p = p.filter((q) => q.unitId === unitFilter);
    if (tagFilter) p = p.filter((q) => q.trapTags.includes(tagFilter));
    return p;
  }, [unitFilter, tagFilter]);

  // How often to inject a generated question vs serve a hand-written one.
  // Higher = more novel, less recall of curated traps. 0.65 keeps things
  // mostly fresh while still surfacing curated questions for retention.
  const generatedShare = endless ? 0.65 : 0;

  const [stats, setStats] = useState<Stats>(empty);
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  // Monotonic seed for the generator so we never repeat within a session.
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));

  useEffect(() => {
    setStats(loadStats());
  }, []);

  // Pull the next question — either curated (ranked by adaptive weights) or generated.
  const pickNext = (
    poolToUse: Question[],
    statsNow: Stats,
    historyNow: string[],
    seedNow: number
  ): Question | null => {
    const wantGenerated = generatedShare > 0 && Math.random() < generatedShare;
    if (wantGenerated) {
      const filter = unitFilter ? { unitId: unitFilter } : undefined;
      const candidates = unitFilter
        ? GENERATORS.filter((g) => g.unitId === unitFilter)
        : GENERATORS;
      if (candidates.length > 0) {
        const q = generateOne(seedNow, filter);
        if (q && (!tagFilter || q.trapTags.includes(tagFilter))) return q;
      }
    }
    const ranked = rankQuestions(poolToUse, statsNow, historyNow);
    return ranked[0] ?? null;
  };

  // Pick a question only when there isn't one (or filters change).
  // Stats updates do NOT re-rank — that would swap the card mid-read.
  useEffect(() => {
    if (pool.length === 0 && !endless) {
      setCurrent(null);
      return;
    }
    setCurrent((cur) => {
      if (cur) return cur;
      return pickNext(pool, loadStats(), [], seed);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, endless]);

  const advance = () => {
    if (!current) return;
    const newHistory = [current.id, ...history].slice(0, 8);
    const newSeed = seed + Math.floor(Math.random() * 1000) + 1;
    setHistory(newHistory);
    setSeed(newSeed);
    setCompleted((c) => c + 1);
    setCurrent(pickNext(pool, stats, newHistory, newSeed));
  };

  const onResolve = (firstTry: boolean) => {
    if (!current) return;
    setStats((prev) => {
      const next: Stats = {
        ...prev,
        seen: { ...prev.seen, [current.id]: (prev.seen[current.id] || 0) + 1 },
        correctFirstTry: prev.correctFirstTry + (firstTry ? 1 : 0),
        correctEventually: prev.correctEventually + 1,
      };
      saveStats(next);
      return next;
    });
    setStreak((s) => (firstTry ? s + 1 : 0));
  };

  const onMissTag = (tags: string[]) => {
    setStats((prev) => {
      const trapMisses = { ...prev.trapMisses };
      for (const t of tags) trapMisses[t] = (trapMisses[t] || 0) + 1;
      const next = { ...prev, trapMisses };
      saveStats(next);
      return next;
    });
  };

  const reset = () => {
    setStats(empty);
    saveStats(empty);
    setHistory([]);
    setStreak(0);
    setCompleted(0);
  };

  const unit = unitFilter ? UNITS.find((u) => u.id === unitFilter) : null;

  const topMisses = Object.entries(stats.trapMisses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </a>
        {unit && (
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            · Unit {unit.number} · {unit.title}
          </span>
        )}
      </div>

      <div className="flex items-end gap-3 flex-wrap mb-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 leading-tight">
          {unit ? `Practice: ${unit.title}` : endless ? "Endless practice" : "Curated practice"}
        </h1>
        {endless && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 text-violet-800 text-[11px] font-bold uppercase tracking-widest">
            <InfinityIcon className="w-3 h-3" /> mixed pool
          </span>
        )}
      </div>
      <p className="text-slate-600 text-lg max-w-2xl mb-4">
        {endless
          ? "Curated questions and freshly-generated trace problems mix together. The pool never runs out — keep going as long as you want."
          : "Curated questions only. Wrong answers nudge you toward the right one; questions you miss come back more often."}
      </p>
      <div className="flex items-center gap-2 text-xs font-semibold mb-8">
        <a
          href={`/practice${unit ? `?unit=${unit.id}` : ""}`}
          className={cn(
            "px-3 py-1.5 rounded-full",
            endless
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300"
          )}
        >
          Endless
        </a>
        <a
          href={`/practice?${unit ? `unit=${unit.id}&` : ""}mode=curated`}
          className={cn(
            "px-3 py-1.5 rounded-full",
            !endless
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-300"
          )}
        >
          Curated only
        </a>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard
          icon={Flame}
          label="Current streak"
          value={streak.toString()}
          tint="from-amber-400 to-orange-500"
        />
        <StatCard
          icon={Trophy}
          label="First-try correct"
          value={`${stats.correctFirstTry}`}
          tint="from-emerald-400 to-teal-500"
        />
        <StatCard
          icon={RotateCcw}
          label="Total resolved"
          value={`${stats.correctEventually}`}
          tint="from-sky-400 to-indigo-500"
        />
      </div>

      <AnimatePresence mode="wait">
        {current ? (
          <McqCard
            key={current.id + completed}
            q={current}
            index={completed}
            total={endless ? undefined : pool.length}
            onResolve={(firstTry) => {
              if (!firstTry) onMissTag(current.trapTags);
              onResolve(firstTry);
            }}
            onNext={advance}
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[28px] shadow-clay p-10 text-center"
          >
            <p className="font-display text-2xl text-slate-900 mb-2">
              No questions match these filters yet.
            </p>
            <p className="text-slate-600">
              Try the{" "}
              <a href="/practice" className="text-indigo-700 font-semibold">
                full mixed set
              </a>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {topMisses.length > 0 && (
        <div className="mt-10 bg-white rounded-[24px] shadow-clay-sm p-6">
          <div className="text-xs font-semibold tracking-widest uppercase text-indigo-700 mb-2">
            Your weak spots
          </div>
          <div className="flex flex-wrap gap-2">
            {topMisses.map(([tag, count]) => (
              <a
                key={tag}
                href={`/practice?tag=${encodeURIComponent(tag)}`}
                className={cn(
                  "px-3 py-1.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
                )}
              >
                {tag.replace(/-/g, " ")}
                <span className="text-rose-500 font-bold">×{count}</span>
              </a>
            ))}
            <button
              onClick={reset}
              className="ml-auto text-xs font-semibold text-slate-500 hover:text-rose-700 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset progress
            </button>
          </div>
        </div>
      )}

      {!unit && (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {UNITS.map((u) => (
            <a
              key={u.id}
              href={`/practice?unit=${u.id}`}
              className="group bg-white rounded-2xl p-4 shadow-clay-sm hover:shadow-clay transition-shadow"
            >
              <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${u.accent} mb-3`} />
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Unit {u.number}
              </div>
              <div className="font-display font-bold text-sm text-slate-900 mt-0.5 group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                {u.title}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="bg-white rounded-[20px] shadow-clay-sm p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tint} grid place-items-center shadow-clay-sm`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2.4} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
          {label}
        </div>
        <div className="font-display font-extrabold text-2xl text-slate-900 leading-none">
          {value}
        </div>
      </div>
    </div>
  );
}
