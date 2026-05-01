"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import type { Question } from "@/lib/questions";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

type Outcome = {
  letter: string;
  state: "wrong" | "right";
  nudge?: string;
};

export function McqCard({
  q,
  onResolve,
  onNext,
  index,
  total,
}: {
  q: Question;
  onResolve?: (correctOnFirstTry: boolean) => void;
  onNext?: () => void;
  index?: number;
  total?: number;
}) {
  const [picks, setPicks] = useState<Outcome[]>([]);
  const [solved, setSolved] = useState(false);
  const [firstTry, setFirstTry] = useState(true);

  useEffect(() => {
    setPicks([]);
    setSolved(false);
    setFirstTry(true);
  }, [q.id]);

  const onPick = (letter: Question["correct"]) => {
    if (solved) return;
    if (picks.some((p) => p.letter === letter)) return;
    if (letter === q.correct) {
      setPicks((p) => [...p, { letter, state: "right" }]);
      setSolved(true);
      onResolve?.(firstTry);
    } else {
      const choice = q.choices.find((c) => c.letter === letter);
      setPicks((p) => [...p, { letter, state: "wrong", nudge: choice?.nudge }]);
      setFirstTry(false);
    }
  };

  const reset = () => {
    setPicks([]);
    setSolved(false);
    setFirstTry(true);
  };

  const status = (letter: string) =>
    picks.find((p) => p.letter === letter)?.state;

  return (
    <motion.article
      key={q.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-[28px] shadow-clay p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider">
        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
          Topic {q.topicId.replace("-", ".")}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
          Difficulty {"·".repeat(q.difficulty)}
        </span>
        {typeof index === "number" && typeof total === "number" && (
          <span className="ml-auto text-slate-400 normal-case tracking-normal">
            {index + 1} / {total}
          </span>
        )}
      </div>

      <h3 className="font-display text-xl sm:text-2xl text-slate-900 mb-4 leading-snug">
        {q.prompt}
      </h3>

      {q.code && (
        <div className="mb-5">
          <CodeBlock code={q.code} />
        </div>
      )}

      <div className="grid gap-2.5">
        {q.choices.map((c) => {
          const s = status(c.letter);
          return (
            <motion.button
              key={c.letter}
              onClick={() => onPick(c.letter)}
              disabled={solved || s === "wrong"}
              whileTap={{ scale: solved || s === "wrong" ? 1 : 0.985 }}
              className={cn(
                "group relative text-left w-full rounded-2xl border-2 px-4 py-3 sm:px-5 sm:py-3.5 flex items-start gap-3 transition-all",
                "font-medium",
                s === "right" &&
                  "border-emerald-300 bg-emerald-50 text-emerald-900",
                s === "wrong" &&
                  "border-rose-200 bg-rose-50/70 text-rose-700 line-through opacity-60",
                !s && !solved &&
                  "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer",
                !s && solved &&
                  "border-slate-200 bg-white opacity-60"
              )}
            >
              <span
                className={cn(
                  "shrink-0 w-7 h-7 rounded-xl grid place-items-center text-sm font-bold",
                  s === "right" && "bg-emerald-500 text-white",
                  s === "wrong" && "bg-rose-300 text-rose-900",
                  !s && "bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200"
                )}
              >
                {s === "right" ? <Check className="w-4 h-4" /> : c.letter}
              </span>
              <span className="text-[15px] sm:text-base leading-relaxed pt-0.5">
                {c.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {picks
          .filter((p) => p.state === "wrong")
          .slice(-1)
          .map((p) => (
            <motion.div
              key={p.letter}
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24 }}
              className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 sm:px-5 sm:py-4 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[14px] leading-relaxed text-amber-900">
                <div className="font-display font-bold mb-0.5">
                  Not quite — but you're closer than you think.
                </div>
                {p.nudge ?? "Re-read the question carefully and check each operator."}
              </div>
            </motion.div>
          ))}

        {solved && (
          <motion.div
            key="solved"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 sm:px-5 sm:py-4 flex gap-3"
          >
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[14px] leading-relaxed text-emerald-900">
              <div className="font-display font-bold mb-0.5">
                {firstTry ? "Got it on the first try!" : "There it is."}
              </div>
              {q.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={reset}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-700 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <div className="text-xs text-slate-400">
          {picks.filter((p) => p.state === "wrong").length} attempt
          {picks.filter((p) => p.state === "wrong").length === 1 ? "" : "s"}
        </div>
        {solved && onNext && (
          <button
            onClick={onNext}
            className="ml-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold inline-flex items-center gap-1.5 shadow-clay-sm active:scale-[0.97]"
          >
            Next question <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.article>
  );
}
