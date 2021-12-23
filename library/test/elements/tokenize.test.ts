import { delegateTokenize } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

describe('elements tokens service', () => {
  testServiceDelegate('tokenize', 'tokenize', delegateTokenize);
});
