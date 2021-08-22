import type { AxiosTransformer } from 'axios';
import { BasisTheoryService } from '../service';
import type { BasisTheoryServiceOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import type {
  Reactor,
  CreateReactorModel,
  UpdateReactorModel,
  ReactorQuery,
} from './types';
import {
  transformReactorResponseCamelCase,
  transformReactorRequestSnakeCase,
} from './../common/utils';

export const BasisTheoryReactors = new CrudBuilder(
  class BasisTheoryReactors extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      options.transformRequest = ([] as AxiosTransformer[]).concat(
        transformReactorRequestSnakeCase,
        options.transformRequest || []
      );

      options.transformResponse = ([] as AxiosTransformer[]).concat(
        transformReactorResponseCamelCase,
        options.transformResponse || []
      );

      super(options);
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
