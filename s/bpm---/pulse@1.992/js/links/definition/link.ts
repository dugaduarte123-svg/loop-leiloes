export const ON_ATTACH = 'ON_ATTACH';
export const ON_DATA = 'ON_DATA';

/**
 * One matched tag between the two linked instances, carrying the context each
 * side contributed for that tag (`undefined` if a side produced a bare-string
 * tag). Transforms get the full set as `contexts` — needed for many-to-many
 * links that must act on every match. For single-match links, `self.context` /
 * `other.context` (the first match) is the simpler read.
 */