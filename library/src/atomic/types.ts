import { ReactorFormulaRequestParam } from './../reactor-formulas/types';
export interface AtomicCard {
  id: string;
  card: {
    number: string;
    expirationMonth: number;
    expirationYear: number;
    cvc?: string;
  };
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      city: string;
      country: string;
      line1: string;
      line2?: string;
      postalCode: string;
      state: string;
    };
  };
}

export interface ReactRequest {
  reactorId: string;
}

// we can disable for this next line as we are only exporting interfaces here
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace PaymentsApi {
  export interface SourceCardModel {
    card: CardModel;
    billing_details?: BillingDetailsModel;
  }

  export interface CardModel {
    number: string;
    expiration_month: number;
    expiration_year: number;
    cvc?: string;
  }

  export interface BillingDetailsModel {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      city: string;
      country: string;
      line1: string;
      line2?: string;
      postal_code: string;
      state: string;
    };
  }

  export interface SourceCardResponse {
    id: string;
    type: 'card';
    card: CardModel;
    billing_details?: BillingDetailsModel;
  }
}
