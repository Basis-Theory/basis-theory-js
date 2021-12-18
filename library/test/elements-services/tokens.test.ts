import { delegateTokens } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

jest.mock('../../src/elements/services/utils');

describe('elements tokens service', () => {
  testServiceDelegate('tokens', 'create', delegateTokens);
});
