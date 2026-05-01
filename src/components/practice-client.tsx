"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flame, RotateCcw, Trophy } from "lucide-react";
import { McqCard } from "@/components/mcq-card";
import { QUESTIONS, type Question } from "@/lib/questions";
import { UNITS } from "@/lib/curriculum";
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

  const pool = useMemo(() => {
    let p = QUESTIONS;
    if (unitFilter) p = p.filter((q) => q.unitId === unitFilter);
    if (tagFilter) p = p.filter((q) => q.trapTags.includes(tagFilter));
    return p;
  }, [unitFilter, tagFilter]);

  const [stats, setStats] = useState<Stats>(empty);
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    if (pool.length === 0) {
      setCurrent(null);
      return;
    }
    const ranked = rankQuestions(pool, stats, history);
    setCurrent(ranked[0]);
  }, [pool, stats, history]);

  const advance = () => {
    if (!current) return;
    setHistory((h) => [current.id, ...h].slice(0, 6));
    setCompleted((c) => c + 1);
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
    setTimeout(advance, 1500);
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

      <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 mb-2 leading-tight">
        {unit ? `Practice: ${unit.title}` : "Mixed practice"}
      </h1>
      <p className="text-slate-600 text-lg max-w-2xl mb-8">
        Adaptive set. Wrong answers nudge you toward the right one — and the
        questions you struggle with come back more often.
      </p>

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
            total={pool.length}
            onResolve={(firstTry) => {
              if (!firstTry) onMissTag(current.trapTags);
              onResolve(firstTry);
            }}
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
