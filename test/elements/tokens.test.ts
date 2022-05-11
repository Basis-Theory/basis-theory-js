import { delegateTokens } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

describe('elements tokens service', () => {
  testServiceDelegate('tokens', 'create', delegateTokens);
});
