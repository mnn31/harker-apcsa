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
import { FRQS } from "@/lib/frqs";

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
            <div className="text-[12px] font-semibold text-indigo-700 uppercase tracking-widest mb-4">
              AP Computer Science A · Ms. Anu Datar
            </div>
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-slate-900 leading-[0.95] tracking-tight">
              Harker APCSA <span className="text-indigo-600">review hub</span>.
            </h1>
            <p className="mt-6 text-lg text-slate-700 max-w-2xl leading-relaxed">
              Every concept on the AP Computer Science A exam, broken into
              short teaching slides and paired with practice MCQs. Wrong
              answers come with a hint that explains the trap, so you can
              find the right answer yourself.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/units/u1"
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold text-base inline-flex items-center gap-2 shadow-clay-sm transition-all active:scale-[0.98]"
              >
                Open Unit 1
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/practice"
                className="px-6 py-3 rounded-2xl bg-white text-slate-800 font-display font-semibold text-base inline-flex items-center gap-2 shadow-clay-sm border border-slate-200 hover:border-indigo-300 transition-all active:scale-[0.98]"
              >
                Practice
                <BrainCircuit className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              {[
                `${UNITS.length} units · ${ALL_TOPICS.length} topics`,
                `${QUESTIONS.length} curated MCQs + endless generated`,
                `${FRQS.length} AP-style FRQs`,
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CircleCheck className="w-4 h-4 text-emerald-500" />
                  <span>{t}</span>
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
              title: "Teaching slides per topic",
              body: "Short slides on each topic in the CED — examples, common traps, and the rules graders most often test.",
            },
            {
              icon: BrainCircuit,
              tint: "from-amber-400 to-orange-500",
              title: "MCQs with hints, not just X marks",
              body: "When you pick a wrong choice, you get a hint about the trap behind that distractor. The right answer stays hidden until you find it.",
            },
            {
              icon: Sparkles,
              tint: "from-violet-500 to-fuchsia-500",
              title: "Endless practice, AP-style FRQs",
              body: "Curated questions sit alongside an endless stream of generated trace problems. Free-response problems include rubrics and model solutions.",
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

      <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-20 mb-20">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/practice"
            className="group bg-white rounded-[26px] p-6 sm:p-7 shadow-clay-sm hover:shadow-clay transition-all"
          >
            <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
              Practice
            </div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1 group-hover:text-indigo-700 transition-colors">
              Endless MCQs with feedback
            </h3>
            <p className="text-slate-600 text-[14px] mt-2 leading-relaxed">
              {QUESTIONS.length} curated questions plus an unlimited stream of
              generated trace problems. Wrong answers give you a hint, not just
              an X.
            </p>
          </Link>
          <Link
            href="/frqs"
            className="group bg-white rounded-[26px] p-6 sm:p-7 shadow-clay-sm hover:shadow-clay transition-all"
          >
            <div className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-700">
              Free Response
            </div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1 group-hover:text-fuchsia-700 transition-colors">
              {FRQS.length} AP-style FRQs
            </h3>
            <p className="text-slate-600 text-[14px] mt-2 leading-relaxed">
              Methods, class design, array, and 2D-array problems written like
              past AP papers. Each part has a model solution and a point-by-point
              rubric.
            </p>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Tip: open a unit, work the slides for each topic, then try the MCQs
          at the bottom. When you have time, head to{" "}
          <Link href="/practice" className="text-indigo-700 font-semibold hover:underline">
            Practice
          </Link>{" "}
          for adaptive review.
        </div>

        <div className="mt-12 text-center text-xs text-slate-500">
          Created by{" "}
          <span className="font-display font-semibold text-slate-700">
            Manan Gupta
          </span>{" "}
          ·{" "}
          <a
            href="mailto:27manang@students.harker.org"
            className="text-indigo-700 hover:underline"
          >
            27manang@students.harker.org
          </a>
        </div>
      </section>
    </div>
  );
}
