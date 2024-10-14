interface CreateThreeDSSessionRequest {
  pan: string;
  type: 'customer' | 'merchant';
  device?: string;
  deviceInfo?: ThreeDSDeviceInfo;
}

interface CreateThreeDSSessionResponse {
  id: string;
  type: 'customer' | 'merchant';
  cardBrand?: string;
  methodUrl?: string;
  methodNotificationUrl?: string;
  directoryServerId?: string;
  recommendedVersion?: string;
}

interface AuthenticateThreeDSSessionRequest {
  authenticationCategory: string;
  authenticationType: string;
  challengePreference?: string;
  purchaseInfo?: ThreeDSPurchaseInfo;
  merchantInfo?: ThreeDSMerchantInfo;
  requestorInfo?: ThreeDSRequestorInfo;
  cardholderInfo?: ThreeDSCardholderInfo;
  broadcastInfo?: unknown;
  messageExtensions?: ThreeDSMessageExtension[];
}

interface ThreeDSPurchaseInfo {
  amount: string;
  currency: string;
  exponent: string;
  date: string;
  transactionType?: string;
  installmentCount?: string;
  recurringExpiration?: string;
  recurringFrequency?: string;
}

interface ThreeDSMerchantInfo {
  mid: string;
  acquirerBin: string;
  name: string;
  countryCode: string;
  categoryCode: string;
  riskInfo?: ThreeDSMerchantRiskInfo;
}

interface ThreeDSMerchantRiskInfo {
  deliveryEmail?: string;
  deliveryTimeframe?: string;
  giftCardAmount?: string;
  giftCardCount?: string;
  giftCardCurrency?: string;
  preOrderPurchase?: boolean;
  preOrderDate?: string;
  reorderedPurchase?: boolean;
  shippingMethod?: string;
}

interface ThreeDSRequestorInfo {
  id: string;
  name: string;
  url: string;
}

interface ThreeDSCardholderInfo {
  accountId?: string;
  accountType?: string;
  accountInfo?: ThreeDSCardholderAccountInfo;
  authenticationInfo?: ThreeDSCardholderAuthenticationInfo;
  priorAuthenticationInfo?: ThreeDSPriorAuthenticationInfo;
  name: string;
  email: string;
  phoneNumber?: ThreeDSCardholderPhoneNumber;
  mobilePhoneNumber?: ThreeDSCardholderPhoneNumber;
  workPhoneNumber?: ThreeDSCardholderPhoneNumber;
  billingShippingAddressMatch?: string;
  billingAddress?: ThreeDSAddress;
  shippingAddress?: ThreeDSAddress;
}

interface ThreeDSCardholderAccountInfo {
  accountAge?: string;
  accountLastChanged?: string;
  accountChangeDate?: string;
  accountCreatedDate?: string;
  accountPasswordLastChanged?: string;
  accountPasswordChangeDate?: string;
  purchaseCountLastYear?: string;
  transactionCountDay?: string;
  paymentAccountAge?: string;
  transactionCountYear?: string;
  paymentAccountCreated?: string;
  shippingAddressFirstUsed?: string;
  shippingAddressUsageDate?: string;
  shippingAccountNameMatch?: boolean;
  suspiciousActivityObserved?: boolean;
}

interface ThreeDSCardholderAuthenticationInfo {
  method?: string;
  timestamp?: string;
  data?: string;
}

interface ThreeDSPriorAuthenticationInfo {
  method?: string;
  timestamp?: string;
  referenceId?: string;
  data?: string;
}

interface ThreeDSCardholderPhoneNumber {
  countryCode: string;
  number: string;
}

interface ThreeDSAddress {
  line1: string;
  line2?: string;
  line3?: string;
  postalCode: string;
  city: string;
  stateCode: string;
  countryCode: string;
}

interface ThreeDSMessageExtension {
  id: string;
  name: string;
  critical: boolean | null;
  data: any;
}

interface ThreeDSSession {
  id: string;
  type?: 'customer' | 'merchant';
  tenantId: string;
  panTokenId: string;
  cardBrand: string;
  expirationDate: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  device: string;
  deviceInfo: ThreeDSDeviceInfo;
  version: ThreeDSVersion;
  method: ThreeDSMethod;
  authentication: ThreeDSAuthentication;
}

interface ThreeDSDeviceInfo {
  browserAcceptHeader?: string;
  browserIpAddress?: string;
  browserJavascriptEnabled?: boolean | null;
  browserJavaEnabled?: boolean | null;
  browserLanguage?: string;
  browserColorDepth?: string;
  browserScreenHeight?: string;
  browserScreenWidth?: string;
  browserTimezone?: string;
  browserUserAgent?: string;
  sdkTransactionId?: string;
  sdkApplicationId?: string;
  sdkEncryptionData?: string;
  sdkEphemeralPublicKey?: string;
  sdkMaxTimeout?: string;
  sdkReferenceNumber?: string;
  sdkRenderOptions?: ThreeDSMobileSdkRenderOptions;
}

interface ThreeDSMobileSdkRenderOptions {
  sdkInterface?: string;
  sdkUiType?: string;
}

interface ThreeDSVersion {
  recommendedVersion: string;
  availableVersions: string[];
  earliestAcsSupportedVersion: string;
  earliestDsSupportedVersion: string;
  latestAcsSupportedVersion: string;
  latestDsSupportedVersion: string;
  acsInformation: string[];
}

interface ThreeDSMethod {
  methodUrl: string;
  methodCompletionIndicator: string;
}

interface ThreeDSAuthentication {
  threedsVersion: string;
  acsTransactionId: string | null;
  dsTransactionId: string | null;
  sdkTransactionId: string | null;
  acsReferenceNumber: string;
  dsReferenceNumber: string;
  authenticationValue: string;
  authenticationStatus: string;
  authenticationStatusReason: string;
  eci: string;
  acsChallengeMandated: string;
  acsDecoupledAuthentication: string;
  authenticationChallengeType: string;
  acsRenderingType: ThreeDSAcsRenderingType;
  acsSignedContent: string;
  acsChallengeUrl: string;
  challengeAttempts: string;
  challengeCancelReason: string;
  cardholderInfo: string;
  whitelistStatus: string;
  whitelistStatusSource: string;
  messageExtensions: ThreeDSMessageExtension[];
}
interface ThreeDSAcsRenderingType {
  acsInterface: string;
  acsUiTemplate: string;
}

export type {
  CreateThreeDSSessionRequest,
  CreateThreeDSSessionResponse,
  AuthenticateThreeDSSessionRequest,
  ThreeDSPurchaseInfo,
  ThreeDSMerchantInfo,
  ThreeDSMerchantRiskInfo,
  ThreeDSRequestorInfo,
  ThreeDSCardholderInfo,
  ThreeDSCardholderAccountInfo,
  ThreeDSCardholderAuthenticationInfo,
  ThreeDSPriorAuthenticationInfo,
  ThreeDSCardholderPhoneNumber,
  ThreeDSAddress,
  ThreeDSMessageExtension,
  ThreeDSSession,
  ThreeDSDeviceInfo,
  ThreeDSMobileSdkRenderOptions,
  ThreeDSVersion,
  ThreeDSMethod,
  ThreeDSAuthentication,
  ThreeDSAcsRenderingType,
};
