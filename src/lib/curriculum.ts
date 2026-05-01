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
          {
            title: "Naming rules",
            body: "Variable names start with a letter, $ or _. Convention: camelCase for variables/methods, PascalCase for class names, ALL_CAPS for constants. Java is case-sensitive — 'count' and 'Count' are different.",
          },
          {
            title: "Type compatibility",
            body: "An int can be assigned to a double automatically (widening). A double assigned to an int requires an explicit cast (narrowing).",
            code: `double d = 5;        // ok — int widens to double
int n = 3.7;         // ERROR — needs cast
int n = (int) 3.7;   // ok — but n = 3 (truncated)`,
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
17 % -5  // 2
0 % 5    // 0
5 % 17   // 5  (smaller % larger is itself)`,
          },
          {
            title: "Operator precedence",
            body: "*, /, % bind tighter than + and −. Comparisons (<, >, <=, >=, ==, !=) are below arithmetic. Logical && is below ||. Use parentheses when in doubt — the AP graders never ding you for them.",
          },
          {
            title: "Common modulus uses",
            body: "x % 2 == 0 tests even. x % 10 gives the last digit of x. x / 10 drops the last digit. These two together are how you process digits one at a time.",
            code: `// Sum digits of n
int sum = 0;
while (n > 0) {
  sum += n % 10;  // last digit
  n = n / 10;     // drop it
}`,
          },
          {
            title: "println vs print",
            body: "System.out.println adds a newline; System.out.print does not. String concatenation with + auto-converts other types to String.",
          },
          {
            title: "Concatenation order matters",
            body: "When + sees a String, it concatenates left-to-right. 'X' + 1 + 2 = 'X12', but 1 + 2 + 'X' = '3X'.",
            callout: {
              kind: "trap",
              text: "Mixed numeric + String expressions evaluate left-to-right. AP loves to test this with 'sum = ' + a + b.",
            },
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
            body: "int holds about ±2.1 billion (-2,147,483,648 to 2,147,483,647). Adding past Integer.MAX_VALUE silently wraps to a large negative — Java does NOT throw.",
          },
          {
            title: "Implicit conversions",
            body: "When a binary operator mixes int and double, the int is automatically promoted to double, then the operation runs in double.",
            code: `int i = 5;
double d = 2.0;
i + d;   // promotes i → 5.0, result 7.0 (double)
i / d;   // 5.0 / 2.0 = 2.5
i / 2;   // 5 / 2 = 2 (both int → integer division)`,
          },
        ],
      },
      {
        id: "1-6",
        number: "1.6",
        title: "Compound Assignment",
        blurb: "+=, -=, *=, /=, %=, ++, --.",
        slides: [
          {
            title: "Shorthand operators",
            body: "x += 5 is shorthand for x = x + 5. The same pattern works for -=, *=, /=, %=.",
            code: `int x = 10;
x += 3;   // x = 13
x -= 1;   // x = 12
x *= 2;   // x = 24
x /= 5;   // x = 4 (integer division!)
x %= 3;   // x = 1`,
          },
          {
            title: "Increment / decrement",
            body: "x++ increases x by 1. x-- decreases by 1. The standalone form is common in for-loop updates.",
            callout: {
              kind: "tip",
              text: "AP Java uses x++ as a statement. The exam doesn't expect you to know the difference between ++x and x++ in expressions, but knowing both forms exist helps with reading code.",
            },
          },
          {
            title: "Compound assignment with division",
            body: "x /= y still does integer division if both are int. The shorthand doesn't promote the type.",
          },
        ],
      },
      {
        id: "1-9",
        number: "1.9",
        title: "Method Signatures",
        blurb: "Header anatomy: visibility, return, name, parameters.",
        slides: [
          {
            title: "Anatomy of a header",
            body: "[access] [static] returnType methodName(paramType paramName, ...) { body }",
            code: `public static int max(int a, int b) {
  if (a > b) return a;
  return b;
}`,
          },
          {
            title: "Overloading",
            body: "Two methods can share a name if their parameter LISTS differ (different types, different counts). Return type alone does NOT count.",
            code: `int add(int a, int b)        // legal pair
double add(double a, double b)
int add(int a, int b, int c)
// double add(int a, int b)  ← would conflict with first`,
            callout: {
              kind: "trap",
              text: "Differing only by return type is a compile error. AP tests this.",
            },
          },
          {
            title: "Reading a signature",
            body: "When the AP gives you a method header, ask: (1) what does it return? (2) what does it take? (3) is it static or instance? (4) what visibility?",
          },
        ],
      },
      {
        id: "1-10",
        number: "1.10",
        title: "Calling Class (Static) Methods",
        blurb: "ClassName.method(...) — no object needed.",
        slides: [
          {
            title: "Static methods belong to the class",
            body: "You call them via the class name, not an instance. They cannot use instance variables — they don't have access to a 'this'.",
            code: `int big = Math.max(3, 7);   // 7
double r = Math.sqrt(25);   // 5.0
int n = Integer.parseInt("42"); // 42`,
          },
          {
            title: "When to call statically",
            body: "Use a static method when the operation doesn't depend on any object's state — utility computations, parsing, helpers. Math is the most-tested example.",
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
            code: `int sq = (int) Math.pow(3, 2);  // 9
double h = Math.sqrt(a*a + b*b);
int absVal = Math.abs(-7);  // 7`,
          },
          {
            title: "Common pitfall: Math.pow precision",
            body: "Math.pow returns a double. (int) Math.pow(10, 3) is usually 1000, but for some larger values floating-point error can give 999. For small powers, prefer multiplying.",
          },
        ],
      },
      {
        id: "1-12",
        number: "1.12",
        title: "Objects & References",
        blurb: "new creates an object. Variables hold references.",
        slides: [
          {
            title: "Reference vs object",
            body: "An object is a chunk of memory with state. A reference is the address that points at it. When you write 'String s = new String(\"hi\")', s is a reference, not the String itself.",
          },
          {
            title: "null",
            body: "null means 'no object'. Calling any method on a null reference throws NullPointerException at run-time.",
            code: `String s = null;
s.length();  // NullPointerException`,
          },
          {
            title: "Aliasing",
            body: "Two references can point at the same object. Mutating the object through one is visible through the other.",
            code: `int[] a = {1, 2, 3};
int[] b = a;       // alias!
b[0] = 99;
System.out.println(a[0]);  // 99`,
            callout: {
              kind: "key",
              text: "Aliasing is heavily tested. Drawing arrows on scratch paper helps you trace correctly.",
            },
          },
        ],
      },
      {
        id: "1-14",
        number: "1.14",
        title: "Calling Instance Methods",
        blurb: "object.method(args) — uses the object's state.",
        slides: [
          {
            title: "Dot notation",
            body: "Instance methods are called on an object: 'name.length()' calls length on the object that 'name' refers to.",
            code: `String name = "Anu";
int n = name.length();        // 3
String up = name.toUpperCase(); // "ANU"`,
          },
          {
            title: "The receiver",
            body: "Inside an instance method, 'this' refers to the object the method was called on. You can omit 'this' for instance variables in most cases.",
          },
          {
            title: "Null receiver = NullPointerException",
            body: "If the variable on the left of the dot is null, calling any method throws at run-time — not compile time.",
            callout: {
              kind: "trap",
              text: "AP often shows code that looks fine but the receiver is uninitialized or nullified earlier in the method.",
            },
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
            title: "length()",
            body: "Strings use length() — with parens. Arrays use .length without parens. Mixing them up is a compile error.",
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
            title: "indexOf",
            body: "s.indexOf(t) returns the index of the first occurrence of t in s, or -1 if not found. Common idiom: if (s.indexOf(t) >= 0) ...",
          },
          {
            title: ".equals vs ==",
            body: "== compares references. .equals() compares character contents. ALWAYS use .equals for Strings.",
          },
          {
            title: "compareTo",
            body: "a.compareTo(b) returns 0 if equal, negative if a < b, positive if a > b — based on Unicode order. Don't assume −1 / 1.",
            code: `"apple".compareTo("apple") // 0
"apple".compareTo("banana") // negative
"banana".compareTo("apple") // positive`,
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
          {
            title: "if vs separate ifs",
            body: "Two separate ifs both run their checks. An if-else chain stops at the first true. The behavior differs when MULTIPLE conditions are true.",
            code: `// chain — runs at most ONE branch
if (x > 0) ...; else if (x > 10) ...;
// independent — both can run
if (x > 0) ...;
if (x > 10) ...;`,
          },
        ],
      },
      {
        id: "2-4",
        number: "2.4",
        title: "Nested if Statements",
        blurb: "An if inside another if.",
        slides: [
          {
            title: "Basic pattern",
            body: "When you need to check a second condition only if the first is true, nest the second inside.",
            code: `if (loggedIn) {
  if (admin) {
    showAdminPanel();
  } else {
    showUserPanel();
  }
}`,
          },
          {
            title: "Equivalent compound condition",
            body: "Nested ifs can often be flattened with &&. Pick whichever reads more clearly. AP exam code uses both.",
          },
          {
            title: "Dangling else",
            body: "An else binds to the NEAREST unmatched if. Use { } to be explicit, especially in nested code.",
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
          {
            title: "Negating comparisons",
            body: "!(x > 5) = (x <= 5). Negating > gives <=, not <. Always include the equality boundary.",
            code: `!(x > 5)  ==  x <= 5
!(x >= 5) ==  x < 5
!(x == 5) ==  x != 5`,
          },
        ],
      },
      {
        id: "2-6",
        number: "2.6",
        title: "Comparing Boolean Expressions",
        blurb: "Boolean equality, truth tables.",
        slides: [
          {
            title: "Equivalent expressions",
            body: "Two boolean expressions are equivalent if they produce the same value for every input. Truth tables prove this.",
          },
          {
            title: "Common simplifications",
            body: "(a && true) = a. (a && false) = false. (a || true) = true. (a || false) = a.",
          },
          {
            title: "Don't compare booleans to true",
            body: "Write 'if (done)' not 'if (done == true)'. Both compile, but the first is what graders expect.",
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
            body: "Forgetting to update the loop variable causes an infinite loop. The AP exam will not show 'infinite loop' as a choice unless that's actually correct — it usually shows wrong output instead.",
          },
          {
            title: "Sentinel-controlled loops",
            body: "When you don't know the count up front, use a while loop with a flag or a 'sentinel' value to terminate.",
            code: `int total = 0;
int n = readNext();
while (n != -1) {   // -1 is sentinel
  total += n;
  n = readNext();
}`,
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
          {
            title: "Counting iterations with a step",
            body: "for (int i = a; i <= b; i += k): the body runs floor((b − a) / k) + 1 times. When in doubt, list the values.",
          },
          {
            title: "Decreasing for loops",
            body: "for (int i = n - 1; i >= 0; i--) walks an array backwards. Useful when you need to remove elements without skipping.",
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
            code: `for (int i = 0; i < n; i++)
  for (int j = 0; j < i; j++)
    // runs 0+1+2+...+(n-1) times`,
          },
          {
            title: "Triangular pattern",
            body: "When you see a triangular print pattern (1, 12, 123…), the inner bound is tied to the outer index.",
          },
        ],
      },
      {
        id: "2-10",
        number: "2.10",
        title: "String Algorithms",
        blurb: "Loop through every character of a String.",
        slides: [
          {
            title: "Iterating characters",
            body: "Use .length() and .substring(i, i+1) to get character at index i. (charAt is not on the AP exam, but it's commonly used in classroom code.)",
            code: `String s = "Anu";
for (int i = 0; i < s.length(); i++) {
  String ch = s.substring(i, i + 1);
  // do something with ch
}`,
          },
          {
            title: "Counting occurrences",
            body: "Iterate, compare each character to the target with .equals(), increment a counter on match.",
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
          {
            title: "Common patterns",
            body: "One loop over n elements: n operations. Two nested loops both over n: n² operations. Loop that halves each step: log n operations.",
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
          {
            title: "Class file structure",
            body: "Order inside a class: instance variables → constructors → methods. Not enforced by Java, but it's the convention every grader expects.",
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
            body: "'this' refers to the current object. Use 'this.name = name;' when a parameter shadows the instance variable.",
            code: `public Student(String name, int grade) {
  this.name = name;     // disambiguate
  this.grade = grade;
}`,
          },
          {
            title: "Constructor chaining",
            body: "A constructor can call another constructor of the same class with this(...). Useful for default values.",
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
          {
            title: "Return paths",
            body: "Every path in a non-void method must return a value. Otherwise: compile error.",
            code: `public int abs(int n) {
  if (n >= 0) return n;
  // missing return — compile error
}`,
          },
          {
            title: "Local variables",
            body: "Variables declared inside a method live only inside that method. They go away when the method returns.",
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
          {
            title: "String 'feels' like a primitive",
            body: "Strings are objects, but immutable — you can never mutate one. So passing a String to a method and 'changing' it inside has no observable effect outside, just like a primitive.",
          },
          {
            title: "Returning a new object",
            body: "If a method needs to give back a 'modified' immutable thing (like a String), it returns a new one. The caller assigns the result.",
          },
        ],
      },
      {
        id: "3-7",
        number: "3.7",
        title: "Static (Class) Variables and Methods",
        blurb: "One copy shared by all instances.",
        slides: [
          {
            title: "Static fields",
            body: "Declared with the 'static' keyword. There's exactly ONE copy, owned by the class — every instance shares it.",
            code: `public class Counter {
  private static int total = 0;
  public Counter() { total++; }
  public static int getTotal() { return total; }
}`,
          },
          {
            title: "Static methods",
            body: "A static method has no 'this' — it cannot access instance variables. It can only use parameters, local variables, and other static members.",
          },
          {
            title: "When to use static",
            body: "Use static for utility helpers (like Math.abs) or counters that belong to the class as a whole, not to one instance.",
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
          {
            title: "Shadowing",
            body: "If a parameter has the same name as an instance variable, it shadows the field inside the method. Use 'this.field' to access the instance variable explicitly.",
          },
          {
            title: "Scope and method calls",
            body: "Local variables in a method are NOT visible to other methods. Pass them as arguments if other methods need to see them.",
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
          {
            title: "Default values for object arrays",
            body: "An array of objects (e.g., String[]) is filled with null until you assign each element. Trying to call a method through a null entry throws.",
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
          {
            title: "Tracking position with for-each",
            body: "If you need both the index and value, use a standard for. for-each gives you only the value.",
          },
        ],
      },
      {
        id: "4-5",
        number: "4.5",
        title: "Array Algorithms",
        blurb: "Sum, max, count, reverse, shift.",
        slides: [
          {
            title: "Sum",
            body: "Initialize a running total to 0. Walk the array. Add each element.",
            code: `int sum = 0;
for (int n : arr) sum += n;`,
          },
          {
            title: "Max",
            body: "Start max at arr[0] (or Integer.MIN_VALUE). Walk the array. Update if you see something larger.",
            callout: {
              kind: "trap",
              text: "Initializing max to 0 fails if all values are negative. Use arr[0].",
            },
          },
          {
            title: "Count matches",
            body: "Walk the array. Increment a counter when the element satisfies your condition.",
          },
          {
            title: "Shift left by one",
            body: "Loop i from 0 to length-2: arr[i] = arr[i+1]. The last slot is left unchanged or set to a default.",
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
          {
            title: "ArrayList vs array",
            body: "Use ArrayList when you don't know the size up front, or when you'll be inserting/removing. Use an array when the size is fixed and known.",
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
          {
            title: "Backwards iteration is the safest fix",
            body: "Walking from size()-1 down to 0 means a remove only affects indices you've already visited.",
            code: `for (int i = list.size() - 1; i >= 0; i--) {
  if (bad(list.get(i))) list.remove(i);
}`,
          },
        ],
      },
      {
        id: "4-10",
        number: "4.10",
        title: "ArrayList Algorithms",
        blurb: "Search, count, max, accumulate.",
        slides: [
          {
            title: "Index-based search",
            body: "Walk by index. Return the index when you find a match. Return -1 if you finish without finding.",
            code: `public static int find(ArrayList<String> list, String t) {
  for (int i = 0; i < list.size(); i++) {
    if (list.get(i).equals(t)) return i;
  }
  return -1;
}`,
          },
          {
            title: "Building a new filtered list",
            body: "Iterate the source, add matching elements to a new ArrayList you return. Doesn't modify the source — safer than removing in place.",
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
          {
            title: "Initializer list",
            body: "You can declare and fill at once with nested braces. Each inner list is a row.",
            code: `int[][] m = {
  {1, 2, 3},
  {4, 5, 6}
};
m.length      // 2 rows
m[0].length   // 3 cols`,
          },
          {
            title: "Searching a 2D array",
            body: "Two nested loops — one over rows, one over columns. Return early when you find what you're looking for.",
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
          {
            title: "Iterative binary search",
            body: "Track lo and hi. mid = (lo + hi) / 2. Compare arr[mid] to target — narrow the range or return mid.",
            code: `int lo = 0, hi = arr.length - 1;
while (lo <= hi) {
  int mid = (lo + hi) / 2;
  if (arr[mid] == t) return mid;
  if (arr[mid] < t) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`,
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
          {
            title: "Picking a sort on the AP",
            body: "Multiple-choice questions often ask 'after pass k, what's the array?'. Selection: first k positions are FINAL. Insertion: first k+1 are sorted relative but may shift.",
            callout: {
              kind: "key",
              text: "Memorize what each sort 'looks like' after one pass. The AP tests this exact thing.",
            },
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
          {
            title: "Multiple base cases",
            body: "Some recursions need more than one base case (e.g., Fibonacci uses fib(0) = 0 and fib(1) = 1). Make sure all small inputs are handled before any recursive call.",
          },
          {
            title: "Tracing recursion",
            body: "Write each call on its own line, indent for depth. When a call returns, copy its return value back into the line above. Do this on scratch paper for every recursion question.",
          },
        ],
      },
      {
        id: "4-17",
        number: "4.17",
        title: "Recursive Search & Sort",
        blurb: "Recursive binary search and merge sort.",
        slides: [
          {
            title: "Recursive binary search",
            body: "Pass lo and hi. Base case: lo > hi → return -1. Otherwise compare arr[mid] and recurse on one half.",
          },
          {
            title: "Merge sort recursion",
            body: "Recursively sort left half, recursively sort right half, then merge. Base case: a sub-array of length ≤ 1 is already sorted.",
          },
        ],
      },
    ],
  },
];

export const ALL_TOPICS = UNITS.flatMap((u) =>
  u.topics.map((t) => ({ ...t, unit: u }))
);
