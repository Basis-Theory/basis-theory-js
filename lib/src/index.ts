import 'core-js';
import 'regenerator-runtime/runtime';
import { BasisTheory } from './BasisTheory';

declare global {
  interface Window {
    BasisTheory: BasisTheory;
  }
}

window.BasisTheory = new BasisTheory();

export { BasisTheory } from './BasisTheory';
export * from './encryption';
