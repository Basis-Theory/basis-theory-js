import { createRequestConfig, dataExtractor } from '@/common';
import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import { ApplicationTemplate } from '@/types/models/application-templates';
import { RequestOptions } from '@/types/sdk';

export const BasisTheoryApplicationTemplates = new CrudBuilder(
  class BasisTheoryApplicationTemplates extends BasisTheoryService {
    public list(options?: RequestOptions): Promise<ApplicationTemplate[]> {
      return this.client
        .get('/', createRequestConfig(options))
        .then(dataExtractor);
    }
  }
)
  .retrieve<ApplicationTemplate>()
  .build();

export type BasisTheoryApplicationTemplates = InstanceType<
  typeof BasisTheoryApplicationTemplates
>;
