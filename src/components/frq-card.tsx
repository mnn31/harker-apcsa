"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code2, ListChecks } from "lucide-react";
import type { FRQ } from "@/lib/frqs";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<FRQ["type"], string> = {
  methods: "Methods & Control",
  class: "Class Design",
  array: "Array / ArrayList",
  array2d: "2D Array",
};

const TYPE_TINT: Record<FRQ["type"], string> = {
  methods: "from-emerald-400 to-teal-500",
  class: "from-fuchsia-400 to-pink-500",
  array: "from-amber-400 to-orange-500",
  array2d: "from-sky-400 to-indigo-500",
};

export function FRQCard({ frq }: { frq: FRQ }) {
  return (
    <article className="bg-white rounded-[28px] shadow-clay p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-4">
        <div
          className={cn(
            "px-3 py-1 rounded-full bg-gradient-to-r text-white text-[11px] font-bold uppercase tracking-widest",
            TYPE_TINT[frq.type]
          )}
        >
          {TYPE_LABEL[frq.type]}
        </div>
        <div className="ml-auto text-xs font-semibold text-slate-500">
          {frq.totalPoints} pts
        </div>
      </div>
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
        {frq.title}
      </h2>
      <p className="mt-3 text-slate-700 leading-relaxed text-[15px]">
        {frq.context}
      </p>

      {frq.setup && (
        <div className="mt-5">
          <CodeBlock code={frq.setup} />
        </div>
      )}

      <div className="mt-6 space-y-4">
        {frq.parts.map((p) => (
          <FRQPartView key={p.letter} part={p} />
        ))}
      </div>
    </article>
  );
}

function FRQPartView({
  part,
}: {
  part: FRQ["parts"][number];
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [showRubric, setShowRubric] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-display font-extrabold text-indigo-600 text-lg">
          ({part.letter})
        </span>
        <span className="text-[15px] text-slate-800 leading-relaxed">
          {part.prompt}
        </span>
      </div>

      {part.signature && (
        <div className="mt-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
            Method header
          </div>
          <CodeBlock code={part.signature} />
        </div>
      )}

      {part.example && (
        <div className="mt-3 rounded-xl bg-sky-50 border border-sky-200 px-4 py-3 text-[14px] text-sky-900 leading-relaxed">
          <span className="font-display font-bold">Example: </span>
          {part.example}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowSolution((v) => !v)}
          className={cn(
            "px-3.5 py-2 rounded-2xl text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors",
            showSolution
              ? "bg-slate-900 text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          {showSolution ? "Hide" : "Show"} solution
          <motion.span animate={{ rotate: showSolution ? 180 : 0 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </button>
        <button
          onClick={() => setShowRubric((v) => !v)}
          className={cn(
            "px-3.5 py-2 rounded-2xl text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors",
            showRubric
              ? "bg-amber-400 text-slate-900"
              : "bg-amber-50 hover:bg-amber-100 text-amber-800"
          )}
        >
          <ListChecks className="w-3.5 h-3.5" />
          {showRubric ? "Hide" : "Show"} rubric ({part.rubric.length} pts)
          <motion.span animate={{ rotate: showRubric ? 180 : 0 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {showSolution && (
          <motion.div
            key="sol"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 mb-1.5">
                Model solution
              </div>
              <CodeBlock code={part.solution} />
            </div>
          </motion.div>
        )}
        {showRubric && (
          <motion.div
            key="rub"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl bg-amber-50/60 border border-amber-200 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-800 mb-2">
                Rubric
              </div>
              <ul className="space-y-1.5">
                {part.rubric.map((r, i) => (
                  <li
                    key={i}
                    className="text-[14px] text-amber-900 leading-relaxed flex gap-2"
                  >
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
