import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FRQS } from "@/lib/frqs";
import { FRQCard } from "@/components/frq-card";

export const metadata = {
  title: "FRQs · Harker APCSA",
};

export default function FRQsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="mb-10">
        <div className="text-[12px] font-semibold uppercase tracking-widest text-indigo-700">
          Free Response · {FRQS.length} problems
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight mt-1">
          AP-style FRQs
        </h1>
        <p className="text-slate-600 mt-3 max-w-2xl leading-relaxed">
          AP CSA FRQs come in four flavors: methods &amp; control, class
          design, array/ArrayList, and 2D array. Each problem has a context, a
          method header to implement, an example, a model solution, and a
          point-by-point rubric. Try the problem first; reveal the solution
          once you have your own.
        </p>
      </div>

      <div className="space-y-8">
        {FRQS.map((f) => (
          <FRQCard key={f.id} frq={f} />
        ))}
      </div>
    </div>
  );
}
