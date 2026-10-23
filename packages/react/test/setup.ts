// Node 25+ defines its own (empty) global localStorage, which hides jsdom's.
const dom = (globalThis as { jsdom?: { window: { localStorage: Storage; sessionStorage: Storage } } }).jsdom;
if (dom) {
  for (const key of ['localStorage', 'sessionStorage'] as const) {
    Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true, writable: true });
  }
}
