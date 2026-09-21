export * from './node_modules/immer/dist/immer.legacy-esm.js';

// The ESM build exports `produce` only as a named export, but the legacy CJS
// build this repackage previously served exposed it as the default export.
// Preserve the default export so `import produce from 'immer'` keeps working.
// TODO: need to migrate all consumers to the named produce export.
export { produce as default } from './node_modules/immer/dist/immer.legacy-esm.js';

// immer 10+ removed the ES5 fallback plugin (every target environment has native
// Proxy now). Keep a no-op stub because redux-toolkit 1.8 calls enableES5() at
// module load, and consumers still call it directly. Proxy is the default draft
// implementation, so registering nothing is the correct behavior.
// TODO: delete this stub once redux-toolkit is upgraded past 1.8 (2.x no longer
// calls enableES5 at module load) and any remaining direct callers are removed.
export function enableES5() {}