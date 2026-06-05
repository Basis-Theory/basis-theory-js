import { dataExtractor } from '@/common';
import { BasisTheoryService } from '@/service';
import {
  AuthenticateThreeDSSessionRequest,
  CreateThreeDSSessionRequest,
  CreateThreeDSSessionResponse,
  ThreeDSAuthentication,
  ThreeDSSession,
} from '@/types/models/threeds';
import { ThreeDS } from '@/types/sdk/services/threeds';

export class BasisTheoryThreeDS extends BasisTheoryService implements ThreeDS {
  public createSession(
    createRequest: CreateThreeDSSessionRequest
  ): Promise<CreateThreeDSSessionResponse> {
    return this.client.post('/sessions', createRequest).then(dataExtractor);
  }

  public getSessionById(sessionId: string): Promise<ThreeDSSession> {
    return this.client.get(`/sessions/${sessionId}`).then(dataExtractor);
  }

  public authenticateSession(
    sessionId: string,
    authenticateRequest: AuthenticateThreeDSSessionRequest
  ): Promise<ThreeDSAuthentication> {
    return this.client
      .post(`/sessions/${sessionId}/authenticate`, authenticateRequest)
      .then(dataExtractor);
  }

  public getChallengeResult(sessionId: string): Promise<ThreeDSAuthentication> {
    return this.client
      .get(`/sessions/${sessionId}/challenge-result`)
      .then(dataExtractor);
  }
}
