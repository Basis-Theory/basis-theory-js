import { BasisTheoryService } from '../service';
import { AtomicCard, PaymentsApi } from './types';

export class BasisTheoryPayments extends BasisTheoryService {
  public async storeCreditCard(
    source: AtomicCard
  ): Promise<PaymentsApi.SourceCardResponse> {
    const payload: PaymentsApi.SourceCardModel = {
      card: {
        number: source.card.number,
        expiration_month: source.card.expirationMonth,
        expiration_year: source.card.expirationYear,
        cvc: source.card.cvc || undefined,
      },
      billing_details: source.billingDetails && {
        name: source.billingDetails.name || undefined,
        email: source.billingDetails.email || undefined,
        phone: source.billingDetails.phone || undefined,
        address: source.billingDetails.address && {
          city: source.billingDetails.address.city,
          country: source.billingDetails.address.country,
          line1: source.billingDetails.address.line1,
          line2: source.billingDetails.address.line2 || undefined,
          postal_code: source.billingDetails.address.postalCode,
          state: source.billingDetails.address.state,
        },
      },
    };
    const { data } = await this.client.post<PaymentsApi.SourceCardResponse>(
      '/sources/cards',
      payload
    );
    return data;
  }
}
