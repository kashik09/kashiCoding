export function ReadingDesk({ size = 280 }: { size?: number }) {
  const stroke = "var(--rose-deep)";
  const fill = "var(--bg-linen)";
  const leaf = "var(--moss)";
  const honey = "var(--honey)";

  return (
    <svg
      width={size}
      height={Math.round(size * 0.85)}
      viewBox="0 0 320 260"
      fill="none"
      stroke={stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
      aria-label="an iced coffee and a laptop with a terminal"
    >
      {/* desk surface — faint horizon */}
      <path
        d="M10 215 Q160 205 310 215"
        stroke="var(--shadow-mid)"
        strokeWidth="1"
      />

      {/* ICED COFFEE — left side */}
      <g transform="translate(40 75)">
        {/* condensation droplets */}
        <circle cx="-4" cy="40" r="2.2" fill={fill} stroke="none" opacity="0.75" />
        <circle cx="78" cy="55" r="1.6" fill={fill} stroke="none" opacity="0.7" />
        <circle cx="-6" cy="85" r="1.8" fill={fill} stroke="none" opacity="0.65" />
        <circle cx="82" cy="95" r="2" fill={fill} stroke="none" opacity="0.7" />
        <circle cx="-2" cy="115" r="1.4" fill={fill} stroke="none" opacity="0.6" />

        {/* coffee fill inside glass */}
        <path
          d="M10 50 L66 50 L62 124 Q38 130 14 124 Z"
          fill="var(--rose-deep)"
          fillOpacity="0.55"
          stroke="none"
        />
        {/* coffee surface ellipse */}
        <ellipse
          cx="38"
          cy="50"
          rx="28"
          ry="3.5"
          fill="var(--rose-deep)"
          fillOpacity="0.75"
          stroke="none"
        />

        {/* ice cubes */}
        <rect
          x="14"
          y="56"
          width="13"
          height="12"
          rx="2.5"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.2"
        />
        <g transform="rotate(10 39 58)">
          <rect
            x="32"
            y="52"
            width="14"
            height="13"
            rx="2.5"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
          />
        </g>
        <rect
          x="49"
          y="58"
          width="12"
          height="11"
          rx="2.5"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.2"
        />

        {/* honey straw */}
        <path
          d="M52 0 L44 126"
          stroke={honey}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* glass outline */}
        <ellipse cx="38" cy="8" rx="34" ry="6" fill="none" />
        <path d="M4 8 L10 126" />
        <path d="M72 8 L66 126" />
        <path d="M10 126 Q38 132 66 126" />
      </g>

      {/* LAPTOP — right */}
      <g transform="translate(170 110)">
        {/* screen bezel */}
        <rect x="0" y="0" width="128" height="82" rx="5" fill={fill} />
        {/* screen interior (terminal) */}
        <rect x="5" y="5" width="118" height="72" rx="3" fill="#3a3328" />
        {/* traffic-light dots */}
        <circle cx="12" cy="12" r="2" fill="#c89a92" stroke="none" />
        <circle cx="19" cy="12" r="2" fill="#d8b87a" stroke="none" />
        <circle cx="26" cy="12" r="2" fill="#a8bb96" stroke="none" />
        {/* terminal text */}
        <g fontFamily="var(--font-mono), monospace" fontSize="6.5">
          <text x="9" y="28" fill="#a8bb96" stroke="none">
            $ kashi --hello
          </text>
          <text x="9" y="38" fill="#d8b87a" stroke="none">
            welcome :)
          </text>
          <text x="9" y="50" fill="#a8bb96" stroke="none">
            $ ls projects/
          </text>
          <text x="9" y="60" fill="#f4ecdc" stroke="none">
            {"{ project_1 }  { project_2 }"}
          </text>
          <text x="9" y="72" fill="#a8bb96" stroke="none">
            ${" "}
          </text>
        </g>
        {/* blinking cursor */}
        <rect
          className="animate-blink"
          x="18"
          y="67"
          width="5"
          height="6"
          fill="#f4ecdc"
          stroke="none"
        />

        {/* laptop base */}
        <path d="M-10 82 L138 82 L130 92 L-2 92 Z" fill={fill} />
        {/* trackpad hint */}
        <path d="M58 87 L70 87" strokeWidth="0.9" opacity="0.55" />
      </g>

      {/* leaf sprig */}
      <g transform="translate(85 104) rotate(8)">
        <path d="M0 0 Q60 -10 120 -4" stroke={leaf} strokeWidth="1.6" />
        <ellipse
          cx="20"
          cy="-6"
          rx="9"
          ry="4"
          transform="rotate(-25 20 -6)"
          fill={leaf}
          stroke={leaf}
          opacity="0.85"
        />
        <ellipse
          cx="48"
          cy="-10"
          rx="10"
          ry="4"
          transform="rotate(-15 48 -10)"
          fill={leaf}
          stroke={leaf}
          opacity="0.85"
        />
        <ellipse
          cx="80"
          cy="-9"
          rx="11"
          ry="4"
          transform="rotate(-5 80 -9)"
          fill={leaf}
          stroke={leaf}
          opacity="0.85"
        />
        <ellipse
          cx="106"
          cy="-5"
          rx="9"
          ry="4"
          transform="rotate(2 106 -5)"
          fill={leaf}
          stroke={leaf}
          opacity="0.85"
        />
      </g>

      {/* sparkle */}
      <g transform="translate(290 50)" stroke={honey}>
        <path d="M0 -8 L0 8" strokeWidth="1.2" />
        <path d="M-8 0 L8 0" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
