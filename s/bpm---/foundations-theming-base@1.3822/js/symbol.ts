/**
 * We want to prevent unintended direct access of the name/mode, so we use symbols to discourage
 * reading directly off the theme.
 *
 * `Symbol.for(...)` is used instead of `Symbol(...)` so that theme objects loaded via the worker or
 * by dynamic imports can still read the theme metadata.
 */
export const THEME_NAME = Symbol.for('ThemeName');
export const THEME_MODE = Symbol.for('ThemeMode');
