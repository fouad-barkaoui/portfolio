import { renderToString } from 'react-dom/server';
import { App } from './App';

/** Prerenders the English page at build time (see scripts/prerender.mjs). */
export function render(): string {
  return renderToString(<App />);
}
