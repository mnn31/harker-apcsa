# Harker APCSA

The friendliest path to a 5 on the AP Computer Science A exam — built for
Harker students.

A Next.js + Tailwind + Framer Motion review hub covering every topic on the
redesigned 4-unit AP CSA exam, with Barron-style teaching slides and adaptive
multiple-choice practice that **nudges** students past wrong answers instead of
just marking them.

## What's inside

- **Landing page** — animated gradient hero, three feature blocks, unit grid
- **4 units, 21 topics** — every concept on the redesigned APCSA course
  - Unit 1: Using Objects and Methods (15–25%)
  - Unit 2: Selection and Iteration (25–35%)
  - Unit 3: Class Creation (10–18%)
  - Unit 4: Data Collections (30–40%)
- **Slide decks per topic** — Barron-style teaching slides with code, traps, and
  key-idea callouts
- **MCQ practice** — Each wrong answer triggers a *nudge*: tells the student
  what trap they fell into without revealing the right choice
- **Adaptive ordering** — Questions are weighted by the trap-tags you've missed.
  Topics you struggle with come back more often.
- **Local progress** — Streaks, first-try score, weak-spot tracking via
  `localStorage`

## Stack

- Next.js 16 (App Router, static prerender of all routes)
- Tailwind CSS v4
- Framer Motion (every transition)
- Lucide icons
- Claymorphism + animated gradient mesh hero

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Build

```bash
npm run build
```

Generates 33 static routes (home + practice + 4 unit pages + 21 topic pages +
filtered practice variants).

## Project layout

```
src/
├── app/
│   ├── page.tsx                          # landing page
│   ├── layout.tsx                        # fonts + nav
│   ├── practice/page.tsx                 # /practice
│   └── units/[unitId]/[topicId]/page.tsx # /units/u1/1-3, etc.
├── components/
│   ├── site-nav.tsx                      # animated tab nav
│   ├── slide-deck.tsx                    # per-topic slides
│   ├── mcq-card.tsx                      # nudge feedback engine
│   ├── practice-client.tsx               # adaptive practice
│   ├── code-block.tsx                    # mini Java syntax highlight
│   └── unit-hero.tsx                     # unit landing
└── lib/
    ├── curriculum.ts                     # units, topics, slides
    ├── questions.ts                      # MCQ bank with per-distractor nudges
    └── utils.ts
```

## Adding more questions

Edit `src/lib/questions.ts`. Each question has:

- `prompt`, optional `code` block
- `choices` — each wrong option carries a `nudge` that hints toward the trap
- `correct` letter
- `explanation` shown only after the student lands the right answer
- `trapTags` — fuel for the adaptive engine
