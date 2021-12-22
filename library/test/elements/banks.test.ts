import { delegateAtomicBanks } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

jest.mock('../../src/elements/services/utils');

describe('elements bank service', () => {
  testServiceDelegate('atomicBanks', 'create', delegateAtomicBanks);
});
