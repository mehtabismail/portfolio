"use client";

import { useState } from "react";

/**
 * © + credit line. Idle: © "Code by {firstName}". Hover: © "{fullName}" — "Code by" is removed
 * and the full name starts at the beginning of the text block (original-site behavior).
 */
export default function NavCreditStrip({
  firstName,
  fullName,
}: {
  firstName: string;
  fullName: string;
}) {
  const [hovered, setHovered] = useState(false);
  const short = firstName.trim();
  const full = fullName.trim();

  return (
    <div
      className="nav-credit-strip"
      aria-label={`Code by ${full}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="credit">
        <span>©</span>
      </div>
      <div className="cbd nav-credit-root">
        {!hovered ? (
          <>
            <span className="code-by">Code by </span>
            <span className="dennis dennis-credit-stack">{short}</span>
          </>
        ) : (
          <span className="dennis dennis-credit-stack">{full}</span>
        )}
      </div>
    </div>
  );
}
