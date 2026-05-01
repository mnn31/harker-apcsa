"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Layers, Sparkles, Target } from "lucide-react";
import { UNITS } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = usePathname();
  const onUnit = (id: string) => pathname?.startsWith(`/units/${id}`);
  const onPractice = pathname?.startsWith("/practice");

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
            className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center shadow-clay-sm"
          >
            <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.4} />
          </motion.div>
          <div className="leading-tight">
            <div className="font-display font-extrabold text-[17px] text-slate-900">
              Harker APCSA
            </div>
            <div className="text-[10px] uppercase tracking-widest text-indigo-600/80 font-semibold">
              score · a · five
            </div>
          </div>
        </Link>

        <nav className="ml-auto hidden md:flex items-center gap-1 scrollbar-thin overflow-x-auto">
          {UNITS.map((u) => (
            <Link
              key={u.id}
              href={`/units/${u.id}`}
              className={cn(
                "relative px-3.5 py-2 rounded-2xl text-sm font-semibold transition-colors whitespace-nowrap",
                onUnit(u.id)
                  ? "text-white"
                  : "text-slate-700 hover:text-indigo-700"
              )}
            >
              {onUnit(u.id) && (
                <motion.span
                  layoutId="nav-pill"
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-r shadow-clay-sm -z-10",
                    u.accent
                  )}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Unit {u.number}
            </Link>
          ))}
          <Link
            href="/practice"
            className={cn(
              "ml-2 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-1.5 shadow-clay-sm transition-transform active:scale-[0.97]",
              onPractice
                ? "bg-amber-400 text-slate-900"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            <Target className="w-4 h-4" strokeWidth={2.4} />
            Practice
          </Link>
        </nav>

        <Link
          href="/practice"
          className="md:hidden ml-auto px-3 py-2 rounded-2xl bg-slate-900 text-white text-sm font-semibold flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" /> Practice
        </Link>
      </div>

      <div className="md:hidden border-t border-slate-100 bg-white/60">
        <div className="mx-auto max-w-7xl px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-thin">
          {UNITS.map((u) => (
            <Link
              key={u.id}
              href={`/units/${u.id}`}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border",
                onUnit(u.id)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200"
              )}
            >
              <Layers className="w-3 h-3 inline mr-1" />
              Unit {u.number}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
