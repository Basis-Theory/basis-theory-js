import {
  AuthenticateThreeDSSessionRequest,
  CreateThreeDSSessionRequest,
  CreateThreeDSSessionResponse,
  ThreeDSAuthentication,
  ThreeDSSession,
} from '@/types/models/threeds';

interface ThreeDS {
  createSession(
    createRequest: CreateThreeDSSessionRequest
  ): Promise<CreateThreeDSSessionResponse>;
  getSessionById(sessionId: string): Promise<ThreeDSSession>;
  authenticateSession(
    sessionId: string,
    authenticateRequest: AuthenticateThreeDSSessionRequest
  ): Promise<ThreeDSAuthentication>;
  getChallengeResult(sessionId: string): Promise<ThreeDSAuthentication>;
}

export type { ThreeDS };
