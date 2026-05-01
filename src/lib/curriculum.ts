export type Slide = {
  title: string;
  body: string;
  code?: string;
  callout?: { kind: "tip" | "trap" | "key"; text: string };
};

export type Topic = {
  id: string;
  number: string;
  title: string;
  blurb: string;
  slides: Slide[];
};

export type Unit = {
  id: string;
  number: number;
  title: string;
  weight: string;
  blurb: string;
  accent: string;
  topics: Topic[];
};

export const UNITS: Unit[] = [
  {
    id: "u1",
    number: 1,
    title: "Using Objects and Methods",
    weight: "15–25%",
    accent: "from-sky-400 via-indigo-500 to-violet-500",
    blurb:
      "Primitives, Strings, the Math class, and how to call methods on objects you didn't build.",
    topics: [
      {
        id: "1-2",
        number: "1.2",
        title: "Variables & Data Types",
        blurb: "int, double, boolean — pick the right bucket.",
        slides: [
          {
            title: "Primitive types on the AP exam",
            body: "Only three primitives are tested: int (whole numbers), double (decimals), and boolean (true/false). Everything else is an object reference.",
            callout: {
              kind: "key",
              text: "char, byte, float, short, long are NOT on the AP CSA exam.",
            },
          },
          {
            title: "Declaring and initializing",
            body: "Always declare a type, then a name, then optionally assign a value. Final variables cannot be reassigned.",
            code: `int score = 0;
double avg = 92.7;
boolean passed = true;
final int MAX = 100; // can't reassign`,
          },
          {
            title: "Default values trap",
            body: "Local variables have NO default value — using them before assignment is a compile error. Instance variables default to 0 / 0.0 / false / null.",
            callout: {
              kind: "trap",
              text: "If a question shows a local variable used before it's set, the answer is 'compile error', not 0.",
            },
          },
        ],
      },
      {
        id: "1-3",
        number: "1.3",
        title: "Expressions & Output",
        blurb: "Operator precedence, integer division, and System.out.",
        slides: [
          {
            title: "Integer division",
            body: "When BOTH operands are int, the result is an int — anything after the decimal is dropped, NOT rounded.",
            code: `int a = 7 / 2;     // 3, not 3.5
double b = 7 / 2;  // still 3.0!
double c = 7.0 / 2; // 3.5`,
            callout: {
              kind: "trap",
              text: "Promotion to double happens BEFORE the assignment, but only if at least one operand is already double.",
            },
          },
          {
            title: "Modulus (%)",
            body: "x % y gives the remainder when x is divided by y. The sign of the result follows the sign of x.",
            code: `17 % 5   // 2
-17 % 5  // -2
17 % -5  // 2`,
          },
          {
            title: "Operator precedence",
            body: "*, /, % bind tighter than + and −. Use parentheses when in doubt — the AP graders never ding you for them.",
          },
          {
            title: "println vs print",
            body: "System.out.println adds a newline; System.out.print does not. String concatenation with + auto-converts other types to String.",
          },
        ],
      },
      {
        id: "1-5",
        number: "1.5",
        title: "Casting & Range",
        blurb: "(int) truncates, (double) promotes, ints overflow silently.",
        slides: [
          {
            title: "Casting to int truncates",
            body: "(int) on a double drops the decimal — it does not round. To round, use (int)(x + 0.5) for positive numbers.",
            code: `(int) 3.9    // 3
(int) -3.9   // -3 (toward zero)
(int)(3.9 + 0.5) // 4 — rounding trick`,
          },
          {
            title: "Casting in expressions",
            body: "Cast binds tightly. (double) a / b promotes a, then divides. (double)(a / b) does integer division first, then promotes — usually wrong.",
            callout: {
              kind: "trap",
              text: "Watch where the parentheses are. A misplaced cast is a classic distractor.",
            },
          },
          {
            title: "Integer overflow",
            body: "int holds about ±2.1 billion. Adding past Integer.MAX_VALUE silently wraps to a large negative — Java does NOT throw.",
          },
        ],
      },
      {
        id: "1-11",
        number: "1.11",
        title: "Math Class",
        blurb: "Static methods: abs, pow, sqrt, random.",
        slides: [
          {
            title: "Static method calls",
            body: "Math methods are static — call them on the class, not an object: Math.pow(2, 10), Math.abs(-5).",
          },
          {
            title: "Math.random()",
            body: "Returns a double in [0.0, 1.0) — INCLUDING 0, EXCLUDING 1. To get an int in [low, high]:",
            code: `// random int in [low, high] inclusive
int n = (int)(Math.random() * (high - low + 1)) + low;`,
            callout: {
              kind: "key",
              text: "+1 in (high − low + 1) is critical. Forgetting it is the #1 trap.",
            },
          },
          {
            title: "pow vs * vs Math.sqrt",
            body: "Math.pow returns a double. Math.sqrt returns a double. If you assign to int, you must cast.",
          },
        ],
      },
      {
        id: "1-15",
        number: "1.15",
        title: "String Manipulation",
        blurb: "substring, indexOf, length, compareTo.",
        slides: [
          {
            title: "Strings are immutable",
            body: "Every method that 'changes' a String actually returns a NEW String. The original is untouched.",
            code: `String s = "hello";
s.toUpperCase();      // does nothing visible
s = s.toUpperCase();  // now s = "HELLO"`,
          },
          {
            title: "substring(a, b)",
            body: "Returns characters from index a UP TO BUT NOT INCLUDING index b. Length of result = b − a.",
            code: `"abcdef".substring(1, 4)  // "bcd"
"abcdef".substring(2)     // "cdef"`,
            callout: {
              kind: "trap",
              text: "Off-by-one errors live here. The 2nd index is exclusive.",
            },
          },
          {
            title: ".equals vs ==",
            body: "== compares references. .equals() compares character contents. ALWAYS use .equals for Strings.",
          },
          {
            title: "compareTo",
            body: "a.compareTo(b) returns 0 if equal, negative if a < b, positive if a > b — based on Unicode order. Don't assume −1 / 1.",
          },
        ],
      },
    ],
  },
  {
    id: "u2",
    number: 2,
    title: "Selection and Iteration",
    weight: "25–35%",
    accent: "from-emerald-400 via-teal-500 to-cyan-500",
    blurb:
      "if/else logic, while, for, nested loops, short-circuit evaluation, and tracing.",
    topics: [
      {
        id: "2-1",
        number: "2.1",
        title: "if / else / else-if",
        blurb: "Branch on Boolean expressions.",
        slides: [
          {
            title: "Structure",
            body: "An if-else chain executes EXACTLY ONE branch. Once a condition is true, the rest are skipped.",
            code: `if (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else grade = "F";`,
          },
          {
            title: "Order matters",
            body: "If you write 'if (score >= 70) ... else if (score >= 90) ...' the second branch is unreachable — anyone with score 90+ already matched the first.",
            callout: {
              kind: "trap",
              text: "Order conditions from most specific (highest threshold) to least. Reversing is a dead-code trap.",
            },
          },
        ],
      },
      {
        id: "2-5",
        number: "2.5",
        title: "Compound Booleans & Short-Circuit",
        blurb: "&& and || stop evaluating once the answer is known.",
        slides: [
          {
            title: "Short-circuit &&",
            body: "In a && b, if a is false, b is NEVER evaluated. This is how you guard against null or out-of-bounds: if (arr != null && arr.length > 0).",
            code: `// safe: short-circuit prevents NullPointerException
if (s != null && s.length() > 0) { ... }`,
          },
          {
            title: "Short-circuit ||",
            body: "In a || b, if a is true, b is NEVER evaluated.",
            callout: {
              kind: "key",
              text: "Side effects in the second operand may NEVER happen. AP loves this trap.",
            },
          },
          {
            title: "De Morgan's Laws",
            body: "!(a && b) = !a || !b.   !(a || b) = !a && !b.   Swap operator AND negate each operand.",
          },
        ],
      },
      {
        id: "2-7",
        number: "2.7",
        title: "while Loops",
        blurb: "Loop while a condition is true.",
        slides: [
          {
            title: "Anatomy",
            body: "Initialize → check condition → run body → update → check again. If condition starts false, body never runs.",
            code: `int i = 0;
while (i < 5) {
  System.out.println(i);
  i++;
}`,
          },
          {
            title: "Infinite loop trap",
            body: "Forgetting to update the loop variable causes an infinite loop. The AP exam will not show 'infinite loop' as a choice — it'll show wrong output instead.",
          },
        ],
      },
      {
        id: "2-8",
        number: "2.8",
        title: "for Loops",
        blurb: "Compact syntax: init; condition; update.",
        slides: [
          {
            title: "for vs while",
            body: "Any for loop can be rewritten as a while loop. Use for when you know HOW MANY times to iterate.",
            code: `for (int i = 0; i < n; i++) { ... }
// equivalent to:
int i = 0;
while (i < n) { ...; i++; }`,
          },
          {
            title: "Off-by-one",
            body: "i < n loops n times (0..n-1). i <= n loops n+1 times. Read the condition carefully.",
            callout: {
              kind: "trap",
              text: "AP distractors deliberately swap < and <=. Trace one iteration to be sure.",
            },
          },
        ],
      },
      {
        id: "2-9",
        number: "2.9",
        title: "Nested Loops",
        blurb: "Inner loop runs fully for each outer iteration.",
        slides: [
          {
            title: "Total iterations",
            body: "If outer runs M times and inner runs N times, body runs M × N times.",
            code: `for (int i = 0; i < 3; i++)
  for (int j = 0; j < 4; j++)
    System.out.print(i + "," + j + " ");
// 12 prints total`,
          },
          {
            title: "Inner loop dependent on outer",
            body: "When inner bound depends on i (e.g. j < i), total iterations = 0 + 1 + ... + (n−1) = n(n−1)/2.",
          },
        ],
      },
      {
        id: "2-12",
        number: "2.12",
        title: "Run-Time Analysis",
        blurb: "Count operations informally.",
        slides: [
          {
            title: "Counting",
            body: "AP CSA only asks for INFORMAL run-time: how does the work scale as input grows? Linear (1 loop), quadratic (nested), constant (no loop over input).",
          },
        ],
      },
    ],
  },
  {
    id: "u3",
    number: 3,
    title: "Class Creation",
    weight: "10–18%",
    accent: "from-fuchsia-400 via-pink-500 to-rose-500",
    blurb:
      "Build your own classes: instance variables, constructors, methods, scope.",
    topics: [
      {
        id: "3-3",
        number: "3.3",
        title: "Anatomy of a Class",
        blurb: "Instance variables (private), methods (public).",
        slides: [
          {
            title: "Encapsulation",
            body: "Make instance variables private. Provide public getter/setter methods so callers cannot break invariants.",
            code: `public class Student {
  private String name;
  private int grade;
  public String getName() { return name; }
  public void setGrade(int g) { grade = g; }
}`,
          },
          {
            title: "private vs public",
            body: "private = only this class can touch it. public = anyone. AP only tests these two access modifiers.",
          },
        ],
      },
      {
        id: "3-4",
        number: "3.4",
        title: "Constructors",
        blurb: "Initialize objects when they're created.",
        slides: [
          {
            title: "Constructor rules",
            body: "Same name as class. NO return type (not even void). Can be overloaded with different parameter lists.",
            code: `public Student(String n, int g) {
  name = n;
  grade = g;
}`,
          },
          {
            title: "Default constructor",
            body: "If you write NO constructor, Java gives you a free no-arg one that does nothing. If you write ANY constructor, that free one disappears.",
            callout: {
              kind: "trap",
              text: "Writing one constructor with parameters and then calling 'new MyClass()' = compile error.",
            },
          },
          {
            title: "this keyword",
            body: "this refers to the current object. Use this.name = name; when parameter shadows the instance variable.",
          },
        ],
      },
      {
        id: "3-5",
        number: "3.5",
        title: "Writing Methods",
        blurb: "Headers, parameters, return values.",
        slides: [
          {
            title: "Header anatomy",
            body: "[access] [static] returnType name(paramType paramName, ...) — order: visibility, static-ness, return type, name, params.",
            code: `public double getAverage(int total, int count) {
  return (double) total / count;
}`,
          },
          {
            title: "void methods",
            body: "Use void when nothing is returned. You can use 'return;' alone to exit early.",
          },
        ],
      },
      {
        id: "3-6",
        number: "3.6",
        title: "Pass-by-Value",
        blurb: "Java passes references and primitives BY VALUE.",
        slides: [
          {
            title: "Primitives",
            body: "When you pass an int, the method gets a COPY. Changing it inside has no effect outside.",
          },
          {
            title: "Object references",
            body: "When you pass an object, you pass a copy of the REFERENCE. The method can mutate the object's state, but cannot reassign the caller's variable to a different object.",
            callout: {
              kind: "key",
              text: "list.add(x) inside a method = visible outside. list = new ArrayList<>() inside = NOT visible outside.",
            },
          },
        ],
      },
      {
        id: "3-8",
        number: "3.8",
        title: "Scope & Access",
        blurb: "Where a variable is visible.",
        slides: [
          {
            title: "Block scope",
            body: "A variable declared inside { } only exists inside that block. Including loop counters in 'for (int i = ...)'.",
          },
          {
            title: "Static vs instance",
            body: "Static variables belong to the class — one copy shared by all objects. Instance variables — one copy per object.",
          },
        ],
      },
    ],
  },
  {
    id: "u4",
    number: 4,
    title: "Data Collections",
    weight: "30–40%",
    accent: "from-amber-400 via-orange-500 to-red-500",
    blurb:
      "Arrays, ArrayLists, 2D arrays, search, sort, recursion — the biggest unit on the exam.",
    topics: [
      {
        id: "4-3",
        number: "4.3",
        title: "Array Basics",
        blurb: "Fixed-size, zero-indexed.",
        slides: [
          {
            title: "Declaring & creating",
            body: "Two steps: declare a reference, then allocate. New arrays are filled with default values (0, 0.0, false, null).",
            code: `int[] nums = new int[5];      // {0,0,0,0,0}
int[] vals = {3, 1, 4, 1, 5}; // initializer list
nums.length;  // 5 — note: NO parentheses`,
          },
          {
            title: "Length is a field, not a method",
            body: "Arrays use .length (no parens). Strings use .length(). Mixing them up is the most common syntax slip.",
            callout: {
              kind: "trap",
              text: "arr.length() = compile error. str.length = compile error.",
            },
          },
        ],
      },
      {
        id: "4-4",
        number: "4.4",
        title: "Array Traversals",
        blurb: "for, for-each, when to use each.",
        slides: [
          {
            title: "Standard for",
            body: "Use when you need the index, OR when you want to MODIFY array elements.",
            code: `for (int i = 0; i < arr.length; i++) {
  arr[i] *= 2;  // can modify
}`,
          },
          {
            title: "for-each (enhanced for)",
            body: "Use to READ elements. The loop variable is a COPY for primitives — assigning to it does NOT change the array.",
            code: `for (int n : arr) {
  n *= 2;  // does NOT modify arr!
}`,
            callout: {
              kind: "trap",
              text: "If you need to write to the array, you cannot use a for-each loop.",
            },
          },
          {
            title: "ArrayIndexOutOfBoundsException",
            body: "Accessing arr[-1] or arr[arr.length] throws at run-time. Loops bounded by < arr.length are safe.",
          },
        ],
      },
      {
        id: "4-8",
        number: "4.8",
        title: "ArrayList",
        blurb: "Resizable list. Generic <Type>.",
        slides: [
          {
            title: "Declaration",
            body: "Always parameterize: ArrayList<String> names = new ArrayList<>(); — primitives are NOT allowed; use wrappers (Integer, Double, Boolean).",
            code: `ArrayList<Integer> nums = new ArrayList<>();
nums.add(7);       // appends
nums.add(0, 3);    // insert at index
nums.get(0);       // 3
nums.set(0, 99);   // replace
nums.remove(0);    // remove by index, returns removed
nums.size();       // size — note parens`,
          },
          {
            title: "Autoboxing",
            body: "Java automatically converts int ↔ Integer. So nums.add(7) compiles even though add() takes Integer.",
          },
        ],
      },
      {
        id: "4-9",
        number: "4.9",
        title: "ArrayList Pitfalls",
        blurb: "Removing while iterating.",
        slides: [
          {
            title: "Index shift on remove",
            body: "When you remove element at index i, every element after slides down by 1. A naive for-loop SKIPS the next element.",
            code: `// WRONG — skips elements
for (int i = 0; i < list.size(); i++) {
  if (badMatch(list.get(i))) list.remove(i);
}
// FIX: iterate backwards or decrement i after remove`,
            callout: {
              kind: "trap",
              text: "AP free response loves this. Iterate backwards or use 'i--' after a remove.",
            },
          },
        ],
      },
      {
        id: "4-13",
        number: "4.13",
        title: "2D Arrays",
        blurb: "Rows and columns.",
        slides: [
          {
            title: "Row-major access",
            body: "arr[r][c] = row r, column c. arr.length = number of rows. arr[0].length = number of columns (assuming rectangular).",
            code: `int[][] grid = new int[3][4]; // 3 rows, 4 cols
for (int r = 0; r < grid.length; r++)
  for (int c = 0; c < grid[0].length; c++)
    grid[r][c] = r * 10 + c;`,
          },
          {
            title: "Row-major vs column-major traversal",
            body: "Outer loop on rows, inner on columns = row-major (default). Swap them for column-major.",
          },
        ],
      },
      {
        id: "4-14",
        number: "4.14",
        title: "Searching",
        blurb: "Linear and binary.",
        slides: [
          {
            title: "Linear search",
            body: "Walk through one by one. Works on ANY array. O(n).",
          },
          {
            title: "Binary search",
            body: "Requires SORTED array. Repeatedly halve the search range. O(log n).",
            callout: {
              kind: "trap",
              text: "Binary search on an unsorted array gives undefined results — not a runtime error.",
            },
          },
        ],
      },
      {
        id: "4-15",
        number: "4.15",
        title: "Sorting",
        blurb: "Selection, insertion, merge.",
        slides: [
          {
            title: "Selection sort",
            body: "Find the smallest, swap to front. Then find the next smallest from the rest, etc. O(n²). After pass k, the first k elements are SORTED and FINAL.",
          },
          {
            title: "Insertion sort",
            body: "Take the next element, slide it backward into its sorted place. O(n²) worst, O(n) best (already sorted). After pass k, the first k+1 elements are sorted RELATIVE TO EACH OTHER but may not be final.",
          },
          {
            title: "Merge sort",
            body: "Recursively split in half, sort each half, merge. O(n log n). Always faster than the two above on large input.",
          },
        ],
      },
      {
        id: "4-16",
        number: "4.16",
        title: "Recursion",
        blurb: "A method that calls itself.",
        slides: [
          {
            title: "Two parts",
            body: "Every recursive method needs (1) a base case that returns without recursing, and (2) a recursive case that moves toward the base case.",
            code: `public static int fact(int n) {
  if (n <= 1) return 1;        // base
  return n * fact(n - 1);      // recursive
}`,
          },
          {
            title: "Stack overflow",
            body: "Forgetting or never reaching the base case = StackOverflowError at run-time.",
            callout: {
              kind: "key",
              text: "On the AP exam, trace recursion by drawing the call stack — write each call's parameters in a column.",
            },
          },
        ],
      },
    ],
  },
];

export const ALL_TOPICS = UNITS.flatMap((u) =>
  u.topics.map((t) => ({ ...t, unit: u }))
);
