import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Target } from "lucide-react";
import { UNITS } from "@/lib/curriculum";
import { QUESTIONS_BY_UNIT } from "@/lib/questions";
import { UnitHero } from "@/components/unit-hero";

export function generateStaticParams() {
  return UNITS.map((u) => ({ unitId: u.id }));
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) notFound();

  const qCount = (QUESTIONS_BY_UNIT[unit.id] || []).length;

  return (
    <div className="overflow-x-hidden">
      <UnitHero unit={unit} qCount={qCount} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Topics in this unit
          </h2>
          <Link
            href={`/practice?unit=${unit.id}`}
            className="text-sm font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
          >
            Practice this unit <Target className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {unit.topics.map((t) => (
            <Link
              key={t.id}
              href={`/units/${unit.id}/${t.id}`}
              className="group bg-white rounded-[24px] p-6 shadow-clay-sm hover:shadow-clay hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2.5 py-1 rounded-full bg-gradient-to-r ${unit.accent} text-white text-xs font-bold`}
                >
                  {t.number}
                </span>
                <BookOpen className="w-4 h-4 text-slate-400 ml-auto" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">
                {t.title}
              </h3>
              <p className="text-slate-600 text-[14px] mt-1.5 leading-relaxed">
                {t.blurb}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">{t.slides.length} slides</span>
                <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
