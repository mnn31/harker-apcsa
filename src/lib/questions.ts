// Barron-style AP CSA MCQs.
// Each distractor has a "nudge" — a hint that exposes WHY a student fell into
// that trap, without giving away the correct answer.

export type Choice = {
  letter: "A" | "B" | "C" | "D" | "E";
  text: string;
  nudge?: string; // shown when the student picks this WRONG answer
};

export type Question = {
  id: string;
  unitId: string;
  topicId: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  code?: string;
  choices: Choice[];
  correct: "A" | "B" | "C" | "D" | "E";
  explanation: string; // shown only after the student finally gets it right
  trapTags: string[]; // e.g. ["off-by-one", "integer-division"]
};

export const QUESTIONS: Question[] = [
  // ============== UNIT 1 ==============
  {
    id: "q1-1",
    unitId: "u1",
    topicId: "1-3",
    difficulty: 1,
    prompt: "What is the value of result after the following code executes?",
    code: `int result = 7 / 2 + 5 % 3;`,
    choices: [
      { letter: "A", text: "1", nudge: "You computed 5 % 3 correctly, but 7 / 2 is not 0. Reconsider what integer division of 7 by 2 produces — Java drops the decimal." },
      { letter: "B", text: "5" },
      { letter: "C", text: "5.5", nudge: "You're treating 7/2 as floating-point division. Both operands are int — what does Java do then?" },
      { letter: "D", text: "8", nudge: "You may have read 5 % 3 as 5 mod 3 → 2, plus 7/2 → 3.5 → 4. Check what truncation does to 3.5." },
      { letter: "E", text: "Compile error", nudge: "Mixing / and % is perfectly legal. The line compiles. Look at the actual values produced." },
    ],
    correct: "B",
    explanation: "7 / 2 = 3 (integer division truncates). 5 % 3 = 2. 3 + 2 = 5.",
    trapTags: ["integer-division", "modulus"],
  },
  {
    id: "q1-2",
    unitId: "u1",
    topicId: "1-5",
    difficulty: 2,
    prompt: "Which expression assigns the average of int a and int b to a double variable named avg, without losing precision?",
    code: `int a = 7, b = 2;
double avg = ____ ;`,
    choices: [
      { letter: "A", text: "(double)(a + b) / 2", nudge: "This works. But check the others — at least one is subtly broken in a way the AP loves to test." },
      { letter: "B", text: "(double)((a + b) / 2)", nudge: "Where does the cast bind? The (a + b) / 2 inside the inner parens is computed first — and both operands are int. What does that give you before the cast?" },
      { letter: "C", text: "(a + b) / 2.0" },
      { letter: "D", text: "(a + b) / (double) 2" },
      { letter: "E", text: "All of A, C, and D preserve precision" },
    ],
    correct: "E",
    explanation: "B casts AFTER integer division (4.0, losing the .5). A, C, D all promote at least one operand of the division to double, so the division is floating-point.",
    trapTags: ["casting", "integer-division"],
  },
  {
    id: "q1-3",
    unitId: "u1",
    topicId: "1-15",
    difficulty: 2,
    prompt: "What is printed?",
    code: `String s = "abcdef";
System.out.println(s.substring(1, 4));`,
    choices: [
      { letter: "A", text: "abcd", nudge: "You're starting at index 0 — but the first argument is 1, not 0." },
      { letter: "B", text: "bcde", nudge: "You're including the character at index 4. Check what the SECOND argument of substring really represents." },
      { letter: "C", text: "bcd" },
      { letter: "D", text: "bcdef", nudge: "You're treating the second argument as a length, not an index. Read the spec again." },
      { letter: "E", text: "abc", nudge: "Indexing starts at 0 in Java, but the first argument here is 1. You shifted in the wrong direction." },
    ],
    correct: "C",
    explanation: "substring(1, 4) returns characters at indices 1, 2, 3 — 'bcd'. The second index is exclusive.",
    trapTags: ["off-by-one", "string"],
  },
  {
    id: "q1-4",
    unitId: "u1",
    topicId: "1-11",
    difficulty: 2,
    prompt: "Which expression returns a random integer in the range [3, 7] inclusive?",
    choices: [
      { letter: "A", text: "(int)(Math.random() * 7) + 3", nudge: "You added 3 to shift, but the multiplier should reflect how many DIFFERENT integers are in [3,7]. Count them." },
      { letter: "B", text: "(int)(Math.random() * 5) + 3" },
      { letter: "C", text: "(int)(Math.random() * 4) + 3", nudge: "You used (high - low). But the range [3,7] includes both endpoints — how many integers is that?" },
      { letter: "D", text: "(int)(Math.random() * 5 + 3)", nudge: "The cast is in the wrong place. Math.random() returns a double; multiplying by 5 and adding 3 keeps it a double inside the cast — but does that change the range?" },
      { letter: "E", text: "(int)(Math.random()) * 5 + 3", nudge: "(int)(Math.random()) — what does Math.random() always satisfy? Cast to int gives you what?" },
    ],
    correct: "B",
    explanation: "Math.random() ∈ [0,1). × 5 → [0,5). (int) → {0,1,2,3,4}. + 3 → {3,4,5,6,7}. Formula: (int)(Math.random() * (high - low + 1)) + low.",
    trapTags: ["math-random", "off-by-one"],
  },
  {
    id: "q1-5",
    unitId: "u1",
    topicId: "1-15",
    difficulty: 3,
    prompt: "Consider:",
    code: `String a = "cat";
String b = "ca" + "t";
System.out.println(a == b);
System.out.println(a.equals(b));`,
    choices: [
      { letter: "A", text: "true / true" },
      { letter: "B", text: "false / true", nudge: "You're assuming a == b is false because they're 'different objects'. But the compiler can intern compile-time string constants. What does Java do with two identical literal expressions?" },
      { letter: "C", text: "true / false", nudge: "equals on Strings compares contents. Both strings have the contents 'cat'. Reconsider equals." },
      { letter: "D", text: "false / false", nudge: "equals MUST be true here — both Strings spell 'cat'. Look at the second comparison again." },
      { letter: "E", text: "Compile error" },
    ],
    correct: "A",
    explanation: "Both 'cat' and 'ca' + 't' are compile-time constants — Java interns them to the same String object, so == is true. .equals is true because contents match. (If b were built at run-time, == would be false — but this is the AP exam, and the rule tested is .equals vs ==.)",
    trapTags: ["string-equality", "reference"],
  },

  // ============== UNIT 2 ==============
  {
    id: "q2-1",
    unitId: "u2",
    topicId: "2-5",
    difficulty: 2,
    prompt: "Given that x is an int and arr is an int[], which expression safely returns true exactly when arr is non-null and contains x at index 0?",
    choices: [
      { letter: "A", text: "arr[0] == x && arr != null", nudge: "Order matters with &&. What gets evaluated FIRST in this expression? What if arr is null when that happens?" },
      { letter: "B", text: "arr != null && arr[0] == x" },
      { letter: "C", text: "arr != null & arr[0] == x", nudge: "You used the right ORDER, but the operator is wrong. & always evaluates both sides — what happens to the right side when arr is null?" },
      { letter: "D", text: "arr.length > 0 && arr[0] == x", nudge: "What if arr is null? Calling .length on null throws. You also need to verify the array exists at all." },
      { letter: "E", text: "arr[0] == x || arr == null", nudge: "You changed && to ||. Walk through the truth table — when arr is null, what does this expression return?" },
    ],
    correct: "B",
    explanation: "Short-circuit && stops at the first false. Checking arr != null first means arr[0] is only evaluated when arr is non-null, avoiding NullPointerException.",
    trapTags: ["short-circuit", "null-check"],
  },
  {
    id: "q2-2",
    unitId: "u2",
    topicId: "2-8",
    difficulty: 2,
    prompt: "How many times does the body of this loop execute?",
    code: `for (int i = 5; i <= 20; i += 3) {
  // body
}`,
    choices: [
      { letter: "A", text: "5", nudge: "You may have computed (20 − 5) / 3 = 5. But check: does the loop run when i = 20? The condition is <=." },
      { letter: "B", text: "6" },
      { letter: "C", text: "7", nudge: "List the values of i: 5, 8, 11, 14, 17, 20 — count them." },
      { letter: "D", text: "4", nudge: "You stopped one iteration too early. Try writing out the values of i in a column." },
      { letter: "E", text: "Infinite", nudge: "i is incremented every iteration, so the loop terminates. Trace it." },
    ],
    correct: "B",
    explanation: "i takes the values 5, 8, 11, 14, 17, 20 — six iterations. (20 is included because <=.)",
    trapTags: ["off-by-one", "for-loop-trace"],
  },
  {
    id: "q2-3",
    unitId: "u2",
    topicId: "2-9",
    difficulty: 2,
    prompt: "What is printed?",
    code: `for (int i = 1; i <= 3; i++) {
  for (int j = 1; j <= i; j++) {
    System.out.print(j);
  }
  System.out.print(" ");
}`,
    choices: [
      { letter: "A", text: "1 12 123 ", nudge: "Close — but check: does the trailing space appear? And what about pass i=1?" },
      { letter: "B", text: "1 2 3 ", nudge: "You're treating the inner loop as if it ran once each time. But j goes from 1 to i — that's not one iteration when i=2 or i=3." },
      { letter: "C", text: "123 123 123 ", nudge: "You ignored that the inner loop's bound depends on i. When i=1, j only goes up to 1." },
      { letter: "D", text: "111 222 333 ", nudge: "You printed i, not j, in the inner loop body. Re-read the print statement." },
      { letter: "E", text: "1 12 123" },
    ],
    correct: "A",
    explanation: "When i=1: print 1, then space → '1 '. When i=2: print 1 then 2, then space → '12 '. When i=3: '123 '. Final output: '1 12 123 '.",
    trapTags: ["nested-loops", "trace"],
  },
  {
    id: "q2-4",
    unitId: "u2",
    topicId: "2-5",
    difficulty: 3,
    prompt: "Which expression is logically equivalent to !(a >= b && c < d)?",
    choices: [
      { letter: "A", text: "a < b && c >= d", nudge: "You negated each comparison correctly, but you didn't change the connector. De Morgan's law requires one more swap." },
      { letter: "B", text: "a < b || c >= d" },
      { letter: "C", text: "a >= b || c < d", nudge: "You changed the connector but kept the comparisons. De Morgan flips BOTH." },
      { letter: "D", text: "!(a < b) || !(c >= d)", nudge: "You wrapped negations on the outside, but the inner comparisons are now flipped twice. Simplify and check." },
      { letter: "E", text: "a > b || c <= d", nudge: "The negation of >= is <, not >. Check each comparison's negation carefully." },
    ],
    correct: "B",
    explanation: "By De Morgan: !(P && Q) = !P || !Q. !(a >= b) = a < b. !(c < d) = c >= d. Result: a < b || c >= d.",
    trapTags: ["de-morgan", "boolean-logic"],
  },
  {
    id: "q2-5",
    unitId: "u2",
    topicId: "2-7",
    difficulty: 1,
    prompt: "What is the final value of count?",
    code: `int n = 16;
int count = 0;
while (n > 1) {
  n = n / 2;
  count++;
}`,
    choices: [
      { letter: "A", text: "3", nudge: "You stopped one iteration too early. Trace n: 16 → 8 → 4 → 2 → 1. The loop runs once more from n=2." },
      { letter: "B", text: "4" },
      { letter: "C", text: "5", nudge: "You counted the final n=1 check as an iteration. The body only runs while the condition is TRUE." },
      { letter: "D", text: "16", nudge: "n is divided by 2 each iteration, not decremented by 1." },
      { letter: "E", text: "Infinite", nudge: "n shrinks each iteration and integer division eventually reaches 1. The loop terminates." },
    ],
    correct: "B",
    explanation: "n: 16→8 (count 1) →4 (count 2) →2 (count 3) →1 (count 4). At n=1 the condition (n>1) is false, so the loop exits.",
    trapTags: ["while-loop-trace"],
  },

  // ============== UNIT 3 ==============
  {
    id: "q3-1",
    unitId: "u3",
    topicId: "3-4",
    difficulty: 2,
    prompt: "Consider this class. Which statement does NOT compile?",
    code: `public class Box {
  private int size;
  public Box(int s) { size = s; }
}`,
    choices: [
      { letter: "A", text: "Box b = new Box(5);" },
      { letter: "B", text: "Box b = new Box();", nudge: "Yes, this seems wrong — but ask yourself: does Java provide a no-arg constructor here? When does it auto-generate one and when does it not?" },
      { letter: "C", text: "Box b; b = new Box(0);", nudge: "This declares b on one line and assigns on the next. Both lines are legal Java syntax. Look elsewhere." },
      { letter: "D", text: "new Box(7);", nudge: "Creating an object whose reference is immediately discarded is wasteful but legal Java. Look for a real compile error." },
      { letter: "E", text: "Box[] boxes = new Box[3];", nudge: "Creating an array of Box references is just allocation — none of the constructors are called. This is legal." },
    ],
    correct: "B",
    explanation: "Once you write any constructor, Java does NOT supply a free no-arg one. Box has only a Box(int) constructor, so 'new Box()' fails to compile.",
    trapTags: ["constructor", "default-constructor"],
  },
  {
    id: "q3-2",
    unitId: "u3",
    topicId: "3-6",
    difficulty: 3,
    prompt: "What is printed?",
    code: `public static void modify(int x, int[] a) {
  x = 99;
  a[0] = 99;
}
// in main:
int x = 1;
int[] a = {1, 2, 3};
modify(x, a);
System.out.println(x + " " + a[0]);`,
    choices: [
      { letter: "A", text: "1 1", nudge: "You have x correct (primitives are passed by value). But what about the array? Inside modify, a refers to the SAME array as outside — what happens when you mutate it?" },
      { letter: "B", text: "99 99", nudge: "You assumed both are passed by reference. Primitives are passed by value — modify gets a COPY of x." },
      { letter: "C", text: "1 99" },
      { letter: "D", text: "99 1", nudge: "You inverted the rules. Primitives are by value (copy); array references give the method access to the original array." },
      { letter: "E", text: "Compile error" },
    ],
    correct: "C",
    explanation: "x is a primitive — modify gets a copy, so the original is unchanged. a is an array reference — modify gets a copy of the reference, but that copy points at the SAME array, so a[0] = 99 is visible after the call.",
    trapTags: ["pass-by-value", "reference"],
  },
  {
    id: "q3-3",
    unitId: "u3",
    topicId: "3-3",
    difficulty: 2,
    prompt: "Which is the strongest reason to make instance variables private?",
    choices: [
      { letter: "A", text: "It saves memory.", nudge: "Access modifiers don't change memory usage at all. They control visibility, not allocation." },
      { letter: "B", text: "It makes the class run faster.", nudge: "private vs public is a compile-time access check. There's no run-time performance difference." },
      { letter: "C", text: "It prevents external code from breaking class invariants." },
      { letter: "D", text: "It is required by the Java compiler.", nudge: "The compiler is happy with public fields too. Many Java classes have public fields. The reason is design, not compulsion." },
      { letter: "E", text: "It hides the variable's type.", nudge: "private affects visibility of the field, not its type. Anyone with access can still see the type." },
    ],
    correct: "C",
    explanation: "Encapsulation keeps invariants safe: callers can only modify state through methods you control, so they can't put the object in an illegal state.",
    trapTags: ["encapsulation"],
  },

  // ============== UNIT 4 ==============
  {
    id: "q4-1",
    unitId: "u4",
    topicId: "4-4",
    difficulty: 2,
    prompt: "What does the array contain after this code runs?",
    code: `int[] arr = {1, 2, 3, 4};
for (int n : arr) {
  n = n * 2;
}`,
    choices: [
      { letter: "A", text: "{2, 4, 6, 8}", nudge: "You assumed the for-each loop modifies the array. For primitive elements, n is a COPY. What does that mean for arr itself?" },
      { letter: "B", text: "{1, 2, 3, 4}" },
      { letter: "C", text: "{0, 0, 0, 0}", nudge: "Nothing in this code zeros the array. The loop multiplies by 2 — even if it 'worked', you wouldn't get zeros." },
      { letter: "D", text: "Runtime error", nudge: "Modifying the loop variable in a for-each loop is legal Java — it just doesn't change the array. No runtime error." },
      { letter: "E", text: "Compile error", nudge: "n = n * 2 is a perfectly legal assignment to the loop variable. The line compiles." },
    ],
    correct: "B",
    explanation: "In a for-each over an int[], n is a copy of each element. Reassigning n has no effect on arr. To modify the array you must use indexed access: arr[i] = arr[i] * 2.",
    trapTags: ["for-each", "pass-by-value"],
  },
  {
    id: "q4-2",
    unitId: "u4",
    topicId: "4-9",
    difficulty: 3,
    prompt: "What does this method do to its argument when called with [1, 2, 2, 3]?",
    code: `public static void clean(ArrayList<Integer> list) {
  for (int i = 0; i < list.size(); i++) {
    if (list.get(i) == 2) list.remove(i);
  }
}`,
    choices: [
      { letter: "A", text: "Result: [1, 3]", nudge: "You assumed both 2s are removed. But trace what happens to the index after each removal — does i still point at the next element?" },
      { letter: "B", text: "Result: [1, 2, 3]" },
      { letter: "C", text: "Result: [1, 2, 2, 3] (no change)", nudge: "list.remove(i) does remove an element. So the list IS modified. Walk through one iteration." },
      { letter: "D", text: "Throws IndexOutOfBoundsException", nudge: "The size() is checked at every iteration, so it shrinks safely. No exception. But are all 2s removed?" },
      { letter: "E", text: "Result: [3]", nudge: "You're removing too much. The loop only removes elements equal to 2, not all elements." },
    ],
    correct: "B",
    explanation: "i=0: get(0)=1, no remove, i→1. i=1: get(1)=2, remove → list is [1,2,3], i→2. i=2: get(2)=3, no remove. The SECOND 2 was at the new index 1, but i has already moved past. Classic index-shift trap.",
    trapTags: ["arraylist", "remove-while-iterating"],
  },
  {
    id: "q4-3",
    unitId: "u4",
    topicId: "4-13",
    difficulty: 2,
    prompt: "What does grid[1][2] equal after this code?",
    code: `int[][] grid = new int[3][4];
for (int r = 0; r < 3; r++)
  for (int c = 0; c < 4; c++)
    grid[r][c] = r * 10 + c;`,
    choices: [
      { letter: "A", text: "12", nudge: "Almost. Read the formula: r * 10 + c. With r=1, what does r * 10 give you? Then add c." },
      { letter: "B", text: "21", nudge: "You inverted r and c — the formula uses r*10, not c*10. Re-check which index is r." },
      { letter: "C", text: "13", nudge: "You may have mixed grid[1][2] vs grid[1][3]. Index 2 is the THIRD column (0-indexed)." },
      { letter: "D", text: "10", nudge: "You forgot to add c. Re-check the assignment: grid[r][c] = r * 10 + c." },
      { letter: "E", text: "11", nudge: "You used r=1, c=1. But the question asks grid[1][2]." },
    ],
    correct: "A",
    explanation: "r=1, c=2 → 1*10 + 2 = 12.",
    trapTags: ["2d-array", "indexing"],
  },
  {
    id: "q4-4",
    unitId: "u4",
    topicId: "4-15",
    difficulty: 3,
    prompt: "Selection sort is being applied to {5, 2, 8, 1, 4}. What is the array after TWO complete passes?",
    choices: [
      { letter: "A", text: "{1, 2, 8, 5, 4}" },
      { letter: "B", text: "{1, 2, 4, 5, 8}", nudge: "That's the FULLY sorted result. Selection sort doesn't get there in two passes on this input. After pass k, only the first k elements are in their final positions." },
      { letter: "C", text: "{2, 5, 8, 1, 4}", nudge: "You ran insertion sort, not selection sort. Selection sort moves the global minimum to the front each pass." },
      { letter: "D", text: "{1, 5, 8, 2, 4}", nudge: "After pass 1, the smallest (1) is at index 0. After pass 2, the second-smallest must be at index 1. Which value is that?" },
      { letter: "E", text: "{1, 2, 5, 8, 4}", nudge: "You did three or more passes. Stop after exactly two." },
    ],
    correct: "A",
    explanation: "Pass 1: find min (1), swap with index 0 → {1, 2, 8, 5, 4}. Pass 2: find min of indices 1..4 (2, already at index 1), swap with itself → {1, 2, 8, 5, 4}.",
    trapTags: ["selection-sort", "trace"],
  },
  {
    id: "q4-5",
    unitId: "u4",
    topicId: "4-16",
    difficulty: 3,
    prompt: "What does mystery(4) return?",
    code: `public static int mystery(int n) {
  if (n <= 1) return 1;
  return n + mystery(n - 2);
}`,
    choices: [
      { letter: "A", text: "10", nudge: "You computed 4+3+2+1 = 10. But the recursive call is n-2, not n-1. Trace which n's are actually visited." },
      { letter: "B", text: "7" },
      { letter: "C", text: "6", nudge: "You may have stopped one call too early. Carefully follow: mystery(4) → 4 + mystery(2) → 4 + 2 + mystery(0)." },
      { letter: "D", text: "4", nudge: "You returned only the first n. Recursion ADDS each n until the base case." },
      { letter: "E", text: "1", nudge: "That's just the base case. The recursion adds intermediate values too." },
    ],
    correct: "B",
    explanation: "mystery(4) = 4 + mystery(2) = 4 + (2 + mystery(0)) = 4 + 2 + 1 = 7. Note mystery(0) hits the base case (0 <= 1) and returns 1.",
    trapTags: ["recursion", "trace"],
  },
  {
    id: "q4-6",
    unitId: "u4",
    topicId: "4-14",
    difficulty: 2,
    prompt: "Binary search is performed on this sorted array looking for 23: {2, 5, 8, 12, 16, 23, 38, 56, 72, 91}. How many comparisons does it take to find 23 (counting the comparison that confirms 23)?",
    choices: [
      { letter: "A", text: "1", nudge: "Binary search starts at the middle, not at the target. What's the middle element of a 10-element array?" },
      { letter: "B", text: "2" },
      { letter: "C", text: "3", nudge: "Trace: compare with arr[5] (index (0+9)/2 = 4 → arr[4]=16). 23 > 16, search right half. New mid: (5+9)/2 = 7 → arr[7]=56. 23<56, search left. (5+6)/2 = 5 → arr[5]=23 — found! Count those comparisons." },
      { letter: "D", text: "4", nudge: "You may have done one extra step. Stop counting once 23 is found." },
      { letter: "E", text: "10", nudge: "10 comparisons would be linear search. Binary search is O(log n)." },
    ],
    correct: "C",
    explanation: "Comparisons: arr[4]=16 (23>16, go right). arr[7]=56 (23<56, go left). arr[5]=23 — match. 3 comparisons.",
    trapTags: ["binary-search", "trace"],
  },
];

// Group questions by unit for fast lookup.
export const QUESTIONS_BY_UNIT: Record<string, Question[]> = QUESTIONS.reduce(
  (acc, q) => {
    (acc[q.unitId] ||= []).push(q);
    return acc;
  },
  {} as Record<string, Question[]>
);

export const QUESTIONS_BY_TOPIC: Record<string, Question[]> = QUESTIONS.reduce(
  (acc, q) => {
    (acc[q.topicId] ||= []).push(q);
    return acc;
  },
  {} as Record<string, Question[]>
);
