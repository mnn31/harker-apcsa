"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { McqCard } from "@/components/mcq-card";
import type { Question } from "@/lib/questions";

export function TopicPractice({ questions }: { questions: Question[] }) {
  const [i, setI] = useState(0);
  const q = questions[i];

  const next = () => setI((v) => (v + 1) % questions.length);

  return (
    <div>
      <AnimatePresence mode="wait">
        <McqCard
          key={q.id}
          q={q}
          index={i}
          total={questions.length}
          onResolve={() => {
            setTimeout(next, 1200);
          }}
        />
      </AnimatePresence>
      {questions.length > 1 && (
        <div className="mt-3 text-center">
          <button
            onClick={next}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-700 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Skip to next →
          </button>
        </div>
      )}
    </div>
  );
}
