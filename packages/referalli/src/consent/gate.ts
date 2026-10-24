import type { ConsentAdapterFactory, ConsentConfig, ConsentEvidence, ConsentState } from './port.js';

export interface ConsentGate {
  /** Begin detecting (call once the change handler is ready). */
  start(): void;
  state(): ConsentState;
  /** The adapter in use: an adapter id, `auto` while still looking, `none`, `no-cmp` or `pending`. */
  mode(): string;
  /** The push path: `aff.consent(true|false)`. The latest signal (push or CMP) wins. Idempotent. */
  push(granted: boolean): void;
  evidence(): ConsentEvidence | null;
  stop(): void;
}

/**
 * The one consent state machine, shared by `referalli/browser` (snippet.ts)
 * and the served `aff.js` (served.ts inlines this function's source text, so
 * it must stay self-contained: parameters and browser globals only).
 *
 * `change(state, evidence)` is called on every transition (never for the
 * initial `unknown`). `auto` polls every 100 ms for up to `waitMs` for a CMP
 * to appear; if the page is being left before then with none found, the
 * no-CMP rule applies at once so a quick click-through still keeps its referral.
 */
export function consentGate(
  w: any,
  cfg: ConsentConfig,
  adapters: Record<string, ConsentAdapterFactory>,
  order: readonly string[],
  change: (state: ConsentState, evidence: ConsentEvidence | null) => void,
): ConsentGate {
  let reader: ReturnType<ConsentAdapterFactory> | null = null;
  let readerId: string | null = null;
  let current: ConsentState = 'unknown';
  let pushed: boolean | null = null;
  let fallback = false;
  let finished = false;
  let timer: any = null;
  let unsub: (() => void) | null = null;
  let started = false;
  const wait = typeof cfg.waitMs === 'number' ? cfg.waitMs : 3000;
  let deadline = 0;

  function read(): ConsentState {
    if (pushed !== null) return pushed ? 'granted' : 'denied';
    if (cfg.mode === 'none') return 'granted';
    if (reader) {
      try {
        const s = reader.state(cfg);
        return s === 'granted' || s === 'denied' ? s : 'unknown';
      } catch {
        return 'unknown';
      }
    }
    if (fallback && cfg.noCmp === 'persist') return 'granted';
    return 'unknown';
  }

  function provider(): string {
    if (pushed !== null) return 'custom';
    if (readerId) return readerId;
    if (cfg.mode === 'none') return 'none';
    if (fallback) return 'no-cmp';
    return String(cfg.mode);
  }

  function evidence(s: ConsentState): ConsentEvidence {
    const ev: ConsentEvidence = { provider: provider(), state: s, at: new Date().toISOString() };
    if (reader && pushed === null) {
      try {
        const x = reader.evidence(cfg);
        if (x) {
          if (typeof x.stamp === 'string' && x.stamp) ev.stamp = x.stamp.slice(0, 200);
          if (typeof x.tcString === 'string' && x.tcString) ev.tcString = x.tcString.slice(0, 4000);
          if (typeof x.gppString === 'string' && x.gppString) ev.gppString = x.gppString.slice(0, 4000);
          if (x.purposes && x.purposes.length) ev.purposes = x.purposes.slice(0, 40).map(String);
        }
      } catch {
        /* evidence is best-effort */
      }
    }
    return ev;
  }

  function emit(): void {
    if (!started) return;
    const s = read();
    if (s === current) return;
    current = s;
    change(s, s === 'unknown' ? null : evidence(s));
  }

  function onCmp(): void {
    pushed = null;
    emit();
  }

  function attach(): boolean {
    const ids = cfg.mode === 'auto' ? order : [String(cfg.mode)];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i] as string;
      const factory = adapters[id];
      if (!factory) continue;
      let r: ReturnType<ConsentAdapterFactory>;
      try {
        r = factory(w);
        if (!r.detect()) continue;
      } catch {
        continue;
      }
      reader = r;
      readerId = id;
      try {
        unsub = r.subscribe(cfg, onCmp);
      } catch {
        unsub = null;
      }
      return true;
    }
    return false;
  }

  function settle(): void {
    finished = true;
    if (timer !== null) {
      try {
        w.clearTimeout(timer);
      } catch {
        /* ignore */
      }
      timer = null;
    }
  }

  function poll(): void {
    timer = null;
    if (finished) return;
    if (attach()) {
      settle();
      emit();
      return;
    }
    if (Date.now() >= deadline) {
      settle();
      if (cfg.mode === 'auto') fallback = true;
      emit();
      return;
    }
    try {
      timer = w.setTimeout(poll, 100);
    } catch {
      settle();
    }
  }

  // Leaving the page before a CMP showed up: apply the no-CMP rule now.
  function onHide(e?: { type?: string }): void {
    if (finished || cfg.mode !== 'auto') return;
    if (e && e.type === 'visibilitychange' && w.document && w.document.visibilityState !== 'hidden') return;
    if (attach()) {
      settle();
      emit();
      return;
    }
    settle();
    fallback = true;
    emit();
  }

  return {
    start(): void {
      if (started) return;
      started = true;
      deadline = Date.now() + wait;
      if (cfg.mode === 'none' || cfg.mode === 'pending') {
        finished = true;
        emit();
        return;
      }
      try {
        w.addEventListener('pagehide', onHide);
        w.addEventListener('visibilitychange', onHide);
      } catch {
        /* no events: rely on the timer */
      }
      poll();
    },
    state: () => current,
    mode(): string {
      if (readerId) return readerId;
      if (cfg.mode === 'auto') return fallback ? 'no-cmp' : 'auto';
      return String(cfg.mode);
    },
    push(granted: boolean): void {
      pushed = granted === true;
      emit();
    },
    evidence: () => (current === 'unknown' ? null : evidence(current)),
    stop(): void {
      settle();
      if (unsub) {
        try {
          unsub();
        } catch {
          /* ignore */
        }
      }
      try {
        w.removeEventListener('pagehide', onHide);
        w.removeEventListener('visibilitychange', onHide);
      } catch {
        /* ignore */
      }
    },
  };
}
