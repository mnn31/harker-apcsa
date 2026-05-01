"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ClipboardList,
  Sparkles,
  CircleCheck,
} from "lucide-react";
import { UNITS, ALL_TOPICS } from "@/lib/curriculum";
import { QUESTIONS } from "@/lib/questions";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-20 gradient-mesh" />
        <div className="absolute -z-10 inset-0 overflow-hidden">
          <div className="blob absolute w-[420px] h-[420px] rounded-full bg-indigo-300/60 -top-20 -left-20" />
          <div
            className="blob absolute w-[520px] h-[520px] rounded-full bg-amber-200/60 top-40 -right-32"
            style={{ animationDelay: "-6s" }}
          />
          <div
            className="blob absolute w-[380px] h-[380px] rounded-full bg-violet-300/60 bottom-0 left-1/3"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur shadow-clay-sm text-[12px] font-semibold text-indigo-700 uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              For Harker students · 2025–26
            </div>
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-slate-900 leading-[0.95] tracking-tight">
              The friendliest path to a{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                5 on APCSA.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-700 max-w-2xl leading-relaxed">
              Every concept on the redesigned AP Computer Science A exam, broken
              into bite-sized slides from <em>Barron&apos;s</em>, paired with
              practice MCQs that nudge you toward the right answer instead of
              just marking you wrong.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/units/u1"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-base inline-flex items-center gap-2 shadow-clay transition-all active:scale-[0.98]"
              >
                Start with Unit 1
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/practice"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-display font-semibold text-base inline-flex items-center gap-2 shadow-clay transition-all active:scale-[0.98]"
              >
                Jump into practice
                <BrainCircuit className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
              {[
                `${UNITS.length} units`,
                `${ALL_TOPICS.length} concepts`,
                `${QUESTIONS.length}+ MCQs with feedback`,
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CircleCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE BLOCKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 sm:-mt-16 relative z-10">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: ClipboardList,
              tint: "from-sky-400 to-indigo-500",
              title: "Slides built from Barron's",
              body: "Each topic distilled into a stack of clear slides — examples, common traps, and the one fact graders love to test.",
            },
            {
              icon: BrainCircuit,
              tint: "from-amber-400 to-orange-500",
              title: "MCQs that nudge, not punish",
              body: "Pick a wrong distractor and we tell you what trap you fell into — without giving away the right answer. Try again until it clicks.",
            },
            {
              icon: Sparkles,
              tint: "from-violet-500 to-fuchsia-500",
              title: "Adaptive review",
              body: "We track which trap-tags you struggle with — over time, practice surfaces more questions in your weak spots.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[28px] p-6 sm:p-7 shadow-clay"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.tint} grid place-items-center shadow-clay-sm mb-4`}
              >
                <f.icon className="w-6 h-6 text-white" strokeWidth={2.4} />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* UNIT GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20 sm:mt-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-[12px] font-semibold tracking-widest text-indigo-700 uppercase">
              Curriculum
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-1">
              Every unit on the exam
            </h2>
          </div>
          <Link
            href="/practice"
            className="text-sm font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
          >
            Mixed practice <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {UNITS.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/units/${u.id}`}
                className="group block rounded-[26px] bg-white p-6 shadow-clay-sm hover:shadow-clay transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`w-full h-2 rounded-full bg-gradient-to-r ${u.accent} mb-5`}
                />
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                    Unit {u.number}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 ml-auto">
                    {u.weight}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">
                  {u.title}
                </h3>
                <p className="text-slate-600 text-[14px] mt-2 leading-relaxed">
                  {u.blurb}
                </p>
                <div className="mt-4 text-xs font-semibold text-slate-500">
                  {u.topics.length} topics
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24 sm:mt-32 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-[36px] p-10 sm:p-16 bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 text-white relative overflow-hidden"
        >
          <div className="absolute -right-20 -bottom-24 w-[420px] h-[420px] rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -left-10 -top-16 w-[340px] h-[340px] rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight max-w-3xl">
              Master every topic. Get the 5.
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-2xl">
              Studying everything on this site is enough to score a 5 on APCSA — that&apos;s the bar we built it to.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/units/u1"
                className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-display font-semibold inline-flex items-center gap-2 shadow-clay-sm active:scale-[0.98]"
              >
                Begin Unit 1 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/practice"
                className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-900 font-display font-semibold inline-flex items-center gap-2 shadow-clay-sm active:scale-[0.98]"
              >
                Practice now <BrainCircuit className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
