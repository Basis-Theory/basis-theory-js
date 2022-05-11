import { delegateAtomicCards } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

describe('elements cards service', () => {
  testServiceDelegate('atomicCards', 'create', delegateAtomicCards);
});
