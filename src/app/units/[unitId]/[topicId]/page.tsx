import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UNITS } from "@/lib/curriculum";
import { QUESTIONS_BY_TOPIC } from "@/lib/questions";
import { SlideDeck } from "@/components/slide-deck";
import { TopicPractice } from "@/components/topic-practice";

export function generateStaticParams() {
  return UNITS.flatMap((u) =>
    u.topics.map((t) => ({ unitId: u.id, topicId: t.id }))
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ unitId: string; topicId: string }>;
}) {
  const { unitId, topicId } = await params;
  const unit = UNITS.find((u) => u.id === unitId);
  const topic = unit?.topics.find((t) => t.id === topicId);
  if (!unit || !topic) notFound();

  const idx = unit.topics.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? unit.topics[idx - 1] : null;
  const next = idx < unit.topics.length - 1 ? unit.topics[idx + 1] : null;
  const questions = QUESTIONS_BY_TOPIC[topic.id] || [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <Link
        href={`/units/${unit.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> {unit.title}
      </Link>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className={`px-2.5 py-1 rounded-full bg-gradient-to-r ${unit.accent} text-white text-xs font-bold`}
        >
          {topic.number}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Unit {unit.number} · {unit.title}
        </span>
      </div>
      <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 leading-tight tracking-tight mb-2">
        {topic.title}
      </h1>
      <p className="text-slate-600 text-lg leading-relaxed mb-8">
        {topic.blurb}
      </p>

      <div className="grid lg:grid-cols-[1fr_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 mb-3 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 rounded-full bg-indigo-500" />
            Slides
          </h2>
          <SlideDeck slides={topic.slides} />
        </div>

        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 mb-3 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 rounded-full bg-amber-400" />
            Try it
          </h2>
          {questions.length > 0 ? (
            <TopicPractice questions={questions} />
          ) : (
            <div className="bg-white rounded-[24px] shadow-clay-sm p-8 text-center text-slate-500">
              <p className="text-sm">
                Practice MCQs for this topic are coming soon. In the meantime,
                try the{" "}
                <Link
                  href={`/practice?unit=${unit.id}`}
                  className="text-indigo-700 font-semibold hover:underline"
                >
                  full unit practice set
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3">
        {prev ? (
          <Link
            href={`/units/${unit.id}/${prev.id}`}
            className="px-4 py-2.5 rounded-2xl bg-white shadow-clay-sm text-slate-700 font-display font-semibold text-sm inline-flex items-center gap-1.5 hover:shadow-clay transition-shadow"
          >
            <ArrowLeft className="w-4 h-4" /> {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/units/${unit.id}/${next.id}`}
            className="ml-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-display font-semibold text-sm inline-flex items-center gap-1.5 shadow-clay-sm active:scale-[0.98]"
          >
            {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/practice?unit=${unit.id}`}
            className="ml-auto px-5 py-2.5 rounded-2xl bg-amber-400 text-slate-900 font-display font-semibold text-sm inline-flex items-center gap-1.5 shadow-clay-sm active:scale-[0.98]"
          >
            Practice the unit <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
