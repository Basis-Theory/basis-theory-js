export interface CreditCardInfo {
  cardNumber: string;
  holderName: string;
  expiration: string;
  cvv: string;
}

export interface CreditCardStoreResponse {
  token: string;
  info: Omit<CreditCardInfo, 'cvv'>;
}
