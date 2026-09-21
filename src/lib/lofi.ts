/**
 * A tiny lofi loop synthesised in the browser: warm seventh chords over a
 * soft kick/hat/snare and vinyl crackle. Nothing is streamed or sampled, so
 * there is no track to license.
 */

const BPM = 74;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
/** Fmaj9 → Em7 → Dm9 → Cmaj7, one bar each, midi notes */
const PROGRESSION: { bass: number; chord: number[] }[] = [
  { bass: 41, chord: [60, 64, 67, 72] },
  { bass: 40, chord: [59, 62, 67, 71] },
  { bass: 38, chord: [57, 62, 65, 69] },
  { bass: 36, chord: [59, 64, 67, 71] },
];
/** a lazy melody over the loop: [bar, beat, midi, length in beats] */
const MELODY: [number, number, number, number][] = [
  [0, 0, 79, 1.5],
  [0, 2, 76, 1],
  [1, 1, 74, 1.5],
  [1, 3, 71, 1],
  [2, 0, 72, 2],
  [2, 3, 69, 1],
  [3, 1.5, 71, 2.5],
];

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** sparse pops and a hiss floor, looping forever */
function crackleBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.06;
    if (Math.random() < 0.00035) data[i] += (Math.random() * 2 - 1) * 0.9;
  }
  return buffer;
}

export type LofiPlayer = {
  start: () => Promise<void>;
  stop: () => void;
  dispose: () => void;
};

export function createLofi(): LofiPlayer {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: BiquadFilterNode | null = null;
  let vinyl: AudioBufferSourceNode | null = null;
  let timer: number | null = null;
  let bar = 0;
  let nextBarAt = 0;

  const env = (node: AudioNode, at: number, attack: number, hold: number, release: number, peak: number) => {
    const gain = ctx!.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + attack);
    gain.gain.setValueAtTime(peak, at + attack + hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
    node.connect(gain);
    gain.connect(bus!);
    return gain;
  };

  const tone = (
    at: number,
    midi: number,
    length: number,
    peak: number,
    type: OscillatorType,
    detune = 0,
  ) => {
    const osc = ctx!.createOscillator();
    osc.type = type;
    osc.frequency.value = freq(midi);
    osc.detune.value = detune;
    env(osc, at, 0.05, length * 0.6, length * 0.6, peak);
    osc.start(at);
    osc.stop(at + length + 0.4);
  };

  const kick = (at: number) => {
    const osc = ctx!.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, at);
    osc.frequency.exponentialRampToValueAtTime(46, at + 0.12);
    env(osc, at, 0.005, 0.02, 0.18, 0.32);
    osc.start(at);
    osc.stop(at + 0.4);
  };

  const noiseHit = (at: number, length: number, peak: number, cutoff: number) => {
    const src = ctx!.createBufferSource();
    src.buffer = noiseBuffer(ctx!, 0.3);
    const band = ctx!.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = cutoff;
    src.connect(band);
    env(band, at, 0.002, 0.01, length, peak);
    src.start(at);
    src.stop(at + length + 0.1);
  };

  /** queue one bar of the loop */
  const scheduleBar = (at: number) => {
    const { bass, chord } = PROGRESSION[bar % PROGRESSION.length];
    tone(at, bass, BAR * 0.9, 0.14, "sine");
    tone(at + BEAT * 2.5, bass + 12, BEAT * 1.2, 0.08, "sine");

    chord.forEach((note, i) => {
      tone(at + i * 0.02, note, BAR * 0.85, 0.11, "triangle", (i % 2 ? 6 : -6));
    });

    kick(at);
    kick(at + BEAT * 2.5);
    noiseHit(at + BEAT, 0.16, 0.12, 1800);
    noiseHit(at + BEAT * 3, 0.16, 0.12, 1800);
    for (let i = 0; i < 4; i++) noiseHit(at + BEAT * (i + 0.5), 0.05, 0.05, 7200);

    MELODY.filter(([b]) => b === bar % PROGRESSION.length).forEach(([, beat, note, len]) => {
      tone(at + beat * BEAT, note, len * BEAT * 0.8, 0.1, "triangle");
    });

    bar += 1;
  };

  const tick = () => {
    if (!ctx) return;
    while (nextBarAt < ctx.currentTime + 0.6) {
      scheduleBar(nextBarAt);
      nextBarAt += BAR;
    }
  };

  const start = async () => {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      const rumble = ctx.createBiquadFilter();
      rumble.type = "highpass";
      rumble.frequency.value = 48;
      rumble.connect(master);

      bus = ctx.createBiquadFilter();
      bus.type = "lowpass";
      bus.frequency.value = 2600;
      bus.Q.value = 0.4;
      bus.connect(rumble);

      vinyl = ctx.createBufferSource();
      vinyl.buffer = crackleBuffer(ctx, 4);
      vinyl.loop = true;
      const vinylGain = ctx.createGain();
      vinylGain.gain.value = 0.16;
      vinyl.connect(vinylGain);
      vinylGain.connect(master);
      vinyl.start();

      bar = 0;
      nextBarAt = ctx.currentTime + 0.15;
    }
    await ctx.resume();
    master!.gain.cancelScheduledValues(ctx.currentTime);
    master!.gain.setValueAtTime(Math.max(master!.gain.value, 0.0001), ctx.currentTime);
    master!.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.2);
    if (timer === null) {
      tick();
      timer = window.setInterval(tick, 120);
    }
  };

  const stop = () => {
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    const closing = ctx;
    window.setTimeout(() => void closing.suspend(), 800);
  };

  const dispose = () => {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    vinyl?.stop();
    void ctx?.close();
    ctx = null;
  };

  return { start, stop, dispose };
}
