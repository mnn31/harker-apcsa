"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, BrainCircuit } from "lucide-react";
import type { Unit } from "@/lib/curriculum";

export function UnitHero({ unit, qCount }: { unit: Unit; qCount: number }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${unit.accent} opacity-20`} />
      <div className="absolute -z-10 inset-0">
        <div
          className={`blob absolute w-[420px] h-[420px] rounded-full bg-gradient-to-br ${unit.accent} -top-20 -right-32`}
          style={{ opacity: 0.35 }}
        />
        <div
          className={`blob absolute w-[320px] h-[320px] rounded-full bg-gradient-to-br ${unit.accent} -bottom-10 -left-20`}
          style={{ opacity: 0.3, animationDelay: "-5s" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All units
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${unit.accent} grid place-items-center shadow-clay-sm font-display font-extrabold text-white text-lg`}
            >
              {unit.number}
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-indigo-700">
                Unit {unit.number} · Exam weight {unit.weight}
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 leading-tight">
                {unit.title}
              </h1>
            </div>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed max-w-2xl mt-3">
            {unit.blurb}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/units/${unit.id}/${unit.topics[0].id}`}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-sm inline-flex items-center gap-2 shadow-clay-sm active:scale-[0.98]"
            >
              Start with {unit.topics[0].title} <ArrowRight className="w-4 h-4" />
            </Link>
            {qCount > 0 && (
              <Link
                href={`/practice?unit=${unit.id}`}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-display font-semibold text-sm inline-flex items-center gap-2 shadow-clay-sm active:scale-[0.98]"
              >
                <BrainCircuit className="w-4 h-4" /> {qCount} MCQs ready
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
