import type { AxiosTransformer } from 'axios';
import {
  transformReactorResponseCamelCase,
  transformReactorRequestSnakeCase,
} from '../common/utils';
import { BasisTheoryService } from '../service';
import type { BasisTheoryServiceOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import type {
  Reactor,
  CreateReactorModel,
  UpdateReactorModel,
  ReactorQuery,
} from './types';

export const BasisTheoryReactors = new CrudBuilder(
  class BasisTheoryReactors extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = options;

      _options.transformRequest = [
        ...([] as AxiosTransformer[]),
        ...[transformReactorRequestSnakeCase],
        ...((options.transformRequest as AxiosTransformer[]) || []),
      ];

      _options.transformResponse = [
        ...([] as AxiosTransformer[]),
        ...[transformReactorResponseCamelCase],
        ...((options.transformResponse as AxiosTransformer[]) || []),
      ];

      super(_options);
    }
  }
)
  .create<Reactor, CreateReactorModel>()
  .retrieve<Reactor>()
  .update<Reactor, UpdateReactorModel>()
  .delete()
  .list<Reactor, ReactorQuery>()
  .build();

export type BasisTheoryReactors = InstanceType<typeof BasisTheoryReactors>;
