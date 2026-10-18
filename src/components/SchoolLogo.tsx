export function SchoolLogo({ id, label }: { id: string; label: string }) {
  if (id === "tamu") {
    return (
      <svg className="school-logo" viewBox="0 0 80 80" role="img" aria-label={label}>
        <circle cx="40" cy="40" r="38" fill="#500000" />
        <circle cx="40" cy="40" r="33" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#fff" strokeWidth="0.6" />
        <path
          d="M40 14.5l1.7 4.6h4.9l-4 2.9 1.5 4.6L40 23.7l-4.1 3 1.5-4.6-4-2.9h4.9z"
          fill="#fff"
        />
        <text
          x="40"
          y="48"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="16"
          fontWeight="700"
        >
          A&amp;M
        </text>
        <text
          x="40"
          y="60"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="7"
          letterSpacing="1.5"
        >
          1876
        </text>
      </svg>
    );
  }

  if (id === "uc3m") {
    return (
      <svg className="school-logo" viewBox="0 0 80 80" role="img" aria-label={label}>
        <rect x="2" y="2" width="76" height="76" rx="4" fill="#fff" stroke="#003399" strokeWidth="3" />
        <text
          x="40"
          y="28"
          textAnchor="middle"
          fill="#003399"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="2"
        >
          III
        </text>
        <line x1="18" y1="34" x2="62" y2="34" stroke="#003399" strokeWidth="1.2" />
        <text
          x="40"
          y="56"
          textAnchor="middle"
          fill="#003399"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          uc3m
        </text>
      </svg>
    );
  }

  return null;
}
