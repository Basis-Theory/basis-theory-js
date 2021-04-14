import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { BasisTheoryService } from '../service';
import { AtomicCard, PaymentsApi } from './types';

export class BasisTheoryPayments extends BasisTheoryService {
  public async storeCreditCard(source: AtomicCard): Promise<AtomicCard> {
    const payload: PaymentsApi.SourceCardModel = snakecaseKeys(source, {
      deep: true,
    });
    const { data } = await this.client.post<PaymentsApi.SourceCardResponse>(
      '/cards',
      payload
    );
    const newCard = (camelcaseKeys(data, {
      deep: true,
    }) as unknown) as AtomicCard;
    return newCard;
  }
}
