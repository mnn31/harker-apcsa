"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, AlertTriangle, Key } from "lucide-react";
import type { Slide } from "@/lib/curriculum";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

const calloutStyle = {
  tip: {
    icon: Lightbulb,
    cls: "bg-sky-50 text-sky-900 border-sky-200",
    label: "Tip",
  },
  trap: {
    icon: AlertTriangle,
    cls: "bg-rose-50 text-rose-900 border-rose-200",
    label: "Trap",
  },
  key: {
    icon: Key,
    cls: "bg-amber-50 text-amber-900 border-amber-200",
    label: "Key idea",
  },
};

export function SlideDeck({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const slide = slides[i];
  const can = (d: number) => i + d >= 0 && i + d < slides.length;
  const go = (d: number) => can(d) && setI((v) => v + d);

  return (
    <div className="bg-white rounded-[28px] shadow-clay p-6 sm:p-8 min-h-[420px] flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
          Slide {i + 1} of {slides.length}
        </div>
        <div className="ml-auto flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === i ? "w-8 bg-indigo-500" : "w-1.5 bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col"
        >
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-3">
            {slide.title}
          </h3>
          <p className="text-slate-700 leading-relaxed text-[15px] sm:text-base mb-4">
            {slide.body}
          </p>

          {slide.code && (
            <div className="mb-4">
              <CodeBlock code={slide.code} />
            </div>
          )}

          {slide.callout && (() => {
            const cfg = calloutStyle[slide.callout.kind];
            const Icon = cfg.icon;
            return (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 flex gap-3 mt-auto",
                  cfg.cls
                )}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-bold text-sm uppercase tracking-wider mb-0.5">
                    {cfg.label}
                  </div>
                  <div className="text-[14px] leading-relaxed">
                    {slide.callout.text}
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          disabled={!can(-1)}
          className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-40 hover:bg-slate-200 transition-colors active:scale-[0.97]"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => go(1)}
          disabled={!can(1)}
          className="ml-auto px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-40 shadow-clay-sm active:scale-[0.97]"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
