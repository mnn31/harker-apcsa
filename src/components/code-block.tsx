"use client";

import { motion } from "framer-motion";

const KEYWORDS = new Set([
  "public", "private", "static", "void", "int", "double", "boolean",
  "String", "char", "if", "else", "while", "for", "return", "new", "class",
  "this", "true", "false", "null", "final", "import", "package",
  "extends", "implements", "interface", "ArrayList", "Integer", "Double",
  "Math", "System", "out", "println", "print",
]);

function highlight(line: string, lineKey: string) {
  // Comments
  const commentIdx = line.indexOf("//");
  let codePart = line;
  let commentPart = "";
  if (commentIdx >= 0) {
    codePart = line.slice(0, commentIdx);
    commentPart = line.slice(commentIdx);
  }

  // Tokenise codePart
  const tokens: { kind: "kw" | "num" | "str" | "txt"; v: string }[] = [];
  // Pull strings out first
  const stringRegex = /"([^"\\]|\\.)*"/g;
  let lastIdx = 0;
  let match;
  while ((match = stringRegex.exec(codePart))) {
    if (match.index > lastIdx) {
      tokens.push({ kind: "txt", v: codePart.slice(lastIdx, match.index) });
    }
    tokens.push({ kind: "str", v: match[0] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < codePart.length) {
    tokens.push({ kind: "txt", v: codePart.slice(lastIdx) });
  }

  // Now further split text tokens by word boundaries
  const refined: { kind: "kw" | "num" | "str" | "txt"; v: string }[] = [];
  for (const tok of tokens) {
    if (tok.kind !== "txt") {
      refined.push(tok);
      continue;
    }
    const parts = tok.v.split(/(\b\w+\b)/);
    for (const p of parts) {
      if (!p) continue;
      if (KEYWORDS.has(p)) refined.push({ kind: "kw", v: p });
      else if (/^\d+(\.\d+)?$/.test(p)) refined.push({ kind: "num", v: p });
      else refined.push({ kind: "txt", v: p });
    }
  }

  return (
    <span key={lineKey}>
      {refined.map((t, i) => (
        <span
          key={i}
          style={{
            color:
              t.kind === "kw"
                ? "#C4B5FD"
                : t.kind === "num"
                ? "#FDA4AF"
                : t.kind === "str"
                ? "#FCD34D"
                : undefined,
          }}
        >
          {t.v}
        </span>
      ))}
      {commentPart && (
        <span style={{ color: "#94A3B8", fontStyle: "italic" }}>{commentPart}</span>
      )}
    </span>
  );
}

export function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <motion.pre
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="code-block text-[13px] leading-[1.65]"
    >
      {lines.map((l, i) => (
        <div key={i}>{highlight(l || " ", `${i}`)}</div>
      ))}
    </motion.pre>
  );
}
