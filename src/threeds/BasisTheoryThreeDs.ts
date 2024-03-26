import { dataExtractor } from '@/common';
import { BasisTheoryService } from '@/service';
import {
  AuthenticateThreeDSSessionRequest,
  ThreeDSAuthentication,
  ThreeDSSession,
} from '@/types/models/threeds';
import { ThreeDS } from '@/types/sdk/services/threeds';

export class BasisTheoryThreeDS extends BasisTheoryService implements ThreeDS {
  public getSessionById(sessionId: string): Promise<ThreeDSSession> {
    return this.client.get(`/${sessionId}`).then(dataExtractor);
  }

  public authenticateSession(
    sessionId: string,
    authenticateRequest: AuthenticateThreeDSSessionRequest
  ): Promise<ThreeDSAuthentication> {
    return this.client
      .post(`/${sessionId}/authenticate`, authenticateRequest)
      .then(dataExtractor);
  }

  public getChallengeResult(sessionId: string): Promise<ThreeDSAuthentication> {
    return this.client
      .get(`/${sessionId}/challenge-result`)
      .then(dataExtractor);
  }
}
