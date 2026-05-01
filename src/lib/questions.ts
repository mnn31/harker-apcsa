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

  // ============== UNIT 1 — extras ==============
  {
    id: "q1-6",
    unitId: "u1",
    topicId: "1-3",
    difficulty: 1,
    prompt: "What is printed?",
    code: `int a = 4, b = 3;
System.out.println("sum = " + a + b);`,
    choices: [
      { letter: "A", text: "sum = 7", nudge: "You added a + b first. But + evaluates left-to-right, and the leftmost + here has a String on its left. What does + do when one side is a String?" },
      { letter: "B", text: "sum = 43" },
      { letter: "C", text: "7", nudge: "The literal \"sum = \" is part of the printed output — it doesn't disappear." },
      { letter: "D", text: "sum = 4 3", nudge: "+ never inserts a space between concatenated values." },
      { letter: "E", text: "Compile error", nudge: "Mixing String + int + int is fully legal. The expression compiles fine." },
    ],
    correct: "B",
    explanation: "Left-to-right: \"sum = \" + 4 → \"sum = 4\". Then \"sum = 4\" + 3 → \"sum = 43\". To get 7, you'd need parentheses: \"sum = \" + (a + b).",
    trapTags: ["string-concat", "operator-precedence"],
  },
  {
    id: "q1-7",
    unitId: "u1",
    topicId: "1-6",
    difficulty: 1,
    prompt: "After this code, what is x?",
    code: `int x = 20;
x /= 6;
x %= 4;`,
    choices: [
      { letter: "A", text: "0", nudge: "You may have used floating-point division. x is int — what does 20 / 6 give in integer division?" },
      { letter: "B", text: "1", nudge: "You may have computed 20 / 6 as 4 (rounding up). Integer division truncates — it doesn't round." },
      { letter: "C", text: "2", nudge: "You may have skipped the second line. Apply both /= and %= in order." },
      { letter: "D", text: "3" },
      { letter: "E", text: "5", nudge: "20 % 6 is 2, but the question uses /=, not %= on line 2. Read the operators carefully." },
    ],
    correct: "D",
    explanation: "20 /= 6 → x = 20 / 6 = 3 (integer division). Then 3 %= 4 → x = 3 % 4 = 3.",
    trapTags: ["compound-assignment", "integer-division"],
  },
  {
    id: "q1-8",
    unitId: "u1",
    topicId: "1-9",
    difficulty: 2,
    prompt: "Which pair of method headers represents legal overloading?",
    choices: [
      { letter: "A", text: "int sum(int a, int b)  /  long sum(int a, int b)", nudge: "These differ only by return type. Overloading requires different parameter LISTS." },
      { letter: "B", text: "void log(String s)  /  void log(int s)" },
      { letter: "C", text: "void run()  /  static void run()", nudge: "Adding 'static' doesn't change the parameter list. These signatures clash." },
      { letter: "D", text: "double avg(double[] a)  /  double avg(double[] a)", nudge: "These are identical signatures. No overloading is possible." },
      { letter: "E", text: "int max(int x)  /  private int max(int x)", nudge: "Visibility modifiers don't make signatures different. Same parameter list = same signature." },
    ],
    correct: "B",
    explanation: "Overloading requires the parameter LIST (types and counts) to differ. Return type, static-ness, and visibility don't count.",
    trapTags: ["method-overloading"],
  },
  {
    id: "q1-9",
    unitId: "u1",
    topicId: "1-12",
    difficulty: 2,
    prompt: "What is printed?",
    code: `int[] a = {1, 2, 3};
int[] b = a;
b[0] = 9;
System.out.println(a[0] + " " + b[0]);`,
    choices: [
      { letter: "A", text: "1 9", nudge: "You assumed b is a copy of a. But arrays are objects — what does 'int[] b = a' actually copy?" },
      { letter: "B", text: "9 9" },
      { letter: "C", text: "1 1", nudge: "b[0] = 9 definitely runs. Why would b[0] still be 1?" },
      { letter: "D", text: "9 1", nudge: "You inverted the order. a is printed first, then b." },
      { letter: "E", text: "Compile error" },
    ],
    correct: "B",
    explanation: "'int[] b = a' copies the REFERENCE, not the array. a and b point at the same array, so b[0] = 9 changes the array seen by both.",
    trapTags: ["aliasing", "reference"],
  },
  {
    id: "q1-10",
    unitId: "u1",
    topicId: "1-15",
    difficulty: 2,
    prompt: "What is the value of result?",
    code: `String name = "Anu Datar";
int result = name.indexOf(" ");`,
    choices: [
      { letter: "A", text: "0", nudge: "indexOf returns the position of the first occurrence — but the first character of \"Anu Datar\" is 'A', not space." },
      { letter: "B", text: "1", nudge: "indexOf is 0-based. Count characters from index 0 until you hit the space." },
      { letter: "C", text: "3" },
      { letter: "D", text: "4", nudge: "You may have included the space in your count. The space IS at the position you return — but indexing is 0-based." },
      { letter: "E", text: "-1", nudge: "indexOf returns -1 only when the target is NOT found. The String \"Anu Datar\" definitely contains a space." },
    ],
    correct: "C",
    explanation: "Indices: A=0, n=1, u=2, space=3. indexOf returns 3.",
    trapTags: ["string", "indexOf"],
  },
  {
    id: "q1-11",
    unitId: "u1",
    topicId: "1-15",
    difficulty: 3,
    prompt: "What is the result?",
    code: `String s = "abracadabra";
String t = s.substring(s.indexOf("c") + 1, s.length() - 2);`,
    choices: [
      { letter: "A", text: "ada", nudge: "Trace it: indexOf(\"c\") gives the position of 'c'. Add 1, then take a substring up to (but not including) length−2." },
      { letter: "B", text: "adab" },
      { letter: "C", text: "cada", nudge: "You may have forgotten the +1 on the first index. substring's first arg is INCLUSIVE." },
      { letter: "D", text: "adabra", nudge: "You used s.length() instead of s.length() - 2 for the second index." },
      { letter: "E", text: "abra", nudge: "You skipped past the 'c' too far. The first index is indexOf(\"c\") + 1, not indexOf(\"c\") + 2." },
    ],
    correct: "B",
    explanation: "indexOf(\"c\")=4, +1 → 5. length=11, −2 → 9. substring(5, 9) takes indices 5,6,7,8 → 'a','d','a','b' = \"adab\".",
    trapTags: ["string", "substring", "off-by-one"],
  },
  {
    id: "q1-12",
    unitId: "u1",
    topicId: "1-5",
    difficulty: 2,
    prompt: "Which expression rounds the double d to the nearest int (assuming d is non-negative)?",
    choices: [
      { letter: "A", text: "(int) d", nudge: "(int) on a double truncates toward zero — it doesn't round. (int) 3.7 is 3, not 4." },
      { letter: "B", text: "(int)(d + 0.5)" },
      { letter: "C", text: "(int) d + 0.5", nudge: "Cast binds tightly. (int) d truncates first, then 0.5 is added — but the result is double, not int." },
      { letter: "D", text: "(int)(d) + 1", nudge: "This always adds 1 after truncating. 3.1 would become 4, but 3.1 should round to 3." },
      { letter: "E", text: "(int) Math.sqrt(d * d)", nudge: "sqrt(d²) just gives back d (for non-negative d), then (int) truncates. Same as choice A." },
    ],
    correct: "B",
    explanation: "(d + 0.5) shifts the value so truncating gives the rounded result. 3.4 + 0.5 = 3.9 → (int) 3. 3.6 + 0.5 = 4.1 → (int) 4.",
    trapTags: ["casting", "rounding"],
  },

  // ============== UNIT 2 — extras ==============
  {
    id: "q2-6",
    unitId: "u2",
    topicId: "2-1",
    difficulty: 1,
    prompt: "What does this code print when score = 85?",
    code: `if (score >= 70) System.out.println("Pass");
else if (score >= 90) System.out.println("Honors");
else System.out.println("Fail");`,
    choices: [
      { letter: "A", text: "Pass" },
      { letter: "B", text: "Honors", nudge: "85 is not >= 90. Even if 85 is high, it doesn't reach the second threshold." },
      { letter: "C", text: "Pass and Honors both", nudge: "An if-else chain runs at most ONE branch. Once a condition matches, the rest are skipped." },
      { letter: "D", text: "Fail", nudge: "85 ≥ 70 is true — the first branch matches." },
      { letter: "E", text: "(no output)" },
    ],
    correct: "A",
    explanation: "Condition order matters: 85 ≥ 70 matches the first branch. The 'Honors' branch is unreachable for any score ≥ 70 because the first one wins.",
    trapTags: ["if-else", "condition-order", "dead-code"],
  },
  {
    id: "q2-7",
    unitId: "u2",
    topicId: "2-5",
    difficulty: 2,
    prompt: "Which expression is true exactly when x is between 1 and 10 INCLUSIVE?",
    choices: [
      { letter: "A", text: "1 < x < 10", nudge: "Java doesn't allow chained comparisons like Python. This is a compile error." },
      { letter: "B", text: "x >= 1 || x <= 10", nudge: "|| means OR. Pick any x — the expression is true for almost any value. Try x = 100." },
      { letter: "C", text: "x >= 1 && x <= 10" },
      { letter: "D", text: "x > 1 && x < 10", nudge: "> and < exclude the boundary values. The question says inclusive." },
      { letter: "E", text: "1 <= x <= 10", nudge: "Same as A — Java does NOT support chained comparisons." },
    ],
    correct: "C",
    explanation: "&& makes both bounds required. >= and <= include the endpoints (inclusive).",
    trapTags: ["boolean-logic", "range"],
  },
  {
    id: "q2-8",
    unitId: "u2",
    topicId: "2-9",
    difficulty: 3,
    prompt: "How many TIMES does the inner body run total?",
    code: `for (int i = 0; i < 4; i++) {
  for (int j = i; j < 4; j++) {
    // body
  }
}`,
    choices: [
      { letter: "A", text: "10" },
      { letter: "B", text: "16", nudge: "16 would be if both loops always ran 4 times. But the inner loop's start depends on i — it shrinks." },
      { letter: "C", text: "8", nudge: "Trace iteration counts per outer pass. i=0: 4. i=1: 3. i=2: 2. i=3: 1. Add them up." },
      { letter: "D", text: "12", nudge: "Try writing each pass: when i=0, j goes 0,1,2,3 — that's 4. When i=1, j goes 1,2,3 — that's 3. Continue and sum." },
      { letter: "E", text: "4", nudge: "You only counted the outer loop. Each iteration of the outer loop runs the inner loop multiple times." },
    ],
    correct: "A",
    explanation: "Inner runs (4 − i) times for each i: i=0:4, i=1:3, i=2:2, i=3:1. Total = 4+3+2+1 = 10.",
    trapTags: ["nested-loops", "trace"],
  },
  {
    id: "q2-9",
    unitId: "u2",
    topicId: "2-7",
    difficulty: 2,
    prompt: "What is the final value of n?",
    code: `int n = 1;
while (n < 50) {
  n = n * 3;
}`,
    choices: [
      { letter: "A", text: "27", nudge: "27 < 50 is still true. The loop runs once more." },
      { letter: "B", text: "50", nudge: "n is multiplied by 3 each time — 1, 3, 9, 27, then 81. 50 is not reachable by these multiplications." },
      { letter: "C", text: "81" },
      { letter: "D", text: "243", nudge: "When n becomes 81, 81 < 50 is false. The loop exits — it doesn't multiply once more." },
      { letter: "E", text: "Infinite", nudge: "n grows each iteration. The loop terminates the moment n >= 50." },
    ],
    correct: "C",
    explanation: "n: 1 → 3 → 9 → 27 → 81. After n becomes 81, the condition 81 < 50 is false — loop exits. Final n = 81.",
    trapTags: ["while-loop-trace"],
  },
  {
    id: "q2-10",
    unitId: "u2",
    topicId: "2-10",
    difficulty: 2,
    prompt: "What does this method return when called with \"banana\"?",
    code: `public static int mystery(String s) {
  int c = 0;
  for (int i = 0; i < s.length(); i++) {
    if (s.substring(i, i + 1).equals("a")) c++;
  }
  return c;
}`,
    choices: [
      { letter: "A", text: "1", nudge: "There's more than one 'a' in \"banana\". Walk through every character." },
      { letter: "B", text: "2", nudge: "Almost — count again. b-a-n-a-n-a. How many 'a's?" },
      { letter: "C", text: "3" },
      { letter: "D", text: "6", nudge: "The method counts only 'a' characters, not all characters." },
      { letter: "E", text: "0", nudge: "The string contains 'a'. Compare each substring(i, i+1) to \"a\" — they DO match in some positions." },
    ],
    correct: "C",
    explanation: "\"banana\" has 'a' at indices 1, 3, 5. The loop counts 3.",
    trapTags: ["string-traversal", "counting"],
  },
  {
    id: "q2-11",
    unitId: "u2",
    topicId: "2-5",
    difficulty: 3,
    prompt: "Given int[] arr and a method hasNegative(int[]) that crashes if passed null, which expression is TRUE when arr is null OR has at least one negative element — without ever throwing?",
    choices: [
      { letter: "A", text: "arr == null || hasNegative(arr)" },
      { letter: "B", text: "hasNegative(arr) || arr == null", nudge: "If arr is null, the first call hasNegative(arr) runs first and crashes — || never gets a chance to short-circuit." },
      { letter: "C", text: "arr == null && hasNegative(arr)", nudge: "&& requires BOTH true. arr can't be both null and have negatives. The expression is always false." },
      { letter: "D", text: "arr != null || hasNegative(arr)", nudge: "When arr IS null, this expression's first half is false, so it falls through to hasNegative — and crashes." },
      { letter: "E", text: "arr == null | hasNegative(arr)", nudge: "Single | is non-short-circuit. Both sides always evaluate, so a null arr will crash inside hasNegative." },
    ],
    correct: "A",
    explanation: "Short-circuit ||: if arr == null is true, the right side never runs. hasNegative is only called when arr is non-null. Order matters.",
    trapTags: ["short-circuit", "null-check"],
  },

  // ============== UNIT 3 — extras ==============
  {
    id: "q3-4",
    unitId: "u3",
    topicId: "3-4",
    difficulty: 2,
    prompt: "Which constructor for Point assigns the parameters to the fields correctly?",
    code: `public class Point {
  private int x;
  private int y;
  // constructor here
}`,
    choices: [
      { letter: "A", text: "public Point(int x, int y) { x = x; y = y; }", nudge: "Without 'this.', the assignments x = x and y = y just copy the parameters into themselves. The fields never get touched." },
      { letter: "B", text: "public Point(int x, int y) { this.x = x; this.y = y; }" },
      { letter: "C", text: "public void Point(int x, int y) { this.x = x; this.y = y; }", nudge: "Constructors have NO return type — not even void. Adding 'void' makes this a regular method, not a constructor." },
      { letter: "D", text: "public Point(int x, int y) { this.x = y; this.y = x; }", nudge: "This compiles, but it swaps the values. Trace what happens with new Point(3, 5)." },
      { letter: "E", text: "public Point() { this.x = x; this.y = y; }", nudge: "No parameters! What would x and y refer to inside this constructor?" },
    ],
    correct: "B",
    explanation: "Constructor name = class name, no return type, and 'this.' disambiguates the field from the parameter when they share a name.",
    trapTags: ["constructor", "this", "shadowing"],
  },
  {
    id: "q3-5",
    unitId: "u3",
    topicId: "3-7",
    difficulty: 2,
    prompt: "Which statement about static methods is TRUE?",
    choices: [
      { letter: "A", text: "Static methods can directly access instance variables without a reference.", nudge: "Static methods have no 'this'. Instance variables belong to a specific object — without one, which object's variable would the static method use?" },
      { letter: "B", text: "Static methods must be called on an instance.", nudge: "It's the opposite — static methods are called on the CLASS (e.g., Math.abs), no instance required." },
      { letter: "C", text: "A static method can call other static methods of the same class without qualification." },
      { letter: "D", text: "Each instance has its own copy of a static method.", nudge: "Methods aren't 'copied' per instance — that's a misconception. The 'static' part means class-level, even more so." },
      { letter: "E", text: "Static methods cannot have parameters.", nudge: "Many static methods have parameters — Math.pow(a, b), Integer.parseInt(s). Static is unrelated to parameters." },
    ],
    correct: "C",
    explanation: "Inside a static method, you can call another static method of the same class by its name alone — no 'this', no class prefix needed.",
    trapTags: ["static"],
  },
  {
    id: "q3-6",
    unitId: "u3",
    topicId: "3-6",
    difficulty: 3,
    prompt: "What is printed?",
    code: `public static void swap(int[] a) {
  int t = a[0];
  a[0] = a[1];
  a[1] = t;
}
// in main:
int[] data = {5, 7};
swap(data);
System.out.println(data[0] + "," + data[1]);`,
    choices: [
      { letter: "A", text: "5,7", nudge: "You assumed the array is unchanged. But the method receives a reference — what does it actually have access to?" },
      { letter: "B", text: "7,5" },
      { letter: "C", text: "0,0", nudge: "The method swaps two values; it doesn't zero them." },
      { letter: "D", text: "Compile error" },
      { letter: "E", text: "5,5", nudge: "Trace carefully — t saves the original a[0], then a[0] gets a[1], then a[1] gets t. No values are lost." },
    ],
    correct: "B",
    explanation: "Java passes a copy of the array reference. swap mutates the SAME array data points to. After the call, data[0]=7 and data[1]=5.",
    trapTags: ["pass-by-value", "reference"],
  },

  // ============== UNIT 4 — extras ==============
  {
    id: "q4-7",
    unitId: "u4",
    topicId: "4-5",
    difficulty: 2,
    prompt: "What does this method return when called on {3, -1, 4, -1, 5, 9}?",
    code: `public static int mystery(int[] arr) {
  int c = 0;
  for (int n : arr) {
    if (n > 0) c++;
  }
  return c;
}`,
    choices: [
      { letter: "A", text: "4" },
      { letter: "B", text: "6", nudge: "The method only counts elements where n > 0. -1 fails that check." },
      { letter: "C", text: "2", nudge: "There are MORE than 2 positive values. List which ones satisfy n > 0." },
      { letter: "D", text: "21", nudge: "21 is the SUM of positive elements (3+4+5+9), not the count. The method increments c by 1, not by n." },
      { letter: "E", text: "-2", nudge: "The method never decrements c. It only increases (or stays the same)." },
    ],
    correct: "A",
    explanation: "Positive elements: 3, 4, 5, 9 — four of them. The method counts how many.",
    trapTags: ["array-traversal", "counting"],
  },
  {
    id: "q4-8",
    unitId: "u4",
    topicId: "4-3",
    difficulty: 1,
    prompt: "Which line causes a COMPILE error?",
    code: `String[] names = new String[3];   // 1
int len = names.length;           // 2
String s = names[0];              // 3
int n = "hello".length;           // 4
int m = "hello".length();         // 5`,
    choices: [
      { letter: "A", text: "Line 1", nudge: "Allocating an array of String references is legal. The elements are null until assigned, but the line itself compiles." },
      { letter: "B", text: "Line 2", nudge: "Arrays use .length without parens — this is correct." },
      { letter: "C", text: "Line 3", nudge: "Reading an unassigned element gives null, but the line compiles. Assigning a null reference is fine; only calling a method on it would throw." },
      { letter: "D", text: "Line 4" },
      { letter: "E", text: "Line 5", nudge: "Strings use length() WITH parens — this is correct." },
    ],
    correct: "D",
    explanation: "Strings have a length() method (with parens). 'string'.length is a compile error. Arrays use .length without parens — the rule is reversed.",
    trapTags: ["string", "array", "length"],
  },
  {
    id: "q4-10",
    unitId: "u4",
    topicId: "4-13",
    difficulty: 2,
    prompt: "What does this method return when called on a 3×3 grid filled with 1s?",
    code: `public static int mystery(int[][] g) {
  int s = 0;
  for (int r = 0; r < g.length; r++)
    for (int c = 0; c < g[0].length; c++)
      if (r == c) s += g[r][c];
  return s;
}`,
    choices: [
      { letter: "A", text: "9", nudge: "9 is the total of ALL 9 cells. The method only adds when r == c — that's not every cell." },
      { letter: "B", text: "3" },
      { letter: "C", text: "6", nudge: "List the (r, c) pairs where r == c. There are exactly that many cells contributing." },
      { letter: "D", text: "1", nudge: "More than one cell has r == c. Try (0,0), (1,1), (2,2) — count them and sum." },
      { letter: "E", text: "0", nudge: "The condition r == c is satisfied along the main diagonal — those cells get added." },
    ],
    correct: "B",
    explanation: "Only cells on the main diagonal (0,0), (1,1), (2,2) satisfy r==c. Each holds 1, so sum = 3.",
    trapTags: ["2d-array", "diagonal", "trace"],
  },
  {
    id: "q4-11",
    unitId: "u4",
    topicId: "4-9",
    difficulty: 3,
    prompt: "Which loop SAFELY removes every element equal to 0 from an ArrayList<Integer>?",
    choices: [
      { letter: "A", text: "for (int i = 0; i < list.size(); i++) if (list.get(i) == 0) list.remove(i);", nudge: "When you remove at i, the next element slides into index i — but i++ skips past it. Adjacent 0s will be missed." },
      { letter: "B", text: "for (int i = list.size() - 1; i >= 0; i--) if (list.get(i) == 0) list.remove(i);" },
      { letter: "C", text: "for (int n : list) if (n == 0) list.remove(n);", nudge: "Two problems: list.remove(n) takes an index, not a value here. Also modifying a list while iterating with for-each throws." },
      { letter: "D", text: "for (int i = 0; i < list.size(); i++) { if (list.get(i) == 0) { list.remove(i); i++; } }", nudge: "You added i++ AFTER a remove. That's the wrong direction — you'd want to step BACK after a slide, not skip ahead." },
      { letter: "E", text: "for (int i = 0; i <= list.size(); i++) if (list.get(i) == 0) list.remove(i);", nudge: "i <= list.size() goes past the end. IndexOutOfBoundsException on the last iteration." },
    ],
    correct: "B",
    explanation: "Iterating from the end means a removal only affects indices you've already visited. The unprocessed portion stays at the same indices.",
    trapTags: ["arraylist", "remove-while-iterating"],
  },
  {
    id: "q4-12",
    unitId: "u4",
    topicId: "4-16",
    difficulty: 3,
    prompt: "What does this return when called as f(\"abcd\")?",
    code: `public static String f(String s) {
  if (s.length() <= 1) return s;
  return f(s.substring(1)) + s.substring(0, 1);
}`,
    choices: [
      { letter: "A", text: "abcd", nudge: "The recursive call uses substring(1), peeling off the first character. The first character is then APPENDED to the result. Trace what gets concatenated last." },
      { letter: "B", text: "dcba" },
      { letter: "C", text: "dabc", nudge: "You may have appended at the wrong position. Trace one step: f(\"abcd\") = f(\"bcd\") + \"a\". Where does \"a\" land in the final string?" },
      { letter: "D", text: "a", nudge: "The recursion runs all the way to length 1, but each level adds a character back. The final string has every character." },
      { letter: "E", text: "abcdcba", nudge: "Each character is added once, not mirrored. Re-check what each recursive level contributes." },
    ],
    correct: "B",
    explanation: "f(\"abcd\") = f(\"bcd\") + \"a\". f(\"bcd\") = f(\"cd\") + \"b\" = (f(\"d\") + \"c\") + \"b\" = \"d\" + \"c\" + \"b\" = \"dcb\". Append \"a\" → \"dcba\". The function reverses its input.",
    trapTags: ["recursion", "string"],
  },
  {
    id: "q4-13",
    unitId: "u4",
    topicId: "4-14",
    difficulty: 2,
    prompt: "Which statement about binary search is FALSE?",
    choices: [
      { letter: "A", text: "It requires the array to be sorted." },
      { letter: "B", text: "It runs in O(log n) time." },
      { letter: "C", text: "On an unsorted array, it throws an exception.", nudge: "Note the word THROWS. Java doesn't validate that the input is sorted — does it actually throw, or just give a wrong answer?" },
      { letter: "D", text: "It can be implemented recursively." },
      { letter: "E", text: "It compares against the middle element each iteration." },
    ],
    correct: "C",
    explanation: "Binary search on an unsorted array gives an undefined / wrong result silently. Java does NOT throw — there's no automatic check that the array is sorted.",
    trapTags: ["binary-search"],
  },
  {
    id: "q4-14",
    unitId: "u4",
    topicId: "4-8",
    difficulty: 1,
    prompt: "Which statement is FALSE about ArrayList<Integer>?",
    choices: [
      { letter: "A", text: "It can grow as elements are added." },
      { letter: "B", text: "list.size() returns the current number of elements." },
      { letter: "C", text: "list.get(0) on an empty list throws an exception." },
      { letter: "D", text: "ArrayList<int> is a valid declaration.", nudge: "Generic type parameters must be reference types. Primitive int isn't allowed — that's why we use Integer." },
      { letter: "E", text: "Java auto-boxes int into Integer when calling list.add(7)." },
    ],
    correct: "D",
    explanation: "Generics in Java only accept reference types. ArrayList<int> is a compile error — use ArrayList<Integer>.",
    trapTags: ["arraylist", "generics"],
  },

  // ============== UNIT 1 — Wave 3 (concepts) ==============
  {
    id: "q1-13",
    unitId: "u1",
    topicId: "1-2",
    difficulty: 1,
    prompt: "Which declaration causes a COMPILE error?",
    choices: [
      { letter: "A", text: "double avg = 5;", nudge: "Assigning an int to a double is a widening conversion — Java does it automatically." },
      { letter: "B", text: "boolean done = 0;", nudge: "Java is stricter than C: 0 and 1 are not booleans." },
      { letter: "C", text: "int n = (int) 3.7;", nudge: "An explicit cast from double to int is legal and produces 3." },
      { letter: "D", text: "final int K = 5;", nudge: "final declares a constant. Perfectly legal." },
      { letter: "E", text: "int x; x = 10;", nudge: "Declaring on one line and assigning later is fine." },
    ],
    correct: "B",
    explanation: "boolean is its own type in Java — only true or false are valid. 0 is an int, not a boolean.",
    trapTags: ["types"],
  },
  {
    id: "q1-14",
    unitId: "u1",
    topicId: "1-3",
    difficulty: 2,
    prompt: "What is printed?",
    code: `int a = 3, b = 4;
System.out.println(a + b + " = sum");`,
    choices: [
      { letter: "A", text: "7 = sum" },
      { letter: "B", text: "34 = sum", nudge: "Numeric + happens left-to-right BEFORE the String appears. Where does the first String live?" },
      { letter: "C", text: "= sum", nudge: "Both numbers are printed — they don't disappear." },
      { letter: "D", text: "3 + 4 = sum", nudge: "+ doesn't preserve the operator literally." },
      { letter: "E", text: "Compile error" },
    ],
    correct: "A",
    explanation: "Both operands of the FIRST + are int, so 3+4=7. Then 7 + \" = sum\" → \"7 = sum\".",
    trapTags: ["string-concat", "operator-precedence"],
  },
  {
    id: "q1-15",
    unitId: "u1",
    topicId: "1-12",
    difficulty: 1,
    prompt: "Which statement creates a String holding the text 'hi'?",
    choices: [
      { letter: "A", text: "String s = \"hi\";" },
      { letter: "B", text: "String s = 'hi';", nudge: "Single quotes denote a single character (and only one char). For multi-char text use double quotes." },
      { letter: "C", text: "string s = \"hi\";", nudge: "Java is case-sensitive. The class name is String, not string." },
      { letter: "D", text: "String s = new \"hi\";", nudge: "You can't 'new' a literal — that's not valid syntax." },
      { letter: "E", text: "var s == \"hi\";", nudge: "Two issues: == is comparison, not assignment. Look for the proper assignment form." },
    ],
    correct: "A",
    explanation: "Strings are written with double quotes. Java case-sensitivity matters: the type is String (capital S).",
    trapTags: ["string", "syntax"],
  },
  {
    id: "q1-16",
    unitId: "u1",
    topicId: "1-15",
    difficulty: 3,
    prompt: "Which expression is true exactly when the String s starts with the character 'A' (assume s is non-empty)?",
    choices: [
      { letter: "A", text: "s.substring(0, 1).equals(\"A\")" },
      { letter: "B", text: "s.substring(0, 1) == \"A\"", nudge: "== compares references. To compare String contents, use equals." },
      { letter: "C", text: "s.indexOf(\"A\") == 0", nudge: "This works WHEN 'A' is at index 0 — but indexOf returns the FIRST occurrence. If 'A' isn't at the start at all, this is -1, not 0. Make sure it's true exactly when the first character IS 'A'." },
      { letter: "D", text: "s.charAt(0) = 'A'", nudge: "= is assignment, not comparison. Also charAt isn't on the AP exam — but the bigger issue is that single = won't compile here." },
      { letter: "E", text: "s.length() == 1 && s.equals(\"A\")", nudge: "This is true only when s is exactly 'A'. The question allows longer strings starting with 'A'." },
    ],
    correct: "A",
    explanation: "On the AP exam, the safe way to grab the first character is substring(0, 1), and the safe way to compare Strings is .equals.",
    trapTags: ["string-equality", "substring"],
  },

  // ============== UNIT 2 — Wave 3 ==============
  {
    id: "q2-12",
    unitId: "u2",
    topicId: "2-9",
    difficulty: 2,
    prompt: "What is printed?",
    code: `for (int r = 1; r <= 3; r++) {
  for (int c = 1; c <= r; c++) {
    System.out.print("*");
  }
  System.out.println();
}`,
    choices: [
      { letter: "A", text: "*\\n**\\n***" },
      { letter: "B", text: "***\\n**\\n*", nudge: "The inner loop bound INCREASES with r. Stars accumulate from row 1 (1 star) to row 3 (3 stars)." },
      { letter: "C", text: "***\\n***\\n***", nudge: "The inner loop runs c from 1 to r — not always to 3. The number of stars depends on the row." },
      { letter: "D", text: "*\\n*\\n*", nudge: "Each row prints r stars, not 1." },
      { letter: "E", text: "(no output)" },
    ],
    correct: "A",
    explanation: "Row 1 prints 1 star. Row 2 prints 2. Row 3 prints 3. Each row ends with println.",
    trapTags: ["nested-loops", "trace"],
  },
  {
    id: "q2-13",
    unitId: "u2",
    topicId: "2-7",
    difficulty: 2,
    prompt: "Trace the loop. What is the value of count when the loop exits?",
    code: `int count = 0;
int n = 100;
while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else n = 3 * n + 1;
  count++;
}`,
    choices: [
      { letter: "A", text: "Loops forever (Collatz never terminates)", nudge: "For 100, the sequence DOES reach 1. That's the whole point of trying it." },
      { letter: "B", text: "25" },
      { letter: "C", text: "10", nudge: "Trace it: 100 → 50 → 25 → 76 → 38 → 19 → 58 → 29 → 88 → 44 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1. Count those steps." },
      { letter: "D", text: "100", nudge: "n is halved or transformed each iteration — it doesn't decrement by 1." },
      { letter: "E", text: "0", nudge: "n starts > 1, so the loop runs at least once." },
    ],
    correct: "B",
    explanation: "The Collatz sequence from 100: 100→50→25→76→38→19→58→29→88→44→22→11→34→17→52→26→13→40→20→10→5→16→8→4→2→1. That's 25 steps.",
    trapTags: ["while-loop-trace", "collatz"],
  },
  {
    id: "q2-14",
    unitId: "u2",
    topicId: "2-5",
    difficulty: 2,
    prompt: "Which expression is logically equivalent to !(x < 10 || x > 100)?",
    choices: [
      { letter: "A", text: "x >= 10 && x <= 100" },
      { letter: "B", text: "x > 10 && x < 100", nudge: "Negate carefully. !(x < 10) is x >= 10, not x > 10." },
      { letter: "C", text: "x >= 10 || x <= 100", nudge: "De Morgan flips the connector. || becomes &&, not stays as ||." },
      { letter: "D", text: "x < 10 && x > 100", nudge: "You kept the comparisons identical. Negation flips them." },
      { letter: "E", text: "!x < 10 && !x > 100", nudge: "You can't negate part of a comparison like that. Negate the whole comparison or apply De Morgan." },
    ],
    correct: "A",
    explanation: "By De Morgan: !(P || Q) = !P && !Q. !(x < 10) is x >= 10. !(x > 100) is x <= 100.",
    trapTags: ["de-morgan", "boolean-logic"],
  },

  // ============== UNIT 3 — Wave 3 ==============
  {
    id: "q3-7",
    unitId: "u3",
    topicId: "3-3",
    difficulty: 1,
    prompt: "Which is NOT a valid public accessor (getter) for a private int field named score?",
    choices: [
      { letter: "A", text: "public int getScore() { return score; }" },
      { letter: "B", text: "public int getScore() { return this.score; }" },
      { letter: "C", text: "public void getScore() { return score; }", nudge: "void means 'returns nothing'. But 'return score;' returns a value. The compiler rejects this." },
      { letter: "D", text: "public int score() { return score; }" },
      { letter: "E", text: "public int getScore() { int s = score; return s; }" },
    ],
    correct: "C",
    explanation: "A void method cannot return a value. The combination of 'void' and 'return score;' is a compile error.",
    trapTags: ["methods", "void"],
  },
  {
    id: "q3-8",
    unitId: "u3",
    topicId: "3-4",
    difficulty: 2,
    prompt: "Consider:",
    code: `public class Box {
  private int size;
  public Box() { size = 1; }
  public Box(int s) { size = s; }
  public int getSize() { return size; }
}
// caller:
Box b = new Box();
Box c = new Box(5);
System.out.println(b.getSize() + " " + c.getSize());`,
    choices: [
      { letter: "A", text: "1 5" },
      { letter: "B", text: "5 5", nudge: "Two different constructors run. The first one (no args) sets size = 1." },
      { letter: "C", text: "0 5", nudge: "The no-arg constructor explicitly sets size = 1, not 0." },
      { letter: "D", text: "1 1", nudge: "The second 'new Box(5)' uses the int constructor, which sets size = s." },
      { letter: "E", text: "Compile error", nudge: "Both constructors are well-formed. Constructor overloading is allowed." },
    ],
    correct: "A",
    explanation: "Two valid constructors, picked by argument list. b uses the no-arg (size=1), c uses the int form (size=5).",
    trapTags: ["constructor-overloading"],
  },
  {
    id: "q3-9",
    unitId: "u3",
    topicId: "3-7",
    difficulty: 3,
    prompt: "What is printed?",
    code: `public class Counter {
  private static int total = 0;
  public Counter() { total++; }
  public static int getTotal() { return total; }
}
// caller:
new Counter(); new Counter(); new Counter();
System.out.println(Counter.getTotal());`,
    choices: [
      { letter: "A", text: "0", nudge: "Each constructor call increments total. Three constructor calls happen." },
      { letter: "B", text: "1", nudge: "total is static — there's ONE shared variable across all instances." },
      { letter: "C", text: "3" },
      { letter: "D", text: "Compile error", nudge: "Calling 'new Counter()' as a statement (without saving the reference) is fully legal." },
      { letter: "E", text: "Run-time error", nudge: "The code runs without throwing. There's nothing null or out-of-bounds here." },
    ],
    correct: "C",
    explanation: "Each new Counter() runs the constructor and total++. Three constructions → total = 3.",
    trapTags: ["static", "constructor"],
  },
  {
    id: "q3-10",
    unitId: "u3",
    topicId: "3-6",
    difficulty: 3,
    prompt: "After this method returns, what is the value of arr[0]?",
    code: `public static void rebuild(int[] a) {
  a = new int[]{99, 99, 99};
  a[0] = 7;
}
// in main:
int[] arr = {1, 2, 3};
rebuild(arr);
// arr[0] = ?`,
    choices: [
      { letter: "A", text: "1" },
      { letter: "B", text: "7", nudge: "Inside rebuild, 'a' is reassigned to a NEW array. After that, a[0] = 7 modifies the new array — not the caller's." },
      { letter: "C", text: "99", nudge: "Same reasoning as above: rebuild creates a fresh array. The caller's reference is unchanged." },
      { letter: "D", text: "0", nudge: "The caller's array isn't reset. The reassignment only affects the local 'a'." },
      { letter: "E", text: "Compile error" },
    ],
    correct: "A",
    explanation: "'a = new int[]{...}' rebinds the local parameter to a new object — it does NOT change the caller's reference. arr still points at the original {1, 2, 3}.",
    trapTags: ["pass-by-value", "reference"],
  },

  // ============== UNIT 4 — Wave 3 ==============
  {
    id: "q4-15",
    unitId: "u4",
    topicId: "4-15",
    difficulty: 2,
    prompt: "Selection sort is being applied to {6, 2, 8, 4, 10}. Which array correctly shows the state after the FIRST pass?",
    choices: [
      { letter: "A", text: "{2, 6, 8, 4, 10}" },
      { letter: "B", text: "{2, 4, 8, 6, 10}", nudge: "After ONE pass, only the first element is guaranteed final. The rest may not be sorted." },
      { letter: "C", text: "{6, 2, 8, 4, 10}", nudge: "Selection sort moves the global minimum to the front each pass. It DOES change the array." },
      { letter: "D", text: "{2, 4, 6, 8, 10}", nudge: "That's the FULLY sorted array. Selection sort takes more than one pass." },
      { letter: "E", text: "{4, 6, 8, 2, 10}", nudge: "Selection sort doesn't reorder this way. It SWAPS the minimum into position 0." },
    ],
    correct: "A",
    explanation: "Pass 1 of selection sort: find the minimum (2 at index 1), swap with index 0. Result: {2, 6, 8, 4, 10}.",
    trapTags: ["selection-sort"],
  },
  {
    id: "q4-16",
    unitId: "u4",
    topicId: "4-16",
    difficulty: 3,
    prompt: "What does this method do?",
    code: `public static int g(int[] arr, int lo, int hi) {
  if (lo > hi) return -1;
  int mid = (lo + hi) / 2;
  if (arr[mid] == 42) return mid;
  if (arr[mid] < 42) return g(arr, mid + 1, hi);
  return g(arr, lo, mid - 1);
}`,
    choices: [
      { letter: "A", text: "Linear search for 42", nudge: "Linear search walks one index at a time. This method jumps to the middle each call." },
      { letter: "B", text: "Recursive binary search for 42 (assumes arr is sorted)" },
      { letter: "C", text: "Selection sort", nudge: "Selection sort doesn't return an index. This method has a return value of int." },
      { letter: "D", text: "Counts occurrences of 42", nudge: "When it finds 42 it returns immediately — no counting." },
      { letter: "E", text: "Always returns -1", nudge: "There's a return path that gives mid when arr[mid] == 42." },
    ],
    correct: "B",
    explanation: "Halve the search range each call by comparing arr[mid] to 42. Base case: lo > hi → not found, return -1. This is recursive binary search.",
    trapTags: ["binary-search", "recursion"],
  },
  {
    id: "q4-17",
    unitId: "u4",
    topicId: "4-13",
    difficulty: 3,
    prompt: "What does this method return when called on a 4×4 grid where grid[r][c] = r + c?",
    code: `public static int mystery(int[][] g) {
  int s = 0;
  for (int r = 0; r < g.length; r++)
    for (int c = 0; c < g[0].length; c++)
      if (r + c == g.length - 1) s += g[r][c];
  return s;
}`,
    choices: [
      { letter: "A", text: "9" },
      { letter: "B", text: "12", nudge: "On a 4×4 grid, the anti-diagonal has 4 cells where r+c = 3. Each holds r+c = 3. Sum = 4 × 3 = 12." },
      { letter: "C", text: "6", nudge: "You may have summed only half the diagonal." },
      { letter: "D", text: "16", nudge: "16 would be the sum of every cell in the grid (g[r][c] = r+c, total = 24 actually). The condition only adds anti-diagonal cells." },
      { letter: "E", text: "0", nudge: "The condition r+c == 3 IS satisfied for cells like (0,3), (1,2), (2,1), (3,0). Not all-zero." },
    ],
    correct: "B",
    explanation: "The condition r + c == 3 picks the anti-diagonal: (0,3), (1,2), (2,1), (3,0). Each cell holds r+c = 3, so sum = 4 × 3 = 12.",
    trapTags: ["2d-array", "anti-diagonal", "trace"],
  },
  {
    id: "q4-18",
    unitId: "u4",
    topicId: "4-9",
    difficulty: 2,
    prompt: "After this code runs, what does list contain?",
    code: `ArrayList<Integer> list = new ArrayList<>();
list.add(10);  list.add(20);  list.add(30);
list.set(1, 99);
list.remove(0);
list.add(0, 5);`,
    choices: [
      { letter: "A", text: "[5, 99, 30]" },
      { letter: "B", text: "[5, 10, 99, 30]", nudge: "The remove(0) removes 10. The set(1, 99) replaced 20 → 99 BEFORE that remove." },
      { letter: "C", text: "[10, 99, 30]", nudge: "You missed the add(0, 5). The last operation inserts 5 at the beginning." },
      { letter: "D", text: "[5, 20, 30]", nudge: "set(1, 99) replaces the element at index 1 (which was 20) with 99." },
      { letter: "E", text: "[5, 99, 30, 10]", nudge: "remove(0) removes the first element entirely; nothing is preserved." },
    ],
    correct: "A",
    explanation: "After add adds: [10,20,30]. set(1,99) → [10,99,30]. remove(0) → [99,30]. add(0,5) → [5,99,30].",
    trapTags: ["arraylist", "trace"],
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
