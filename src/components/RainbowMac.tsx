export function RainbowMac({ size = 58 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <rect x="8" y="10" width="48" height="36" rx="3" fill="#e6e0d2" stroke="#2a2a2a" strokeWidth="1.5" />
      <rect x="12" y="14" width="40" height="26" fill="#07140e" />
      <path d="M14 36 h8" stroke="#e23b2f" strokeWidth="3" />
      <path d="M22 36 h6" stroke="#f0a202" strokeWidth="3" />
      <path d="M28 36 h6" stroke="#efe07a" strokeWidth="3" />
      <path d="M34 36 h6" stroke="#3aa655" strokeWidth="3" />
      <path d="M40 36 h6" stroke="#2f6fdb" strokeWidth="3" />
      <path d="M46 36 h4" stroke="#7a3e9d" strokeWidth="3" />
      <rect x="27" y="46" width="10" height="5" fill="#c9c2b0" />
      <rect x="18" y="51" width="28" height="4" rx="1" fill="#b3ab98" stroke="#2a2a2a" />
    </svg>
  );
}
