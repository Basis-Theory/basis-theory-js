import type { BasisTheoryInit } from '@/interfaces/sdk';
import { BasisTheory } from './BasisTheory';

/**
 * Default instance used to expose bundle in <script> tags. <br/>
 * Not meant to be used in Node environment.
 */
export const _instance: BasisTheoryInit = new BasisTheory();

export * from './BasisTheory';
export * from './applications';
export * from './tokens';
