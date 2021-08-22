import { BasisTheory } from './BasisTheory';

/**
 * Default instance used to expose bundle in <script> tags. <br/>
 * Not meant to be used in Node environment.
 */
export const _instance = new BasisTheory();
export * from './BasisTheory';
export * from './encryption';
export * from './applications';
export * from './tokens';
