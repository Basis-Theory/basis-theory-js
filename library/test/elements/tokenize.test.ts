import { delegateTokenize } from '../../src/elements';
import { testMethodDelegate } from '../setup/utils';

describe('elements tokens service', () => {
  testMethodDelegate('tokenize', delegateTokenize);
});
