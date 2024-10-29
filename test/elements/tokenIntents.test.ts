import { delegateTokenIntents } from '../../src/elements';
import { testServiceDelegate } from '../setup/utils';

describe('elements token intents service', () => {
  testServiceDelegate('tokenIntents', 'create', delegateTokenIntents);
});
