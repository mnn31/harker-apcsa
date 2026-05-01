// AP CSA Free Response Questions — written in the style of past papers.
// Each FRQ has 1–3 parts, a method signature to implement, sample I/O,
// a model solution, and a rubric breakdown.

export type FRQPart = {
  letter: "a" | "b" | "c" | "d";
  prompt: string;
  signature?: string;
  example?: string;
  solution: string;
  rubric: string[];
};

export type FRQ = {
  id: string;
  type: "methods" | "class" | "array" | "array2d";
  unitId: string;
  title: string;
  context: string;
  setup?: string; // class declaration / array shown to student
  parts: FRQPart[];
  totalPoints: number;
};

export const FRQS: FRQ[] = [
  // ---------------- 1. Methods & Control ----------------
  {
    id: "frq-001",
    type: "methods",
    unitId: "u2",
    title: "Digit Sum and Pattern",
    context:
      "A whole number's digit sum is the result of adding all of its digits together. For example, the digit sum of 1729 is 1 + 7 + 2 + 9 = 19. You will write helper methods that work with the digits of a positive integer.",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method digitSum(int n) that returns the sum of the digits of n. You may assume n is non-negative.",
        signature: "public static int digitSum(int n)",
        example: "digitSum(1729) → 19   ·   digitSum(0) → 0   ·   digitSum(50) → 5",
        solution: `public static int digitSum(int n) {
  int sum = 0;
  while (n > 0) {
    sum += n % 10;
    n = n / 10;
  }
  return sum;
}`,
        rubric: [
          "+1 Initializes accumulator to 0",
          "+1 Loops while n > 0 (handles n == 0 correctly)",
          "+1 Adds n % 10 each pass to extract last digit",
          "+1 Updates n with integer division by 10",
          "+1 Returns the accumulated sum",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a method isHarshad(int n) that returns true if n is divisible by its digit sum. Use digitSum from part (a). Assume n > 0.",
        signature: "public static boolean isHarshad(int n)",
        example: "isHarshad(18) → true (digit sum 9, 18 % 9 == 0)   ·   isHarshad(20) → false",
        solution: `public static boolean isHarshad(int n) {
  return n % digitSum(n) == 0;
}`,
        rubric: [
          "+1 Calls digitSum(n) (no re-implementing required)",
          "+1 Tests divisibility correctly with %",
          "+1 Returns a boolean directly (no if-else needed)",
        ],
      },
    ],
    totalPoints: 8,
  },

  // ---------------- 2. Class Design ----------------
  {
    id: "frq-002",
    type: "class",
    unitId: "u3",
    title: "The Locker class",
    context:
      "Harker's locker assignments are tracked by a Locker class. Each locker has a number, an owner name (initially null), and a state — either open or closed. Implement the class.",
    setup: `public class Locker {
  // private fields here
  // constructor and methods here
}`,
    parts: [
      {
        letter: "a",
        prompt:
          "Declare appropriate private instance variables. Then write a constructor Locker(int number) that creates a closed, unowned locker with the given number.",
        signature: "public Locker(int number)",
        solution: `private int number;
private String owner;
private boolean isOpen;

public Locker(int number) {
  this.number = number;
  this.owner = null;
  this.isOpen = false;
}`,
        rubric: [
          "+1 Three private instance variables of correct types",
          "+1 Constructor uses parameter to initialize number (uses this.number to disambiguate)",
          "+1 owner initialized to null and isOpen initialized to false",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a method assignTo(String name) that sets the locker's owner. Return true if the locker had no previous owner, false otherwise.",
        signature: "public boolean assignTo(String name)",
        example: "If the locker is unowned, assignTo(\"Anu\") sets the owner to \"Anu\" and returns true. A second call assignTo(\"Bob\") returns false but leaves the owner unchanged.",
        solution: `public boolean assignTo(String name) {
  if (owner != null) return false;
  owner = name;
  return true;
}`,
        rubric: [
          "+1 Checks if owner is currently null",
          "+1 Returns false WITHOUT modifying state when already owned",
          "+1 Sets owner and returns true on the unowned path",
        ],
      },
      {
        letter: "c",
        prompt:
          "Write a method toggle() that flips the isOpen field — open lockers close, closed lockers open. Return the new state.",
        signature: "public boolean toggle()",
        solution: `public boolean toggle() {
  isOpen = !isOpen;
  return isOpen;
}`,
        rubric: [
          "+1 Flips the boolean correctly",
          "+1 Returns the post-toggle value",
        ],
      },
    ],
    totalPoints: 11,
  },

  // ---------------- 3. Array ----------------
  {
    id: "frq-003",
    type: "array",
    unitId: "u4",
    title: "Quiz Score Statistics",
    context:
      "An int array scores holds quiz scores for a single class. Each entry is in the range 0..100 inclusive. You'll write methods that summarize the data.",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method countAbove(int[] scores, int cutoff) that returns the number of scores STRICTLY above the cutoff.",
        signature: "public static int countAbove(int[] scores, int cutoff)",
        example: "countAbove({72, 90, 85, 60}, 80) → 2",
        solution: `public static int countAbove(int[] scores, int cutoff) {
  int count = 0;
  for (int s : scores) {
    if (s > cutoff) count++;
  }
  return count;
}`,
        rubric: [
          "+1 Iterates over all elements of scores",
          "+1 Uses > (strict, not >=)",
          "+1 Increments and returns counter",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a method classAverage(int[] scores) that returns the average as a double. If scores is empty, return 0.0.",
        signature: "public static double classAverage(int[] scores)",
        example: "classAverage({80, 90, 100}) → 90.0   ·   classAverage({}) → 0.0",
        solution: `public static double classAverage(int[] scores) {
  if (scores.length == 0) return 0.0;
  int sum = 0;
  for (int s : scores) sum += s;
  return (double) sum / scores.length;
}`,
        rubric: [
          "+1 Handles empty-array edge case correctly",
          "+1 Sums all elements",
          "+1 Promotes to double BEFORE division to avoid integer division",
          "+1 Returns the result as a double",
        ],
      },
      {
        letter: "c",
        prompt:
          "Write a method curveBy(int[] scores, int delta) that returns a NEW array where each element is its original score + delta, clamped to the [0, 100] range.",
        signature: "public static int[] curveBy(int[] scores, int delta)",
        example: "curveBy({90, 50, 30}, 15) → {100, 65, 45} (90+15 clamps to 100)",
        solution: `public static int[] curveBy(int[] scores, int delta) {
  int[] out = new int[scores.length];
  for (int i = 0; i < scores.length; i++) {
    int v = scores[i] + delta;
    if (v < 0) v = 0;
    else if (v > 100) v = 100;
    out[i] = v;
  }
  return out;
}`,
        rubric: [
          "+1 Allocates a new array of correct length",
          "+1 Iterates by index (since we need to write into out)",
          "+1 Adds delta and clamps both bounds [0, 100]",
          "+1 Returns the new array (does NOT mutate input)",
        ],
      },
    ],
    totalPoints: 11,
  },

  // ---------------- 4. 2D Array ----------------
  {
    id: "frq-004",
    type: "array2d",
    unitId: "u4",
    title: "Seating Chart",
    context:
      "A teacher tracks attendance on a 2D char-style grid where each row is a row of seats and each cell is either \"X\" (occupied) or \".\" (empty). Represent the grid with a String[][].",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method countOccupied(String[][] grid) that returns the total number of \"X\" cells in the grid.",
        signature: "public static int countOccupied(String[][] grid)",
        example: "For grid {{X,.,X},{.,X,.}}, return 3.",
        solution: `public static int countOccupied(String[][] grid) {
  int count = 0;
  for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[r].length; c++) {
      if (grid[r][c].equals("X")) count++;
    }
  }
  return count;
}`,
        rubric: [
          "+1 Outer loop over rows using grid.length",
          "+1 Inner loop over columns using grid[r].length",
          "+1 Uses .equals to compare String contents",
          "+1 Returns running counter",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a method rowMostFull(String[][] grid) that returns the index of the row with the highest count of \"X\" cells. If multiple rows tie, return the lowest index. Assume at least one row exists.",
        signature: "public static int rowMostFull(String[][] grid)",
        solution: `public static int rowMostFull(String[][] grid) {
  int best = 0;
  int bestCount = countInRow(grid, 0);
  for (int r = 1; r < grid.length; r++) {
    int c = countInRow(grid, r);
    if (c > bestCount) {
      best = r;
      bestCount = c;
    }
  }
  return best;
}

private static int countInRow(String[][] g, int r) {
  int c = 0;
  for (int j = 0; j < g[r].length; j++) {
    if (g[r][j].equals("X")) c++;
  }
  return c;
}`,
        rubric: [
          "+1 Tracks both the best index and the best count",
          "+1 Uses strict > (not >=) so ties keep the lowest index",
          "+1 Iterates over rows correctly",
          "+1 Returns the index, not the count",
        ],
      },
    ],
    totalPoints: 8,
  },

  // ---------------- 5. Methods (recursion-flavored) ----------------
  {
    id: "frq-005",
    type: "methods",
    unitId: "u4",
    title: "Recursive String Helpers",
    context:
      "You'll write recursive methods that operate on Strings. Iterative solutions will receive zero credit.",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a recursive method countChar(String s, String ch) that returns the number of times ch (a single character String) appears in s.",
        signature: "public static int countChar(String s, String ch)",
        example: "countChar(\"banana\", \"a\") → 3",
        solution: `public static int countChar(String s, String ch) {
  if (s.length() == 0) return 0;
  int rest = countChar(s.substring(1), ch);
  if (s.substring(0, 1).equals(ch)) return rest + 1;
  return rest;
}`,
        rubric: [
          "+1 Base case for empty string",
          "+1 Recursive call on substring(1) (peel one off)",
          "+1 Compares first character with .equals",
          "+1 Combines result without using a loop",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a recursive method reverse(String s) that returns the reverse of s.",
        signature: "public static String reverse(String s)",
        example: "reverse(\"abc\") → \"cba\"",
        solution: `public static String reverse(String s) {
  if (s.length() <= 1) return s;
  return reverse(s.substring(1)) + s.substring(0, 1);
}`,
        rubric: [
          "+1 Base case for length <= 1",
          "+1 Recurses on a strictly smaller subproblem",
          "+1 Concatenates first character to the END of the recursive result",
        ],
      },
    ],
    totalPoints: 7,
  },

  // ---------------- 6. ArrayList ----------------
  {
    id: "frq-006",
    type: "array",
    unitId: "u4",
    title: "Removing Duplicates",
    context:
      "An ArrayList<Integer> holds a sequence of integers, possibly with consecutive duplicates. You'll write methods that clean up the list.",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method removeAdjacentDuplicates(ArrayList<Integer> list) that modifies list in place by removing any element that equals the element immediately before it. Process in a single pass.",
        signature: "public static void removeAdjacentDuplicates(ArrayList<Integer> list)",
        example: "[1, 1, 2, 3, 3, 3, 4] → [1, 2, 3, 4]",
        solution: `public static void removeAdjacentDuplicates(ArrayList<Integer> list) {
  for (int i = list.size() - 1; i >= 1; i--) {
    if (list.get(i).equals(list.get(i - 1))) {
      list.remove(i);
    }
  }
}`,
        rubric: [
          "+1 Iterates backwards (or otherwise handles index shift correctly)",
          "+1 Compares Integer values with .equals (NOT ==)",
          "+1 Removes the duplicate, not the original",
          "+1 Modifies list in place; void return type is correct",
        ],
      },
    ],
    totalPoints: 4,
  },

  // ---------------- 7. Class Design (rich) ----------------
  {
    id: "frq-007",
    type: "class",
    unitId: "u3",
    title: "BankAccount",
    context:
      "Harker's CS lab simulates banking with a BankAccount class. Each account has an owner name and a non-negative balance.",
    setup: `public class BankAccount {
  // your code here
}`,
    parts: [
      {
        letter: "a",
        prompt:
          "Declare private instance variables and write a constructor BankAccount(String owner) that opens an account with balance 0.",
        signature: "public BankAccount(String owner)",
        solution: `private String owner;
private double balance;

public BankAccount(String owner) {
  this.owner = owner;
  this.balance = 0.0;
}`,
        rubric: [
          "+1 Two private instance variables, sensible types (double for balance)",
          "+1 Constructor uses this.owner = owner pattern",
          "+1 Initializes balance to 0",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a method deposit(double amount) that adds amount to the balance only if amount > 0. Return whether the deposit was accepted.",
        signature: "public boolean deposit(double amount)",
        solution: `public boolean deposit(double amount) {
  if (amount <= 0) return false;
  balance += amount;
  return true;
}`,
        rubric: [
          "+1 Validates amount > 0 (or rejects amount <= 0)",
          "+1 Updates balance only on the accept path",
          "+1 Returns boolean reflecting acceptance",
        ],
      },
      {
        letter: "c",
        prompt:
          "Write a method withdraw(double amount) that removes amount only if it is positive AND <= balance. Return whether the withdrawal succeeded.",
        signature: "public boolean withdraw(double amount)",
        solution: `public boolean withdraw(double amount) {
  if (amount <= 0 || amount > balance) return false;
  balance -= amount;
  return true;
}`,
        rubric: [
          "+1 Rejects non-positive amounts",
          "+1 Rejects amounts greater than balance (no overdraft)",
          "+1 Decrements balance only on success path",
          "+1 Returns boolean reflecting outcome",
        ],
      },
    ],
    totalPoints: 10,
  },

  // ---------------- 8. Array (cumulative pattern) ----------------
  {
    id: "frq-008",
    type: "array",
    unitId: "u4",
    title: "Running Maximums",
    context:
      "Given an array of integers, the running maximum at index i is the largest value in arr[0..i] inclusive.",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method runningMax(int[] arr) that returns a new int array where the value at index i is the running maximum up to index i.",
        signature: "public static int[] runningMax(int[] arr)",
        example: "runningMax({3, 1, 4, 1, 5, 9, 2, 6}) → {3, 3, 4, 4, 5, 9, 9, 9}",
        solution: `public static int[] runningMax(int[] arr) {
  int[] out = new int[arr.length];
  if (arr.length == 0) return out;
  out[0] = arr[0];
  for (int i = 1; i < arr.length; i++) {
    out[i] = Math.max(out[i - 1], arr[i]);
  }
  return out;
}`,
        rubric: [
          "+1 Allocates new array of correct size",
          "+1 Handles empty array correctly",
          "+1 Sets out[0] = arr[0]",
          "+1 Uses out[i-1] (the prior running max) when computing out[i]",
          "+1 Returns the new array",
        ],
      },
    ],
    totalPoints: 5,
  },

  // ---------------- 9. 2D Array (transformation) ----------------
  {
    id: "frq-009",
    type: "array2d",
    unitId: "u4",
    title: "Image Threshold",
    context:
      "A grayscale image is stored as a 2D int array where each value is in [0, 255]. You will threshold the image to make every pixel either 0 (dark) or 255 (light).",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method threshold(int[][] img, int t) that MODIFIES img so that pixels with value >= t become 255 and pixels with value < t become 0.",
        signature: "public static void threshold(int[][] img, int t)",
        solution: `public static void threshold(int[][] img, int t) {
  for (int r = 0; r < img.length; r++) {
    for (int c = 0; c < img[r].length; c++) {
      if (img[r][c] >= t) img[r][c] = 255;
      else img[r][c] = 0;
    }
  }
}`,
        rubric: [
          "+1 Outer loop over rows",
          "+1 Inner loop over img[r].length (handles ragged arrays correctly)",
          "+1 Compares >= with t (correct boundary)",
          "+1 Modifies in place; void return is correct",
        ],
      },
    ],
    totalPoints: 4,
  },

  // ---------------- 10. Methods (combined) ----------------
  {
    id: "frq-010",
    type: "methods",
    unitId: "u2",
    title: "Prime Detection",
    context:
      "You will determine whether positive integers are prime. A prime number is a whole number > 1 with no positive divisors other than 1 and itself.",
    parts: [
      {
        letter: "a",
        prompt:
          "Write a method isPrime(int n) that returns true if n is prime, false otherwise.",
        signature: "public static boolean isPrime(int n)",
        example: "isPrime(7) → true · isPrime(9) → false · isPrime(1) → false",
        solution: `public static boolean isPrime(int n) {
  if (n < 2) return false;
  for (int d = 2; d * d <= n; d++) {
    if (n % d == 0) return false;
  }
  return true;
}`,
        rubric: [
          "+1 Special-cases n < 2",
          "+1 Loops divisors up to a reasonable bound (sqrt(n) or n/2)",
          "+1 Uses % to test divisibility",
          "+1 Returns false on first hit, true if no divisor found",
        ],
      },
      {
        letter: "b",
        prompt:
          "Write a method countPrimesBelow(int n) that returns the number of primes less than n. Use isPrime from part (a).",
        signature: "public static int countPrimesBelow(int n)",
        example: "countPrimesBelow(10) → 4 (2, 3, 5, 7)",
        solution: `public static int countPrimesBelow(int n) {
  int count = 0;
  for (int k = 2; k < n; k++) {
    if (isPrime(k)) count++;
  }
  return count;
}`,
        rubric: [
          "+1 Loops from 2 (or 1) up to but not including n",
          "+1 Reuses isPrime instead of re-implementing",
          "+1 Returns the count",
        ],
      },
    ],
    totalPoints: 7,
  },
];

export const FRQS_BY_TYPE: Record<FRQ["type"], FRQ[]> = FRQS.reduce(
  (acc, frq) => {
    (acc[frq.type] ||= []).push(frq);
    return acc;
  },
  {} as Record<FRQ["type"], FRQ[]>
);
