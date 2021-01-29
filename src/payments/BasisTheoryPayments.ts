import { BasisTheoryService } from '../service';
import { CreditCardInfo, CreditCardStoreResponse } from './types';

export class BasisTheoryPayments extends BasisTheoryService {
  public async storeCreditCard(
    info: CreditCardInfo
  ): Promise<CreditCardStoreResponse> {
    const { data } = await this.client.post<CreditCardStoreResponse>(
      '/credit_card',
      info
    );
    return data;
  }
}
