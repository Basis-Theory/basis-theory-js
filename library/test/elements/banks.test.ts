import { delegateAtomicBanks } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

describe('elements bank service', () => {
  testServiceDelegate('atomicBanks', 'create', delegateAtomicBanks);
});
