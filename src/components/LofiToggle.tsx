"use client";

import { useEffect, useRef, useState } from "react";
import { createLofi, type LofiPlayer } from "@/lib/lofi";

/** starts muted: browsers block audio until the visitor asks for it anyway */
export default function LofiToggle() {
  const player = useRef<LofiPlayer | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => () => player.current?.dispose(), []);

  const toggle = () => {
    player.current ??= createLofi();
    if (on) {
      player.current.stop();
      setOn(false);
    } else {
      void player.current.start();
      setOn(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      title={on ? "mute the lofi loop" : "play a lofi loop"}
      className="pointer-events-auto flex items-center gap-2 rounded-full border-2 border-white bg-white/85 px-3.5 py-2 font-mono text-[11px] font-semibold text-brass shadow-[0_4px_0_rgba(20,23,26,0.12)] transition hover:bg-white"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[3px] rounded-sm bg-brass ${on ? "animate-bars" : ""}`}
            style={{ height: on ? "100%" : "35%", animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      {on ? "lofi on" : "lofi off"}
    </button>
  );
}
