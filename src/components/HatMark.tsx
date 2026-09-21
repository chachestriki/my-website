/** the cowboy hat the site runs on — same silhouette as the favicon and the avatar */
export default function HatMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <g stroke="#7a3f12" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round">
        <path d="M20.5 36c-2.5-11-.5-18.5 2.5-20.5 2.2-1.5 4.4 1.5 9 1.5s6.8-3 9-1.5c3 2 5 9.5 2.5 20.5z" fill="#e0a241" />
        <path d="M32 16.5c-1.6 4-1.6 9.4 0 14" fill="none" strokeWidth={1.8} opacity={0.55} />
        <path
          d="M4 40.5C8.5 34 14 31 20 30.5c4-.3 8-.4 12-.4s8 .1 12 .4c6 .5 11.5 3.5 16 10-6 1.5-11 .5-14.5-2.5-4 3.4-8.4 5-13.5 5s-9.5-1.6-13.5-5C15 41 10 42 4 40.5z"
          fill="#e0a241"
        />
        <path
          d="M20.7 32.4c2.9 1.7 7.2 2.6 11.3 2.6s8.4-.9 11.3-2.6l.6 3.4c-3.1 1.9-7.6 2.9-11.9 2.9s-8.8-1-11.9-2.9z"
          fill="#a02040"
        />
      </g>
      <circle cx="43.6" cy="34.4" r="2.1" fill="#ffc01f" stroke="#7a3f12" strokeWidth={1.5} />
    </svg>
  );
}
