import { delegateAtomicCards } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

jest.mock('../../src/elements/services/utils');

describe('elements cards service', () => {
  testServiceDelegate('atomicCards', 'create', delegateAtomicCards);
});
