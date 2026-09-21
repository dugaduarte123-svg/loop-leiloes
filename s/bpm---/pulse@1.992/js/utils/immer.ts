import { produce } from 'immer';
export const produceNext = (base, recipe) => {
  const next = produce(base, draft => recipe(draft));
  return next !== undefined && next !== base ? next : undefined;
};