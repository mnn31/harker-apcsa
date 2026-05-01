import { Suspense } from "react";
import { PracticeClient } from "@/components/practice-client";

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading practice…</div>}>
      <PracticeClient />
    </Suspense>
  );
}
