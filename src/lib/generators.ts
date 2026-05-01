// Procedural MCQ generators. Each takes a numeric seed and returns a Question.
// Same seed → same question (deterministic). Different seeds → fresh question
// with different parameters and updated nudges. The pool is effectively
// unbounded — a student can practice forever and rarely see the same one.

import type { Question, Choice } from "@/lib/questions";

// --- Deterministic RNG -------------------------------------------------------

function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const pick = <T>(r: () => number, arr: readonly T[]) =>
  arr[Math.floor(r() * arr.length)];
const intIn = (r: () => number, lo: number, hi: number) =>
  Math.floor(r() * (hi - lo + 1)) + lo;

// Shuffle a small array deterministically.
function shuffle<T>(r: () => number, arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function letters(n: number): ("A" | "B" | "C" | "D" | "E")[] {
  return ["A", "B", "C", "D", "E"].slice(0, n) as never;
}

// Build a Question from a correct answer and 4 distractors-with-nudges.
// Distractors must be unique vs the correct answer.
function buildQ(
  args: {
    id: string;
    unitId: string;
    topicId: string;
    difficulty: 1 | 2 | 3;
    prompt: string;
    code?: string;
    correct: string;
    explanation: string;
    trapTags: string[];
    distractors: { text: string; nudge: string }[];
  },
  seed: number
): Question {
  const r = rng(seed + 7919);
  const dedup: { text: string; nudge: string }[] = [];
  const seen = new Set<string>([args.correct]);
  for (const d of args.distractors) {
    if (!seen.has(d.text)) {
      dedup.push(d);
      seen.add(d.text);
    }
  }
  while (dedup.length < 4) {
    const filler = `${args.correct} (mismatch ${dedup.length + 1})`;
    if (!seen.has(filler)) {
      dedup.push({
        text: filler,
        nudge: "This option doesn't match standard Java semantics.",
      });
      seen.add(filler);
    }
  }
  const opts = shuffle(r, [
    { text: args.correct, nudge: undefined as string | undefined, isCorrect: true },
    ...dedup.slice(0, 4).map((d) => ({ ...d, isCorrect: false })),
  ]);
  const ls = letters(opts.length);
  let correctLetter: "A" | "B" | "C" | "D" | "E" = "A";
  const choices: Choice[] = opts.map((o, i) => {
    if (o.isCorrect) correctLetter = ls[i];
    return { letter: ls[i], text: o.text, nudge: o.nudge };
  });
  return {
    id: args.id,
    unitId: args.unitId,
    topicId: args.topicId,
    difficulty: args.difficulty,
    prompt: args.prompt,
    code: args.code,
    choices,
    correct: correctLetter,
    explanation: args.explanation,
    trapTags: args.trapTags,
  };
}

// --- 1. Integer division & modulus ------------------------------------------

function genIntDiv(seed: number): Question {
  const r = rng(seed);
  const a = intIn(r, 7, 49);
  const b = intIn(r, 2, 7);
  const op = pick(r, ["/", "%"] as const);
  const correctVal = op === "/" ? Math.trunc(a / b) : a % b;
  const float = (a / b).toFixed(2);
  return buildQ(
    {
      id: `gen-intdiv-${seed}`,
      unitId: "u1",
      topicId: "1-3",
      difficulty: 1,
      prompt: `What does this expression evaluate to?`,
      code: `${a} ${op} ${b}`,
      correct: `${correctVal}`,
      explanation:
        op === "/"
          ? `Both operands are int, so / is integer division. Floor(${a}/${b}) = ${correctVal}.`
          : `${a} % ${b} is the remainder when ${a} is divided by ${b}. Trunc(${a}/${b}) = ${Math.trunc(a / b)}, so remainder = ${a} − ${b}·${Math.trunc(a / b)} = ${correctVal}.`,
      trapTags: op === "/" ? ["integer-division"] : ["modulus"],
      distractors:
        op === "/"
          ? [
              { text: `${float}`, nudge: "You did floating-point division. Both operands are int — Java does integer division." },
              { text: `${Math.ceil(a / b)}`, nudge: "You rounded UP. Integer division truncates toward zero — it doesn't round." },
              { text: `${a % b}`, nudge: "That's the modulus result. The operator here is /, not %." },
              { text: `0`, nudge: `${a} / ${b} ≥ 1 because ${a} > ${b}. Re-do the division.` },
            ]
          : [
              { text: `${Math.trunc(a / b)}`, nudge: "That's the quotient (a / b). The operator here is %, the remainder." },
              { text: `${b - (a % b)}`, nudge: "You subtracted from b. Modulus is just the remainder, not its complement." },
              { text: `${a}`, nudge: "Remainder is bounded above by b. It can't equal a when a > b." },
              { text: `0`, nudge: `${a} % ${b} = 0 only when ${b} divides ${a} evenly. Check: does it?` },
            ],
    },
    seed
  );
}

// --- 2. Casting / rounding ---------------------------------------------------

function genCasting(seed: number): Question {
  const r = rng(seed);
  const whole = intIn(r, 1, 12);
  const frac = intIn(r, 1, 9) / 10;
  const d = whole + frac;
  const truncated = Math.trunc(d);
  const rounded = Math.round(d);
  return buildQ(
    {
      id: `gen-cast-${seed}`,
      unitId: "u1",
      topicId: "1-5",
      difficulty: 1,
      prompt: `What is the value of n?`,
      code: `double d = ${d};
int n = (int) d;`,
      correct: `${truncated}`,
      explanation: `(int) on a double truncates toward zero — drops the decimal. ${d} → ${truncated}.`,
      trapTags: ["casting"],
      distractors: [
        { text: `${rounded}`, nudge: "You rounded to the nearest int. (int) truncates — it does not round." },
        { text: `${Math.ceil(d)}`, nudge: "You rounded UP. (int) drops the decimal, never adding 1." },
        { text: `${d}`, nudge: "You kept the decimal. The (int) cast forces an integer result." },
        { text: `${truncated + 1}`, nudge: "Off by one. (int) truncates — it doesn't add a unit." },
      ],
    },
    seed
  );
}

// --- 3. Loop iteration count -------------------------------------------------

function genLoopCount(seed: number): Question {
  const r = rng(seed);
  const lo = intIn(r, 1, 8);
  const step = intIn(r, 1, 4);
  const span = intIn(r, 4, 12);
  const hi = lo + span;
  const op = pick(r, ["<", "<="] as const);
  const reach = op === "<=" ? hi : hi - 1;
  const count = Math.floor((reach - lo) / step) + 1;
  return buildQ(
    {
      id: `gen-loop-${seed}`,
      unitId: "u2",
      topicId: "2-8",
      difficulty: 1,
      prompt: `How many times does the body of this loop execute?`,
      code: `for (int i = ${lo}; i ${op} ${hi}; i += ${step}) {
  // body
}`,
      correct: `${count}`,
      explanation: `i takes values ${Array.from({ length: count }, (_, k) => lo + k * step).join(", ")}. ${count} iterations.`,
      trapTags: ["off-by-one", "for-loop-trace"],
      distractors: [
        { text: `${count - 1}`, nudge: "Off by one — you stopped one iteration too early. Count the values of i carefully, including the boundary." },
        { text: `${count + 1}`, nudge: `Off by one — you ran one too many. Check the relationship between the operator (${op}) and ${hi}.` },
        { text: `${hi - lo}`, nudge: `You ignored the step (i += ${step}). Each iteration advances i by ${step}, not 1.` },
        { text: `Infinite`, nudge: "i is incremented every iteration, so the loop terminates." },
      ],
    },
    seed
  );
}

// --- 4. Loop trace: print statements -----------------------------------------

function genLoopPrint(seed: number): Question {
  const r = rng(seed);
  const n = intIn(r, 3, 5);
  const start = intIn(r, 0, 1);
  const op = pick(r, ["<", "<="] as const);
  const limit = op === "<=" ? n - 1 : n;
  const last = op === "<=" ? n - 1 : n - 1;
  const values: number[] = [];
  for (let i = start; op === "<" ? i < n : i <= n - 1; i++) values.push(i);
  const correct = values.join("");
  return buildQ(
    {
      id: `gen-loopprint-${seed}`,
      unitId: "u2",
      topicId: "2-8",
      difficulty: 1,
      prompt: `What is printed?`,
      code: `for (int i = ${start}; i ${op} ${limit}; i++) {
  System.out.print(i);
}`,
      correct,
      explanation: `i takes ${values.join(", ")} → printed concatenated as "${correct}".`,
      trapTags: ["for-loop-trace"],
      distractors: [
        { text: values.slice(0, -1).join(""), nudge: "Off by one — you stopped one iteration short." },
        { text: values.concat(last + 1).join(""), nudge: "Off by one — you ran past the upper bound." },
        { text: values.slice(1).join(""), nudge: `You skipped i = ${start}. The first iteration runs the body before any update.` },
        { text: values.join(" "), nudge: "System.out.print() does NOT add a space — output is concatenated tightly." },
      ],
    },
    seed
  );
}

// --- 5. Modulus output for digit work ----------------------------------------

function genDigit(seed: number): Question {
  const r = rng(seed);
  const n = intIn(r, 100, 999);
  const op = pick(r, ["last", "first", "tens"] as const);
  const last = n % 10;
  const tens = Math.trunc(n / 10) % 10;
  const first = Math.trunc(n / 100);
  const want = op === "last" ? last : op === "first" ? first : tens;
  const expr =
    op === "last"
      ? `${n} % 10`
      : op === "first"
      ? `${n} / 100`
      : `(${n} / 10) % 10`;
  return buildQ(
    {
      id: `gen-digit-${seed}`,
      unitId: "u1",
      topicId: "1-3",
      difficulty: 1,
      prompt: `What does this expression evaluate to?`,
      code: expr,
      correct: `${want}`,
      explanation:
        op === "last"
          ? `${n} % 10 isolates the last digit: ${last}.`
          : op === "first"
          ? `${n} / 100 (integer division) drops the last two digits: ${first}.`
          : `${n} / 10 = ${Math.trunc(n / 10)}, then % 10 gives the new last digit: ${tens}.`,
      trapTags: ["modulus", "digit-extraction"],
      distractors: [
        { text: `${last}`, nudge: "That's the last digit. The expression isolates a different digit." },
        { text: `${first}`, nudge: "That's the leading digit. Re-read the operator order." },
        { text: `${tens}`, nudge: "That's the tens digit. Re-read the expression." },
        { text: `${n}`, nudge: "The expression reduces n — it isn't equal to n." },
      ].filter((d) => d.text !== `${want}`),
    },
    seed
  );
}

// --- 6. Substring extraction -------------------------------------------------

function genSubstring(seed: number): Question {
  const r = rng(seed);
  const words = ["abcdefghij", "computers", "harker2025", "programming", "alphabet", "mississippi"];
  const s = pick(r, words);
  const i = intIn(r, 0, Math.max(0, s.length - 4));
  const j = intIn(r, i + 1, Math.min(s.length, i + 5));
  const correct = s.substring(i, j);
  return buildQ(
    {
      id: `gen-substr-${seed}`,
      unitId: "u1",
      topicId: "1-15",
      difficulty: 2,
      prompt: `What is printed?`,
      code: `String s = "${s}";
System.out.println(s.substring(${i}, ${j}));`,
      correct,
      explanation: `substring(${i}, ${j}) returns characters at indices ${i}..${j - 1}: "${correct}".`,
      trapTags: ["substring", "off-by-one"],
      distractors: [
        { text: s.substring(i, j + 1), nudge: "You included index j. The second argument is EXCLUSIVE." },
        { text: s.substring(Math.max(0, i - 1), j), nudge: "You included one extra character at the start. The first index is INCLUSIVE." },
        { text: s.substring(i, Math.max(i + 1, j - 1)), nudge: "You stopped one character early. substring takes characters up to (not including) index j." },
        { text: s, nudge: "That's the whole string. You discarded the index bounds." },
      ],
    },
    seed
  );
}

// --- 7. 2D array index access ------------------------------------------------

function gen2D(seed: number): Question {
  const r = rng(seed);
  const rows = intIn(r, 2, 4);
  const cols = intIn(r, 2, 4);
  const queryR = intIn(r, 0, rows - 1);
  const queryC = intIn(r, 0, cols - 1);
  const correct = queryR * 10 + queryC;
  const swapped = queryC * 10 + queryR;
  return buildQ(
    {
      id: `gen-2d-${seed}`,
      unitId: "u4",
      topicId: "4-13",
      difficulty: 2,
      prompt: `What is grid[${queryR}][${queryC}]?`,
      code: `int[][] grid = new int[${rows}][${cols}];
for (int r = 0; r < ${rows}; r++)
  for (int c = 0; c < ${cols}; c++)
    grid[r][c] = r * 10 + c;`,
      correct: `${correct}`,
      explanation: `r=${queryR}, c=${queryC} → ${queryR}*10 + ${queryC} = ${correct}.`,
      trapTags: ["2d-array", "indexing"],
      distractors: [
        { text: `${swapped}`, nudge: "You swapped r and c. The first index is the row, second is the column." },
        { text: `${queryR + queryC}`, nudge: "You added r and c. The formula multiplies r by 10 first." },
        { text: `${queryR * queryC}`, nudge: "You multiplied r and c. Re-read the assignment." },
        { text: `${queryR}`, nudge: "You forgot to add c. Re-check the assignment formula." },
      ],
    },
    seed
  );
}

// --- 8. Array sum / count / max ---------------------------------------------

function genArrayReduce(seed: number): Question {
  const r = rng(seed);
  const len = intIn(r, 4, 6);
  const arr: number[] = [];
  for (let i = 0; i < len; i++) arr.push(intIn(r, -5, 9));
  const op = pick(r, ["sum", "max", "countPos"] as const);
  let result = 0;
  let body = "";
  let trapTag = "";
  if (op === "sum") {
    result = arr.reduce((a, b) => a + b, 0);
    body = `int s = 0;
for (int n : arr) s += n;
return s;`;
    trapTag = "array-sum";
  } else if (op === "max") {
    result = Math.max(...arr);
    body = `int m = arr[0];
for (int n : arr) if (n > m) m = n;
return m;`;
    trapTag = "array-max";
  } else {
    result = arr.filter((x) => x > 0).length;
    body = `int c = 0;
for (int n : arr) if (n > 0) c++;
return c;`;
    trapTag = "counting";
  }
  const max = Math.max(...arr);
  const sum = arr.reduce((a, b) => a + b, 0);
  const positives = arr.filter((x) => x > 0).length;
  return buildQ(
    {
      id: `gen-arrred-${seed}-${op}`,
      unitId: "u4",
      topicId: "4-5",
      difficulty: 2,
      prompt: `Given int[] arr = {${arr.join(", ")}}, what does this method return?`,
      code: body,
      correct: `${result}`,
      explanation:
        op === "sum"
          ? `Sum of ${arr.join(" + ")} = ${result}.`
          : op === "max"
          ? `Max of {${arr.join(", ")}} = ${result}.`
          : `Positive elements (n > 0): ${arr.filter((x) => x > 0).join(", ") || "none"}. Count = ${result}.`,
      trapTags: ["array-traversal", trapTag],
      distractors: [
        { text: `${sum}`, nudge: "That's the SUM, not what the method computes. Re-read the body." },
        { text: `${max}`, nudge: "That's the MAX, not what the method computes." },
        { text: `${positives}`, nudge: "That's the COUNT of positives." },
        { text: `${arr.length}`, nudge: "That's the array length, not the result of the loop." },
      ].filter((d) => d.text !== `${result}`),
    },
    seed
  );
}

// --- 9. Boolean evaluation ---------------------------------------------------

function genBoolean(seed: number): Question {
  const r = rng(seed);
  const x = intIn(r, 0, 20);
  const y = intIn(r, 0, 20);
  const a = pick(r, [
    { expr: `x > 5 && y < 10`, val: x > 5 && y < 10 },
    { expr: `x < 5 || y > 10`, val: x < 5 || y > 10 },
    { expr: `!(x == y)`, val: x !== y },
    { expr: `x >= y && x <= 15`, val: x >= y && x <= 15 },
    { expr: `(x + y) % 2 == 0`, val: (x + y) % 2 === 0 },
  ] as const);
  return buildQ(
    {
      id: `gen-bool-${seed}`,
      unitId: "u2",
      topicId: "2-5",
      difficulty: 1,
      prompt: `Given int x = ${x}, int y = ${y}, what is the value of this expression?`,
      code: a.expr,
      correct: a.val ? "true" : "false",
      explanation: `Substitute x=${x}, y=${y} into ${a.expr} → evaluates to ${a.val}.`,
      trapTags: ["boolean-logic"],
      distractors: [
        { text: a.val ? "false" : "true", nudge: "You inverted the result. Substitute the values and walk through each operator." },
        { text: "Compile error", nudge: "The expression is well-formed. It compiles." },
        { text: `${x}`, nudge: "Boolean expressions evaluate to true or false, not to a number." },
        { text: `${y}`, nudge: "Boolean expressions evaluate to true or false, not to a number." },
      ],
    },
    seed
  );
}

// --- 10. Recursion trace -----------------------------------------------------

function genRecursion(seed: number): Question {
  const r = rng(seed);
  const n = intIn(r, 3, 6);
  const variant = pick(r, ["sum", "fact", "step2"] as const);
  let code = "";
  let result = 0;
  let topic = "4-16";
  if (variant === "sum") {
    code = `public static int f(int n) {
  if (n <= 0) return 0;
  return n + f(n - 1);
}
// f(${n})`;
    result = (n * (n + 1)) / 2;
  } else if (variant === "fact") {
    code = `public static int f(int n) {
  if (n <= 1) return 1;
  return n * f(n - 1);
}
// f(${n})`;
    result = 1;
    for (let k = 2; k <= n; k++) result *= k;
  } else {
    code = `public static int f(int n) {
  if (n <= 1) return 1;
  return n + f(n - 2);
}
// f(${n})`;
    result = 0;
    for (let k = n; k > 1; k -= 2) result += k;
    result += 1;
  }
  return buildQ(
    {
      id: `gen-rec-${seed}-${variant}`,
      unitId: "u4",
      topicId: topic,
      difficulty: 3,
      prompt: `What does f(${n}) return?`,
      code,
      correct: `${result}`,
      explanation: `Trace each recursive call down to the base case, then accumulate values back up.`,
      trapTags: ["recursion", "trace"],
      distractors: [
        { text: `${n}`, nudge: "You returned only the first n. Recursion accumulates intermediate values." },
        { text: `${result - 1}`, nudge: "Off by one — you stopped one call early or missed the base case contribution." },
        { text: `${result + 1}`, nudge: "Off by one — you ran one extra recursive level." },
        { text: `1`, nudge: "That's just the base case. The recursion adds layers above it." },
      ].filter((d) => d.text !== `${result}`),
    },
    seed
  );
}

// --- 11. ArrayList operations trace -----------------------------------------

function genArrayList(seed: number): Question {
  const r = rng(seed);
  const list = [intIn(r, 1, 9), intIn(r, 1, 9), intIn(r, 1, 9), intIn(r, 1, 9)];
  const addVal1 = intIn(r, 10, 19);
  const addVal2 = intIn(r, 20, 29);
  const setVal = intIn(r, 30, 39);
  const ops: { code: string; apply: (l: number[]) => void }[] = [
    { code: `list.add(${addVal1});`, apply: (l) => { l.push(addVal1); } },
    { code: `list.set(1, ${setVal});`, apply: (l) => { if (l.length > 1) l[1] = setVal; } },
    { code: `list.add(0, ${addVal2});`, apply: (l) => { l.unshift(addVal2); } },
  ];
  const chosen = shuffle(r, ops.slice());
  const work = list.slice();
  for (const op of chosen) op.apply(work);
  const correct = `[${work.join(", ")}]`;
  return buildQ(
    {
      id: `gen-al-${seed}`,
      unitId: "u4",
      topicId: "4-8",
      difficulty: 2,
      prompt: `Given an ArrayList<Integer> initialized to [${list.join(", ")}], what does it contain after these operations execute in order?`,
      code: chosen.map((o) => o.code).join("\n"),
      correct,
      explanation: `Apply each operation in order, tracking the new list state after each call.`,
      trapTags: ["arraylist", "trace"],
      distractors: [
        { text: `[${list.join(", ")}]`, nudge: "That's the initial list. The operations DO modify it." },
        { text: `[${list.slice().reverse().join(", ")}]`, nudge: "None of these operations reverses the list." },
        { text: `[${work.slice().reverse().join(", ")}]`, nudge: "Right elements, wrong order. The list isn't reversed by these operations." },
        { text: `Compile error`, nudge: "All these methods are valid ArrayList<Integer> operations." },
      ],
    },
    seed
  );
}

// --- 12. String methods grab bag --------------------------------------------

function genStringMethod(seed: number): Question {
  const r = rng(seed);
  const variant = pick(r, ["length", "indexOf", "equals", "concat"] as const);
  if (variant === "length") {
    const s = pick(r, ["hello", "abc", "Java", "code", "harker"]);
    return buildQ(
      {
        id: `gen-strlen-${seed}`,
        unitId: "u1",
        topicId: "1-15",
        difficulty: 1,
        prompt: `What is the value of n?`,
        code: `String s = "${s}";
int n = s.length();`,
        correct: `${s.length}`,
        explanation: `length() returns the number of characters in "${s}" — that's ${s.length}.`,
        trapTags: ["string", "length"],
        distractors: [
          { text: `${s.length - 1}`, nudge: "You may have used the last index. length() returns the count, which is one MORE than the last index." },
          { text: `${s.length + 1}`, nudge: "Off by one. length() doesn't include any phantom character." },
          { text: `Compile error`, nudge: "length() is a valid String method." },
          { text: `0`, nudge: "The string is non-empty. length() can't be 0 here." },
        ],
      },
      seed
    );
  }
  if (variant === "indexOf") {
    const s = pick(r, ["banana", "rocketship", "harker", "abracadabra"]);
    const ch = s[intIn(r, 0, s.length - 1)];
    return buildQ(
      {
        id: `gen-stridx-${seed}`,
        unitId: "u1",
        topicId: "1-15",
        difficulty: 1,
        prompt: `What does the expression evaluate to?`,
        code: `"${s}".indexOf("${ch}")`,
        correct: `${s.indexOf(ch)}`,
        explanation: `indexOf returns the index of the FIRST occurrence of "${ch}" in "${s}", which is ${s.indexOf(ch)}.`,
        trapTags: ["string", "indexOf"],
        distractors: [
          { text: `${s.lastIndexOf(ch)}`, nudge: "indexOf returns the FIRST occurrence, not the last." },
          { text: `-1`, nudge: "-1 means NOT FOUND. The character does appear in this string." },
          { text: `${s.indexOf(ch) + 1}`, nudge: "Off by one. indexOf is 0-based." },
          { text: `${s.length}`, nudge: "indexOf returns a position, not the string's length." },
        ],
      },
      seed
    );
  }
  if (variant === "equals") {
    const a = pick(r, ["cat", "dog", "Java"]);
    const b = pick(r, ["cat", "dog", "java"]);
    return buildQ(
      {
        id: `gen-streq-${seed}`,
        unitId: "u1",
        topicId: "1-15",
        difficulty: 1,
        prompt: `What is printed?`,
        code: `String a = "${a}";
String b = "${b}";
System.out.println(a.equals(b));`,
        correct: a === b ? "true" : "false",
        explanation: `equals compares characters case-sensitively. "${a}".equals("${b}") = ${a === b}.`,
        trapTags: ["string", "equals"],
        distractors: [
          { text: a === b ? "false" : "true", nudge: "You inverted the result. Compare the strings character by character (case-sensitively)." },
          { text: "Compile error", nudge: "equals is a valid String method." },
          { text: a, nudge: "equals returns a boolean, not a String." },
          { text: b, nudge: "equals returns a boolean, not a String." },
        ],
      },
      seed
    );
  }
  // concat
  const a = pick(r, ["Hello, ", "Mr. ", "Hi "]);
  const b = pick(r, ["Anu", "world", "Harker"]);
  return buildQ(
    {
      id: `gen-strcat-${seed}`,
      unitId: "u1",
      topicId: "1-3",
      difficulty: 1,
      prompt: `What is printed?`,
      code: `String s = "${a}" + "${b}";
System.out.println(s);`,
      correct: `${a}${b}`,
      explanation: `+ on Strings concatenates them in order: "${a}" + "${b}" = "${a}${b}".`,
      trapTags: ["string-concat"],
      distractors: [
        { text: `${b}${a}`, nudge: "You reversed the order. + concatenates left-to-right." },
        { text: `${a}`, nudge: "Both halves are concatenated, not just the first." },
        { text: `${b}`, nudge: "Both halves are concatenated, not just the second." },
        { text: `Compile error`, nudge: "Concatenating Strings with + is fully legal." },
      ],
    },
    seed
  );
}

// --- 13. Pre-condition / null safety ----------------------------------------

function genShortCircuit(seed: number): Question {
  const r = rng(seed);
  const n = intIn(r, 1, 5);
  return buildQ(
    {
      id: `gen-sc-${seed}`,
      unitId: "u2",
      topicId: "2-5",
      difficulty: 2,
      prompt: `Given int[] arr (which may be null), which expression is TRUE iff arr is non-null AND its first element equals ${n}, with NO chance of NullPointerException?`,
      correct: `arr != null && arr[0] == ${n}`,
      explanation: `Short-circuit && checks arr != null first. If arr is null, the right side never runs, so no NullPointerException.`,
      trapTags: ["short-circuit", "null-check"],
      distractors: [
        { text: `arr[0] == ${n} && arr != null`, nudge: "Order matters with &&. The first operand evaluates first. What happens when arr is null?" },
        { text: `arr != null & arr[0] == ${n}`, nudge: "Single & always evaluates both sides. Short-circuit & is &&." },
        { text: `arr.length > 0 && arr[0] == ${n}`, nudge: "Calling .length on null throws. You need to guard against null first." },
        { text: `arr == null && arr[0] == ${n}`, nudge: "&& with arr == null can't be true at the same time as arr[0] is anything. The expression is always false." },
      ],
    },
    seed
  );
}

// --- Registry ---------------------------------------------------------------

export const GENERATORS: { id: string; topicId: string; unitId: string; fn: (s: number) => Question; }[] = [
  { id: "intdiv", topicId: "1-3", unitId: "u1", fn: genIntDiv },
  { id: "cast", topicId: "1-5", unitId: "u1", fn: genCasting },
  { id: "loopcount", topicId: "2-8", unitId: "u2", fn: genLoopCount },
  { id: "loopprint", topicId: "2-8", unitId: "u2", fn: genLoopPrint },
  { id: "digit", topicId: "1-3", unitId: "u1", fn: genDigit },
  { id: "substring", topicId: "1-15", unitId: "u1", fn: genSubstring },
  { id: "2d", topicId: "4-13", unitId: "u4", fn: gen2D },
  { id: "arrred", topicId: "4-5", unitId: "u4", fn: genArrayReduce },
  { id: "boolean", topicId: "2-5", unitId: "u2", fn: genBoolean },
  { id: "recursion", topicId: "4-16", unitId: "u4", fn: genRecursion },
  { id: "arraylist", topicId: "4-8", unitId: "u4", fn: genArrayList },
  { id: "stringmethod", topicId: "1-15", unitId: "u1", fn: genStringMethod },
  { id: "shortcircuit", topicId: "2-5", unitId: "u2", fn: genShortCircuit },
];

// Generate a batch of N unique questions sampled across all generators.
export function generateBatch(
  count: number,
  startSeed: number,
  filter?: { unitId?: string; topicId?: string }
): Question[] {
  const pool = filter
    ? GENERATORS.filter(
        (g) =>
          (!filter.unitId || g.unitId === filter.unitId) &&
          (!filter.topicId || g.topicId === filter.topicId)
      )
    : GENERATORS;
  if (pool.length === 0) return [];
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    const g = pool[i % pool.length];
    out.push(g.fn(startSeed + i * 31 + g.id.length));
  }
  return out;
}

// One-shot: get a single fresh generated question.
export function generateOne(seed: number, filter?: { unitId?: string; topicId?: string }): Question | null {
  const batch = generateBatch(1, seed, filter);
  return batch[0] ?? null;
}
